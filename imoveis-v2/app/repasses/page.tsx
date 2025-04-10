"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { fetchRepasses } from "@/lib/api/repasses"
import type { RepasseDto } from "@/types/api-types"
import { Input } from "@/components/ui/input"
import { formatDate, formatCurrency } from "@/lib/utils"

export default function RepassesPage() {
  const [repasses, setRepasses] = useState<RepasseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  useEffect(() => {
    async function loadRepasses() {
      try {
        const data = await fetchRepasses()
        setRepasses(data)
      } catch (error) {
        console.error("Erro ao carregar repasses:", error)
      } finally {
        setLoading(false)
      }
    }

    loadRepasses()
  }, [])

  const filteredRepasses = repasses.filter((repasse) => {
    const contratoId = repasse.contrato?.id?.toString() || ""
    const dataRepasse = formatDate(repasse.dataRepasse || "")

    return contratoId.includes(searchTerm) || dataRepasse.includes(searchTerm)
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Repasses</h1>
        <Button onClick={() => router.push("/repasses/novo")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Repasse
        </Button>
      </div>

      <div className="max-w-md">
        <Input
          placeholder="Buscar por contrato ou data..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
      </div>

      {loading ? (
        <div className="text-center py-10">Carregando...</div>
      ) : filteredRepasses.length === 0 ? (
        <div className="text-center py-10">
          {searchTerm ? "Nenhum repasse encontrado para esta busca." : "Nenhum repasse cadastrado."}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRepasses.map((repasse) => (
            <Card key={repasse.id}>
              <CardHeader className="pb-2">
                <CardTitle>Repasse #{repasse.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Contrato</p>
                    <p className="font-medium">#{repasse.contrato?.id || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data do Repasse</p>
                    <p className="font-medium">{formatDate(repasse.dataRepasse || "")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valor</p>
                    <p className="font-medium text-lg text-green-600 dark:text-green-400">
                      {formatCurrency(repasse.valorRepasse || 0)}
                    </p>
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
