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

export interface Usuario {
  id: number
  name: string
  email: string
}
