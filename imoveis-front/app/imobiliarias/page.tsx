"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { type ImobiliariaDto, imobiliariaApi } from "@/lib/api"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Edit, Trash, Plus, FileText, Users } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function ImobiliariasPage() {
  const [imobiliarias, setImobiliarias] = useState<ImobiliariaDto[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchImobiliarias = async () => {
      try {
        const data = await imobiliariaApi.getAll()
        setImobiliarias(data)
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar as imobiliárias.",
          variant: "destructive",
        })
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchImobiliarias()
  }, [toast])

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta imobiliária?")) {
      try {
        await imobiliariaApi.delete(id)
        setImobiliarias(imobiliarias.filter((imobiliaria) => imobiliaria.id !== id))
        toast({
          title: "Sucesso",
          description: "Imobiliária excluída com sucesso.",
        })
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível excluir a imobiliária.",
          variant: "destructive",
        })
        console.error(error)
      }
    }
  }

  const columns: ColumnDef<ImobiliariaDto>[] = [
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
      accessorKey: "inquilinos",
      header: "Inquilinos",
      cell: ({ row }) => {
        const inquilinos = row.original.inquilinos || []
        return <span>{inquilinos.length}</span>
      },
    },
    {
      accessorKey: "contratos",
      header: "Contratos",
      cell: ({ row }) => {
        const contratos = row.original.contratos || []
        return <span>{contratos.length}</span>
      },
    },
    {
      id: "acoes",
      header: "Ações",
      cell: ({ row }) => {
        const imobiliaria = row.original
        return (
          <div className="flex items-center gap-2">
            <Link href={`/imobiliarias/${imobiliaria.id}`}>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(imobiliaria.id)}>
              <Trash className="h-4 w-4" />
            </Button>
            <Link href={`/contratos?imobiliariaId=${imobiliaria.id}`}>
              <Button variant="ghost" size="icon">
                <FileText className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/inquilinos?imobiliariaId=${imobiliaria.id}`}>
              <Button variant="ghost" size="icon">
                <Users className="h-4 w-4" />
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
          <h1 className="text-3xl font-bold tracking-tight">Imobiliárias</h1>
          <p className="text-muted-foreground">Gerencie as imobiliárias cadastradas no sistema.</p>
        </div>
        <Link href="/imobiliarias/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Imobiliária
          </Button>
        </Link>
      </div>

      <DataTable columns={columns} data={imobiliarias} searchColumn="nome" searchPlaceholder="Filtrar por nome..." />
    </div>
  )
}
