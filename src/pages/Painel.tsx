import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { FormularioEvento } from "@/components/FormularioEvento"
import { MensagemErro, Vazio } from "@/components/Estados"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/AuthContext"
import { traduzir } from "@/lib/erros"
import { formatarData, formatarValor } from "@/lib/formatar"
import { listarEventos, removerEvento } from "@/services/eventos"
import type { Evento } from "@/tipos"

// null: diálogo fechado · "novo": criando · Evento: editando aquele evento
type Edicao = null | "novo" | Evento

export function Painel() {
  const { usuario } = useAuth()
  const queryClient = useQueryClient()
  const [edicao, setEdicao] = useState<Edicao>(null)

  // Mesma chave da vitrine: os dois compartilham o cache.
  const { data: eventos, isPending, error } = useQuery({
    queryKey: ["eventos"],
    queryFn: listarEventos,
  })

  // A API só deixa alterar e remover o que a própria conta criou.
  // O painel mostra só esses: estado derivado da mesma lista da vitrine.
  const meus = eventos?.filter((evento) => evento.user_id === usuario?.id)

  const remover = useMutation({
    mutationFn: removerEvento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventos"] })
      toast.success("Evento removido.")
    },
    onError: (erro) => toast.error(traduzir(erro.message)),
  })

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-4xl font-extrabold sm:text-5xl">Painel do organizador</h1>
          <p className="text-muted-foreground">Olá, {usuario?.name}. Aqui ficam os eventos que você criou.</p>
        </div>
        <Button onClick={() => setEdicao("novo")}>
          <Plus /> Novo evento
        </Button>
      </div>

      {isPending && <Skeleton className="h-64 rounded-xl" />}
      {error && <MensagemErro erro={error} />}
      {meus?.length === 0 && <Vazio>Você ainda não criou nenhum evento.</Vazio>}

      {meus && meus.length > 0 && (
        <ul className="divide-y rounded-xl border">
          {meus.map((evento) => (
            <li key={evento.id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="mr-auto">
                <p className="font-medium">{evento.titulo}</p>
                <p className="text-sm text-muted-foreground">
                  {formatarData(evento.data)}, {evento.vagas} vagas, {formatarValor(evento.valor)}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setEdicao(evento)}>
                <Pencil /> Editar
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 /> Remover
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remover "{evento.titulo}"?</AlertDialogTitle>
                    <AlertDialogDescription>
                      As inscrições deste evento também serão apagadas. Não dá para desfazer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => remover.mutate(evento.id)}>Remover</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={edicao !== null} onOpenChange={(aberto) => !aberto && setEdicao(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{edicao === "novo" ? "Novo evento" : "Editar evento"}</DialogTitle>
          </DialogHeader>
          {edicao !== null && (
            <FormularioEvento
              key={edicao === "novo" ? "novo" : edicao.id}
              evento={edicao === "novo" ? undefined : edicao}
              aoConcluir={() => setEdicao(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
