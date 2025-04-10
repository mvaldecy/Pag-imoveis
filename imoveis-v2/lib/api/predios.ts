import { fetchApi } from "./config"
import type { PredioDto, PredioCreationDto } from "@/types/api-types"

export async function fetchPredios(): Promise<PredioDto[]> {
  return fetchApi<PredioDto[]>("/predio")
}

export async function fetchPredioById(id: number): Promise<PredioDto> {
  return fetchApi<PredioDto>(`/predio/${id}`)
}

export async function createPredio(predio: PredioCreationDto): Promise<PredioDto> {
  return fetchApi<PredioDto>("/predio", {
    method: "POST",
    body: JSON.stringify(predio),
  })
}
