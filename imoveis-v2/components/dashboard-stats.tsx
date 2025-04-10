"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, FileText, Building } from "lucide-react"
import { useEffect, useState } from "react"
import { fetchPredios } from "@/lib/api/predios"
import { fetchImoveis } from "@/lib/api/imoveis"
import { fetchImobiliarias } from "@/lib/api/imobiliarias"
import { fetchContratos } from "@/lib/api/contratos"

export function DashboardStats() {
  const [stats, setStats] = useState({
    predios: 0,
    imoveis: 0,
    imobiliarias: 0,
    contratos: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [predios, imoveis, imobiliarias, contratos] = await Promise.all([
          fetchPredios(),
          fetchImoveis(),
          fetchImobiliarias(),
          fetchContratos(),
        ])

        setStats({
          predios: predios.length,
          imoveis: imoveis.length,
          imobiliarias: imobiliarias.length,
          contratos: contratos.length,
        })
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const items = [
    {
      title: "Prédios",
      value: stats.predios,
      icon: Building2,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Imóveis",
      value: stats.imoveis,
      icon: Building,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Imobiliárias",
      value: stats.imobiliarias,
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Contratos",
      value: stats.contratos,
      icon: FileText,
      color: "text-amber-500",
      bgColor: "bg-amber-100 dark:bg-amber-900/20",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <div className={`${item.bgColor} p-2 rounded-full`}>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
