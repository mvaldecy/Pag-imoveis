"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type InquilinoCreationDto, type ImobiliariaDto, inquilinoApi, imobiliariaApi } from "@/lib/api"
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

export default function InquilinoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const id = params.id as string
  const isNew = id === "novo"

  const [inquilino, setInquilino] = useState<InquilinoCreationDto>({
    nome: "",
    status: "Ativo",
    cpf: "",
    imobiliariaId: 0,
  })

  const [imobiliarias, setImobiliarias] = useState<ImobiliariaDto[]>([])
  const [loading, setLoading] = useState(!isNew)
  const [submitting, setSubmitting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar imobiliárias
        const imobiliariasData = await imobiliariaApi.getAll()
        setImobiliarias(imobiliariasData)

        // Se for edição, buscar dados do inquilino
        if (!isNew) {
          const inquilinoData = await inquilinoApi.getById(Number.parseInt(id))
          setInquilino({
            nome: inquilinoData.nome,
            status: inquilinoData.status,
            cpf: inquilinoData.cpf,
            imobiliariaId: inquilinoData.imobiliaria.imobiliariaId,
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
  }, [id, isNew, toast])

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!inquilino.nome.trim()) {
      errors.nome = "Nome é obrigatório"
    }

    if (!inquilino.cpf.trim()) {
      errors.cpf = "CPF é obrigatório"
    } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(inquilino.cpf) && !/^\d{11}$/.test(inquilino.cpf)) {
      errors.cpf = "CPF inválido. Use o formato 000.000.000-00 ou 00000000000"
    }

    if (!inquilino.imobiliariaId) {
      errors.imobiliariaId = "Imobiliária é obrigatória"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const formatCpf = (cpf: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = cpf.replace(/\D/g, "")

    // Se tiver 11 dígitos, formata como CPF
    if (numbers.length === 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    }

    // Retorna o que foi digitado
    return cpf
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
      // Formatar CPF se necessário
      const formattedInquilino = {
        ...inquilino,
        cpf: formatCpf(inquilino.cpf),
      }

      if (isNew) {
        await inquilinoApi.create(formattedInquilino)
        toast({
          title: "Sucesso",
          description: "Inquilino criado com sucesso.",
        })
      } else {
        await inquilinoApi.update(Number.parseInt(id), formattedInquilino)
        toast({
          title: "Sucesso",
          description: "Inquilino atualizado com sucesso.",
        })
      }
      router.push("/inquilinos")
    } catch (error) {
      toast({
        title: "Erro",
        description: isNew ? "Não foi possível criar o inquilino." : "Não foi possível atualizar o inquilino.",
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
          <h1 className="text-3xl font-bold tracking-tight">{isNew ? "Novo Inquilino" : "Editar Inquilino"}</h1>
          <p className="text-muted-foreground">
            {isNew ? "Preencha os dados para criar um novo inquilino." : "Atualize os dados do inquilino."}
          </p>
        </div>
        <Link href="/inquilinos">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Inquilino</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="nome" className={formErrors.nome ? "text-destructive" : ""}>
                  Nome
                </Label>
                <Input
                  id="nome"
                  value={inquilino.nome}
                  onChange={(e) => setInquilino({ ...inquilino, nome: e.target.value })}
                  className={formErrors.nome ? "border-destructive" : ""}
                />
                {formErrors.nome && <p className="text-xs text-destructive">{formErrors.nome}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cpf" className={formErrors.cpf ? "text-destructive" : ""}>
                  CPF
                </Label>
                <Input
                  id="cpf"
                  value={inquilino.cpf}
                  onChange={(e) => setInquilino({ ...inquilino, cpf: e.target.value })}
                  placeholder="000.000.000-00"
                  className={formErrors.cpf ? "border-destructive" : ""}
                />
                {formErrors.cpf && <p className="text-xs text-destructive">{formErrors.cpf}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={inquilino.status}
                  onValueChange={(value) => setInquilino({ ...inquilino, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="imobiliariaId" className={formErrors.imobiliariaId ? "text-destructive" : ""}>
                  Imobiliária
                </Label>
                <Select
                  value={inquilino.imobiliariaId ? inquilino.imobiliariaId.toString() : ""}
                  onValueChange={(value) => setInquilino({ ...inquilino, imobiliariaId: Number.parseInt(value) })}
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
            </div>

            <Button type="submit" disabled={submitting} className="mt-4">
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className={`${submitting ? "" : "mr-2"} h-4 w-4`} />
              {isNew ? "Criar Inquilino" : "Salvar Alterações"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isNew ? "Criar Inquilino" : "Atualizar Inquilino"}</AlertDialogTitle>
            <AlertDialogDescription>
              {isNew
                ? "Tem certeza que deseja criar este inquilino com os dados informados?"
                : "Tem certeza que deseja atualizar os dados deste inquilino?"}
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
