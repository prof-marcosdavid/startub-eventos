import { Route, Routes } from "react-router"
import { Layout } from "@/components/Layout"
import { DetalheEvento } from "@/pages/DetalheEvento"
import { NaoEncontrada } from "@/pages/NaoEncontrada"
import { Vitrine } from "@/pages/Vitrine"

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Vitrine />} />
        <Route path="eventos/:id" element={<DetalheEvento />} />
        <Route path="*" element={<NaoEncontrada />} />
      </Route>
    </Routes>
  )
}
