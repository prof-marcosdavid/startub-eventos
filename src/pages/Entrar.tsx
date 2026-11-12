import { useState, type FormEvent } from "react"
import { Link, Navigate, useLocation } from "react-router"
import { TelaDeAcesso } from "@/components/TelaDeAcesso"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"
import { traduzir } from "@/lib/erros"
import { ApiError } from "@/services/api"

export function Entrar() {
  const { usuario, entrar } = useAuth()
  const local = useLocation()
  const destino = local.state?.voltarPara ?? "/"

  // Componentes controlados: o valor de cada campo mora num useState.
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [erros, setErros] = useState<Record<string, string[]>>({})
  const [enviando, setEnviando] = useState(false)

  // Depois do login, o usuário existe e esta linha leva para o destino.
  if (usuario) return <Navigate to={destino} replace />

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // o navegador não recarrega a página
    setEnviando(true)
    setErros({})
    try {
      await entrar({ email, password })
    } catch (erro) {
      // 422 traz um erro por campo; qualquer outro vira um erro geral
      if (erro instanceof ApiError && erro.status === 422) setErros(erro.erros)
      else setErros({ geral: [(erro as Error).message] })
    } finally {
      setEnviando(false)
    }
  }

  // O primeiro erro do campo, traduzido, no formato que o FieldError espera
  function erroDe(campo: string) {
    const mensagem = erros[campo]?.[0]
    return mensagem ? [{ message: traduzir(mensagem) }] : undefined
  }

  return (
    <TelaDeAcesso>
      <Card className="w-full max-w-sm justify-self-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Entrar</CardTitle>
          <CardDescription>Entre para ver a programação e fazer suas inscrições.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={enviar}>
            <FieldGroup>
              <Field data-invalid={!!erros.email}>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <FieldError errors={erroDe("email")} />
              </Field>
              <Field data-invalid={!!erros.password}>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <FieldError errors={erroDe("password")} />
              </Field>
              <FieldError errors={erroDe("geral")} />
              <Button type="submit" disabled={enviando}>
                {enviando ? "Entrando..." : "Entrar"}
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
