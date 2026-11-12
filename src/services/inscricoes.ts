import type { Inscricao } from "@/tipos"
import type { DadosInscricao } from "@/schemas/inscricao"
import { requisicao } from "./api"

export function inscrever(eventoId: number, dados: DadosInscricao) {
  return requisicao<Inscricao>(`/eventos/${eventoId}/inscricoes`, {
    method: "POST",
    body: JSON.stringify(dados),
  })
}

export function buscarInscricao(id: number) {
  return requisicao<Inscricao>(`/inscricoes/${id}`)
}
