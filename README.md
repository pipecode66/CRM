# CRM Omnicanal IA

Plataforma CRM fullstack en Next.js para ventas/soporte con:

- Inbox omnicanal (WhatsApp, Instagram, Facebook, Email; TikTok opcional por feature flag).
- Pipeline Kanban de leads + ficha 360.
- Plantillas de respuestas rÃ¡pidas con variables dinÃ¡micas.
- CampaÃ±as y seguimiento comercial.
- Motor visual tipo n8n (workflow DSL v1) para automatizaciones + funciones IA.
- Agente IA autÃ³nomo 24/7 con guardrails crÃ­ticos, RAG y citas.
- Roles y permisos (admin, supervisor, asesor, soporte, marketing).
- UI bilingÃ¼e ES/EN.

## Stack

- Next.js App Router + TypeScript + Tailwind CSS
- Auth.js (`next-auth`) + Prisma Adapter
- Supabase Postgres (Prisma ORM)
- Supabase Realtime
- OpenAI API
- React Flow (constructor visual)
- Vitest + Playwright

## Requisitos

- Node.js 22+
- pnpm 10+
- Base de datos Supabase Postgres (obligatoria para este proyecto)

## Arranque local

```bash
pnpm install
cp .env.example .env
pnpm db:generate
pnpm db:push
pnpm db:seed
pnpm dev
```

App: `http://localhost:3000`

### Usuario demo (seed)

- Email: `admin@crm.local`
- Password: `Admin12345!`

## Variables de entorno

Revisar `.env.example`.

Variables crÃ­ticas de producciÃ³n:

- `DATABASE_URL`, `DIRECT_URL`
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `META_*`, `WHATSAPP_*`, `GMAIL_*`, `MICROSOFT_*`

## Scripts

```bash
pnpm dev
pnpm build
pnpm lint
pnpm test
pnpm test:e2e
pnpm db:generate
pnpm db:push
pnpm db:migrate
pnpm db:seed
```

## APIs

Dominios principales:

- `/api/auth`, `/api/leads`, `/api/inbox`, `/api/conversations`
- `/api/tasks`, `/api/templates`, `/api/campaigns`, `/api/reports`
- `/api/workflows`, `/api/ai`, `/api/channel-accounts`, `/api/branches`

Webhooks:

- `/api/webhooks/meta`
- `/api/webhooks/whatsapp-status`
- `/api/webhooks/gmail`
- `/api/webhooks/microsoft`
- `/api/webhooks/tiktok`

## Workflow DSL v1

El motor usa un DSL JSON versionado (`src/lib/workflows/dsl.ts`) con:

- Trigger
- Nodes (`trigger`, `condition`, `action`, `delay`)
- Edges
- Reintentos y timeout

Acciones soportadas v1:

- `message.reply`
- `lead.assign`
- `lead.move_stage`
- `task.create`
- `lead.tag`
- `campaign.trigger`
- `human.handoff`
- `ai.invoke`

## Despliegue Vercel

1. Conectar repo `pipecode66/CRM` desde dashboard Vercel.
2. Configurar variables de entorno.
3. Definir `main` como rama productiva.
4. Desplegar.

## Estado actual

Esta entrega deja:

- Arquitectura base completa.
- Esquema de datos principal.
- APIs nÃºcleo del CRM.
- Webhooks base de integraciones.
- Constructor visual de flujos.
- Panel operativo del agente IA.
- Tests unitarios + E2E inicial.

Integraciones externas quedan listas para conexiÃ³n real con credenciales productivas.
