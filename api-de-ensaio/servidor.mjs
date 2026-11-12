// API de ensaio do minicurso StartUB Eventos.
// Reproduz o contrato da API Laravel de inscrições (rotas, formatos e mensagens de erro)
// para quem estiver sem internet ou quiser treinar em casa. Node 22 ou mais novo, sem dependências.
//
//   node servidor.mjs            (porta 8000)
//   PORTA=9000 node servidor.mjs
//
// Os dados ficam em memória: reiniciar o servidor volta ao estado inicial.

import { createServer } from "node:http"
import { randomBytes, randomUUID } from "node:crypto"

const PORTA = Number(process.env.PORTA ?? 8000)
const ATRASO_MS = Number(process.env.ATRASO_MS ?? 400) // simula a rede, para o "carregando" aparecer

// Dados iniciais

const agora = () => new Date().toISOString().replace(/\.(\d{3})Z$/, ".$1000Z") // formato do Laravel: microssegundos

let proximoEvento = 1
let proximaInscricao = 1
let proximoToken = 1

const eventos = []
const inscricoes = []
const tokens = new Map() // token em texto -> id do usuário

const usuarios = [
  { id: 1, name: "Organização StartUB", email: "organizador@example.com", password: "password", created_at: agora(), updated_at: agora() },
]

// user_id: quem criou o evento. Os eventos de exemplo não têm dono (null),
// e por isso ninguém consegue alterá-los ou removê-los.
function criarEvento(dados, userId = null) {
  const instante = agora()
  const evento = {
    id: proximoEvento++,
    titulo: dados.titulo,
    descricao: dados.descricao ?? null,
    local: dados.local,
    data: dados.data,
    vagas: dados.vagas,
    valor: Number(dados.valor).toFixed(2),
    created_at: instante,
    updated_at: instante,
    user_id: userId,
  }
  eventos.push(evento)
  return evento
}

;[
  { titulo: "Workshop de APIs com Laravel", descricao: "APIs REST, integração e webhooks na prática.", local: "Laboratório 3", data: "2026-12-05 19:00", vagas: 30, valor: 0 },
  { titulo: "Minicurso de Git e GitHub", descricao: "Versionamento de código do zero ao pull request.", local: "Auditório", data: "2026-12-12 14:00", vagas: 2, valor: 25 },
  { titulo: "Frontend Moderno com React e TypeScript", descricao: "Componentes, formulários, estado e integração com APIs REST.", local: "Laboratório 2", data: "2026-12-05 19:00", vagas: 30, valor: 0 },
  { titulo: "Pitch para Startups", descricao: "Como apresentar uma ideia em cinco minutos.", local: "Auditório", data: "2026-12-10 19:30", vagas: 80, valor: 0 },
  { titulo: "Design de Interfaces no Figma", descricao: "Do rascunho ao protótipo navegável.", local: "Laboratório 1", data: "2026-12-11 19:00", vagas: 25, valor: 15 },
  { titulo: "Hackathon StartUB", descricao: "Equipes multidisciplinares, 24 horas e um problema real.", local: "Bloco B", data: "2026-12-19 08:00", vagas: 60, valor: 40 },
].forEach((dados) => criarEvento(dados))

// Validação no estilo do Laravel (mensagens em inglês, como a API real)

const MSG = {
  required: (c) => `The ${c} field is required.`,
  string: (c) => `The ${c} field must be a string.`,
  max: (c, n) => `The ${c} field must not be greater than ${n} characters.`,
  email: (c) => `The ${c} field must be a valid email address.`,
  digits: (c, n) => `The ${c} field must be ${n} digits.`,
  unique: (c) => `The ${c} has already been taken.`,
  date: (c) => `The ${c} field must be a valid date.`,
  after: (c) => `The ${c} field must be a date after now.`,
  integer: (c) => `The ${c} field must be an integer.`,
  numeric: (c) => `The ${c} field must be a number.`,
  minNum: (c, n) => `The ${c} field must be at least ${n}.`,
  minChars: (c, n) => `The ${c} field must be at least ${n} characters.`,
  confirmed: (c) => `The ${c} field confirmation does not match.`,
}

