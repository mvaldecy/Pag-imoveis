"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { type RepasseCreationDto, type ContratoDto, repasseApi, contratoApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CurrencyInput } from "@/components/ui/currency-input"

export default function RepasseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const id = params.id as string
  const isNew = id === "novo"
  const contratoIdParam = searchParams.get("contratoId")

  const [repasse, setRepasse] = useState<RepasseCreationDto>({
    valorRepasse: 0,
    dataRepasse: {
      year: new Date().getFullYear(),
      month: getMonthName(new Date().getMonth()),
      monthValue: new Date().getMonth() + 1,
      leapYear: isLeapYear(new Date().getFullYear()),
    },
    contratoId: contratoIdParam ? Number.parseInt(contratoIdParam) : 0,
  })

  const [valorCentavos, setValorCentavos] = useState(0)
  const [contratos, setContratos] = useState<ContratoDto[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Função para obter o nome do mês
  function getMonthName(monthIndex: number): string {
    const months = [
      "JANUARY",
      "FEBRUARY",
      "MARCH",
      "APRIL",
      "MAY",
      "JUNE",
      "JULY",
      "AUGUST",
      "SEPTEMBER",
      "OCTOBER",
      "NOVEMBER",
      "DECEMBER",
    ]
    return months[monthIndex]
  }

  // Função para verificar se o ano é bissexto
  function isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar contratos ativos
        const contratosData = await contratoApi.getByIsActive(true)
        setContratos(contratosData)

        // Se for edição, buscar dados do repasse
        if (!isNew) {
          const repasseData = await repasseApi.getById(Number.parseInt(id))
          setRepasse({
            valorRepasse: repasseData.valorRepasse,
            dataRepasse: repasseData.dataRepasse,
            contratoId: repasseData.contrato.contratoId,
          })

          // Converter o valor para centavos para o componente CurrencyInput
          setValorCentavos(repasseData.valorRepasse * 100)
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados necessários.",
          variant: "destructive",
        })
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, isNew, toast, contratoIdParam])

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!valorCentavos || valorCentavos <= 0) {
      errors.valorRepasse = "Valor do repasse deve ser maior que zero"
    }

    if (!repasse.contratoId) {
      errors.contratoId = "Contrato é obrigatório"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os erros no formulário.",
        variant: "destructive",
      })
      return
    }

    setShowConfirmDialog(true)
  }

  const confirmSubmit = async () => {
    setSubmitting(true)
    setShowConfirmDialog(false)

    try {
      // Converter o valor de centavos para reais antes de enviar
      const repasseToSave = {
        ...repasse,
        valorRepasse: valorCentavos / 100,
      }

      if (isNew) {
        await repasseApi.create(repasseToSave)
        toast({
          title: "Sucesso",
          description: "Repasse criado com sucesso.",
        })
      } else {
        await repasseApi.update(Number.parseInt(id), repasseToSave)
        toast({
          title: "Sucesso",
          description: "Repasse atualizado com sucesso.",
        })
      }

      // Redirecionar para a lista de repasses do contrato se veio de lá
      if (contratoIdParam) {
        router.push(`/repasses?contratoId=${contratoIdParam}`)
      } else {
        router.push("/repasses")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: isNew ? "Não foi possível criar o repasse." : "Não foi possível atualizar o repasse.",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleMonthChange = (monthValue: string) => {
    const monthIndex = Number.parseInt(monthValue) - 1
    setRepasse({
      ...repasse,
      dataRepasse: {
        ...repasse.dataRepasse,
        month: getMonthName(monthIndex),
        monthValue: Number.parseInt(monthValue),
      },
    })
  }

  const handleYearChange = (year: string) => {
    const yearValue = Number.parseInt(year)
    setRepasse({
      ...repasse,
      dataRepasse: {
        ...repasse.dataRepasse,
        year: yearValue,
        leapYear: isLeapYear(yearValue),
      },
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isNew ? "Novo Repasse" : "Editar Repasse"}</h1>
          <p className="text-muted-foreground">
            {isNew ? "Preencha os dados para criar um novo repasse." : "Atualize os dados do repasse."}
          </p>
        </div>
        <Link href={contratoIdParam ? `/repasses?contratoId=${contratoIdParam}` : "/repasses"}>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Repasse</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="contratoId" className={formErrors.contratoId ? "text-destructive" : ""}>
                  Contrato
                </Label>
                <Select
                  value={repasse.contratoId ? repasse.contratoId.toString() : ""}
                  onValueChange={(value) => setRepasse({ ...repasse, contratoId: Number.parseInt(value) })}
                  disabled={!!contratoIdParam}
                >
                  <SelectTrigger className={formErrors.contratoId ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecione um contrato" />
                  </SelectTrigger>
                  <SelectContent>
                    {contratos.map((contrato) => (
                      <SelectItem key={contrato.id} value={contrato.id.toString()}>
                        {contrato.imovel.apto} - {contrato.imovel.predioNome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.contratoId && <p className="text-xs text-destructive">{formErrors.contratoId}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="valorRepasse" className={formErrors.valorRepasse ? "text-destructive" : ""}>
                  Valor do Repasse (R$)
                </Label>
                <CurrencyInput
                  id="valorRepasse"
                  value={valorCentavos}
                  onChange={setValorCentavos}
                  className={formErrors.valorRepasse ? "border-destructive" : ""}
                />
                {formErrors.valorRepasse && <p className="text-xs text-destructive">{formErrors.valorRepasse}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="month">Mês</Label>
                <Select value={repasse.dataRepasse.monthValue.toString()} onValueChange={handleMonthChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um mês" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Janeiro</SelectItem>
                    <SelectItem value="2">Fevereiro</SelectItem>
                    <SelectItem value="3">Março</SelectItem>
                    <SelectItem value="4">Abril</SelectItem>
                    <SelectItem value="5">Maio</SelectItem>
                    <SelectItem value="6">Junho</SelectItem>
                    <SelectItem value="7">Julho</SelectItem>
                    <SelectItem value="8">Agosto</SelectItem>
                    <SelectItem value="9">Setembro</SelectItem>
                    <SelectItem value="10">Outubro</SelectItem>
                    <SelectItem value="11">Novembro</SelectItem>
                    <SelectItem value="12">Dezembro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="year">Ano</Label>
                <Select value={repasse.dataRepasse.year.toString()} onValueChange={handleYearChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 2 + i).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={submitting} className="mt-4">
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className={`${submitting ? "" : "mr-2"} h-4 w-4`} />
              {isNew ? "Criar Repasse" : "Salvar Alterações"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isNew ? "Criar Repasse" : "Atualizar Repasse"}</AlertDialogTitle>
            <AlertDialogDescription>
              {isNew
                ? "Tem certeza que deseja criar este repasse com os dados informados?"
                : "Tem certeza que deseja atualizar os dados deste repasse?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmit}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
