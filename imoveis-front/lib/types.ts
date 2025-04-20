// Enums
export enum ImovelTipo {
  APTO_1_DORM = "Apartamento - 1 dormitório",
  APTO_2_DORM = "Apartamento - 2 dormitórios",
  APTO_LUXO = "Apartamento Luxo",
  FLAT = "Flat",
  SALA_COMERCIAL = "Sala comercial",
}

export enum ImovelStatus {
  DISPONIVEL = "Disponível",
  OCUPADO = "Ocupado",
}

// Interfaces
export interface PredioDto {
  id: number
  nome: string
  endereco: string
  imoveis?: ImovelResumoDto[]
}

export interface PredioCreationDto {
  nome: string
  endereco: string
}

export interface ImovelDto {
  id: number
  tipo: ImovelTipo
  tamanho: number
  apto: string
  status: ImovelStatus
  predio: PredioResumoDto
  observacao?: string
  valor?: number
}

export interface ImovelResumoDto {
  id: number
  apto: string
  status: ImovelStatus
  tamanho: number
  tipo: ImovelTipo
  predioId: number
  predioNome: string
  predioEndereco: string
  observacao?: string
}

export interface ImovelCreationDto {
  apto: string
  status: ImovelStatus
  tamanho: number
  tipo: ImovelTipo
  predioId: number
  valor: number
  observacao?: string
}

export interface PredioResumoDto {
  id: number
  nome: string
  endereco: string
}

export interface InquilinoDto {
  id: number
  cpf: string
  nome: string
  status: string
  imobiliaria: ImobiliariaResumoDto
  contratos?: ContratoResumoDto[]
}

export interface InquilinoResumoDto {
  id: number
  nome: string
  cpf: string
  status: string
}

export interface InquilinoCreationDto {
  nome: string
  status: string
  cpf: string
  imobiliariaId: number
}

export interface ImobiliariaDto {
  id: number
  nome: string
  inquilinos?: InquilinoResumoDto[]
  contratos?: ContratoResumoDto[]
}

export interface ImobiliariaResumoDto {
  imobiliariaId: number
  imobiliariaNome: string
}

export interface ImobiliariaCreationDto {
  nome: string
}

export interface ContratoDto {
  id: number
  startDate: string
  endDate: string
  active: boolean
  imobiliaria: ImobiliariaResumoDto
  imovel: ImovelResumoDto
  repasse?: RepasseResumoDto[]
}

export interface ContratoResumoDto {
  contratoId: number
  startDate: string
  endDate: string
  active: boolean
  predioId: number
  predioNome: string
  predioEndereco: string
  imovelId: number
  imovelApto: string
  inquilinoId: number
  inquilinoNome: string
  imobiliariaId: number
  imobiliariaNome: string
}

export interface ContratoCreationDto {
  startDate: string
  endDate: string
  imobiliariaId: number
  imovelId: number
  inquilinoId: number
}

export interface RepasseDto {
  id: number
  dataRepasse: {
    year: number
    month: string
    monthValue: number
    leapYear: boolean
  }
  valorRepasse: number
  contrato: ContratoResumoDto
}

export interface RepasseResumoDto {
  id: number
  dataRepasse: {
    year: number
    month: string
    monthValue: number
    leapYear: boolean
  }
  valorRepasse: number
}

export interface RepasseCreationDto {
  valorRepasse: number
  dataRepasse: {
    year: number
    month: string
    monthValue: number
    leapYear: boolean
  }
  contratoId: number
}
