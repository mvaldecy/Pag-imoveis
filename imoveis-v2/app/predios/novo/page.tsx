"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createPredio } from "@/lib/api/predios"
import type { PredioCreationDto } from "@/types/api-types"
import { useToast } from "@/hooks/use-toast"

export default function NovoPredioPage() {
  const [formData, setFormData] = useState<PredioCreationDto>({
    nome: "",
    endereco: "",
    latitude: "",
    longitude: "",
    link: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await createPredio(formData)
      toast({
        title: "Prédio criado",
        description: "O prédio foi criado com sucesso.",
      })
      router.push("/predios")
    } catch (error) {
      console.error("Erro ao criar prédio:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o prédio.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Novo Prédio</h1>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Prédio</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input id="endereco" name="endereco" value={formData.endereco} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input id="latitude" name="latitude" value={formData.latitude} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input id="longitude" name="longitude" value={formData.longitude} onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Link</Label>
              <Input id="link" name="link" value={formData.link} onChange={handleChange} placeholder="https://" />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
