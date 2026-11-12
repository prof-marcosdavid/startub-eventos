import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { CHAVE_SESSAO } from "@/services/api"
import * as auth from "@/services/auth"
import type { DadosCadastro, DadosLogin, Sessao } from "@/services/auth"
import type { Usuario } from "@/tipos"

interface AuthContextValor {
  usuario: Usuario | null
  cadastrar: (dados: DadosCadastro) => Promise<void>
  entrar: (dados: DadosLogin) => Promise<void>
  sair: () => Promise<void>
}

const AuthContext = createContext<AuthContextValor | null>(null)

function sessaoSalva(): Sessao | null {
  try {
    const texto = localStorage.getItem(CHAVE_SESSAO)
    return texto ? JSON.parse(texto) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(() => sessaoSalva()?.user ?? null)

  // A camada da API avisa quando o token deixou de valer (resposta 401).
  useEffect(() => {
    const aoExpirar = () => setUsuario(null)
    window.addEventListener("sessao-expirada", aoExpirar)
    return () => window.removeEventListener("sessao-expirada", aoExpirar)
  }, [])

  // Cadastro e login devolvem a mesma coisa: guardamos a sessão do mesmo jeito.
  function guardar(sessao: Sessao) {
    localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao))
    setUsuario(sessao.user)
  }

  async function cadastrar(dados: DadosCadastro) {
    guardar(await auth.cadastrar(dados))
  }

  async function entrar(dados: DadosLogin) {
    guardar(await auth.entrar(dados))
  }

  async function sair() {
    try {
      await auth.sair()
    } finally {
      localStorage.removeItem(CHAVE_SESSAO)
      setUsuario(null)
    }
  }

  return (
    <AuthContext.Provider value={{ usuario, cadastrar, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const valor = useContext(AuthContext)
  if (!valor) throw new Error("useAuth precisa estar dentro de <AuthProvider>")
  return valor
}
