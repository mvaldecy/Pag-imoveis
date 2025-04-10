"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export function DashboardHeader() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo ao sistema de gerenciamento imobiliário.</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => router.push("/contratos/novo")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Contrato
        </Button>
        <ModeToggle />
      </div>
    </div>
  )
}
