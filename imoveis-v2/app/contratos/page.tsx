"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { fetchContratos } from "@/lib/api/contratos"
import type { ContratoDto } from "@/types/api-types"
import { Input } from "@/components/ui/input"
import { formatDate } from "@/lib/utils"

export default function ContratosPage() {
  const [contratos, setContratos] = useState<ContratoDto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  useEffect(() => {
    async function loadContratos() {
      try {
        const data = await fetchContratos()
        setContratos(data)
      } catch (error) {
        console.error("Erro ao carregar contratos:", error)
      } finally {
        setLoading(false)
      }
    }

    loadContratos()
  }, [])

  const filteredContratos = contratos.filter((contrato) => {
    const imobiliariaName = contrato.imobiliaria?.nome?.toLowerCase() || ""
    const imovelInfo = `${contrato.imovel?.apto || ""} ${contrato.imovel?.predio?.nome || ""}`.toLowerCase()

    return imobiliariaName.includes(searchTerm.toLowerCase()) || imovelInfo.includes(searchTerm.toLowerCase())
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Contratos</h1>
        <Button onClick={() => router.push("/contratos/novo")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Contrato
        </Button>
      </div>

      <div className="max-w-md">
        <Input
          placeholder="Buscar por imobiliária ou imóvel..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
      </div>

      {loading ? (
        <div className="text-center py-10">Carregando...</div>
      ) : filteredContratos.length === 0 ? (
        <div className="text-center py-10">
          {searchTerm ? "Nenhum contrato encontrado para esta busca." : "Nenhum contrato cadastrado."}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredContratos.map((contrato) => (
            <Card
              key={contrato.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push(`/contratos/${contrato.id}`)}
            >
              <CardHeader className="pb-2">
                <CardTitle>Contrato #{contrato.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Imóvel</p>
                    <p className="font-medium">
                      {contrato.imovel?.apto || "N/A"} - {contrato.imovel?.predio?.nome || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Imobiliária</p>
                    <p className="font-medium">{contrato.imobiliaria?.nome || "N/A"}</p>
                  </div>
                  <div className="flex justify-between pt-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Início</p>
                      <p className="text-sm">{formatDate(contrato.starDate || "")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Fim</p>
                      <p className="text-sm">{formatDate(contrato.endDate || "")}</p>
                    </div>
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
