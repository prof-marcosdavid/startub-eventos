// O formato dos dados, copiado das respostas reais da API.

export interface Evento {
  id: number
  titulo: string
  descricao: string | null
  local: string
  data: string // "2026-12-05 19:00", sem o T
  vagas: number
  valor: string // "25.00", texto e não número
  created_at: string
  updated_at: string
  user_id: number | null // quem criou; null nos eventos de exemplo da API
}

export type StatusInscricao = "pendente" | "confirmada" | "cancelada"

export interface Inscricao {
  id: number
  evento_id: number
  nome: string
  email: string
  cpf: string
  status: StatusInscricao
  link_pagamento?: string | null
  pago_em?: string | null
  created_at: string
  user_id: number // quem se inscreveu
  evento?: Evento // só vem na consulta de uma inscrição
}

export interface Usuario {
  id: number
  name: string
  email: string
}
