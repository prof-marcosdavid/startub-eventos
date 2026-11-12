import { Link, Navigate } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { TelaDeAcesso } from "@/components/TelaDeAcesso"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"
import { aplicarErrosDaApi, traduzir } from "@/lib/erros"
import { esquemaCadastro } from "@/schemas/cadastro"
import type { DadosCadastro } from "@/services/auth"

export function Cadastro() {
  const { usuario, cadastrar } = useAuth()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<DadosCadastro>({
    resolver: zodResolver(esquemaCadastro),
    defaultValues: { name: "", email: "", password: "", password_confirmation: "" },
  })

  const cadastro = useMutation({
    mutationFn: cadastrar,
    onSuccess: () => toast.success("Conta criada. Bem-vindo!"),
    onError: (erro) => {
      if (!aplicarErrosDaApi(erro, setError)) toast.error(traduzir(erro.message))
    },
  })

  if (usuario) return <Navigate to="/" replace />

  return (
    <TelaDeAcesso>
      <Card className="w-full max-w-sm justify-self-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Criar conta</CardTitle>
          <CardDescription>Crie sua conta para ver a programação do StartUB 2026 e se inscrever.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((dados) => cadastro.mutate(dados))} noValidate>
            <FieldGroup>
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="name">Nome</FieldLabel>
                <Input id="name" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} />
                <FieldError errors={[errors.name]} />
              </Field>
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
                <FieldError errors={[errors.email]} />
              </Field>
              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <Input id="password" type="password" autoComplete="new-password" aria-invalid={!!errors.password} {...register("password")} />
                <FieldError errors={[errors.password]} />
              </Field>
              <Field data-invalid={!!errors.password_confirmation}>
                <FieldLabel htmlFor="password_confirmation">Confirme a senha</FieldLabel>
                <Input id="password_confirmation" type="password" autoComplete="new-password" aria-invalid={!!errors.password_confirmation} {...register("password_confirmation")} />
                <FieldError errors={[errors.password_confirmation]} />
              </Field>
              <Button type="submit" disabled={cadastro.isPending}>
                {cadastro.isPending ? "Criando..." : "Criar conta"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Já tem conta? <Link to="/entrar" className="text-primary underline">Entrar</Link>
              </p>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </TelaDeAcesso>
  )
}
