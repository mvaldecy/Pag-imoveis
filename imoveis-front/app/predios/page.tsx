"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { type PredioDto, predioApi } from "@/lib/api"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Edit, Trash, Plus, Building } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { ActionButton } from "@/components/ui/action-button"

export default function PrediosPage() {
  const [predios, setPredios] = useState<PredioDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchPredios = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("Buscando prédios da API...")
        const data = await predioApi.getAll()
        console.log("Dados recebidos:", data)

        setPredios(data)
      } catch (error) {
        console.error("Erro ao buscar prédios:", error)
        setError("Não foi possível carregar os prédios. Verifique a conexão com a API.")

        toast({
          title: "Erro de conexão",
          description: "Não foi possível carregar os prédios da API. Verifique se a API está disponível.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPredios()
  }, [toast])

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este prédio?")) {
      try {
        await predioApi.delete(id)
        setPredios(predios.filter((predio) => predio.id !== id))
        toast({
          title: "Sucesso",
          description: "Prédio excluído com sucesso.",
        })
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível excluir o prédio.",
          variant: "destructive",
        })
        console.error(error)
      }
    }
  }

  const columns: ColumnDef<PredioDto>[] = [
    {
      accessorKey: "id",
      header: "ID",
      size: 80,
    },
    {
      accessorKey: "nome",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Nome
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "endereco",
      header: "Endereço",
    },
    {
      accessorKey: "imoveis",
      header: "Imóveis",
      size: 100,
      cell: ({ row }) => {
        const imoveis = row.original.imoveis || []
        return <span>{imoveis.length}</span>
      },
    },
    {
      id: "acoes",
      header: "Ações",
      size: 120,
      cell: ({ row }) => {
        const predio = row.original
        return (
          <div className="flex items-center gap-2">
            <Link href={`/predios/${predio.id}`}>
              <ActionButton icon={Edit} tooltip="Editar prédio" />
            </Link>
            <ActionButton icon={Trash} tooltip="Excluir prédio" onClick={() => handleDelete(predio.id)} />
            <Link href={`/imoveis?predioId=${predio.id}`}>
              <ActionButton icon={Building} tooltip="Ver imóveis" />
            </Link>
          </div>
        )
      },
    },
  ]

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <LoadingSpinner size="lg" text="Carregando prédios..." />
      </div>
    )
  }

  if (predios.length === 0 && !error) {
    return (
      <div className="w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Prédios</h1>
            <p className="text-muted-foreground">Gerencie os prédios cadastrados no sistema.</p>
          </div>
          <Link href="/predios/novo">
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Novo Prédio
            </Button>
          </Link>
        </div>

        <EmptyState
          title="Nenhum prédio encontrado"
          description="Você ainda não tem prédios cadastrados. Clique no botão abaixo para criar seu primeiro prédio."
          icon={Building}
          actionLabel="Criar Prédio"
          actionHref="/predios/novo"
        />
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Prédios</h1>
          <p className="text-muted-foreground">Gerencie os prédios cadastrados no sistema.</p>
        </div>
        <Link href="/predios/novo">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Novo Prédio
          </Button>
        </Link>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!error && (
        <DataTable columns={columns} data={predios} searchColumn="nome" searchPlaceholder="Filtrar por nome..." />
      )}
    </div>
  )
}
