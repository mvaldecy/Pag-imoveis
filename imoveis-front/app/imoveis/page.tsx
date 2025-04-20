"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { type ImovelDto, ImovelStatus, imovelApi, predioApi } from "@/lib/api"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Edit, Trash, Plus, FileText } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { ActionButton } from "@/components/ui/action-button"

export default function ImoveisPage() {
  const [imoveis, setImoveis] = useState<ImovelDto[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const predioId = searchParams.get("predioId")

  useEffect(() => {
    const fetchImoveis = async () => {
      try {
        let data: ImovelDto[]
        if (predioId) {
          data = await imovelApi.getByPredioId(Number.parseInt(predioId))

          // Buscar o nome do prédio para exibir no título
          const predio = await predioApi.getById(Number.parseInt(predioId))
          document.title = `Imóveis - ${predio.nome}`
        } else {
          data = await imovelApi.getAll()
        }
        setImoveis(data)
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os imóveis.",
          variant: "destructive",
        })
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchImoveis()
  }, [predioId, toast])

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este imóvel?")) {
      try {
        await imovelApi.delete(id)
        setImoveis(imoveis.filter((imovel) => imovel.id !== id))
        toast({
          title: "Sucesso",
          description: "Imóvel excluído com sucesso.",
        })
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível excluir o imóvel.",
          variant: "destructive",
        })
        console.error(error)
      }
    }
  }

  const columns: ColumnDef<ImovelDto>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "apto",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Apartamento/Sala
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
    },
    {
      accessorKey: "tamanho",
      header: "Tamanho (m²)",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        return <Badge variant={status === ImovelStatus.DISPONIVEL ? "outline" : "secondary"}>{status}</Badge>
      },
    },
    {
      accessorKey: "predio.nome",
      header: "Prédio",
      cell: ({ row }) => row.original.predio?.nome || "-",
    },
    {
      id: "acoes",
      header: "Ações",
      cell: ({ row }) => {
        const imovel = row.original
        return (
          <div className="flex items-center gap-2">
            <Link href={`/imoveis/${imovel.id}`}>
              <ActionButton icon={Edit} tooltip="Editar imóvel" />
            </Link>
            <ActionButton icon={Trash} tooltip="Excluir imóvel" onClick={() => handleDelete(imovel.id)} />
            <Link href={`/contratos?imovelId=${imovel.id}`}>
              <ActionButton icon={FileText} tooltip="Ver contratos" />
            </Link>
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
          <h1 className="text-3xl font-bold tracking-tight">{predioId ? "Imóveis do Prédio" : "Imóveis"}</h1>
          <p className="text-muted-foreground">
            {predioId ? "Gerencie os imóveis deste prédio." : "Gerencie todos os imóveis cadastrados no sistema."}
          </p>
        </div>
        <div className="flex gap-2">
          {predioId && (
            <Link href="/imoveis">
              <Button variant="outline">Ver Todos</Button>
            </Link>
          )}
          <Link href={`/imoveis/novo${predioId ? `?predioId=${predioId}` : ""}`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Imóvel
            </Button>
          </Link>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={imoveis}
        searchColumn="apto"
        searchPlaceholder="Filtrar por apartamento/sala..."
      />
    </div>
  )
}
