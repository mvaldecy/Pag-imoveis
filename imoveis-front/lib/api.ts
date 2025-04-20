// Import types from types.ts
import {
  type PredioDto,
  type PredioCreationDto,
  type ImovelDto,
  type ImovelCreationDto,
  type InquilinoDto,
  type InquilinoCreationDto,
  type ImobiliariaDto,
  type ImobiliariaCreationDto,
  type ContratoDto,
  type ContratoCreationDto,
  type RepasseDto,
  type RepasseCreationDto,
  ImovelStatus,
  ImovelTipo,
} from "./types"

// URL base da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8083"

// Função auxiliar para fazer requisições à API com tratamento de erros
async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    console.log(`Fazendo requisição para: ${API_BASE_URL}${url}`)
    const response = await fetch(`${API_BASE_URL}${url}`, options)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Erro na API (${response.status}): ${errorText}`)
      throw new Error(`Falha na requisição: ${response.status} ${response.statusText}`)
    }

    // Para requisições DELETE que podem não retornar conteúdo
    if (response.status === 204) {
      return {} as T
    }

    // Verificar se há conteúdo antes de tentar fazer o parse como JSON
    const text = await response.text()
    if (!text) {
      return {} as T
    }

    try {
      return JSON.parse(text) as T
    } catch (e) {
      console.error("Erro ao fazer parse do JSON:", e)
      console.log("Resposta recebida:", text)
      throw new Error("Resposta inválida da API")
    }
  } catch (error) {
    console.error("Erro na requisição:", error)
    throw error
  }
}

// Funções de API para Prédios
export const predioApi = {
  getAll: async (): Promise<PredioDto[]> => {
    return apiRequest<PredioDto[]>("/predio")
  },

  getById: async (id: number): Promise<PredioDto> => {
    return apiRequest<PredioDto>(`/predio/${id}`)
  },

  create: async (predio: PredioCreationDto): Promise<PredioDto> => {
    return apiRequest<PredioDto>("/predio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(predio),
    })
  },

  update: async (id: number, predio: PredioCreationDto): Promise<PredioDto> => {
    return apiRequest<PredioDto>(`/predio/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(predio),
    })
  },

  delete: async (id: number): Promise<string> => {
    return apiRequest<string>(`/predio/${id}`, {
      method: "DELETE",
    })
  },
}

// Funções de API para Imóveis
export const imovelApi = {
  getAll: async (): Promise<ImovelDto[]> => {
    return apiRequest<ImovelDto[]>("/imovel")
  },

  getById: async (id: number): Promise<ImovelDto> => {
    return apiRequest<ImovelDto>(`/imovel/${id}`)
  },

  getByPredioId: async (predioId: number): Promise<ImovelDto[]> => {
    return apiRequest<ImovelDto[]>(`/imovelByPredioId/${predioId}`)
  },

  getByTipo: async (tipo: ImovelTipo): Promise<ImovelDto[]> => {
    return apiRequest<ImovelDto[]>(`/imovel/por-tipo?tipo=${encodeURIComponent(tipo)}`)
  },

  getByStatus: async (status: ImovelStatus): Promise<ImovelDto[]> => {
    return apiRequest<ImovelDto[]>(`/imovel/por-status?status=${encodeURIComponent(status)}`)
  },

  getTipos: async (): Promise<ImovelTipo[]> => {
    return apiRequest<ImovelTipo[]>("/imovel/tipos")
  },

  getStatus: async (): Promise<ImovelStatus[]> => {
    return apiRequest<ImovelStatus[]>("/imovel/status")
  },

  create: async (imovel: ImovelCreationDto): Promise<ImovelDto> => {
    return apiRequest<ImovelDto>("/imovel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(imovel),
    })
  },

  update: async (id: number, imovel: ImovelCreationDto): Promise<ImovelDto> => {
    return apiRequest<ImovelDto>(`/imovel/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(imovel),
    })
  },

  delete: async (id: number): Promise<string> => {
    return apiRequest<string>(`/imovel/${id}`, {
      method: "DELETE",
    })
  },
}

// Funções de API para Inquilinos
export const inquilinoApi = {
  getAll: async (): Promise<InquilinoDto[]> => {
    return apiRequest<InquilinoDto[]>("/inquilino")
  },

  getById: async (id: number): Promise<InquilinoDto> => {
    return apiRequest<InquilinoDto>(`/inquilino/${id}`)
  },

  getByCpf: async (cpf: string): Promise<InquilinoDto> => {
    return apiRequest<InquilinoDto>(`/inquilino/cpf?cpf=${cpf}`)
  },

  create: async (inquilino: InquilinoCreationDto): Promise<InquilinoDto> => {
    return apiRequest<InquilinoDto>("/inquilino", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inquilino),
    })
  },

  update: async (id: number, inquilino: InquilinoCreationDto): Promise<InquilinoDto> => {
    return apiRequest<InquilinoDto>(`/inquilino/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inquilino),
    })
  },

  delete: async (id: number): Promise<string> => {
    return apiRequest<string>(`/inquilino/${id}`, {
      method: "DELETE",
    })
  },
}

