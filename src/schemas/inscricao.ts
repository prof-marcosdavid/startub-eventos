import { z } from "zod"

// As mesmas regras que a API aplica no Laravel:
// nome obrigatório até 120, e-mail válido, CPF com 11 dígitos.
export const esquemaInscricao = z.object({
  nome: z
    .string()
    .trim()
    .min(3, "Informe seu nome completo.")
    .max(120, "Use no máximo 120 caracteres."),
  email: z.email("Informe um e-mail válido."),
  cpf: z.string().regex(/^\d{11}$/, "Use os 11 números do CPF, sem pontos nem traço."),
})

export type DadosInscricao = z.infer<typeof esquemaInscricao>
