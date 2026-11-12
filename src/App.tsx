import { Route, Routes } from "react-router"
import { Layout } from "@/components/Layout"
import { RotaProtegida } from "@/components/RotaProtegida"
import { Cadastro } from "@/pages/Cadastro"
import { DetalheEvento } from "@/pages/DetalheEvento"
import { Entrar } from "@/pages/Entrar"
import { NaoEncontrada } from "@/pages/NaoEncontrada"
import { Vitrine } from "@/pages/Vitrine"

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* abertas: quem ainda não entrou */}
        <Route path="entrar" element={<Entrar />} />
        <Route path="cadastro" element={<Cadastro />} />

        {/* todo o resto exige login, porque a API exige token */}
        <Route element={<RotaProtegida />}>
          <Route index element={<Vitrine />} />
          <Route path="eventos/:id" element={<DetalheEvento />} />
        </Route>

        <Route path="*" element={<NaoEncontrada />} />
      </Route>
    </Routes>
  )
}
