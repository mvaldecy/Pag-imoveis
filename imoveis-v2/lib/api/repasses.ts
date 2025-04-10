import { fetchApi } from "./config"
import type { RepasseDto, RepasseCreationDto } from "@/types/api-types"

export async function fetchRepasses(): Promise<RepasseDto[]> {
  return fetchApi<RepasseDto[]>("/repasse")
}

export async function createRepasse(repasse: RepasseCreationDto): Promise<RepasseDto> {
  return fetchApi<RepasseDto>("/repasse", {
    method: "POST",
    body: JSON.stringify(repasse),
  })
}
