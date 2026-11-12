import { Route, Routes } from "react-router"
import { Layout } from "@/components/Layout"
import { RotaProtegida } from "@/components/RotaProtegida"
import { Cadastro } from "@/pages/Cadastro"
import { Comprovante } from "@/pages/Comprovante"
import { DetalheEvento } from "@/pages/DetalheEvento"
import { Entrar } from "@/pages/Entrar"
import { MinhasInscricoes } from "@/pages/MinhasInscricoes"
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
          <Route path="inscricoes/:id" element={<Comprovante />} />
          <Route path="minhas" element={<MinhasInscricoes />} />
        </Route>

        <Route path="*" element={<NaoEncontrada />} />
      </Route>
    </Routes>
  )
}
