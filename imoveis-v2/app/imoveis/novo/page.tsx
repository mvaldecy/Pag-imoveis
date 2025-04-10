"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createImovel } from "@/lib/api/imoveis"
import { fetchPredios } from "@/lib/api/predios"
import type { ImovelCreationDto, PredioDto } from "@/types/api-types"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NovoImovelPage() {
  const [formData, setFormData] = useState<ImovelCreationDto>({
    apto: "",
    status: "DISPONIVEL",
    tamanho: 0,
    tipo: "",
    predioId: 0,
  })
  const [predios, setPredios] = useState<PredioDto[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingPredios, setLoadingPredios] = useState(true)

  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const predioIdParam = searchParams.get("predioId")

  useEffect(() => {
    async function loadPredios() {
      try {
        const data = await fetchPredios()
        setPredios(data)

        // Se tiver um predioId na URL, preenche o formulário
        if (predioIdParam) {
          const predioId = Number.parseInt(predioIdParam)
          setFormData((prev) => ({ ...prev, predioId }))
        }
      } catch (error) {
        console.error("Erro ao carregar prédios:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar a lista de prédios.",
          variant: "destructive",
        })
      } finally {
        setLoadingPredios(false)
      }
    }

    loadPredios()
  }, [predioIdParam, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "tamanho" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === "predioId" ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await createImovel(formData)
      toast({
        title: "Imóvel criado",
        description: "O imóvel foi criado com sucesso.",
      })

      // Se veio de um prédio específico, volta para a página dele
      if (predioIdParam) {
        router.push(`/predios/${predioIdParam}`)
      } else {
        router.push("/imoveis")
      }
    } catch (error) {
      console.error("Erro ao criar imóvel:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o imóvel.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loadingPredios) {
    return <div className="text-center py-10">Carregando...</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Novo Imóvel</h1>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Imóvel</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="predioId">Prédio</Label>
              <Select
                value={formData.predioId.toString()}
                onValueChange={(value) => handleSelectChange("predioId", value)}
                disabled={!!predioIdParam}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um prédio" />
                </SelectTrigger>
                <SelectContent>
                  {predios.map((predio) => (
                    <SelectItem key={predio.id} value={predio.id.toString()}>
                      {predio.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apto">Apartamento/Unidade</Label>
              <Input id="apto" name="apto" value={formData.apto} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select value={formData.tipo} onValueChange={(value) => handleSelectChange("tipo", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="APARTAMENTO">Apartamento</SelectItem>
                    <SelectItem value="CASA">Casa</SelectItem>
                    <SelectItem value="SALA_COMERCIAL">Sala Comercial</SelectItem>
                    <SelectItem value="LOJA">Loja</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tamanho">Tamanho (m²)</Label>
                <Input
                  id="tamanho"
                  name="tamanho"
                  type="number"
                  value={formData.tamanho}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DISPONIVEL">Disponível</SelectItem>
                  <SelectItem value="OCUPADO">Ocupado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting || formData.predioId === 0}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
