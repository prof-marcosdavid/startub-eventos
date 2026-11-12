import { Clock, MapPin, Users } from "lucide-react"
import { DataDoEvento } from "@/components/DataDoEvento"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ehGratuito, formatarValor, partesDaData } from "@/lib/formatar"
import type { Evento } from "@/tipos"

interface EventoCardProps {
  evento: Evento
}

// Uma linha da programação: a data à esquerda, o evento no meio, o valor à direita.
export function EventoCard({ evento }: EventoCardProps) {
  const { hora } = partesDaData(evento.data)

  return (
    <Card className="grid grid-cols-[4.5rem_1fr] gap-4 px-4 text-base sm:grid-cols-[5rem_1fr_auto] sm:items-center sm:px-6">
      <DataDoEvento data={evento.data} />

      <div className="grid gap-1.5">
        <h2 className="text-xl leading-tight font-bold">{evento.titulo}</h2>
        {evento.descricao && <p className="text-muted-foreground">{evento.descricao}</p>}
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <li className="flex items-center gap-1.5"><Clock className="size-4" /> {hora}</li>
          <li className="flex items-center gap-1.5"><MapPin className="size-4" /> {evento.local}</li>
          <li className="flex items-center gap-1.5"><Users className="size-4" /> {evento.vagas} vagas</li>
        </ul>
      </div>

      <div className="col-span-2 flex items-center justify-between gap-3 sm:col-span-1 sm:flex-col sm:items-end">
        <Badge variant={ehGratuito(evento.valor) ? "secondary" : "default"}>
          {formatarValor(evento.valor)}
        </Badge>
      </div>
    </Card>
  )
}
