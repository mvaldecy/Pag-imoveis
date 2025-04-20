"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { type RepasseDto, repasseApi } from "@/lib/api"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Edit, Trash, Plus } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RepassesPage() {
  const [repasses, setRepasses] = useState<RepasseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [mes, setMes] = useState(new Date().getMonth() + 1)
  const [ano, setAno] = useState(new Date().getFullYear())
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const contratoId = searchParams.get("contratoId")

  const fetchRepasses = async () => {
    setLoading(true)
    try {
      let data: RepasseDto[]

      if (contratoId) {
        data = await repasseApi.findByContratoId(Number.parseInt(contratoId))
      } else {
        data = await repasseApi.findByMes(mes, ano)
      }

      setRepasses(data)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os repasses.",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRepasses()
  }, [contratoId, toast])

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este repasse?")) {
      try {
        await repasseApi.delete(id)
        setRepasses(repasses.filter((repasse) => repasse.id !== id))
        toast({
          title: "Sucesso",
          description: "Repasse excluído com sucesso.",
        })
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível excluir o repasse.",
          variant: "destructive",
        })
        console.error(error)
      }
    }
  }

  const columns: ColumnDef<RepasseDto>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "dataRepasse",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Data
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const data = row.original.dataRepasse
        const mes = data.monthValue
        const ano = data.year

        const meses = [
          "Janeiro",
          "Fevereiro",
          "Março",
          "Abril",
          "Maio",
          "Junho",
          "Julho",
          "Agosto",
          "Setembro",
          "Outubro",
          "Novembro",
          "Dezembro",
        ]

        return `${meses[mes - 1]}/${ano}`
      },
    },
    {
      accessorKey: "valorRepasse",
      header: "Valor",
      cell: ({ row }) => {
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(row.original.valorRepasse)
      },
    },
    {
      accessorKey: "contrato.contratoId",
      header: "Contrato",
      cell: ({ row }) => {
        const contrato = row.original.contrato
        return (
          <div>
            <div>ID: {contrato.contratoId}</div>
            <div className="text-xs text-muted-foreground">
              {contrato.imovelApto} - {contrato.predioNome}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "contrato.inquilinoNome",
      header: "Inquilino",
    },
    {
      id: "acoes",
      header: "Ações",
      cell: ({ row }) => {
        const repasse = row.original
        return (
          <div className="flex items-center gap-2">
            <Link href={`/repasses/${repasse.id}`}>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(repasse.id)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  if (loading) {
    return <div className="flex justify-center p-12">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Repasses</h1>
          <p className="text-muted-foreground">
            {contratoId ? "Repasses do contrato selecionado." : "Gerencie os repasses cadastrados no sistema."}
          </p>
        </div>
        <div className="flex gap-2">
          {contratoId && (
            <Link href="/repasses">
              <Button variant="outline">Ver Todos</Button>
            </Link>
          )}
          <Link href="/repasses/novo">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Repasse
            </Button>
          </Link>
        </div>
      </div>

      {!contratoId && (
        <Card>
          <CardHeader>
            <CardTitle>Filtro por Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-end gap-4">
              <div className="grid gap-2 w-full sm:w-auto">
                <Label htmlFor="mes">Mês</Label>
                <Input
                  id="mes"
                  type="number"
                  min="1"
                  max="12"
                  value={mes}
                  onChange={(e) => setMes(Number.parseInt(e.target.value) || 1)}
                  className="w-full"
                />
              </div>
              <div className="grid gap-2 w-full sm:w-auto">
                <Label htmlFor="ano">Ano</Label>
                <Input
                  id="ano"
                  type="number"
                  min="2000"
                  max="2100"
                  value={ano}
                  onChange={(e) => setAno(Number.parseInt(e.target.value) || 2023)}
                  className="w-full"
                />
              </div>
              <Button onClick={fetchRepasses} className="w-full sm:w-auto">
                Buscar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <DataTable
        columns={columns}
        data={repasses}
        searchColumn="contrato.inquilinoNome"
        searchPlaceholder="Filtrar por inquilino..."
      />
    </div>
  )
}
