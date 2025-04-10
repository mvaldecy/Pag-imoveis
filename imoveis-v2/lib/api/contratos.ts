import { fetchApi } from "./config"
import type { ContratoDto, ContratoCreationDto } from "@/types/api-types"

export async function fetchContratos(): Promise<ContratoDto[]> {
  return fetchApi<ContratoDto[]>("/contrato")
}

export async function fetchContratoById(id: number): Promise<ContratoDto> {
  return fetchApi<ContratoDto>(`/contrato/${id}`)
}

export async function fetchContratosByInquilinoId(inquilinoId: number): Promise<ContratoDto[]> {
  return fetchApi<ContratoDto[]>(`/contrato/findByInquilinoId/${inquilinoId}`)
}

export async function fetchContratosByImobiliariaId(imobiliariaId: number): Promise<ContratoDto[]> {
  return fetchApi<ContratoDto[]>(`/contrato/findByImobiliariaId/${imobiliariaId}`)
}

export async function createContrato(contrato: ContratoCreationDto): Promise<ContratoDto> {
  return fetchApi<ContratoDto>("/contrato", {
    method: "POST",
    body: JSON.stringify(contrato),
  })
}
