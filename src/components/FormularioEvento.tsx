import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { aplicarErrosDaApi, traduzir } from "@/lib/erros"
import { esquemaEvento, type CamposEvento, type DadosEvento } from "@/schemas/evento"
import { atualizarEvento, criarEvento } from "@/services/eventos"
import type { Evento } from "@/tipos"

interface FormularioEventoProps {
  evento?: Evento // sem evento: criar; com evento: editar
  aoConcluir: () => void
}

// Converte o evento da API para os campos do formulário (tudo texto).
function paraCampos(evento?: Evento): CamposEvento {
  return {
    titulo: evento?.titulo ?? "",
    descricao: evento?.descricao ?? "",
    local: evento?.local ?? "",
    data: evento ? evento.data.replace(" ", "T") : "",
    vagas: evento ? String(evento.vagas) : "",
    valor: evento ? evento.valor : "0",
  }
}

export function FormularioEvento({ evento, aoConcluir }: FormularioEventoProps) {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CamposEvento, unknown, DadosEvento>({
    resolver: zodResolver(esquemaEvento),
    defaultValues: paraCampos(evento),
  })

  const salvar = useMutation({
    mutationFn: (dados: DadosEvento) =>
      evento ? atualizarEvento(evento.id, dados) : criarEvento(dados),
    onSuccess: () => {
      // A lista mudou: tudo que começa com ["eventos"] será buscado de novo.
      queryClient.invalidateQueries({ queryKey: ["eventos"] })
      toast.success(evento ? "Evento atualizado." : "Evento criado.")
      aoConcluir()
    },
    onError: (erro) => {
      if (!aplicarErrosDaApi(erro, setError)) toast.error(traduzir(erro.message))
    },
  })

  return (
    <form onSubmit={handleSubmit((dados) => salvar.mutate(dados))} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.titulo}>
          <FieldLabel htmlFor="titulo">Título</FieldLabel>
          <Input id="titulo" aria-invalid={!!errors.titulo} {...register("titulo")} />
          <FieldError errors={[errors.titulo]} />
        </Field>

        <Field data-invalid={!!errors.descricao}>
          <FieldLabel htmlFor="descricao">Descrição</FieldLabel>
          <Textarea id="descricao" rows={3} {...register("descricao")} />
          <FieldError errors={[errors.descricao]} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors.local}>
            <FieldLabel htmlFor="local">Local</FieldLabel>
            <Input id="local" aria-invalid={!!errors.local} {...register("local")} />
            <FieldError errors={[errors.local]} />
          </Field>
          <Field data-invalid={!!errors.data}>
            <FieldLabel htmlFor="data">Data e hora</FieldLabel>
            <Input id="data" type="datetime-local" aria-invalid={!!errors.data} {...register("data")} />
            <FieldError errors={[errors.data]} />
          </Field>
          <Field data-invalid={!!errors.vagas}>
            <FieldLabel htmlFor="vagas">Vagas</FieldLabel>
            <Input id="vagas" type="number" min={1} aria-invalid={!!errors.vagas} {...register("vagas")} />
            <FieldError errors={[errors.vagas]} />
          </Field>
          <Field data-invalid={!!errors.valor}>
            <FieldLabel htmlFor="valor">Valor (R$)</FieldLabel>
            <Input id="valor" type="number" min={0} step="0.01" aria-invalid={!!errors.valor} {...register("valor")} />
            <FieldError errors={[errors.valor]} />
          </Field>
        </div>

        <Button type="submit" disabled={salvar.isPending}>
          {salvar.isPending ? "Salvando..." : "Salvar evento"}
        </Button>
      </FieldGroup>
    </form>
  )
}