const vazio = (v) => v === undefined || v === null || (typeof v === "string" && v.trim() === "")

function lerData(v) {
  if (typeof v !== "string") return null
  const d = new Date(v.includes("T") ? v : v.replace(" ", "T"))
  return Number.isNaN(d.getTime()) ? null : d
}

function formatarData(d) {
  const p = (n) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

// regras: { campo: { obrigatorio, opcional, ...checagens } }
function validar(corpo, regras, parcial = false) {
  const erros = {}
  const dados = {}
  for (const [campo, r] of Object.entries(regras)) {
    const presente = Object.prototype.hasOwnProperty.call(corpo, campo)
    if (parcial && !presente) continue
    const v = corpo[campo]
    const falha = (m) => (erros[campo] ??= []).push(m)
    if (vazio(v)) {
      if (r.obrigatorio) falha(MSG.required(campo))
      else if (presente) dados[campo] = null
      continue
    }
    if (r.texto) {
      if (typeof v !== "string") { falha(MSG.string(campo)); continue }
      if (r.max && v.length > r.max) falha(MSG.max(campo, r.max))
      if (r.minTexto && v.length < r.minTexto) falha(MSG.minChars(campo, r.minTexto))
      if (r.confirmado && corpo[campo + "_confirmation"] !== v) falha(MSG.confirmed(campo))
    }
    if (r.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v))) falha(MSG.email(campo))
    if (r.digitos && !new RegExp(`^\\d{${r.digitos}}$`).test(String(v))) falha(MSG.digits(campo, r.digitos))
    if (r.data) {
      const d = lerData(v)
      if (!d) falha(MSG.date(campo))
      else if (r.futura && d <= new Date()) falha(MSG.after(campo))
      else dados[campo] = formatarData(d)
      continue
    }
    if (r.inteiro) {
      if (!Number.isInteger(Number(v)) || typeof v === "boolean") { falha(MSG.integer(campo)); continue }
      if (r.min !== undefined && Number(v) < r.min) falha(MSG.minNum(campo, r.min))
      dados[campo] = Number(v)
      continue
    }
    if (r.numero) {
      if (Number.isNaN(Number(v)) || typeof v === "boolean") { falha(MSG.numeric(campo)); continue }
      if (r.min !== undefined && Number(v) < r.min) falha(MSG.minNum(campo, r.min))
      dados[campo] = Number(v)
      continue
    }
    if (r.unico && r.unico(v)) falha(MSG.unique(campo))
    dados[campo] = typeof v === "string" ? v.trim() : v
  }
  return { erros, dados }
}

class Resposta {
  constructor(status, corpo) { this.status = status; this.corpo = corpo }
}

function erroValidacao(erros) {
  const lista = Object.values(erros).flat()
  const extra = lista.length > 1 ? ` (and ${lista.length - 1} more error${lista.length > 2 ? "s" : ""})` : ""
  return new Resposta(422, { message: lista[0] + extra, errors: erros })
}

const naoEncontrado = (modelo, id) =>
  new Resposta(404, { message: `No query results for model [App\\Models\\${modelo}] ${id}` })

const REGRAS_EVENTO = {
  titulo: { obrigatorio: true, texto: true, max: 120 },
  descricao: { texto: true },
  local: { obrigatorio: true, texto: true, max: 120 },
  data: { obrigatorio: true, data: true, futura: true },
  vagas: { obrigatorio: true, inteiro: true, min: 1 },
  valor: { obrigatorio: true, numero: true, min: 0 },
}

// Autenticação no estilo do Sanctum (token Bearer)

