// A API responde as validações em inglês. Esta tabela traduz as mensagens
// que os formulários podem receber. O que não estiver aqui aparece como veio.
const TRADUCOES: [RegExp, string][] = [
  [/has already been taken/, "Este e-mail já está em uso."],
  [/field is required/, "Campo obrigatório."],
  [/must be a valid email/, "Informe um e-mail válido."],
  [/must be at least (\d+) characters/, "Use pelo menos $1 caracteres."],
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
