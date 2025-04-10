"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Building2, Home, Users, FileText, CreditCard, Building, Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const navItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Prédios", href: "/predios", icon: Building2 },
  { name: "Imóveis", href: "/imoveis", icon: Building },
  { name: "Imobiliárias", href: "/imobiliarias", icon: Users },
  { name: "Inquilinos", href: "/inquilinos", icon: Users },
  { name: "Contratos", href: "/contratos", icon: FileText },
  { name: "Repasses", href: "/repasses", icon: CreditCard },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r transform transition-transform duration-200 ease-in-out md:translate-x-0 md:relative md:inset-auto",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary">Pag Imóveis</h1>
        </div>
        <nav className="px-4 py-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm rounded-md transition-colors",
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
