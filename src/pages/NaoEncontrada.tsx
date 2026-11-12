import { Link } from "react-router"
import { Button } from "@/components/ui/button"

export function NaoEncontrada() {
  return (
    <section className="grid justify-items-center gap-4 py-16 text-center">
      <p className="texto-marca font-heading text-8xl font-extrabold">404</p>
      <h1 className="text-3xl font-bold">Esta página não existe</h1>
      <p className="text-muted-foreground">Confira o endereço ou volte para a programação.</p>
      <Button asChild>
        <Link to="/">Ver a programação</Link>
      </Button>
    </section>
  )
}
