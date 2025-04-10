import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  if (!dateString) return "N/A"

  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR").format(date)
  } catch (error) {
    console.error("Erro ao formatar data:", error)
    return "Data inválida"
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}
