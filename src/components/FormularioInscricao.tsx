import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"
import { aplicarErrosDaApi, traduzir } from "@/lib/erros"
import { ehGratuito, formatarValor } from "@/lib/formatar"
import { esquemaInscricao, type DadosInscricao } from "@/schemas/inscricao"
import { inscrever } from "@/services/inscricoes"
import type { Evento } from "@/tipos"

export function FormularioInscricao({ evento }: { evento: Evento }) {
  const { usuario } = useAuth()

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<DadosInscricao>({
    resolver: zodResolver(esquemaInscricao),
    // nome e e-mail já vêm da conta; a pessoa só confere e completa o CPF
    defaultValues: { nome: usuario?.name ?? "", email: usuario?.email ?? "", cpf: "" },
  })

  const inscricao = useMutation({
    mutationFn: (dados: DadosInscricao) => inscrever(evento.id, dados),
    onSuccess: (nova) => {
      toast.success(`Inscrição nº ${nova.id} realizada!`)
      reset()
    },
    onError: (erro) => {
      // 422: erros de campo. Qualquer outro (409, 502, rede): aviso geral.
      if (!aplicarErrosDaApi(erro, setError)) toast.error(traduzir(erro.message))
    },
  })

  return (
    <Card className="h-fit lg:sticky lg:top-24">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Sua inscrição</CardTitle>
        <CardDescription>
          {ehGratuito(evento.valor)
            ? "Inscrição gratuita. Confira seus dados e confirme."
            : `Inscrição de ${formatarValor(evento.valor)}. O pagamento abre depois que você confirmar.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit((dados) => inscricao.mutate(dados))} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.nome}>
              <FieldLabel htmlFor="nome">Nome completo</FieldLabel>
              <Input id="nome" aria-invalid={!!errors.nome} {...register("nome")} />
              <FieldError errors={[errors.nome]} />
            </Field>

            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">E-mail</FieldLabel>
              <Input id="email" type="email" aria-invalid={!!errors.email} {...register("email")} />
              <FieldError errors={[errors.email]} />
            </Field>

            <Field data-invalid={!!errors.cpf}>
              <FieldLabel htmlFor="cpf">CPF</FieldLabel>
              <Input
                id="cpf"
                inputMode="numeric"
                maxLength={11}
                placeholder="Somente números"
                aria-invalid={!!errors.cpf}
                {...register("cpf")}
              />
              <FieldError errors={[errors.cpf]} />
            </Field>

            <Button type="submit" disabled={inscricao.isPending}>
              {inscricao.isPending ? "Enviando..." : "Confirmar inscrição"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
