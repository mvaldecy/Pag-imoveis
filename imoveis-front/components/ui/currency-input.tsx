"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: number
  onChange: (value: number) => void
  className?: string
}

export function CurrencyInput({ value, onChange, className, ...props }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState("")

  // Format the value for display
  useEffect(() => {
    // if (value === 0 && displayValue === "") return

    const formatted = new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100)

    setDisplayValue(formatted)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters
    const rawValue = e.target.value.replace(/\D/g, "")

    if (rawValue === "") {
      setDisplayValue("")
      onChange(0)
      return
    }

    // Convert to number (in cents)
    const numericValue = Number.parseInt(rawValue, 10)

    // Update the actual value
    onChange(numericValue)

    // Format for display
    const formatted = new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericValue / 100)

    setDisplayValue(formatted)
  }

  return (
    <Input
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={handleChange}
      className={cn("text-right", className)}
      {...props}
    />
  )
}
