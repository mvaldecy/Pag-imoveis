"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { createRepasse } from "@/lib/api/repasses"
import { fetchContratos } from "@/lib/api/contratos"
import type { RepasseCreationDto, ContratoDto } from "@/types/api-types"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export default function NovoRepassePage() {
  const [formData, setFormData] = useState<RepasseCreationDto>({
    valorRepasse: 0,
    dataRepasse: new Date().toISOString().split("T")[0],
    contratoId: 0,
  })
  const [contratos, setContratos] = useState<ContratoDto[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function loadContratos() {
      try {
        const data = await fetchContratos()
        setContratos(data)
      } catch (error) {
        console.error("Erro ao carregar contratos:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar a lista de contratos.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadContratos()
  }, [toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "valorRepasse" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      contratoId: Number.parseInt(value),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await createRepasse(formData)
      toast({
        title: "Repasse criado",
        description: "O repasse foi criado com sucesso.",
      })
      router.push("/repasses")
    } catch (error) {
      console.error("Erro ao criar repasse:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o repasse.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-10">Carregando...</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Novo Repasse</h1>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Repasse</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contratoId">Contrato</Label>
              <Select
                value={formData.contratoId ? formData.contratoId.toString() : ""}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um contrato" />
                </SelectTrigger>
                <SelectContent>
                  {contratos.map((contrato) => (
                    <SelectItem key={contrato.id} value={contrato.id.toString()}>
                      Contrato #{contrato.id} - {contrato.imovel?.apto} - {contrato.imobiliaria?.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valorRepasse">Valor do Repasse (R$)</Label>
              <Input
                id="valorRepasse"
                name="valorRepasse"
                type="number"
                step="0.01"
                min="0"
                value={formData.valorRepasse}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataRepasse">Data do Repasse</Label>
              <Input
                id="dataRepasse"
                name="dataRepasse"
                type="date"
                value={formData.dataRepasse}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting || !formData.contratoId || formData.valorRepasse <= 0}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
