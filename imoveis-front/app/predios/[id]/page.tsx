"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type PredioCreationDto, predioApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function PredioDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const id = params.id as string
  const isNew = id === "novo"

  const [predio, setPredio] = useState<PredioCreationDto>({
    nome: "",
    endereco: "",
  })
  const [loading, setLoading] = useState(!isNew)

  useEffect(() => {
    if (!isNew) {
      const fetchPredio = async () => {
        try {
          const data = await predioApi.getById(Number.parseInt(id))
          setPredio({
            nome: data.nome,
            endereco: data.endereco,
          })
        } catch (error) {
          toast({
            title: "Erro",
            description: "Não foi possível carregar os dados do prédio.",
            variant: "destructive",
          })
          console.error(error)
        } finally {
          setLoading(false)
        }
      }

      fetchPredio()
    }
  }, [id, isNew, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isNew) {
        await predioApi.create(predio)
        toast({
          title: "Sucesso",
          description: "Prédio criado com sucesso.",
        })
      } else {
        await predioApi.update(Number.parseInt(id), predio)
        toast({
          title: "Sucesso",
          description: "Prédio atualizado com sucesso.",
        })
      }
      router.push("/predios")
    } catch (error) {
      toast({
        title: "Erro",
        description: isNew ? "Não foi possível criar o prédio." : "Não foi possível atualizar o prédio.",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !isNew) {
    return <div className="flex justify-center p-12">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isNew ? "Novo Prédio" : "Editar Prédio"}</h1>
          <p className="text-muted-foreground">
            {isNew ? "Preencha os dados para criar um novo prédio." : "Atualize os dados do prédio."}
          </p>
        </div>
        <Link href="/predios">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Prédio</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={predio.nome}
                    onChange={(e) => setPredio({ ...predio, nome: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={predio.endereco}
                    onChange={(e) => setPredio({ ...predio, endereco: e.target.value })}
                    required
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" />
                {isNew ? "Criar Prédio" : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
