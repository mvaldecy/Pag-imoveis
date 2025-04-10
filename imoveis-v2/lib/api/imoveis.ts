import { fetchApi } from "./config"
import type { ImovelDto, ImovelCreationDto } from "@/types/api-types"

export async function fetchImoveis(): Promise<ImovelDto[]> {
  return fetchApi<ImovelDto[]>("/imovel")
}

export async function fetchImovelById(id: number): Promise<ImovelDto> {
  return fetchApi<ImovelDto>(`/imovel/${id}`)
}

export async function fetchImoveisByPredioId(predioId: number): Promise<ImovelDto[]> {
  return fetchApi<ImovelDto[]>(`/imovelByPredioId/${predioId}`)
}

export async function createImovel(imovel: ImovelCreationDto): Promise<ImovelDto> {
  return fetchApi<ImovelDto>("/imovel", {
    method: "POST",
    body: JSON.stringify(imovel),
  })
}
