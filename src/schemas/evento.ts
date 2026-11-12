import { z } from "zod"

// O campo <input type="datetime-local"> entrega "2026-12-05T19:00".
// O Laravel aceita esse formato e devolve "2026-12-05 19:00".
export const esquemaEvento = z.object({
  titulo: z.string().trim().min(1, "Campo obrigatório.").max(120, "Use no máximo 120 caracteres."),
  descricao: z.string().trim(),
  local: z.string().trim().min(1, "Campo obrigatório.").max(120, "Use no máximo 120 caracteres."),
  data: z
    .string()
    .min(1, "Campo obrigatório.")
    .refine((texto) => new Date(texto) > new Date(), "A data precisa ser futura."),
  vagas: z.coerce.number<string>().int("Use um número inteiro.").min(1, "O mínimo é 1 vaga."),
  valor: z.coerce.number<string>().min(0, "O valor não pode ser negativo."),
})

// O que o formulário guarda (texto) e o que a API recebe (números).
export type CamposEvento = z.input<typeof esquemaEvento>
export type DadosEvento = z.output<typeof esquemaEvento>