function usuarioDoToken(req) {
  const cab = req.headers.authorization ?? ""
  const token = cab.startsWith("Bearer ") ? cab.slice(7) : null
  const id = token ? tokens.get(token) : undefined
  return id ? usuarios.find((u) => u.id === id) : undefined
}

const publico = ({ password, ...u }) => ({ id: u.id, name: u.name, email: u.email, email_verified_at: null, created_at: u.created_at, updated_at: u.updated_at })
const naoAutenticado = new Resposta(401, { message: "Unauthenticated." })
// Como uma Policy do Laravel que recusa: 403 com a mensagem padrão.
const proibido = new Resposta(403, { message: "This action is unauthorized." })

// Rotas

const rotas = []
const rota = (metodo, padrao, protegida, acao) => {
  const nomes = []
  const re = new RegExp("^" + padrao.replace(/\{(\w+)\}/g, (_, n) => (nomes.push(n), "([^/]+)")) + "/?$")
  rotas.push({ metodo, re, nomes, protegida, acao })
}

rota("GET", "/api/ping", false, () => ({
  mensagem: "API de inscrições no ar!",
  hora: new Date().toTimeString().slice(0, 8),
}))

// Como na API real: login limitado a 6 tentativas por minuto por endereço IP (throttle:6,1).
const tentativas = new Map()
function limiteDeLogin(req) {
  const ip = req.socket.remoteAddress ?? "?"
  const agoraMs = Date.now()
  const recentes = (tentativas.get(ip) ?? []).filter((t) => agoraMs - t < 60_000)
  recentes.push(agoraMs)
  tentativas.set(ip, recentes)
  return process.env.SEM_LIMITE ? false : recentes.length > 6
}

function novoToken(id) {
  const token = `${proximoToken++}|${randomBytes(40).toString("hex").slice(0, 48)}`
  tokens.set(token, id)
  return token
}

rota("POST", "/api/register", false, ({ corpo }) => {
  const { erros, dados } = validar(corpo, {
    name: { obrigatorio: true, texto: true, max: 255 },
    email: { obrigatorio: true, email: true, unico: (v) => usuarios.some((u) => u.email === v) },
    password: { obrigatorio: true, texto: true, minTexto: 8, confirmado: true },
  })
  if (Object.keys(erros).length) return erroValidacao(erros)
  const instante = agora()
  const u = { id: usuarios.length + 1, name: dados.name, email: dados.email, password: corpo.password, created_at: instante, updated_at: instante }
  usuarios.push(u)
  // a ordem dos campos é a do Laravel logo depois do create()
  const user = { name: u.name, email: u.email, updated_at: instante, created_at: instante, id: u.id }
  return new Resposta(201, { user, token: novoToken(u.id) })
})

rota("POST", "/api/login", false, ({ req, corpo }) => {
  if (limiteDeLogin(req)) return new Resposta(429, { message: "Too Many Attempts." })
  const { erros } = validar(corpo, { email: { obrigatorio: true, email: true }, password: { obrigatorio: true } })
  if (Object.keys(erros).length) return erroValidacao(erros)
  const u = usuarios.find((x) => x.email === corpo.email && x.password === corpo.password)
  if (!u) return erroValidacao({ email: ["Credenciais inválidas."] })
  return { user: publico(u), token: novoToken(u.id) }
})

rota("GET", "/api/user", true, ({ usuario }) => publico(usuario))

rota("POST", "/api/logout", true, ({ req }) => {
  tokens.delete(req.headers.authorization.slice(7))
  return new Resposta(204, null)
})

rota("GET", "/api/eventos", true, () =>
  [...eventos].sort((a, b) => a.data.localeCompare(b.data)),
)

rota("GET", "/api/eventos/{id}", true, ({ p }) =>
  eventos.find((e) => e.id === Number(p.id)) ?? naoEncontrado("Evento", p.id),
)

rota("POST", "/api/eventos", true, ({ corpo, usuario }) => {
  const { erros, dados } = validar(corpo, REGRAS_EVENTO)
  if (Object.keys(erros).length) return erroValidacao(erros)
  return new Resposta(201, criarEvento(dados, usuario.id))
})

