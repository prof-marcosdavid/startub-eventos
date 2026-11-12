import type { ReactNode } from "react"

// Moldura das telas de cadastro e de login: as boas-vindas à esquerda,
// o formulário à direita. No celular, só o formulário.
export function TelaDeAcesso({ children }: { children: ReactNode }) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1fr_24rem]">
      <div className="hidden gap-4 lg:grid">
        <p className="texto-marca font-heading text-8xl leading-none font-extrabold">2026</p>
        <h1 className="max-w-lg text-4xl leading-tight font-extrabold">
          As inscrições do congresso StartUB, num lugar só
        </h1>
        <p className="max-w-prose text-lg text-muted-foreground">
          Veja a programação, inscreva-se nas oficinas, nos minicursos e no hackathon e acompanhe o
          pagamento com a sua conta.
        </p>
      </div>
      {children}
    </div>
  )
}
