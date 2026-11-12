export const API_URL =
  import.meta.env.VITE_API_URL ?? "https://startub.appmake.com.br/api"

export const CHAVE_SESSAO = "startub:sessao"

// Erro com o que a API respondeu: o status HTTP, a mensagem e,
// no caso do 422, os erros de cada campo.
export class ApiError extends Error {
  status: number
  erros: Record<string, string[]>

  constructor(status: number, mensagem: string, erros: Record<string, string[]> = {}) {
    super(mensagem)
    this.status = status
    this.erros = erros
  }
}

function tokenSalvo(): string | null {
  const sessao = localStorage.getItem(CHAVE_SESSAO)
  return sessao ? JSON.parse(sessao).token : null
}

export async function requisicao<T>(caminho: string, opcoes: RequestInit = {}): Promise<T> {
  const token = tokenSalvo()

  let resposta: Response
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      ...opcoes,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...opcoes.headers,
      },
    })
  } catch {
    throw new ApiError(0, "Não foi possível falar com a API. Confira sua conexão.")
  }

  if (resposta.status === 204) return undefined as T

  const corpo = await resposta.json().catch(() => ({}))

  if (!resposta.ok) {
    if (resposta.status === 401 && token) {
      localStorage.removeItem(CHAVE_SESSAO)
      window.dispatchEvent(new Event("sessao-expirada"))
    }
    throw new ApiError(resposta.status, corpo.message ?? `Erro ${resposta.status}`, corpo.errors)
  }

  return corpo as T
}
