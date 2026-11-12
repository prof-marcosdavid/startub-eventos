import { Badge } from "@/components/ui/badge"
import type { StatusInscricao } from "@/tipos"

const ROTULOS: Record<StatusInscricao, string> = {
  pendente: "Aguardando pagamento",
  confirmada: "Confirmada",
  cancelada: "Cancelada",
}

const VARIANTES = {
  pendente: "outline",
  confirmada: "default",
  cancelada: "destructive",
} as const

export function StatusBadge({ status }: { status: StatusInscricao }) {
  return <Badge variant={VARIANTES[status]}>{ROTULOS[status]}</Badge>
}
