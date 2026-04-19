# Roblox Creator BR

Plataforma SaaS que democratiza a criação de skins e itens no Roblox para crianças e jovens brasileiros — basta digitar um prompt em português.

## Visão Geral

O Brasil é o **2º maior mercado global do Roblox** (DAUs crescendo 181% entre 2020–2024), mas ferramentas de criação são quase todas em inglês e exigem conhecimento técnico. Esta plataforma resolve esse gap: qualquer pessoa escreve o que quer criar em português e o sistema gera, valida e publica o item no Marketplace automaticamente.

```
Usuário digita prompt em PT-BR
       ↓
IA gera textura / asset (DALL-E 3)
       ↓
Validação automática (specs Roblox)
       ↓
Upload via Roblox Open Cloud API
       ↓
Publicação no Marketplace
       ↓
Usuário recebe % dos Robux
```

## Modelo de Negócio

A plataforma opera como **curadoria**: publica os itens sob conta verificada e repassa royalties ao usuário.

| Plano | Preço | Itens 2D/mês | Itens 3D/mês | Royalties |
|---|---|---|---|---|
| Grátis | R$ 0 | 1 | 0 | 50% |
| Criador | R$ 29 | 5 | 1 | 60% |
| Estúdio | R$ 79 | 20 | 5 | 75% |

## Stack Técnica

```
┌─────────────────────────────────────────────────────┐
│                    Frontend                         │
│              Next.js + Tailwind CSS                 │
└────────────────────┬────────────────────────────────┘
                     │ REST / HTTP
┌────────────────────▼────────────────────────────────┐
│                    Backend                          │
│           Python 3.12 + FastAPI                     │
│                                                     │
│  ┌──────────────┐    ┌──────────────────────────┐  │
│  │  Redis + RQ  │    │  PostgreSQL (via SQLModel) │  │
│  │  (job queue) │    │  (usuários, itens, planos) │  │
│  └──────────────┘    └──────────────────────────┘  │
└────────────────────┬────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   OpenAI        Roblox       Stripe /
   DALL-E 3    Open Cloud   Mercado Pago
   (geração)    API (upload)  (pagamentos)
```

**Backend:** Python 3.12, FastAPI, SQLModel, Redis, RQ  
**Frontend:** Next.js 14, React, TypeScript, Tailwind CSS  
**IA:** OpenAI DALL-E 3 (fase 1 — 2D), Meshy API (fase 2 — 3D)  
**Roblox:** Open Cloud Assets API v1  
**Banco de Dados:** PostgreSQL  
**Pagamentos:** Stripe + Mercado Pago (PIX)  
**Ambiente:** Docker & Docker Compose  

## Estrutura do Projeto

```
.
├── backend/
│   ├── app/
│   │   ├── api/          # Rotas FastAPI
│   │   ├── core/         # Config, segurança, dependências
│   │   ├── models/       # SQLModel (tabelas)
│   │   ├── services/     # Lógica de negócio
│   │   │   ├── ai/       # DALL-E, Meshy
│   │   │   ├── roblox/   # Open Cloud API
│   │   │   └── billing/  # Stripe, Mercado Pago
│   │   └── workers/      # Tasks RQ (geração assíncrona)
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/          # App Router (Next.js 14)
│   │   ├── components/
│   │   └── lib/
│   └── package.json
├── .env.example
└── docker-compose.yml
```

## Como Executar Localmente

**Pré-requisitos:** Docker e Docker Compose instalados.

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/arthur-amx/roblox-creator-br.git
   cd roblox-creator-br
   ```

2. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env
   # Edite o .env com suas chaves de API
   ```

3. **Suba os containers:**
   ```bash
   docker-compose up --build -d
   ```

4. **Acesse:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000](http://localhost:8000)
   - Docs (Swagger): [http://localhost:8000/docs](http://localhost:8000/docs)

## Roadmap

| Milestone | Descrição | Status |
|---|---|---|
| M1 — Setup | Estrutura, CI, Docker | 🔜 |
| M2 — Core | Geração 2D + Upload Roblox | 🔜 |
| M3 — Produto Web | Frontend + Auth + Dashboard | 🔜 |
| M4 — Monetização | Stripe + Mercado Pago + Cotas | 🔜 |
| M5 — 3D (fase 2) | Integração Meshy para modelos 3D | 🔜 |

## Variáveis de Ambiente

```ini
# OpenAI
OPENAI_API_KEY=sk-...

# Roblox Open Cloud
ROBLOX_API_KEY=...
ROBLOX_CREATOR_ID=...

# Banco de Dados
DATABASE_URL=postgresql://user:password@localhost:5432/roblox_creator

# Redis
REDIS_URL=redis://localhost:6379

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Mercado Pago
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-...

# App
SECRET_KEY=sua-chave-secreta-aqui
```

## Licença

MIT
