"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Área preparada para incorporação do dashboard Looker.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dashboard Looker</CardTitle>
          <CardDescription>Incorpore seu dashboard do Looker Studio neste espaço.</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[600px] flex items-center justify-center border-2 border-dashed border-muted">
          <div className="text-center">
            <p className="text-muted-foreground">Adicione o código de incorporação do Looker Studio aqui.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
