"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  type ContratoCreationDto,
  type ImobiliariaDto,
  type ImovelDto,
  type InquilinoDto,
  type PredioDto,
  contratoApi,
  imobiliariaApi,
  imovelApi,
  inquilinoApi,
  predioApi,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"
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
import { Combobox, type ComboboxOption } from "@/components/ui/combobox"

export default function ContratoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const id = params.id as string
  const isNew = id === "novo"

  // Parâmetros de URL para pré-selecionar valores
  const inquilinoIdParam = searchParams.get("inquilinoId")
  const imovelIdParam = searchParams.get("imovelId")
  const imobiliariaIdParam = searchParams.get("imobiliariaId")

  // Datas em formato de string para exibição
  const [startDateStr, setStartDateStr] = useState<string>(isNew ? "" : formatDateForDisplay(new Date()))
  const [endDateStr, setEndDateStr] = useState<string>(isNew ? "" : formatDateForDisplay(addOneYear(new Date())))

  const [contrato, setContrato] = useState<ContratoCreationDto>({
    startDate: isNew ? "" : formatDateForApi(new Date()),
    endDate: isNew ? "" : formatDateForApi(addOneYear(new Date())),
    imobiliariaId: imobiliariaIdParam ? Number.parseInt(imobiliariaIdParam) : 0,
    imovelId: imovelIdParam ? Number.parseInt(imovelIdParam) : 0,
    inquilinoId: inquilinoIdParam ? Number.parseInt(inquilinoIdParam) : 0,
  })

  const [imobiliarias, setImobiliarias] = useState<ImobiliariaDto[]>([])
  const [predios, setPredios] = useState<PredioDto[]>([])
  const [imoveis, setImoveis] = useState<ImovelDto[]>([])
  const [imoveisOriginal, setImoveisOriginal] = useState<ImovelDto[]>([])
  const [inquilinos, setInquilinos] = useState<InquilinoDto[]>([])
  const [selectedPredioId, setSelectedPredioId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Funções auxiliares para manipulação de datas
  function formatDateForDisplay(date: Date): string {
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  function formatDateForApi(date: Date): string {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  function parseDisplayDate(dateStr: string): Date | null {
    // Formato esperado: DD/MM/YYYY
    const parts = dateStr.split("/")
    if (parts.length !== 3) return null

    const day = Number.parseInt(parts[0], 10)
    const month = Number.parseInt(parts[1], 10) - 1 // Mês em JS é 0-indexed
    const year = Number.parseInt(parts[2], 10)

    if (isNaN(day) || isNaN(month) || isNaN(year)) return null

    const date = new Date(year, month, day)
    return date
  }

  function addOneYear(date: Date): Date {
    const newDate = new Date(date)
    newDate.setFullYear(newDate.getFullYear() + 1)
    return newDate
  }

  function applyDateMask(value: string): string {
    // Remove todos os caracteres não numéricos
    const numericValue = value.replace(/\D/g, "")

    // Limita a 8 dígitos (DDMMAAAA)
    const limitedValue = numericValue.slice(0, 8)

    // Aplica a máscara
    if (limitedValue.length <= 2) {
      return limitedValue
    } else if (limitedValue.length <= 4) {
      return `${limitedValue.slice(0, 2)}/${limitedValue.slice(2)}`
    } else {
      return `${limitedValue.slice(0, 2)}/${limitedValue.slice(2, 4)}/${limitedValue.slice(4)}`
    }
  }

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = applyDateMask(e.target.value)
    setStartDateStr(maskedValue)

    // Tentar converter para o formato da API
    const date = parseDisplayDate(maskedValue)
    if (date) {
      setContrato({ ...contrato, startDate: formatDateForApi(date) })
    }
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = applyDateMask(e.target.value)
    setEndDateStr(maskedValue)

    // Tentar converter para o formato da API
    const date = parseDisplayDate(maskedValue)
    if (date) {
      setContrato({ ...contrato, endDate: formatDateForApi(date) })
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar imobiliárias
        const imobiliariasData = await imobiliariaApi.getAll()
        setImobiliarias(imobiliariasData)

        // Buscar prédios
        const prediosData = await predioApi.getAll()
        setPredios(prediosData)

        // Buscar imóveis
        const imoveisData = await imovelApi.getAll()
        setImoveisOriginal(imoveisData)
        setImoveis(imoveisData)

        // Buscar inquilinos
        const inquilinosData = await inquilinoApi.getAll()
        setInquilinos(inquilinosData)

        // Se for edição, buscar dados do contrato
        if (!isNew) {
          const contratoData = await contratoApi.getById(Number.parseInt(id))

          const startDateObj = new Date(contratoData.startDate)
          const endDateObj = new Date(contratoData.endDate)

          setStartDateStr(formatDateForDisplay(startDateObj))
          setEndDateStr(formatDateForDisplay(endDateObj))

          setContrato({
            startDate: formatDateForApi(startDateObj),
            endDate: formatDateForApi(endDateObj),
            imobiliariaId: contratoData.imobiliaria.imobiliariaId,
            imovelId: contratoData.imovel.id,
            inquilinoId: contratoData.imovel.id, // Usando um campo válido
          })

          // Se o imóvel tem prédio, selecionar o prédio
          const imovel = imoveisData.find((i) => i.id === contratoData.imovel.id)
          if (imovel && imovel.predio) {
            setSelectedPredioId(imovel.predio.id)
          }
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
  }, [id, isNew, toast, inquilinoIdParam, imovelIdParam, imobiliariaIdParam])

  // Filtrar imóveis quando o prédio é selecionado
  useEffect(() => {
    if (selectedPredioId) {
      const filteredImoveis = imoveisOriginal.filter((imovel) => imovel.predio && imovel.predio.id === selectedPredioId)
      setImoveis(filteredImoveis)

      // Se o imóvel atual não pertence ao prédio selecionado, limpar a seleção
      if (contrato.imovelId) {
        const currentImovel = imoveisOriginal.find((i) => i.id === contrato.imovelId)
        if (currentImovel && currentImovel.predio && currentImovel.predio.id !== selectedPredioId) {
          setContrato((prev) => ({ ...prev, imovelId: 0 }))
        }
      }
    } else {
      setImoveis(imoveisOriginal)
    }
  }, [selectedPredioId, imoveisOriginal, contrato.imovelId])

  const validateForm = () => {
    const errors: Record<string, string> = {}

    // Verificar se as datas foram preenchidas
    if (!startDateStr) {
      errors.startDate = "Data de início é obrigatória"
    } else {
      // Validar formato das datas
      const startDateValid = /^\d{2}\/\d{2}\/\d{4}$/.test(startDateStr)
      if (!startDateValid) {
        errors.startDate = "Data de início inválida. Use o formato DD/MM/AAAA"
      }
    }

    if (!endDateStr) {
      errors.endDate = "Data de término é obrigatória"
    } else {
      // Validar formato das datas
      const endDateValid = /^\d{2}\/\d{2}\/\d{4}$/.test(endDateStr)
      if (!endDateValid) {
        errors.endDate = "Data de término inválida. Use o formato DD/MM/AAAA"
      }
    }

    // Validar se as datas são válidas
    const startDate = startDateStr ? parseDisplayDate(startDateStr) : null
    const endDate = endDateStr ? parseDisplayDate(endDateStr) : null

    if (startDate && endDate && endDate <= startDate) {
      errors.endDate = "A data de término deve ser posterior à data de início"
    }

    if (!contrato.imobiliariaId) {
      errors.imobiliariaId = "Imobiliária é obrigatória"
    }

    if (!contrato.imovelId) {
      errors.imovelId = "Imóvel é obrigatório"
    }

    if (!contrato.inquilinoId) {
      errors.inquilinoId = "Inquilino é obrigatório"
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
      if (isNew) {
        await contratoApi.create(contrato)
        toast({
          title: "Sucesso",
          description: "Contrato criado com sucesso.",
        })
      } else {
        // Não há endpoint para atualizar contrato na API, apenas para estender
        await contratoApi.extendContrato(Number.parseInt(id), contrato.endDate)
        toast({
          title: "Sucesso",
          description: "Contrato atualizado com sucesso.",
        })
      }
      router.push("/contratos")
    } catch (error) {
      toast({
        title: "Erro",
        description: isNew ? "Não foi possível criar o contrato." : "Não foi possível atualizar o contrato.",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  // Preparar opções para os comboboxes
  const imobiliariaOptions: ComboboxOption[] = imobiliarias.map((imobiliaria) => ({
    value: imobiliaria.id.toString(),
    label: imobiliaria.nome,
  }))

  const predioOptions: ComboboxOption[] = predios.map((predio) => ({
    value: predio.id.toString(),
    label: predio.nome,
  }))

  const imovelOptions: ComboboxOption[] = imoveis.map((imovel) => ({
    value: imovel.id.toString(),
    label: `${imovel.apto} - ${imovel.predio?.nome || "Sem prédio"}`,
  }))

  const inquilinoOptions: ComboboxOption[] = inquilinos.map((inquilino) => ({
    value: inquilino.id.toString(),
    label: inquilino.nome,
  }))

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
          <h1 className="text-3xl font-bold tracking-tight">{isNew ? "Novo Contrato" : "Editar Contrato"}</h1>
          <p className="text-muted-foreground">
            {isNew ? "Preencha os dados para criar um novo contrato." : "Atualize os dados do contrato."}
          </p>
        </div>
        <Link href="/contratos">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Contrato</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="startDate" className={formErrors.startDate ? "text-destructive" : ""}>
                  Data de Início (DD/MM/AAAA)
                </Label>
                <Input
                  id="startDate"
                  value={startDateStr}
                  onChange={handleStartDateChange}
                  placeholder="DD/MM/AAAA"
                  className={formErrors.startDate ? "border-destructive" : ""}
                />
                {formErrors.startDate && <p className="text-xs text-destructive">{formErrors.startDate}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="endDate" className={formErrors.endDate ? "text-destructive" : ""}>
                  Data de Término (DD/MM/AAAA)
                </Label>
                <Input
                  id="endDate"
                  value={endDateStr}
                  onChange={handleEndDateChange}
                  placeholder="DD/MM/AAAA"
                  className={formErrors.endDate ? "border-destructive" : ""}
                />
                {formErrors.endDate && <p className="text-xs text-destructive">{formErrors.endDate}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="imobiliariaId" className={formErrors.imobiliariaId ? "text-destructive" : ""}>
                  Imobiliária
                </Label>
                <Combobox
                  options={imobiliariaOptions}
                  value={contrato.imobiliariaId ? contrato.imobiliariaId.toString() : ""}
                  onValueChange={(value) => setContrato({ ...contrato, imobiliariaId: Number.parseInt(value) })}
                  placeholder="Selecione uma imobiliária"
                  emptyMessage="Nenhuma imobiliária encontrada."
                  error={!!formErrors.imobiliariaId}
                />
                {formErrors.imobiliariaId && <p className="text-xs text-destructive">{formErrors.imobiliariaId}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="predioId">Prédio (Filtro)</Label>
                <Combobox
                  options={predioOptions}
                  value={selectedPredioId ? selectedPredioId.toString() : ""}
                  onValueChange={(value) => setSelectedPredioId(value ? Number.parseInt(value) : null)}
                  placeholder="Filtrar por prédio (opcional)"
                  emptyMessage="Nenhum prédio encontrado."
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="imovelId" className={formErrors.imovelId ? "text-destructive" : ""}>
                  Imóvel
                </Label>
                <Combobox
                  options={imovelOptions}
                  value={contrato.imovelId ? contrato.imovelId.toString() : ""}
                  onValueChange={(value) => setContrato({ ...contrato, imovelId: Number.parseInt(value) })}
                  placeholder="Selecione um imóvel"
                  emptyMessage="Nenhum imóvel encontrado."
                  error={!!formErrors.imovelId}
                />
                {formErrors.imovelId && <p className="text-xs text-destructive">{formErrors.imovelId}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="inquilinoId" className={formErrors.inquilinoId ? "text-destructive" : ""}>
                  Inquilino
                </Label>
                <Combobox
                  options={inquilinoOptions}
                  value={contrato.inquilinoId ? contrato.inquilinoId.toString() : ""}
                  onValueChange={(value) => setContrato({ ...contrato, inquilinoId: Number.parseInt(value) })}
                  placeholder="Selecione um inquilino"
                  emptyMessage="Nenhum inquilino encontrado."
                  error={!!formErrors.inquilinoId}
                />
                {formErrors.inquilinoId && <p className="text-xs text-destructive">{formErrors.inquilinoId}</p>}
              </div>
            </div>

            <Button type="submit" disabled={submitting} className="mt-4">
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className={`${submitting ? "" : "mr-2"} h-4 w-4`} />
              {isNew ? "Criar Contrato" : "Salvar Alterações"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isNew ? "Criar Contrato" : "Atualizar Contrato"}</AlertDialogTitle>
            <AlertDialogDescription>
              {isNew
                ? "Tem certeza que deseja criar este contrato com os dados informados?"
                : "Tem certeza que deseja atualizar os dados deste contrato?"}
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
