import type { Evento } from "@/tipos"
import { requisicao } from "./api"

export function listarEventos() {
  return requisicao<Evento[]>("/eventos")
}

export function buscarEvento(id: number) {
  return requisicao<Evento>(`/eventos/${id}`)
}
