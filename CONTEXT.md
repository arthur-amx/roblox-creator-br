# Projeto: Plataforma Curadoria Roblox BR

## Visão geral
SaaS brasileiro que permite crianças e jovens criarem skins/itens
UGC para o Roblox via prompt em português. A plataforma publica
os itens sob conta verificada própria e repassa royalties ao usuário.
Foco inicial 100% em roupas/itens 2D. Games e itens 3D nas fases seguintes.

## Contexto de mercado
- Brasil é o 2º maior mercado Roblox global (181% crescimento em 4 anos)
- Mercado UGC fashion Roblox: US$ 330M em 2025
- Estimativa Brasil: US$ 25–35M/ano em itens UGC
- Zero concorrentes brasileiros nesse nicho
- Roblox lançou IA nativa para games (abril/2026) — janela de skins continua aberta

## Modelo de negócio
### Planos de assinatura
- Explorador: grátis — 1 item 2D/mês, royalties 50%
- Criador: R$29/mês — 5 itens 2D + 1 item 3D, royalties 65%
- Estúdio: R$79/mês — 20 itens 2D + 5 itens 3D, royalties 75%

### Receita adicional
- Comissão de 25–50% sobre royalties gerados no Marketplace
- Break-even: ~80 assinantes pagos

## Roadmap de produto
- Fase 1 (MVP): Skins 2D via prompt → geração → preview → upload → marketplace
- Fase 2 (mês 12+): Itens 3D UGC, SaaS para conta própria do usuário
- Fase 3 (ano 2+): Marketplace próprio, ferramentas de monetização para games

## Stack técnica definida
- Backend: Python 3.12 + FastAPI
- Filas assíncronas: Redis + RQ
- Geração 2D (MVP): OpenAI DALL-E 3 via API
- Geração 3D (fase 2): Meshy API ou Tripo3D API
- Integração Roblox: Open Cloud Assets API
  - Wrapper Python: rblx-open-cloud
  - Autenticação via API key (conta verificada própria)
- Banco de dados: PostgreSQL via SQLModel
- Pagamentos: Stripe (assinaturas) + Mercado Pago (PIX)
- Frontend: Next.js 14 + Tailwind CSS (mobile-first, PT-BR)
- Deploy: Railway ou Render

## Especificações técnicas Roblox
- Roupas 2D: template 585×559px PNG
- Itens 3D: .fbx, máx 2.000 triângulos (acessórios)
- Upload via Open Cloud Assets API v1
- Taxa de upload: ~750 Robux por item

## Fluxo do MVP (fase 1)
1. Usuário digita prompt em PT-BR
2. DALL-E 3 gera textura aplicada ao template Roblox (585×559px)
3. Preview para aprovação do usuário
4. Fila Redis processa upload via Open Cloud API
5. Moderação Roblox (24–72h)
6. Item publicado no Marketplace sob conta da plataforma
7. Royalties repassados ao usuário conforme plano

## Custos operacionais (por item 2D publicado)
- Geração imagem (DALL-E 3): ~R$ 0,22
- Taxa upload Roblox: ~R$ 0,80
- Curadoria/moderação humana (rateada): ~R$ 0,50
- Infraestrutura (rateada): ~R$ 0,15
- Total: ~R$ 1,67 por item
- Margem bruta: ~71%

## Riscos principais
- Roblox mudar regras de UGC → diversificar para Fortnite Creative futuramente
- Taxa de rejeição na moderação → curadoria antes do envio, meta >85% aprovação
- Churn → gamificação, notificações de royalties recebidos

## Issues GitHub — ordem de execução
### Milestone 1 — Setup
- #1 Estrutura do projeto FastAPI + pastas + requirements.txt
- #2 Modelagem do banco de dados (SQLModel + Alembic)
- #3 CI/CD com GitHub Actions

### Milestone 2 — Core
- #4 Integração OpenAI DALL-E 3 (geração por prompt + template 585×559px)
- #5 Sistema de filas Redis + RQ
- #6 Integração Roblox Open Cloud API (upload de asset)
- #7 Fluxo completo: prompt → imagem → preview → upload

### Milestone 3 — Produto Web
- #8 Autenticação de usuário (JWT)
- #9 Frontend — tela de criação (prompt + preview)
- #10 Frontend — dashboard (histórico + royalties)

### Milestone 4 — Monetização
- #11 Integração Stripe (assinaturas)
- #12 Integração Mercado Pago (PIX)
- #13 Controle de cotas por plano
