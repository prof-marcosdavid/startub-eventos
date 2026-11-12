import { Navigate, Outlet, useLocation } from "react-router"
import { useAuth } from "@/contexts/AuthContext"

// Sem usuário logado, manda para /entrar e lembra de onde a pessoa veio.
export function RotaProtegida() {
  const { usuario } = useAuth()
  const local = useLocation()

  if (!usuario) {
    return <Navigate to="/entrar" replace state={{ voltarPara: local.pathname }} />
  }
  return <Outlet />
}
