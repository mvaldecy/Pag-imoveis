"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type ImobiliariaCreationDto, imobiliariaApi } from "@/lib/api"
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

export default function ImobiliariaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const id = params.id as string
  const isNew = id === "novo"

  const [imobiliaria, setImobiliaria] = useState<ImobiliariaCreationDto>({
    nome: "",
  })

  const [loading, setLoading] = useState(!isNew)
  const [submitting, setSubmitting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isNew) {
      const fetchImobiliaria = async () => {
        try {
          const data = await imobiliariaApi.getById(Number.parseInt(id))
          setImobiliaria({
            nome: data.nome,
          })
        } catch (error) {
          toast({
            title: "Erro",
            description: "Não foi possível carregar os dados da imobiliária.",
            variant: "destructive",
          })
          console.error(error)
        } finally {
          setLoading(false)
        }
      }

      fetchImobiliaria()
    } else {
      setLoading(false)
    }
  }, [id, isNew, toast])

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!imobiliaria.nome.trim()) {
      errors.nome = "Nome é obrigatório"
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
        await imobiliariaApi.create(imobiliaria)
        toast({
          title: "Sucesso",
          description: "Imobiliária criada com sucesso.",
        })
      } else {
        await imobiliariaApi.update(Number.parseInt(id), imobiliaria)
        toast({
          title: "Sucesso",
          description: "Imobiliária atualizada com sucesso.",
        })
      }
      router.push("/imobiliarias")
    } catch (error) {
      toast({
        title: "Erro",
        description: isNew ? "Não foi possível criar a imobiliária." : "Não foi possível atualizar a imobiliária.",
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
          <h1 className="text-3xl font-bold tracking-tight">{isNew ? "Nova Imobiliária" : "Editar Imobiliária"}</h1>
          <p className="text-muted-foreground">
            {isNew ? "Preencha os dados para criar uma nova imobiliária." : "Atualize os dados da imobiliária."}
          </p>
        </div>
        <Link href="/imobiliarias">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados da Imobiliária</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="nome" className={formErrors.nome ? "text-destructive" : ""}>
                Nome
              </Label>
              <Input
                id="nome"
                value={imobiliaria.nome}
                onChange={(e) => setImobiliaria({ ...imobiliaria, nome: e.target.value })}
                className={formErrors.nome ? "border-destructive" : ""}
              />
              {formErrors.nome && <p className="text-xs text-destructive">{formErrors.nome}</p>}
            </div>

            <Button type="submit" disabled={submitting} className="mt-4">
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className={`${submitting ? "" : "mr-2"} h-4 w-4`} />
              {isNew ? "Criar Imobiliária" : "Salvar Alterações"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isNew ? "Criar Imobiliária" : "Atualizar Imobiliária"}</AlertDialogTitle>
            <AlertDialogDescription>
              {isNew
                ? "Tem certeza que deseja criar esta imobiliária com os dados informados?"
                : "Tem certeza que deseja atualizar os dados desta imobiliária?"}
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
