import { Link, Navigate, useLocation } from "react-router"
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
import { esquemaLogin } from "@/schemas/login"
import type { DadosLogin } from "@/services/auth"

export function Entrar() {
  const { usuario, entrar } = useAuth()
  const local = useLocation()
  const destino = local.state?.voltarPara ?? "/"

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<DadosLogin>({
    resolver: zodResolver(esquemaLogin),
    defaultValues: { email: "", password: "" },
  })

  const login = useMutation({
    mutationFn: entrar,
    onError: (erro) => {
      if (!aplicarErrosDaApi(erro, setError)) toast.error(traduzir(erro.message))
    },
  })

  // Logado, não há o que fazer aqui: segue para onde a pessoa queria ir.
  if (usuario) return <Navigate to={destino} replace />

  return (
    <TelaDeAcesso>
      <Card className="w-full max-w-sm justify-self-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Entrar</CardTitle>
          <CardDescription>Entre para ver a programação e fazer suas inscrições.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((dados) => login.mutate(dados))} noValidate>
            <FieldGroup>
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input id="email" type="email" autoComplete="username" aria-invalid={!!errors.email} {...register("email")} />
                <FieldError errors={[errors.email]} />
              </Field>
              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <Input id="password" type="password" autoComplete="current-password" aria-invalid={!!errors.password} {...register("password")} />
                <FieldError errors={[errors.password]} />
              </Field>
              <Button type="submit" disabled={login.isPending}>
                {login.isPending ? "Entrando..." : "Entrar"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Ainda não tem conta? <Link to="/cadastro" className="text-primary underline">Criar conta</Link>
              </p>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </TelaDeAcesso>
  )
}
