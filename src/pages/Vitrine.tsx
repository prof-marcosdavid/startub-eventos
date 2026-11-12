import { useQuery } from "@tanstack/react-query"
import { EventoCard } from "@/components/EventoCard"
import { CarregandoCards, MensagemErro, Vazio } from "@/components/Estados"
import { listarEventos } from "@/services/eventos"

export function Vitrine() {
  const { data: eventos, isPending, error, refetch } = useQuery({
    queryKey: ["eventos"],
    queryFn: listarEventos,
  })

  if (isPending) return <CarregandoCards />
  if (error) return <MensagemErro erro={error} tentarDeNovo={refetch} />

  return (
    <section className="grid gap-8">
      <header className="grid gap-2">
        <h1 className="text-4xl font-extrabold sm:text-5xl">Programação do StartUB 2026</h1>
        <p className="max-w-prose text-lg text-muted-foreground">
          Oficinas, minicursos e o hackathon do congresso. Escolha um evento e faça sua inscrição.
        </p>
      </header>

      {eventos.length === 0 ? (
        <Vazio>A programação ainda não tem eventos.</Vazio>
      ) : (
        <div className="grid gap-3">
          {eventos.map((evento) => (
            <EventoCard key={evento.id} evento={evento} />
          ))}
        </div>
      )}
    </section>
  )
}
