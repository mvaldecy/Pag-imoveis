"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building, Home, Users, FileText, DollarSign, Store, LayoutDashboard, AlertTriangle } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/predios", label: "Prédios", icon: Building },
  { href: "/imoveis", label: "Imóveis", icon: Home },
  { href: "/inquilinos", label: "Inquilinos", icon: Users },
  { href: "/contratos", label: "Contratos", icon: FileText },
  { href: "/repasses", label: "Repasses", icon: DollarSign },
  { href: "/imobiliarias", label: "Imobiliárias", icon: Store },
  { href: "/contratos/vencendo", label: "Contratos a Vencer", icon: AlertTriangle },
]

export default function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-primary">Pag Imóveis</h1>
          <p className="text-sm text-muted-foreground">Sistema de Gestão</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link href={item.href} className="flex items-center gap-3 w-full">
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <p className="text-xs text-muted-foreground">© 2023 Pag Imóveis</p>
      </SidebarFooter>
    </Sidebar>
  )
}
