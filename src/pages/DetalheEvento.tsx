import { Link, useParams } from "react-router"
import { ArrowLeft } from "lucide-react"
import { DataDoEvento } from "@/components/DataDoEvento"
import { Badge } from "@/components/ui/badge"
import { EVENTOS } from "@/dados-de-exemplo"
import { ehGratuito, formatarData, formatarValor } from "@/lib/formatar"
import { NaoEncontrada } from "@/pages/NaoEncontrada"

export function DetalheEvento() {
  const { id } = useParams()
  const evento = EVENTOS.find((e) => e.id === Number(id))

  if (!evento) return <NaoEncontrada />

  return (
    <article className="grid gap-6">
      <Link to="/" className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Voltar para a programação
      </Link>

      <div className="flex items-start gap-6">
        <DataDoEvento data={evento.data} className="pt-1" />
        <div className="grid gap-3">
          <Badge variant={ehGratuito(evento.valor) ? "secondary" : "default"}>
            {formatarValor(evento.valor)}
          </Badge>
          <h1 className="text-4xl leading-none font-extrabold sm:text-5xl">{evento.titulo}</h1>
        </div>
      </div>

      {evento.descricao && <p className="max-w-prose text-lg text-muted-foreground">{evento.descricao}</p>}

      <dl className="grid gap-4 rounded-xl bg-muted p-5 sm:grid-cols-3">
        <div>
          <dt className="text-sm text-muted-foreground">Quando</dt>
          <dd className="font-semibold">{formatarData(evento.data)}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Onde</dt>
          <dd className="font-semibold">{evento.local}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Vagas</dt>
          <dd className="font-semibold">{evento.vagas}</dd>
        </div>
      </dl>
    </article>
  )
}
