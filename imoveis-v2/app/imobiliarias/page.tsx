"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { fetchImobiliarias } from "@/lib/api/imobiliarias"
import type { ImobiliariaDto } from "@/types/api-types"
import { Input } from "@/components/ui/input"

export default function ImobiliariasPage() {
  const [imobiliarias, setImobiliarias] = useState<ImobiliariaDto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  useEffect(() => {
    async function loadImobiliarias() {
      try {
        const data = await fetchImobiliarias()
        setImobiliarias(data)
      } catch (error) {
        console.error("Erro ao carregar imobiliárias:", error)
      } finally {
        setLoading(false)
      }
    }

    loadImobiliarias()
  }, [])

  const filteredImobiliarias = imobiliarias.filter((imobiliaria) =>
    imobiliaria.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Imobiliárias</h1>
        <Button onClick={() => router.push("/imobiliarias/novo")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Imobiliária
        </Button>
      </div>

      <div className="max-w-md">
        <Input
          placeholder="Buscar por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
      </div>

      {loading ? (
        <div className="text-center py-10">Carregando...</div>
      ) : filteredImobiliarias.length === 0 ? (
        <div className="text-center py-10">
          {searchTerm ? "Nenhuma imobiliária encontrada para esta busca." : "Nenhuma imobiliária cadastrada."}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredImobiliarias.map((imobiliaria) => (
            <Card
              key={imobiliaria.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push(`/imobiliarias/${imobiliaria.id}`)}
            >
              <CardHeader className="pb-2">
                <CardTitle>{imobiliaria.nome}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Inquilinos</p>
                    <p className="text-xl font-bold">{imobiliaria.inquilinos?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contratos</p>
                    <p className="text-xl font-bold">{imobiliaria.contratos?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
