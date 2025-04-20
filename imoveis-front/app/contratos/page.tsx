"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { type ContratoDto, contratoApi } from "@/lib/api"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Edit, Trash, Plus, DollarSign, Calendar } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function ContratosPage() {
  const [contratos, setContratos] = useState<ContratoDto[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const inquilinoId = searchParams.get("inquilinoId")
  const imovelId = searchParams.get("imovelId")
  const imobiliariaId = searchParams.get("imobiliariaId")

  useEffect(() => {
    const fetchContratos = async () => {
      try {
        let data: ContratoDto[]

        if (inquilinoId) {
          data = await contratoApi.getByInquilinoId(Number.parseInt(inquilinoId))
        } else if (imovelId) {
          data = await contratoApi.getByImovelId(Number.parseInt(imovelId))
        } else if (imobiliariaId) {
          data = await contratoApi.getByImobiliariaId(Number.parseInt(imobiliariaId))
        } else {
          data = await contratoApi.getAll()
        }

        setContratos(data)
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os contratos.",
          variant: "destructive",
        })
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchContratos()
  }, [inquilinoId, imovelId, imobiliariaId, toast])

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este contrato?")) {
      try {
        await contratoApi.delete(id)
        setContratos(contratos.filter((contrato) => contrato.id !== id))
        toast({
          title: "Sucesso",
          description: "Contrato excluído com sucesso.",
        })
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível excluir o contrato.",
          variant: "destructive",
        })
        console.error(error)
      }
    }
  }

  const handleCloseContrato = async (id: number) => {
    if (window.confirm("Tem certeza que deseja encerrar este contrato?")) {
      try {
        await contratoApi.closeContrato(id)

        // Atualizar o estado local
        setContratos(contratos.map((contrato) => (contrato.id === id ? { ...contrato, active: false } : contrato)))

        toast({
          title: "Sucesso",
          description: "Contrato encerrado com sucesso.",
        })
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível encerrar o contrato.",
          variant: "destructive",
        })
        console.error(error)
      }
    }
  }

  const columns: ColumnDef<ContratoDto>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "imovel.apto",
      header: "Imóvel",
      cell: ({ row }) => {
        const imovel = row.original.imovel
        return (
          <div>
            <div>{imovel.apto}</div>
            <div className="text-xs text-muted-foreground">{imovel.predioNome}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "startDate",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Início
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return format(new Date(row.original.startDate), "dd/MM/yyyy", { locale: ptBR })
      },
    },
    {
      accessorKey: "endDate",
      header: "Término",
      cell: ({ row }) => {
        return format(new Date(row.original.endDate), "dd/MM/yyyy", { locale: ptBR })
      },
    },
    {
      accessorKey: "active",
      header: "Status",
      cell: ({ row }) => {
        const active = row.original.active
        return <Badge variant={active ? "outline" : "secondary"}>{active ? "Ativo" : "Encerrado"}</Badge>
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
        const contrato = row.original
        return (
          <div className="flex items-center gap-2">
            <Link href={`/contratos/${contrato.id}`}>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            {contrato.active && (
              <Button variant="ghost" size="icon" onClick={() => handleCloseContrato(contrato.id)}>
                <Calendar className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => handleDelete(contrato.id)}>
              <Trash className="h-4 w-4" />
            </Button>
            <Link href={`/repasses?contratoId=${contrato.id}`}>
              <Button variant="ghost" size="icon">
                <DollarSign className="h-4 w-4" />
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
          <h1 className="text-3xl font-bold tracking-tight">Contratos</h1>
          <p className="text-muted-foreground">
            {inquilinoId
              ? "Contratos do inquilino selecionado."
              : imovelId
                ? "Contratos do imóvel selecionado."
                : imobiliariaId
                  ? "Contratos da imobiliária selecionada."
                  : "Gerencie os contratos cadastrados no sistema."}
          </p>
        </div>
        <div className="flex gap-2">
          {(inquilinoId || imovelId || imobiliariaId) && (
            <Link href="/contratos">
              <Button variant="outline">Ver Todos</Button>
            </Link>
          )}
          <Link href="/contratos/novo">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Contrato
            </Button>
          </Link>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={contratos}
        searchColumn="imovel.apto"
        searchPlaceholder="Filtrar por imóvel..."
      />
    </div>
  )
}