// Funções de API para Imobiliárias
export const imobiliariaApi = {
  getAll: async (): Promise<ImobiliariaDto[]> => {
    return apiRequest<ImobiliariaDto[]>("/imobiliaria")
  },

  getById: async (id: number): Promise<ImobiliariaDto> => {
    return apiRequest<ImobiliariaDto>(`/imobiliaria/${id}`)
  },

  getContratosByImobiliariaId: async (id: number): Promise<ContratoDto[]> => {
    return apiRequest<ContratoDto[]>(`/imobiliaria/${id}/contratos`)
  },

  create: async (imobiliaria: ImobiliariaCreationDto): Promise<ImobiliariaDto> => {
    return apiRequest<ImobiliariaDto>("/imobiliaria", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(imobiliaria),
    })
  },

  update: async (id: number, imobiliaria: ImobiliariaCreationDto): Promise<ImobiliariaDto> => {
    return apiRequest<ImobiliariaDto>(`/imobiliaria/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(imobiliaria),
    })
  },

  delete: async (id: number): Promise<string> => {
    return apiRequest<string>(`/imobiliaria/${id}`, {
      method: "DELETE",
    })
  },

  deleteAll: async (): Promise<string> => {
    return apiRequest<string>("/imobiliaria", {
      method: "DELETE",
    })
  },
}

// Funções de API para Contratos
export const contratoApi = {
  getAll: async (): Promise<ContratoDto[]> => {
    return apiRequest<ContratoDto[]>("/contrato")
  },

  getById: async (id: number): Promise<ContratoDto> => {
    return apiRequest<ContratoDto>(`/contrato/${id}`)
  },

  getByInquilinoId: async (inquilinoId: number): Promise<ContratoDto[]> => {
    return apiRequest<ContratoDto[]>(`/contrato/inquilino/${inquilinoId}`)
  },

  getByImovelId: async (imovelId: number): Promise<ContratoDto[]> => {
    return apiRequest<ContratoDto[]>(`/contrato/imovel/${imovelId}`)
  },

  getByImobiliariaId: async (imobiliariaId: number): Promise<ContratoDto[]> => {
    return apiRequest<ContratoDto[]>(`/contrato/imobiliaria/${imobiliariaId}`)
  },

  getByIsActive: async (ativo: boolean): Promise<ContratoDto[]> => {
    return apiRequest<ContratoDto[]>(`/contrato/ativos?ativo=${ativo}`)
  },

  findExpiringWithin: async (dias: number): Promise<ContratoDto[]> => {
    return apiRequest<ContratoDto[]>(`/contrato/vencendo-em?dias=${dias}`)
  },

  create: async (contrato: ContratoCreationDto): Promise<ContratoDto> => {
    return apiRequest<ContratoDto>("/contrato", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contrato),
    })
  },

  extendContrato: async (id: number, newDate: string): Promise<ContratoDto> => {
    return apiRequest<ContratoDto>(`/contrato/${id}/extend?newDate=${newDate}`, {
      method: "PUT",
    })
  },

  closeContrato: async (id: number): Promise<string> => {
    return apiRequest<string>(`/contrato/${id}/close`, {
      method: "PUT",
    })
  },

  delete: async (id: number): Promise<string> => {
    return apiRequest<string>(`/contrato/${id}`, {
      method: "DELETE",
    })
  },
}

// Funções de API para Repasses
export const repasseApi = {
  getAll: async (): Promise<RepasseDto[]> => {
    return apiRequest<RepasseDto[]>("/repasse")
  },

  getById: async (id: number): Promise<RepasseDto> => {
    return apiRequest<RepasseDto>(`/repasse/${id}`)
  },

  findByMes: async (mes: number, ano: number): Promise<RepasseDto[]> => {
    return apiRequest<RepasseDto[]>(`/repasse/mes?mes=${mes}&ano=${ano}`)
  },

  findByContratoId: async (contratoId: number): Promise<RepasseDto[]> => {
    return apiRequest<RepasseDto[]>(`/repasse/contrato/${contratoId}`)
  },

  create: async (repasse: RepasseCreationDto): Promise<RepasseDto> => {
    return apiRequest<RepasseDto>("/repasse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(repasse),
    })
  },

  update: async (id: number, repasse: RepasseCreationDto): Promise<RepasseDto> => {
    return apiRequest<RepasseDto>(`/repasse/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(repasse),
    })
  },

  delete: async (id: number): Promise<string> => {
    return apiRequest<string>(`/repasse/${id}`, {
      method: "DELETE",
    })
  },
}

export type {
  ContratoDto,
  ImobiliariaDto,
  ImovelDto,
  InquilinoDto,
  PredioDto,
  RepasseDto,
  ContratoCreationDto,
  ImobiliariaCreationDto,
  ImovelCreationDto,
  InquilinoCreationDto,
  PredioCreationDto,
  RepasseCreationDto,
}

export { ImovelStatus, ImovelTipo }
