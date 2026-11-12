import { EventoCard } from "@/components/EventoCard"
import { EVENTOS } from "@/dados-de-exemplo"

export function Vitrine() {
  return (
    <section className="grid gap-8">
      <header className="grid gap-2">
        <h1 className="text-4xl font-extrabold sm:text-5xl">Programação do StartUB 2026</h1>
        <p className="max-w-prose text-lg text-muted-foreground">
          Oficinas, minicursos e o hackathon do congresso. Escolha um evento e faça sua inscrição.
        </p>
      </header>

      <div className="grid gap-3">
        {EVENTOS.map((evento) => (
          <EventoCard key={evento.id} evento={evento} />
        ))}
      </div>
    </section>
  )
}
