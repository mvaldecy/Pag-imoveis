import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Home, Users, FileText, DollarSign, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo ao sistema de gestão Pag Imóveis.</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/predios" className="w-full">
          <Card className="hover:bg-muted/50 transition-colors h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prédios</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Gerenciar</div>
              <p className="text-xs text-muted-foreground">Cadastro e gestão de prédios</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/imoveis" className="w-full">
          <Card className="hover:bg-muted/50 transition-colors h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Imóveis</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Gerenciar</div>
              <p className="text-xs text-muted-foreground">Cadastro e gestão de imóveis</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/inquilinos" className="w-full">
          <Card className="hover:bg-muted/50 transition-colors h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inquilinos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Gerenciar</div>
              <p className="text-xs text-muted-foreground">Cadastro e gestão de inquilinos</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/contratos" className="w-full">
          <Card className="hover:bg-muted/50 transition-colors h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contratos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Gerenciar</div>
              <p className="text-xs text-muted-foreground">Cadastro e gestão de contratos</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/repasses" className="w-full">
          <Card className="hover:bg-muted/50 transition-colors h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Repasses</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Gerenciar</div>
              <p className="text-xs text-muted-foreground">Cadastro e gestão de repasses</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/contratos/vencendo" className="w-full">
          <Card className="hover:bg-muted/50 transition-colors bg-amber-50 dark:bg-amber-950/30 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contratos a Vencer</CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Verificar</div>
              <p className="text-xs text-muted-foreground">Contratos próximos do vencimento</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
