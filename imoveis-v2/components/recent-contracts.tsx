"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchContratos } from "@/lib/api/contratos"
import type { ContratoDto } from "@/types/api-types"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function RecentContracts() {
  const [contratos, setContratos] = useState<ContratoDto[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadContratos() {
      try {
        const data = await fetchContratos()
        // Ordenar por data de início, mais recentes primeiro
        const sorted = [...data].sort(
          (a, b) => new Date(b.starDate || "").getTime() - new Date(a.starDate || "").getTime(),
        )
        setContratos(sorted.slice(0, 5)) // Pegar apenas os 5 mais recentes
      } catch (error) {
        console.error("Erro ao carregar contratos:", error)
      } finally {
        setLoading(false)
      }
    }

    loadContratos()
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Contratos Recentes</CardTitle>
        <Button variant="outline" onClick={() => router.push("/contratos")}>
          Ver todos
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Carregando...</div>
        ) : contratos.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">Nenhum contrato encontrado</div>
        ) : (
          <div className="space-y-4">
            {contratos.map((contrato) => (
              <div
                key={contrato.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                onClick={() => router.push(`/contratos/${contrato.id}`)}
                role="button"
                tabIndex={0}
              >
                <div>
                  <div className="font-medium">
                    Imóvel: {contrato.imovel?.apto || "N/A"} - {contrato.imovel?.predio?.nome || "N/A"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Imobiliária: {contrato.imobiliaria?.nome || "N/A"}
                  </div>
                </div>
                <div className="text-sm">
                  <div>Início: {formatDate(contrato.starDate || "")}</div>
                  <div>Fim: {formatDate(contrato.endDate || "")}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
