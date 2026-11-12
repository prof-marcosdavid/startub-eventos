import { Link, useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { ExternalLink, LoaderCircle } from "lucide-react"
import { DataDoEvento } from "@/components/DataDoEvento"
import { MensagemErro } from "@/components/Estados"
import { StatusBadge } from "@/components/StatusBadge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatarValor, partesDaData } from "@/lib/formatar"
import { buscarInscricao } from "@/services/inscricoes"

export function Comprovante() {
  const { id } = useParams()
  const inscricaoId = Number(id)

  const { data: inscricao, isPending, error } = useQuery({
    queryKey: ["inscricoes", inscricaoId],
    queryFn: () => buscarInscricao(inscricaoId),
    // Enquanto o pagamento não cai, pergunta de novo à API a cada 5 segundos.
    refetchInterval: (query) => (query.state.data?.status === "pendente" ? 5000 : false),
  })

  if (isPending) return <Skeleton className="mx-auto h-96 max-w-md rounded-2xl" />
  if (error) return <MensagemErro erro={error} />

  const { evento } = inscricao

  // A credencial do congresso: o evento em cima, o canhoto com os dados embaixo.
  return (
    <article className="mx-auto max-w-md overflow-hidden rounded-2xl border bg-card shadow-lg shadow-primary/10">
      {evento && (
        <header className="flex items-center gap-5 bg-[#1d2559] p-6 text-white">
          <DataDoEvento data={evento.data} />
          <div className="grid gap-1">
            <p className="text-sm opacity-75">Congresso StartUB 2026</p>
            <h1 className="text-2xl leading-tight font-bold">{evento.titulo}</h1>
            <p className="text-sm opacity-75">
              {partesDaData(evento.data).hora}, {evento.local}
            </p>
          </div>
        </header>
      )}

      {/* a linha picotada entre o evento e o canhoto */}
      <div className="relative border-t-2 border-dashed">
        <span className="absolute -top-3 -left-3 size-6 rounded-full bg-background" />
        <span className="absolute -top-3 -right-3 size-6 rounded-full bg-background" />
      </div>

      <div className="grid gap-5 p-6">
        <div className="flex items-center justify-between gap-3">
          <StatusBadge status={inscricao.status} />
          <span className="text-sm text-muted-foreground">Inscrição nº {inscricao.id}</span>
        </div>

        <dl className="grid gap-3">
          <div>
            <dt className="text-sm text-muted-foreground">Participante</dt>
            <dd className="font-semibold">{inscricao.nome}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">E-mail</dt>
            <dd className="font-semibold">{inscricao.email}</dd>
          </div>
          {evento && (
            <div>
              <dt className="text-sm text-muted-foreground">Valor</dt>
              <dd className="font-semibold">{formatarValor(evento.valor)}</dd>
            </div>
          )}
        </dl>

        {inscricao.status === "pendente" && inscricao.link_pagamento && (
          <div className="grid gap-3">
            <Button asChild size="lg">
              <a href={inscricao.link_pagamento} target="_blank" rel="noreferrer">
                Pagar inscrição <ExternalLink />
              </a>
            </Button>
            <p className="flex items-center gap-2 text-sm text-muted-foreground" aria-live="polite">
              <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" />
              Esta página atualiza sozinha quando o pagamento for confirmado.
            </p>
          </div>
        )}

        {inscricao.status === "confirmada" && (
          <Button variant="outline" asChild>
            <Link to="/minhas">Ver minhas inscrições</Link>
          </Button>
        )}
      </div>
    </article>
  )
}
