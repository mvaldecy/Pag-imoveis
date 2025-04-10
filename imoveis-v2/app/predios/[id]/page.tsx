"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchPredioById } from "@/lib/api/predios"
import { fetchImoveisByPredioId } from "@/lib/api/imoveis"
import type { PredioDto, ImovelDto } from "@/types/api-types"
import { PlusCircle, ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function PredioDetailPage({ params }: { params: { id: string } }) {
  const [predio, setPredio] = useState<PredioDto | null>(null)
  const [imoveis, setImoveis] = useState<ImovelDto[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const predioId = Number.parseInt(params.id)

  useEffect(() => {
    async function loadData() {
      try {
        const [predioData, imoveisData] = await Promise.all([
          fetchPredioById(predioId),
          fetchImoveisByPredioId(predioId),
        ])
        setPredio(predioData)
        setImoveis(imoveisData)
      } catch (error) {
        console.error("Erro ao carregar dados do prédio:", error)
      } finally {
        setLoading(false)
      }
    }

    if (!isNaN(predioId)) {
      loadData()
    }
  }, [predioId])

  if (loading) {
    return <div className="text-center py-10">Carregando...</div>
  }

  if (!predio) {
    return <div className="text-center py-10">Prédio não encontrado</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{predio.nome}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Prédio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Endereço</h3>
              <p className="text-muted-foreground">{predio.endereco}</p>
            </div>

            {predio.link && (
              <div>
                <h3 className="font-medium">Link</h3>
                <Link
                  href={predio.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary flex items-center gap-1 hover:underline"
                >
                  Abrir link <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            )}

            {(predio.latitude || predio.longitude) && (
              <div>
                <h3 className="font-medium">Localização</h3>
                <p className="text-muted-foreground">
                  {predio.latitude}, {predio.longitude}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Imóveis</CardTitle>
            <Button size="sm" onClick={() => router.push(`/imoveis/novo?predioId=${predio.id}`)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Imóvel
            </Button>
          </CardHeader>
          <CardContent>
            {imoveis.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">Nenhum imóvel cadastrado para este prédio</div>
            ) : (
              <div className="space-y-4">
                {imoveis.map((imovel) => (
                  <div
                    key={imovel.id}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                    onClick={() => router.push(`/imoveis/${imovel.id}`)}
                    role="button"
                    tabIndex={0}
                  >
                    <div>
                      <div className="font-medium">{imovel.apto}</div>
                      <div className="text-sm text-muted-foreground">
                        {imovel.tipo} - {imovel.tamanho}m²
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-xs ${
                        imovel.status === "OCUPADO"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      }`}
                    >
                      {imovel.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
