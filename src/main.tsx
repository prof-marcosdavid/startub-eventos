import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/contexts/AuthContext"
import { MinhasInscricoesProvider } from "@/contexts/MinhasInscricoesContext"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000 }, // dados valem 30 s antes de buscar de novo
  },
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <MinhasInscricoesProvider>
              <App />
            </MinhasInscricoesProvider>
          </AuthProvider>
        </BrowserRouter>
        <Toaster richColors position="top-center" />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
)
