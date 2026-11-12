# StartUB Eventos

Aplicação de inscrições do **Congresso StartUB 2026**, construída no minicurso **Desenvolvimento Frontend
Moderno com React e TypeScript**, da Unibalsas. Ela mostra a programação do congresso, faz a inscrição nos
eventos, acompanha o pagamento e deixa cada pessoa cadastrar e gerenciar os próprios eventos.

A aplicação consome a API de inscrições do StartUB, construída em Laravel no workshop de backend do
congresso.

## Tecnologias

React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router, TanStack Query, React Hook Form e Zod.

## Como rodar

Você precisa do [Node.js](https://nodejs.org) 22.22 ou mais novo.

```bash
git clone https://github.com/prof-marcosdavid/startub-eventos.git
cd startub-eventos
npm install
npm run dev
```

Abra `http://localhost:5173`. A API do StartUB exige uma conta: crie a sua em **Criar conta**. O cadastro
já entra logado.

## As branches

Cada branch é o projeto num ponto do minicurso.

| Branch | O que tem |
|---|---|
| `main` | o projeto como fica ao fim do material prévio: criado, com as bibliotecas, os componentes e o kit visual do StartUB |
| `dia-1` | o projeto ao fim do primeiro encontro: programação, página do evento, cadastro, login e a API |
| `dia-2` | o projeto completo: busca, inscrição, comprovante, minhas inscrições e o painel |

Para trocar de branch:

```bash
git switch dia-1
npm install
```

## As etapas

Cada etapa das apostilas é um commit com uma tag. Se você se perder no meio de um encontro, pode ir
direto para o fim da etapa em que a turma está e seguir dali.

| Tag | Etapa |
|---|---|
| `d1-etapa-3` | Dia 1: componentes, props e interfaces |
| `d1-etapa-4` | Dia 1: rotas |
| `d1-etapa-5` | Dia 1: cadastro e login |
| `d1-etapa-6` | Dia 1: falando com a API |
| `d2-etapa-2` | Dia 2: busca e filtro |
| `d2-etapa-3` | Dia 2: o formulário de inscrição |
| `d2-etapa-4` | Dia 2: comprovante e minhas inscrições |
| `d2-etapa-5` | Dia 2: o painel do organizador |
| `d2-etapa-6` | Dia 2: cadastro e login com Zod |

Para começar a partir de uma etapa, criando uma branch sua:

```bash
git switch -c minha-versao d1-etapa-5
```

Para ver o que mudou entre duas etapas:

```bash
git diff d1-etapa-5 d1-etapa-6
```

## A API

A aplicação usa a API publicada em `https://startub.appmake.com.br/api`. Para usar outra, crie na raiz do
projeto um arquivo `.env.local` a partir do `.env.example` e troque o endereço.

### API de ensaio

Sem internet, ou para treinar em casa, use a **API de ensaio**: um único arquivo que imita a API do
StartUB, com os mesmos endereços, respostas e erros. Ela roda com o Node, sem instalar nada:

```bash
node api-de-ensaio/servidor.mjs
```

e responde em `http://localhost:8000/api`. Crie o `.env.local` com a linha
`VITE_API_URL=http://localhost:8000/api` e reinicie o `npm run dev`. Os dados ficam na memória e voltam ao
estado inicial quando ela é reiniciada.

## Créditos

Minicurso ministrado pelo prof. Marcos David Souza Ramos no Congresso StartUB 2026, o II Congresso de
Ciência, Empreendedorismo e Inovação da Unibalsas. A API de inscrições é do workshop de backend do prof.
Alex Rogaleski Marques. A logo e a identidade visual são do congresso.
