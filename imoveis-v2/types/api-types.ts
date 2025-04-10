// Tipos para Prédio
export interface PredioCreationDto {
  nome: string
  endereco: string
  latitude: string
  longitude: string
  link: string
}

export interface Imovel {
  id: number
  tipo: string
  tamanho: number
  apto: string
  status: string
}

export interface PredioDto {
  id: number
  nome: string
  endereco: string
  latitude: string
  longitude: string
  link: string
  imoveis: Imovel[]
}

// Tipos para Imóvel
export interface ImovelCreationDto {
  apto: string
  status: string
  tamanho: number
  tipo: string
  predioId: number
}

export interface Predio {
  id: number
  nome: string
  endereco: string
  latitude: string
  longitude: string
  link: string
}

export interface ImovelDto {
  id: number
  tipo: string
  tamanho: number
  apto: string
  status: string
  predio: Predio
}

// Tipos para Imobiliária
export interface ImobiliariaCreationDto {
  nome: string
}

export interface Inquilino {
  id: number
  nome: string
  cpf: string
  status: string
}

export interface Contrato {
  id: number
  startDate: string
  endDate: string
}

export interface ImobiliariaDto {
  id: number
  nome: string
  inquilinos: Inquilino[]
  contratos: Contrato[]
}

// Tipos para Inquilino
export interface InquilinoCreationDto {
  nome: string
  status: string
  cpf: string
  imobiliariaId: number
}

export interface Imobiliaria {
  id: number
  nome: string
}

export interface InquilinoDto {
  id: number
  cpf: string
  nome: string
  status: string
  imobiliaria: Imobiliaria
}

// Tipos para Contrato
export interface ContratoCreationDto {
  startDate: string
  endDate: string
  imobiliariaId: number
  imovelId: number
  inquilinoid: number
}

export interface Repasse {
  id: number
  valorRepasse: number
  dataRepasse: string
}

export interface ContratoDto {
  id: number
  starDate: string
  endDate: string
  imobiliaria: Imobiliaria
  imovel: Imovel
  repasse: Repasse[]
}

// Tipos para Repasse
export interface RepasseCreationDto {
  valorRepasse: number
  dataRepasse: string
  contratoId: number
}

export interface RepasseDto {
  id: number
  dataRepasse: string
  valorRepasse: number
  contrato: Contrato
}
