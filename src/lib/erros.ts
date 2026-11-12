import type { FieldValues, Path, UseFormSetError } from "react-hook-form"
import { ApiError } from "@/services/api"

// A API responde as validações em inglês. Esta tabela traduz as mensagens
// que os formulários podem receber. O que não estiver aqui aparece como veio.
const TRADUCOES: [RegExp, string][] = [
  [/has already been taken/, "Este e-mail já está em uso."],
  [/field is required/, "Campo obrigatório."],
  [/must be a valid email/, "Informe um e-mail válido."],
  [/must be (\d+) digits/, "Use $1 números, sem pontos nem traço."],
  [/must be a date after now/, "A data precisa ser futura."],
  [/must be at least (\d+) characters/, "Use pelo menos $1 caracteres."],
  [/must be at least (\d+)/, "O valor mínimo é $1."],
  [/must not be greater than (\d+) characters/, "Use no máximo $1 caracteres."],
  [/confirmation does not match/, "As senhas não conferem."],
  [/Too Many Attempts/, "Muitas tentativas. Espere um minuto e tente de novo."],
  [/This action is unauthorized/, "Você não tem permissão para isso: só quem criou pode alterar."],
  [/No query results/, "Não encontramos o que você procurou."],
]

export function traduzir(mensagem: string): string {
  for (const [padrao, traducao] of TRADUCOES) {
    const achou = mensagem.match(padrao)
    if (achou) return traducao.replace("$1", achou[1] ?? "")
  }
  return mensagem
}

// Leva cada erro 422 da API para o campo correspondente do formulário.
// Devolve true se havia erros de campo para mostrar.
export function aplicarErrosDaApi<T extends FieldValues>(
  erro: unknown,
  setError: UseFormSetError<T>,
): boolean {
  if (!(erro instanceof ApiError) || erro.status !== 422) return false
  for (const [campo, mensagens] of Object.entries(erro.erros)) {
    setError(campo as Path<T>, { message: traduzir(mensagens[0]) })
  }
  return true
}