for (const metodo of ["PUT", "PATCH"]) {
  rota(metodo, "/api/eventos/{id}", true, ({ p, corpo, usuario }) => {
    const evento = eventos.find((e) => e.id === Number(p.id))
    if (!evento) return naoEncontrado("Evento", p.id)
    if (evento.user_id !== usuario.id) return proibido
    const { erros, dados } = validar(corpo, REGRAS_EVENTO, true)
    if (Object.keys(erros).length) return erroValidacao(erros)
    if ("valor" in dados) dados.valor = Number(dados.valor).toFixed(2)
    Object.assign(evento, dados, { updated_at: agora() })
    return evento
  })
}

rota("DELETE", "/api/eventos/{id}", true, ({ p, usuario }) => {
  const i = eventos.findIndex((e) => e.id === Number(p.id))
  if (i < 0) return naoEncontrado("Evento", p.id)
  if (eventos[i].user_id !== usuario.id) return proibido
  const [removido] = eventos.splice(i, 1)
  for (let j = inscricoes.length - 1; j >= 0; j--) if (inscricoes[j].evento_id === removido.id) inscricoes.splice(j, 1)
  return new Resposta(204, null)
})

rota("GET", "/api/eventos/{id}/inscricoes", true, ({ p, usuario }) => {
  const evento = eventos.find((e) => e.id === Number(p.id))
  if (!evento) return naoEncontrado("Evento", p.id)
  if (evento.user_id !== usuario.id) return proibido
  return inscricoes.filter((x) => x.evento_id === evento.id).sort((a, b) => a.nome.localeCompare(b.nome))
})

rota("POST", "/api/eventos/{id}/inscricoes", true, ({ p, corpo, base, usuario }) => {
  const evento = eventos.find((e) => e.id === Number(p.id))
  if (!evento) return naoEncontrado("Evento", p.id)
  const { erros, dados } = validar(corpo, {
    nome: { obrigatorio: true, texto: true, max: 120 },
    email: {
      obrigatorio: true, email: true,
      unico: (v) => inscricoes.some((x) => x.evento_id === evento.id && x.email === v),
    },
    cpf: { obrigatorio: true, digitos: 11 },
  })
  if (Object.keys(erros).length) return erroValidacao(erros)
  if (inscricoes.filter((x) => x.evento_id === evento.id).length >= evento.vagas)
    return new Resposta(409, { message: "Não há vagas para este evento." })

  const pago = Number(evento.valor) > 0
  const instante = agora()
  const inscricao = {
    id: proximaInscricao++,
    evento_id: evento.id,
    nome: dados.nome,
    email: dados.email,
    cpf: dados.cpf,
    status: pago ? "pendente" : "confirmada",
    created_at: instante,
    updated_at: instante,
    asaas_cliente_id: null,
    asaas_cobranca_id: null,
    link_pagamento: null,
    pago_em: null,
    user_id: usuario.id,
  }
  if (pago) {
    const cobranca = "pay_" + randomUUID().replaceAll("-", "").slice(0, 16)
    inscricao.asaas_cliente_id = "cus_" + randomUUID().replaceAll("-", "").slice(0, 12)
    inscricao.asaas_cobranca_id = cobranca
    inscricao.link_pagamento = `${base}/sandbox/pagar/${cobranca}`
  }
  inscricoes.push(inscricao)
  return new Resposta(201, inscricao)
})

rota("GET", "/api/inscricoes/{id}", true, ({ p, usuario }) => {
  const x = inscricoes.find((i) => i.id === Number(p.id))
  if (!x) return naoEncontrado("Inscricao", p.id)
  if (x.user_id !== usuario.id) return proibido
  return { ...x, evento: eventos.find((e) => e.id === x.evento_id) ?? null }
})

