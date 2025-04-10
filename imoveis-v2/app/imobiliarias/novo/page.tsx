"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createImobiliaria } from "@/lib/api/imobiliarias"
import type { ImobiliariaCreationDto } from "@/types/api-types"
import { useToast } from "@/hooks/use-toast"

export default function NovaImobiliariaPage() {
  const [formData, setFormData] = useState<ImobiliariaCreationDto>({
    nome: "",
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
      await createImobiliaria(formData)
      toast({
        title: "Imobiliária criada",
        description: "A imobiliária foi criada com sucesso.",
      })
      router.push("/imobiliarias")
    } catch (error) {
      console.error("Erro ao criar imobiliária:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar a imobiliária.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Nova Imobiliária</h1>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Imobiliária</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
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
