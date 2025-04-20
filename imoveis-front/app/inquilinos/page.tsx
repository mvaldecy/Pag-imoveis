"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { type InquilinoDto, inquilinoApi } from "@/lib/api"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Edit, Trash, Plus, FileText } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

export default function InquilinosPage() {
  const [inquilinos, setInquilinos] = useState<InquilinoDto[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchInquilinos = async () => {
      try {
        const data = await inquilinoApi.getAll()
        setInquilinos(data)
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os inquilinos.",
          variant: "destructive",
        })
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchInquilinos()
  }, [toast])

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este inquilino?")) {
      try {
        await inquilinoApi.delete(id)
        setInquilinos(inquilinos.filter((inquilino) => inquilino.id !== id))
        toast({
          title: "Sucesso",
          description: "Inquilino excluído com sucesso.",
        })
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível excluir o inquilino.",
          variant: "destructive",
        })
        console.error(error)
      }
    }
  }

  const columns: ColumnDef<InquilinoDto>[] = [
    {
      accessorKey: "id",
      header: "ID",
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
      accessorKey: "cpf",
      header: "CPF",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        return <Badge variant={status === "Ativo" ? "outline" : "secondary"}>{status}</Badge>
      },
    },
    {
      accessorKey: "imobiliaria.imobiliariaNome",
      header: "Imobiliária",
    },
    {
      id: "acoes",
      header: "Ações",
      cell: ({ row }) => {
        const inquilino = row.original
        return (
          <div className="flex items-center gap-2">
            <Link href={`/inquilinos/${inquilino.id}`}>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(inquilino.id)}>
              <Trash className="h-4 w-4" />
            </Button>
            <Link href={`/contratos?inquilinoId=${inquilino.id}`}>
              <Button variant="ghost" size="icon">
                <FileText className="h-4 w-4" />
              </Button>
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
          <h1 className="text-3xl font-bold tracking-tight">Inquilinos</h1>
          <p className="text-muted-foreground">Gerencie os inquilinos cadastrados no sistema.</p>
        </div>
        <Link href="/inquilinos/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Inquilino
          </Button>
        </Link>
      </div>

      <DataTable columns={columns} data={inquilinos} searchColumn="nome" searchPlaceholder="Filtrar por nome..." />
    </div>
  )
}