// Página que faz o papel do checkout do Asaas sandbox. Ao pagar, a inscrição muda
// para "confirmada" alguns segundos depois, como aconteceria com o webhook real.

function paginaPagamento(cobranca, msg) {
  const x = inscricoes.find((i) => i.asaas_cobranca_id === cobranca)
  const ev = x && eventos.find((e) => e.id === x.evento_id)
  const corpo = !x
    ? "<p>Cobrança não encontrada.</p>"
    : x.status === "confirmada" || msg
      ? `<p class="ok">Pagamento recebido. A confirmação chega à API em alguns segundos.</p><p>Pode fechar esta aba.</p>`
      : `<p>${x.nome}</p><p><strong>${ev?.titulo ?? ""}</strong></p><p class="valor">R$ ${ev ? ev.valor.replace(".", ",") : ""}</p>
         <form method="post"><button>Pagar (simulação)</button></form>`
  return `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>Pagamento sandbox</title><style>body{font-family:system-ui;max-width:420px;margin:60px auto;padding:0 16px;color:#1d2733}
.tag{display:inline-block;background:#fdecc8;color:#7a4a00;border-radius:4px;padding:2px 8px;font-size:12px}
.valor{font-size:32px;font-weight:700}.ok{color:#0f6b4a;font-weight:600}
button{font:inherit;background:#1d4ed8;color:#fff;border:0;border-radius:8px;padding:12px 20px;cursor:pointer}</style>
<span class="tag">AMBIENTE DE TESTE</span><h1>Pagamento</h1>${corpo}</html>`
}

// Servidor

const servidor = createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Accept, Authorization, Content-Type")
  if (req.method === "OPTIONS") { res.writeHead(204).end(); return }

  const url = new URL(req.url, `http://${req.headers.host}`)
  const base = `http://${req.headers.host}`

  const pag = url.pathname.match(/^\/sandbox\/pagar\/([\w-]+)$/)
  if (pag) {
    let msg = false
    if (req.method === "POST") {
      const x = inscricoes.find((i) => i.asaas_cobranca_id === pag[1])
      if (x && x.status === "pendente") {
        setTimeout(() => Object.assign(x, { status: "confirmada", pago_em: formatarData(new Date()) + ":" + String(new Date().getSeconds()).padStart(2, "0"), updated_at: agora() }), 4000)
        msg = true
      }
    }
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }).end(paginaPagamento(pag[1], msg))
    return
  }

  let corpo = {}
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    let texto = ""
    for await (const parte of req) texto += parte
    try { corpo = texto ? JSON.parse(texto) : {} } catch { corpo = {} }
  }

  let resposta = new Resposta(404, { message: `The route ${url.pathname.slice(1)} could not be found.` })
  for (const r of rotas) {
    const m = url.pathname.match(r.re)
    if (!m) continue
    if (r.metodo !== req.method) {
      resposta = new Resposta(405, { message: `The ${req.method} method is not supported for route ${url.pathname.slice(1)}.` })
      continue
    }
    const usuario = usuarioDoToken(req)
    if (r.protegida && !usuario) { resposta = naoAutenticado; break }
    const p = Object.fromEntries(r.nomes.map((n, i) => [n, decodeURIComponent(m[i + 1])]))
    const saida = r.acao({ req, p, corpo, usuario, base })
    resposta = saida instanceof Resposta ? saida : new Resposta(200, saida)
    break
  }

  await new Promise((ok) => setTimeout(ok, ATRASO_MS))
  console.log(`${req.method.padEnd(6)} ${url.pathname} -> ${resposta.status}`)
  if (resposta.status === 204) { res.writeHead(204).end(); return }
  res.writeHead(resposta.status, { "Content-Type": "application/json" })
  res.end(JSON.stringify(resposta.corpo))
})

servidor.listen(PORTA, () => {
  console.log(`API de ensaio em http://localhost:${PORTA}/api`)
  console.log("Crie uma conta em POST /api/register, ou entre com organizador@example.com / password")
})
