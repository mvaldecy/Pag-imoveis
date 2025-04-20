"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  type ContratoCreationDto,
  type ImobiliariaDto,
  type ImovelDto,
  type InquilinoDto,
  contratoApi,
  imobiliariaApi,
  imovelApi,
  inquilinoApi,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Loader2, Calendar } from "lucide-react"
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
import { format, addMonths } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

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

  const [contrato, setContrato] = useState<ContratoCreationDto>({
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(addMonths(new Date(), 12), "yyyy-MM-dd"),
    imobiliariaId: imobiliariaIdParam ? Number.parseInt(imobiliariaIdParam) : 0,
    imovelId: imovelIdParam ? Number.parseInt(imovelIdParam) : 0,
    inquilinoId: inquilinoIdParam ? Number.parseInt(inquilinoIdParam) : 0,
  })

  const [imobiliarias, setImobiliarias] = useState<ImobiliariaDto[]>([])
  const [imoveis, setImoveis] = useState<ImovelDto[]>([])
  const [inquilinos, setInquilinos] = useState<InquilinoDto[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Para os calendários
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(addMonths(new Date(), 12))

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar imobiliárias
        const imobiliariasData = await imobiliariaApi.getAll()
        setImobiliarias(imobiliariasData)

        // Buscar imóveis
        const imoveisData = await imovelApi.getAll()
        setImoveis(imoveisData)

        // Buscar inquilinos
        const inquilinosData = await inquilinoApi.getAll()
        setInquilinos(inquilinosData)

        // Se for edição, buscar dados do contrato
        if (!isNew) {
          const contratoData = await contratoApi.getById(Number.parseInt(id))

          const startDateObj = new Date(contratoData.startDate)
          const endDateObj = new Date(contratoData.endDate)

          setStartDate(startDateObj)
          setEndDate(endDateObj)

          setContrato({
            startDate: format(startDateObj, "yyyy-MM-dd"),
            endDate: format(endDateObj, "yyyy-MM-dd"),
            imobiliariaId: contratoData.imobiliaria.imobiliariaId,
            imovelId: contratoData.imovel.id,
            inquilinoId: contratoData.imovel.id, // Isso é um placeholder, a API não retorna o inquilinoId diretamente
          })
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

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!contrato.startDate) {
      errors.startDate = "Data de início é obrigatória"
    }

    if (!contrato.endDate) {
      errors.endDate = "Data de término é obrigatória"
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

    // Verificar se a data de término é posterior à data de início
    if (contrato.startDate && contrato.endDate) {
      const start = new Date(contrato.startDate)
      const end = new Date(contrato.endDate)

      if (end <= start) {
        errors.endDate = "A data de término deve ser posterior à data de início"
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      setStartDate(date)
      setContrato({ ...contrato, startDate: format(date, "yyyy-MM-dd") })

      // Atualizar a data de término para 12 meses após a data de início
      const newEndDate = addMonths(date, 12)
      setEndDate(newEndDate)
      setContrato((prev) => ({ ...prev, endDate: format(newEndDate, "yyyy-MM-dd") }))
    }
  }

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      setEndDate(date)
      setContrato({ ...contrato, endDate: format(date, "yyyy-MM-dd") })
    }
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
        // Aqui você pode implementar a lógica para estender o contrato se  apenas para estender
        // Aqui você pode implementar a lógica para estender o contrato se necessário
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
                  Data de Início
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground",
                        formErrors.startDate && "border-destructive",
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "dd/MM/yyyy") : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={handleStartDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {formErrors.startDate && <p className="text-xs text-destructive">{formErrors.startDate}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="endDate" className={formErrors.endDate ? "text-destructive" : ""}>
                  Data de Término
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground",
                        formErrors.endDate && "border-destructive",
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "dd/MM/yyyy") : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={endDate}
                      onSelect={handleEndDateChange}
                      disabled={(date) => date < startDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {formErrors.endDate && <p className="text-xs text-destructive">{formErrors.endDate}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="imobiliariaId" className={formErrors.imobiliariaId ? "text-destructive" : ""}>
                  Imobiliária
                </Label>
                <Select
                  value={contrato.imobiliariaId ? contrato.imobiliariaId.toString() : ""}
                  onValueChange={(value) => setContrato({ ...contrato, imobiliariaId: Number.parseInt(value) })}
                >
                  <SelectTrigger className={formErrors.imobiliariaId ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecione uma imobiliária" />
                  </SelectTrigger>
                  <SelectContent>
                    {imobiliarias.map((imobiliaria) => (
                      <SelectItem key={imobiliaria.id} value={imobiliaria.id.toString()}>
                        {imobiliaria.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.imobiliariaId && <p className="text-xs text-destructive">{formErrors.imobiliariaId}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="imovelId" className={formErrors.imovelId ? "text-destructive" : ""}>
                  Imóvel
                </Label>
                <Select
                  value={contrato.imovelId ? contrato.imovelId.toString() : ""}
                  onValueChange={(value) => setContrato({ ...contrato, imovelId: Number.parseInt(value) })}
                >
                  <SelectTrigger className={formErrors.imovelId ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecione um imóvel" />
                  </SelectTrigger>
                  <SelectContent>
                    {imoveis.map((imovel) => (
                      <SelectItem key={imovel.id} value={imovel.id.toString()}>
                        {imovel.apto} - {imovel.predio.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.imovelId && <p className="text-xs text-destructive">{formErrors.imovelId}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="inquilinoId" className={formErrors.inquilinoId ? "text-destructive" : ""}>
                  Inquilino
                </Label>
                <Select
                  value={contrato.inquilinoId ? contrato.inquilinoId.toString() : ""}
                  onValueChange={(value) => setContrato({ ...contrato, inquilinoId: Number.parseInt(value) })}
                >
                  <SelectTrigger className={formErrors.inquilinoId ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecione um inquilino" />
                  </SelectTrigger>
                  <SelectContent>
                    {inquilinos.map((inquilino) => (
                      <SelectItem key={inquilino.id} value={inquilino.id.toString()}>
                        {inquilino.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
