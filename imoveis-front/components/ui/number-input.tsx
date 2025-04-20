"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: number | undefined
  onChange: (value: number | undefined) => void
  className?: string
  allowEmpty?: boolean
}

export function NumberInput({ value, onChange, className, allowEmpty = false, ...props }: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value

    if (val === "") {
      if (allowEmpty) {
        onChange(undefined)
      } else {
        onChange(0)
      }
      return
    }

    // Remove leading zeros
    const trimmed = val.replace(/^0+/, "")
    const numValue = Number.parseInt(trimmed || "0", 10)

    if (!isNaN(numValue)) {
      onChange(numValue)
    }
  }

  return (
    <Input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={value === undefined || (value === 0 && allowEmpty) ? "" : value}
      onChange={handleChange}
      className={cn(className)}
      {...props}
    />
  )
}
