"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createInquilino } from "@/lib/api/inquilinos"
import { fetchImobiliarias } from "@/lib/api/imobiliarias"
import type { InquilinoCreationDto, ImobiliariaDto } from "@/types/api-types"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NovoInquilinoPage() {
  const [formData, setFormData] = useState<InquilinoCreationDto>({
    nome: "",
    status: "ATIVO",
    cpf: "",
    imobiliariaId: 0,
  })
  const [imobiliarias, setImobiliarias] = useState<ImobiliariaDto[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingImobiliarias, setLoadingImobiliarias] = useState(true)

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function loadImobiliarias() {
      try {
        const data = await fetchImobiliarias()
        setImobiliarias(data)
      } catch (error) {
        console.error("Erro ao carregar imobiliárias:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar a lista de imobiliárias.",
          variant: "destructive",
        })
      } finally {
        setLoadingImobiliarias(false)
      }
    }

    loadImobiliarias()
  }, [toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === "imobiliariaId" ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await createInquilino(formData)
      toast({
        title: "Inquilino criado",
        description: "O inquilino foi criado com sucesso.",
      })
      router.push("/inquilinos")
    } catch (error) {
      console.error("Erro ao criar inquilino:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o inquilino.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loadingImobiliarias) {
    return <div className="text-center py-10">Carregando...</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Novo Inquilino</h1>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Inquilino</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                required
                placeholder="000.000.000-00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imobiliariaId">Imobiliária</Label>
              <Select
                value={formData.imobiliariaId.toString()}
                onValueChange={(value) => handleSelectChange("imobiliariaId", value)}
              >
                <SelectTrigger>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ATIVO">Ativo</SelectItem>
                  <SelectItem value="INATIVO">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting || formData.imobiliariaId === 0}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
