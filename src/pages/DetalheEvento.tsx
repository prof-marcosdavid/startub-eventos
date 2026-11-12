import { Link, useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import { DataDoEvento } from "@/components/DataDoEvento"
import { FormularioInscricao } from "@/components/FormularioInscricao"
import { MensagemErro } from "@/components/Estados"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ehGratuito, formatarData, formatarValor } from "@/lib/formatar"
import { buscarEvento } from "@/services/eventos"

export function DetalheEvento() {
  const { id } = useParams()
  const eventoId = Number(id)

  const { data: evento, isPending, error } = useQuery({
    queryKey: ["eventos", eventoId],
    queryFn: () => buscarEvento(eventoId),
  })

  if (isPending) return <Skeleton className="h-96 rounded-xl" />
  if (error) return <MensagemErro erro={error} />

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_24rem] lg:items-start">
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

      <FormularioInscricao evento={evento} />
    </div>
  )
}
