import type { Evento } from "@/tipos"

// Três eventos copiados da resposta da API. Servem só até a Etapa 5,
// quando os dados passam a vir do servidor.
export const EVENTOS: Evento[] = [
  {
    id: 1,
    titulo: "Workshop de APIs com Laravel",
    descricao: "APIs REST, integração e webhooks na prática.",
    local: "Laboratório 3",
    data: "2026-12-05 19:00",
    vagas: 30,
    valor: "0.00",
    created_at: "2026-11-12T13:00:00.000000Z",
    updated_at: "2026-11-12T13:00:00.000000Z",
    user_id: null,
  },
  {
    id: 2,
    titulo: "Minicurso de Git e GitHub",
    descricao: "Versionamento de código do zero ao pull request.",
    local: "Auditório",
    data: "2026-12-12 14:00",
    vagas: 2,
    valor: "25.00",
    created_at: "2026-11-12T13:00:00.000000Z",
    updated_at: "2026-11-12T13:00:00.000000Z",
    user_id: null,
  },
  {
    id: 6,
    titulo: "Hackathon StartUB",
    descricao: null,
    local: "Bloco B",
    data: "2026-12-19 08:00",
    vagas: 60,
    valor: "40.00",
    created_at: "2026-11-12T13:00:00.000000Z",
    updated_at: "2026-11-12T13:00:00.000000Z",
    user_id: null,
  },
]
