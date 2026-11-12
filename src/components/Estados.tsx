import type { ReactNode } from "react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { traduzir } from "@/lib/erros"

// Os três estados que toda tela que busca dados precisa desenhar:
// carregando, erro e vazio.

export function CarregandoCards() {
  return (
    <div className="grid gap-3">
      {[1, 2, 3].map((n) => (
        <Skeleton key={n} className="h-32 rounded-xl" />
      ))}
    </div>
  )
}

interface MensagemErroProps {
  erro: Error
  tentarDeNovo?: () => void
}

export function MensagemErro({ erro, tentarDeNovo }: MensagemErroProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle />
      <AlertTitle>Algo deu errado</AlertTitle>
      <AlertDescription>
        <p>{traduzir(erro.message)}</p>
        {tentarDeNovo && (
          <Button variant="outline" size="sm" className="mt-2" onClick={tentarDeNovo}>
            Tentar de novo
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

export function Vazio({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border-2 border-dashed p-10 text-center text-muted-foreground">
      {children}
    </p>
  )
}
