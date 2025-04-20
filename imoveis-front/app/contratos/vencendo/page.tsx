"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { type ContratoDto, contratoApi } from "@/lib/api"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Calendar, Edit } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { format, differenceInDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ContratosVencendoPage() {
  const [contratos, setContratos] = useState<ContratoDto[]>([])
  const [loading, setLoading] = useState(true)
  const [dias, setDias] = useState(30)
  const { toast } = useToast()

  const fetchContratos = async () => {
    setLoading(true)
    try {
      const data = await contratoApi.findExpiringWithin(dias)
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

  useEffect(() => {
    fetchContratos()
  }, [toast])

  const handleExtendContrato = async (id: number, endDate: string) => {
    // Calcular nova data (adicionar 12 meses)
    const currentEndDate = new Date(endDate)
    const newEndDate = new Date(currentEndDate)
    newEndDate.setFullYear(newEndDate.getFullYear() + 1)

    const formattedNewDate = format(newEndDate, "yyyy-MM-dd")

    if (
      window.confirm(
        `Deseja renovar este contrato por mais 12 meses? Nova data de término: ${format(newEndDate, "dd/MM/yyyy")}`,
      )
    ) {
      try {
        await contratoApi.extendContrato(id, formattedNewDate)

        // Atualizar a lista
        fetchContratos()

        toast({
          title: "Sucesso",
          description: "Contrato renovado com sucesso.",
        })
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível renovar o contrato.",
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
      accessorKey: "endDate",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Vencimento
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const endDate = new Date(row.original.endDate)
        const today = new Date()
        const daysLeft = differenceInDays(endDate, today)

        let badgeVariant: "default" | "destructive" | "outline" = "outline"
        if (daysLeft <= 15) badgeVariant = "destructive"
        else if (daysLeft <= 30) badgeVariant = "default"

        return (
          <div className="flex flex-col gap-1">
            <div>{format(endDate, "dd/MM/yyyy", { locale: ptBR })}</div>
            <Badge variant={badgeVariant}>{daysLeft <= 0 ? "Vencido" : `${daysLeft} dias restantes`}</Badge>
          </div>
        )
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
            <Button variant="ghost" size="icon" onClick={() => handleExtendContrato(contrato.id, contrato.endDate)}>
              <Calendar className="h-4 w-4" />
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contratos a Vencer</h1>
        <p className="text-muted-foreground">Visualize e gerencie contratos próximos do vencimento.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtro</CardTitle>
          <CardDescription>Defina o período para buscar contratos a vencer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="grid gap-2 flex-1">
              <Label htmlFor="dias">Dias até o vencimento</Label>
              <Input
                id="dias"
                type="number"
                value={dias}
                onChange={(e) => setDias(Number.parseInt(e.target.value) || 30)}
              />
            </div>
            <Button onClick={fetchContratos} className="w-full sm:w-auto">
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={contratos}
        searchColumn="imovel.apto"
        searchPlaceholder="Filtrar por imóvel..."
      />
    </div>
  )
}
