import type { Evento } from "@/tipos"
import type { DadosEvento } from "@/schemas/evento"
import { requisicao } from "./api"

export function listarEventos() {
  return requisicao<Evento[]>("/eventos")
}

export function buscarEvento(id: number) {
  return requisicao<Evento>(`/eventos/${id}`)
}

export function criarEvento(dados: DadosEvento) {
  return requisicao<Evento>("/eventos", {
    method: "POST",
    body: JSON.stringify(dados),
  })
}

export function atualizarEvento(id: number, dados: DadosEvento) {
  return requisicao<Evento>(`/eventos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(dados),
  })
}

export function removerEvento(id: number) {
  return requisicao<void>(`/eventos/${id}`, { method: "DELETE" })
}
