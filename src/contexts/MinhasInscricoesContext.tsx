import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useAuth } from "@/contexts/AuthContext"

// Guarda só os ids das inscrições feitas neste navegador, separados por usuário:
// no laboratório, várias pessoas usam o mesmo computador.
// Os dados de cada inscrição vêm sempre da API.

const CHAVE = "startub:minhas-inscricoes"

type IdsPorUsuario = Record<string, number[]>

interface MinhasInscricoesValor {
  ids: number[]
  adicionar: (id: number) => void
}

const MinhasInscricoesContext = createContext<MinhasInscricoesValor | null>(null)

function salvos(): IdsPorUsuario {
  try {
    const lido = JSON.parse(localStorage.getItem(CHAVE) ?? "{}")
    return lido && typeof lido === "object" && !Array.isArray(lido) ? lido : {}
  } catch {
    return {}
  }
}

export function MinhasInscricoesProvider({ children }: { children: ReactNode }) {
  const { usuario } = useAuth()
  const [todos, setTodos] = useState<IdsPorUsuario>(salvos)

  useEffect(() => {
    localStorage.setItem(CHAVE, JSON.stringify(todos))
  }, [todos])

  const dono = String(usuario?.id ?? "")
  const lidos = todos[dono]
  const ids = Array.isArray(lidos) ? lidos.filter(Number.isInteger) : []

  function adicionar(id: number) {
    setTodos((atual) => {
      const meus = atual[dono] ?? []
      return meus.includes(id) ? atual : { ...atual, [dono]: [id, ...meus] }
    })
  }

  return (
    <MinhasInscricoesContext.Provider value={{ ids, adicionar }}>
      {children}
    </MinhasInscricoesContext.Provider>
  )
}

export function useMinhasInscricoes() {
  const valor = useContext(MinhasInscricoesContext)
  if (!valor) throw new Error("useMinhasInscricoes precisa estar dentro de <MinhasInscricoesProvider>")
  return valor
}
