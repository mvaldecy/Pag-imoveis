"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { fetchImoveis } from "@/lib/api/imoveis"
import type { ImovelDto } from "@/types/api-types"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ImoveisPage() {
  const [imoveis, setImoveis] = useState<ImovelDto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("TODOS")
  const router = useRouter()

  useEffect(() => {
    async function loadImoveis() {
      try {
        const data = await fetchImoveis()
        setImoveis(data)
      } catch (error) {
        console.error("Erro ao carregar imóveis:", error)
      } finally {
        setLoading(false)
      }
    }

    loadImoveis()
  }, [])

  const filteredImoveis = imoveis.filter((imovel) => {
    const matchesSearch =
      imovel.apto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      imovel.predio?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      imovel.tipo.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "TODOS" || imovel.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Imóveis</h1>
        <Button onClick={() => router.push("/imoveis/novo")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Imóvel
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Buscar por apartamento ou prédio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sm:max-w-xs"
        />

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:max-w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos</SelectItem>
            <SelectItem value="DISPONIVEL">Disponível</SelectItem>
            <SelectItem value="OCUPADO">Ocupado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-10">Carregando...</div>
      ) : filteredImoveis.length === 0 ? (
        <div className="text-center py-10">
          {searchTerm || statusFilter !== "TODOS"
            ? "Nenhum imóvel encontrado para esta busca."
            : "Nenhum imóvel cadastrado."}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredImoveis.map((imovel) => (
            <Card
              key={imovel.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push(`/imoveis/${imovel.id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>{imovel.apto}</CardTitle>
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
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium mb-1">{imovel.predio?.nome}</p>
                <div className="text-sm text-muted-foreground">
                  {imovel.tipo} - {imovel.tamanho}m²
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
