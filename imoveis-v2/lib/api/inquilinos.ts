import { fetchApi } from "./config"
import type { InquilinoDto, InquilinoCreationDto } from "@/types/api-types"

export async function fetchInquilinos(): Promise<InquilinoDto[]> {
  return fetchApi<InquilinoDto[]>("/inqulino")
}

export async function fetchInquilinoById(id: number): Promise<InquilinoDto> {
  return fetchApi<InquilinoDto>(`/inquilino/${id}`)
}

export async function fetchInquilinoByCpf(cpf: string): Promise<InquilinoDto> {
  return fetchApi<InquilinoDto>(`/inquilinoByCpf?Cpf=${cpf}`)
}

export async function createInquilino(inquilino: InquilinoCreationDto): Promise<InquilinoDto> {
  return fetchApi<InquilinoDto>("/inquilino", {
    method: "POST",
    body: JSON.stringify(inquilino),
  })
}
