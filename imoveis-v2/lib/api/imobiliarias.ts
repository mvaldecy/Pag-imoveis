import { fetchApi } from "./config"
import type { ImobiliariaDto, ImobiliariaCreationDto } from "@/types/api-types"

export async function fetchImobiliarias(): Promise<ImobiliariaDto[]> {
  return fetchApi<ImobiliariaDto[]>("/imobiliaria")
}

export async function fetchImobiliariaById(id: number): Promise<ImobiliariaDto> {
  return fetchApi<ImobiliariaDto>(`/imobiliaria/${id}`)
}

export async function createImobiliaria(imobiliaria: ImobiliariaCreationDto): Promise<ImobiliariaDto> {
  return fetchApi<ImobiliariaDto>("/imobiliaria", {
    method: "POST",
    body: JSON.stringify(imobiliaria),
  })
}

export async function deleteAllImobiliarias(): Promise<string> {
  return fetchApi<string>("/imobiliaria", {
    method: "DELETE",
  })
}
