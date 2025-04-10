"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { fetchInquilinos } from "@/lib/api/inquilinos"
import type { InquilinoDto } from "@/types/api-types"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function InquilinosPage() {
  const [inquilinos, setInquilinos] = useState<InquilinoDto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("TODOS")
  const router = useRouter()

  useEffect(() => {
    async function loadInquilinos() {
      try {
        const data = await fetchInquilinos()
        setInquilinos(data)
      } catch (error) {
        console.error("Erro ao carregar inquilinos:", error)
      } finally {
        setLoading(false)
      }
    }

    loadInquilinos()
  }, [])

  const filteredInquilinos = inquilinos.filter((inquilino) => {
    const matchesSearch =
      inquilino.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquilino.cpf.includes(searchTerm) ||
      inquilino.imobiliaria?.nome.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "TODOS" || inquilino.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Inquilinos</h1>
        <Button onClick={() => router.push("/inquilinos/novo")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Inquilino
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Buscar por nome, CPF ou imobiliária..."
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
            <SelectItem value="ATIVO">Ativo</SelectItem>
            <SelectItem value="INATIVO">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-10">Carregando...</div>
      ) : filteredInquilinos.length === 0 ? (
        <div className="text-center py-10">
          {searchTerm || statusFilter !== "TODOS"
            ? "Nenhum inquilino encontrado para esta busca."
            : "Nenhum inquilino cadastrado."}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredInquilinos.map((inquilino) => (
            <Card
              key={inquilino.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push(`/inquilinos/${inquilino.id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>{inquilino.nome}</CardTitle>
                  <div
                    className={`px-2 py-1 rounded text-xs ${
                      inquilino.status === "INATIVO"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    }`}
                  >
                    {inquilino.status}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-1">CPF: {inquilino.cpf}</p>
                <p className="text-sm font-medium">Imobiliária: {inquilino.imobiliaria?.nome || "N/A"}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
