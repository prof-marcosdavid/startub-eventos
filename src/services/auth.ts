import { requisicao } from "./api"
import type { Usuario } from "@/tipos"

// O que a API devolve no cadastro e no login: o usuário e o token.
export interface Sessao {
  user: Usuario
  token: string
}

export interface DadosCadastro {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface DadosLogin {
  email: string
  password: string
}

export function cadastrar(dados: DadosCadastro) {
  return requisicao<Sessao>("/register", {
    method: "POST",
    body: JSON.stringify(dados),
  })
}

export function entrar(dados: DadosLogin) {
  return requisicao<Sessao>("/login", {
    method: "POST",
    body: JSON.stringify(dados),
  })
}

export function sair() {
  return requisicao<void>("/logout", { method: "POST" })
}
