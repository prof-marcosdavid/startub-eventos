import { useState, type FormEvent } from "react"
import { Link, Navigate } from "react-router"
import { TelaDeAcesso } from "@/components/TelaDeAcesso"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"
import { traduzir } from "@/lib/erros"
import { ApiError } from "@/services/api"

export function Cadastro() {
  const { usuario, cadastrar } = useAuth()

  // Um único useState com um objeto para os quatro campos
  const [dados, setDados] = useState({ name: "", email: "", password: "", password_confirmation: "" })
  const [erros, setErros] = useState<Record<string, string[]>>({})
  const [enviando, setEnviando] = useState(false)

  if (usuario) return <Navigate to="/" replace />

  // Troca só o campo que mudou, mantendo os outros
  function mudar(campo: keyof typeof dados, valor: string) {
    setDados((atual) => ({ ...atual, [campo]: valor }))
  }

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setEnviando(true)
    setErros({})
    try {
      await cadastrar(dados)
    } catch (erro) {
      if (erro instanceof ApiError && erro.status === 422) setErros(erro.erros)
      else setErros({ geral: [(erro as Error).message] })
    } finally {
      setEnviando(false)
    }
  }

  function erroDe(campo: string) {
    const mensagem = erros[campo]?.[0]
    return mensagem ? [{ message: traduzir(mensagem) }] : undefined
  }

  return (
    <TelaDeAcesso>
      <Card className="w-full max-w-sm justify-self-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Criar conta</CardTitle>
          <CardDescription>Crie sua conta para ver a programação do StartUB 2026 e se inscrever.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={enviar}>
            <FieldGroup>
              <Field data-invalid={!!erros.name}>
                <FieldLabel htmlFor="name">Nome</FieldLabel>
                <Input id="name" value={dados.name} onChange={(e) => mudar("name", e.target.value)} />
                <FieldError errors={erroDe("name")} />
              </Field>
              <Field data-invalid={!!erros.email}>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input id="email" type="email" value={dados.email} onChange={(e) => mudar("email", e.target.value)} />
                <FieldError errors={erroDe("email")} />
              </Field>
              <Field data-invalid={!!erros.password}>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <Input id="password" type="password" value={dados.password} onChange={(e) => mudar("password", e.target.value)} />
                <FieldError errors={erroDe("password")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="password_confirmation">Confirme a senha</FieldLabel>
                <Input id="password_confirmation" type="password" value={dados.password_confirmation} onChange={(e) => mudar("password_confirmation", e.target.value)} />
              </Field>
              <FieldError errors={erroDe("geral")} />
              <Button type="submit" disabled={enviando}>
                {enviando ? "Criando..." : "Criar conta"}
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
