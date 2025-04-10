"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { fetchPredios } from "@/lib/api/predios"
import type { PredioDto } from "@/types/api-types"
import { Input } from "@/components/ui/input"

export default function PrediosPage() {
  const [predios, setPredios] = useState<PredioDto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  useEffect(() => {
    async function loadPredios() {
      try {
        const data = await fetchPredios()
        setPredios(data)
      } catch (error) {
        console.error("Erro ao carregar prédios:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPredios()
  }, [])

  const filteredPredios = predios.filter(
    (predio) =>
      predio.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      predio.endereco.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Prédios</h1>
        <Button onClick={() => router.push("/predios/novo")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Prédio
        </Button>
      </div>

      <div className="max-w-md">
        <Input
          placeholder="Buscar por nome ou endereço..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
      </div>

      {loading ? (
        <div className="text-center py-10">Carregando...</div>
      ) : filteredPredios.length === 0 ? (
        <div className="text-center py-10">
          {searchTerm ? "Nenhum prédio encontrado para esta busca." : "Nenhum prédio cadastrado."}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPredios.map((predio) => (
            <Card
              key={predio.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push(`/predios/${predio.id}`)}
            >
              <CardHeader className="pb-2">
                <CardTitle>{predio.nome}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{predio.endereco}</p>
                <div className="text-sm">
                  <span className="font-medium">{predio.imoveis?.length || 0}</span> imóveis
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
