"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { createContrato } from "@/lib/api/contratos"
import { fetchImobiliarias } from "@/lib/api/imobiliarias"
import { fetchImoveis } from "@/lib/api/imoveis"
import { fetchInquilinos } from "@/lib/api/inquilinos"
import type { ContratoCreationDto, ImobiliariaDto, ImovelDto, InquilinoDto } from "@/types/api-types"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export default function NovoContratoPage() {
  const [formData, setFormData] = useState<ContratoCreationDto>({
    startDate: "",
    endDate: "",
    imobiliariaId: 0,
    imovelId: 0,
    inquilinoid: 0,
  })
  const [imobiliarias, setImobiliarias] = useState<ImobiliariaDto[]>([])
  const [imoveis, setImoveis] = useState<ImovelDto[]>([])
  const [inquilinos, setInquilinos] = useState<InquilinoDto[]>([])
  const [filteredInquilinos, setFilteredInquilinos] = useState<InquilinoDto[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function loadData() {
      try {
        const [imobiliariasData, imoveisData, inquilinosData] = await Promise.all([
          fetchImobiliarias(),
          fetchImoveis(),
          fetchInquilinos(),
        ])

        // Filtrar imóveis disponíveis
        const imoveisDisponiveis = imoveisData.filter((imovel) => imovel.status === "DISPONIVEL")

        setImobiliarias(imobiliariasData)
        setImoveis(imoveisDisponiveis)
        setInquilinos(inquilinosData)
        setFilteredInquilinos(inquilinosData)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados necessários.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [toast])

  // Filtrar inquilinos quando a imobiliária for selecionada
  useEffect(() => {
    if (formData.imobiliariaId) {
      const filtered = inquilinos.filter((inquilino) => inquilino.imobiliaria?.id === formData.imobiliariaId)
      setFilteredInquilinos(filtered)
    } else {
      setFilteredInquilinos(inquilinos)
    }
  }, [formData.imobiliariaId, inquilinos])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: Number.parseInt(value),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await createContrato(formData)
      toast({
        title: "Contrato criado",
        description: "O contrato foi criado com sucesso.",
      })
      router.push("/contratos")
    } catch (error) {
      console.error("Erro ao criar contrato:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o contrato.",
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
      <h1 className="text-3xl font-bold tracking-tight mb-6">Novo Contrato</h1>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Contrato</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imobiliariaId">Imobiliária</Label>
              <Select
                value={formData.imobiliariaId ? formData.imobiliariaId.toString() : ""}
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
              <Label htmlFor="inquilinoid">Inquilino</Label>
              <Select
                value={formData.inquilinoid ? formData.inquilinoid.toString() : ""}
                onValueChange={(value) => handleSelectChange("inquilinoid", value)}
                disabled={!formData.imobiliariaId}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      formData.imobiliariaId ? "Selecione um inquilino" : "Selecione uma imobiliária primeiro"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {filteredInquilinos.map((inquilino) => (
                    <SelectItem key={inquilino.id} value={inquilino.id.toString()}>
                      {inquilino.nome} - CPF: {inquilino.cpf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imovelId">Imóvel</Label>
              <Select
                value={formData.imovelId ? formData.imovelId.toString() : ""}
                onValueChange={(value) => handleSelectChange("imovelId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um imóvel" />
                </SelectTrigger>
                <SelectContent>
                  {imoveis.map((imovel) => (
                    <SelectItem key={imovel.id} value={imovel.id.toString()}>
                      {imovel.apto} - {imovel.predio?.nome} ({imovel.tipo}, {imovel.tamanho}m²)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {imoveis.length === 0 && (
                <p className="text-sm text-red-500 mt-1">Não há imóveis disponíveis para locação.</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleDateChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Data de Término</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleDateChange}
                  required
                  min={formData.startDate}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  !formData.imobiliariaId ||
                  !formData.inquilinoid ||
                  !formData.imovelId ||
                  !formData.startDate ||
                  !formData.endDate
                }
              >
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
