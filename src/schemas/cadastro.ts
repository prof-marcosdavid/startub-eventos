import { z } from "zod"

// As regras do cadastro na API: nome até 255, e-mail válido,
// senha com pelo menos 8 caracteres e confirmação igual à senha.
export const esquemaCadastro = z
  .object({
    name: z.string().trim().min(1, "Campo obrigatório.").max(255, "Use no máximo 255 caracteres."),
    email: z.email("Informe um e-mail válido."),
    password: z.string().min(8, "Use pelo menos 8 caracteres."),
    password_confirmation: z.string(),
  })
  // Regra que envolve dois campos: vai no objeto, e o erro aparece na confirmação.
  .refine((dados) => dados.password === dados.password_confirmation, {
    message: "As senhas não conferem.",
    path: ["password_confirmation"],
  })
