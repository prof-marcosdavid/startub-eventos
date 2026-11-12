import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Search } from "lucide-react"
import { EventoCard } from "@/components/EventoCard"
import { CarregandoCards, MensagemErro, Vazio } from "@/components/Estados"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ehGratuito } from "@/lib/formatar"
import { listarEventos } from "@/services/eventos"

type Filtro = "todos" | "gratuitos" | "pagos"

const FILTROS: { valor: Filtro; rotulo: string }[] = [
  { valor: "todos", rotulo: "Todos" },
  { valor: "gratuitos", rotulo: "Gratuitos" },
  { valor: "pagos", rotulo: "Pagos" },
]

export function Vitrine() {
  const [busca, setBusca] = useState("")
  const [filtro, setFiltro] = useState<Filtro>("todos")

  const { data: eventos, isPending, error, refetch } = useQuery({
    queryKey: ["eventos"],
    queryFn: listarEventos,
  })

  if (isPending) return <CarregandoCards />
  if (error) return <MensagemErro erro={error} tentarDeNovo={refetch} />

  // Estado derivado: a lista filtrada é calculada a cada renderização,
  // não fica guardada num useState.
  const termo = busca.trim().toLowerCase()
  const visiveis = eventos.filter((evento) => {
    const casaBusca = evento.titulo.toLowerCase().includes(termo)
    const casaFiltro =
      filtro === "todos" ||
      (filtro === "gratuitos" && ehGratuito(evento.valor)) ||
      (filtro === "pagos" && !ehGratuito(evento.valor))
    return casaBusca && casaFiltro
  })

  return (
    <section className="grid gap-8">
      <header className="grid gap-2">
        <h1 className="text-4xl font-extrabold sm:text-5xl">Programação do StartUB 2026</h1>
        <p className="max-w-prose text-lg text-muted-foreground">
          Oficinas, minicursos e o hackathon do congresso. Escolha um evento e faça sua inscrição.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-60 flex-1">
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar pelo título"
            aria-label="Buscar pelo título"
            className="pl-10"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <div className="flex gap-1 rounded-full bg-muted p-1" role="group" aria-label="Filtrar por valor">
          {FILTROS.map(({ valor, rotulo }) => (
            <Button
              key={valor}
              size="sm"
              variant={filtro === valor ? "default" : "ghost"}
              aria-pressed={filtro === valor}
              className="rounded-full px-4"
              onClick={() => setFiltro(valor)}
            >
              {rotulo}
            </Button>
          ))}
        </div>
      </div>

      {visiveis.length === 0 ? (
        <Vazio>Nenhum evento com esse título ou filtro. Tente outra busca.</Vazio>
      ) : (
        <div className="grid gap-3">
          {visiveis.map((evento) => (
            <EventoCard key={evento.id} evento={evento} />
          ))}
        </div>
      )}
    </section>
  )
}
