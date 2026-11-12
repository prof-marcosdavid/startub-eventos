import { Link } from "react-router"
import { useQueries } from "@tanstack/react-query"
import { DataDoEvento } from "@/components/DataDoEvento"
import { Vazio } from "@/components/Estados"
import { StatusBadge } from "@/components/StatusBadge"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useMinhasInscricoes } from "@/contexts/MinhasInscricoesContext"
import { buscarInscricao } from "@/services/inscricoes"

export function MinhasInscricoes() {
  const { ids } = useMinhasInscricoes()

  // Uma consulta por inscrição, todas em paralelo. A chave é a mesma do
  // comprovante, então o que já foi buscado lá aparece aqui sem nova requisição.
  const consultas = useQueries({
    queries: ids.map((id) => ({
      queryKey: ["inscricoes", id],
      queryFn: () => buscarInscricao(id),
    })),
  })

  return (
    <section className="grid gap-6">
      <h1 className="text-4xl font-extrabold sm:text-5xl">Minhas inscrições</h1>

      {ids.length === 0 && (
        <Vazio>
          Você ainda não se inscreveu em nenhum evento.{" "}
          <Link to="/" className="font-semibold text-primary underline">Ver a programação</Link>
        </Vazio>
      )}

      <div className="grid gap-3">
        {consultas.map(({ data: inscricao, isPending }, i) =>
          isPending || !inscricao ? (
            <Skeleton key={ids[i]} className="h-28 rounded-xl" />
          ) : (
            <Link key={inscricao.id} to={`/inscricoes/${inscricao.id}`} className="rounded-xl">
              <Card className="grid grid-cols-[4.5rem_1fr] items-center gap-4 px-5 text-base hover:bg-muted/60 sm:grid-cols-[4.5rem_1fr_auto]">
                {inscricao.evento && <DataDoEvento data={inscricao.evento.data} />}
                <div>
                  <h2 className="text-lg leading-tight font-bold">{inscricao.evento?.titulo}</h2>
                  <p className="text-sm text-muted-foreground">Inscrição nº {inscricao.id}</p>
                </div>
                <StatusBadge status={inscricao.status} />
              </Card>
            </Link>
          ),
        )}
      </div>
    </section>
  )
}
