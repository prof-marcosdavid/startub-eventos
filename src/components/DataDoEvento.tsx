import { partesDaData } from "@/lib/formatar"
import { cn } from "@/lib/utils"

interface DataDoEventoProps {
  data: string
  className?: string
}

// O dia em número grande, no gradiente das peças do StartUB, com o mês e o dia da semana embaixo.
export function DataDoEvento({ data, className }: DataDoEventoProps) {
  const { dia, mes, semana } = partesDaData(data)

  return (
    <time dateTime={data.replace(" ", "T")} className={cn("flex flex-col items-center leading-none", className)}>
      <span className="texto-marca font-heading text-5xl font-extrabold">{dia}</span>
      <span className="mt-1 font-semibold">{mes}</span>
      <span className="mt-0.5 text-xs opacity-70">{semana}</span>
    </time>
  )
}
