import type { ReactNode } from "react"
import { NavLink, Outlet } from "react-router"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"

function Item({ para, children }: { para: string; children: ReactNode }) {
  return (
    <NavLink
      to={para}
      end
      className={({ isActive }) =>
        cn(
          "border-b-2 py-1 text-sm font-semibold",
          isActive ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
        )
      }
    >
      {children}
    </NavLink>
  )
}

export function Layout() {
  const { usuario, sair } = useAuth()

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <NavLink to="/" className="mr-auto">
            <img src="/startub-logo.jpg" alt="Congresso StartUB 2026" className="h-10 w-auto rounded-md dark:bg-white dark:p-1" />
          </NavLink>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {usuario ? (
              <>
                <Item para="/">Programação</Item>
                <Button variant="ghost" size="sm" onClick={sair} title={`Sair da conta de ${usuario.name}`}>
                  <LogOut /> <span className="sr-only sm:not-sr-only">Sair</span>
                </Button>
              </>
            ) : (
              <>
                <Item para="/entrar">Entrar</Item>
                <Item para="/cadastro">Criar conta</Item>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <Outlet />
      </main>

      <footer className="onda-startub mt-10 pb-8 text-center text-sm">
        <p className="font-semibold">II Congresso de Ciência, Empreendedorismo e Inovação da Unibalsas</p>
        <p className="opacity-75">Feito no minicurso de frontend com React e TypeScript.</p>
      </footer>
    </div>
  )
}
