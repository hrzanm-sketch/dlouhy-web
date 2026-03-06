# dlouhy-web

Company website + customer portal for Dlouhy Technology s.r.o. (SAMSON, SCHROEDAHL/CIRCOR, ELCO distributor for CZ/SK).

## Tech stack

- **Next.js 16** (App Router, standalone output)
- **Payload CMS 3** (Next.js plugin, admin at `/admin`, Lexical editor)
- **PostgreSQL 16** (shared DB with dt-intranet)
- **Drizzle ORM** (migrations, schema-first)
- **NextAuth v5** (magic link + credentials)
- **Tailwind CSS 4** (CSS-first config in `globals.css`)
- **Resend** (React Email templates)
- **Cloudflare R2** (image/file storage)
- **Zod + React Hook Form** (validation)
- **pnpm** (package manager)
- **TypeScript** (strict mode)

## Commands

```bash
pnpm dev              # Dev server on localhost:3001 (port 3000 = intranet)
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # ESLint
pnpm format           # Prettier write
pnpm format:check     # Prettier check
pnpm db:generate      # Generate Drizzle migrations
pnpm db:migrate       # Apply migrations
pnpm db:seed          # Seed data (tsx src/lib/db/seed.ts)
pnpm db:studio        # Drizzle Studio on port 4984
```

No test runner configured yet.

## Project structure

```
src/
  app/
    (web)/              # Public website (Czech URLs)
      page.tsx          # Homepage
      produkty/         # Products (category/slug nesting)
      servis/           # Service pages + inquiry form
      reference/        # Case studies
      novinky/          # Blog/news
      ke-stazeni/       # Downloads
      kontakt/          # Contact
      poptavka/         # General inquiry form
      reklamace/        # Complaint form
      o-nas/, gdpr/, podminky/  # Static pages
      dekujeme/         # Thank-you pages (poptavka, reklamace, servis)
    (portal)/           # Customer portal (behind login)
      portal/
        login/, reset-hesla/, prvni-prihlaseni/
        dashboard/, objednavky/, faktury/
        servis/, reklamace/, dokumenty/, profil/
    (payload)/          # Payload CMS admin at /admin
    api/
      auth/[...nextauth]/   # NextAuth routes
      web/                  # All REST API
        products/, categories/, references/, articles/, downloads/, search/
        inquiry/, service-inquiry/, claim/, contact/
        portal/             # Authenticated portal API
        admin/              # Admin API (leads, portal-users)
        webhooks/           # Intranet webhooks (order-status, new-invoice, service-update, claim-update)
        revalidate/         # On-demand ISR
  components/
    ui/                 # Base UI (Button, Card, Input, Badge, Table)
    layout/             # Header, Footer, Sidebar, Navigation
    products/           # ProductCard, ProductGrid, FilterSidebar
    forms/              # InquiryForm, ClaimForm, ServiceForm, ContactForm
    portal/             # KPICards, OrderTimeline, NotificationList
    shared/             # Hero, CTABlock, ReferenceCard, ArticleCard
  lib/
    db/
      index.ts          # Drizzle client (max 5 connections)
      schema/           # All table definitions
        intranet/       # Read-only intranet table refs
      seed.ts
    auth.ts             # NextAuth v5 config
    email/
      client.ts         # Resend client
      templates/        # 14 React Email templates
    validations/        # Zod schemas (shared frontend + backend)
    portal/             # Portal helpers (queries, session, notifications)
    intranet-client.ts  # HTTP client for intranet API
    r2.ts               # Cloudflare R2 client
    rate-limit.ts
    seo.ts
    constants.ts        # Manufacturers, industries, form options
    utils.ts            # cn(), formatAmount(), formatDate()
  payload/
    collections/        # Products, Categories, Downloads, References, Articles
    globals/            # Homepage, SiteSettings
payload.config.ts       # Payload CMS root config
drizzle.config.ts       # Drizzle Kit config
drizzle/                # SQL migrations (3 so far)
scripts/                # scrape-products.py, products-demo.json
docs/                   # Design brief, specs, integration docs
```

## Key conventions

### Naming
- Files: kebab-case (`product-card.tsx`)
- Components: PascalCase (`ProductCard`)
- DB tables: snake_case (`portal_users`)
- API routes: kebab-case (`/api/web/service-inquiry`)
- URL slugs: Czech without diacritics (`regulacni-ventily`)

### Code style
- Prettier: no semicolons, double quotes, 2-space indent, trailing comma es5
- ESLint: next/core-web-vitals + typescript + prettier
- Imports: `@/*` alias for `src/*`, `@payload-config` for `payload.config.ts`

### DB conventions
- UUID primary keys (`defaultRandom()`)
- Soft delete: `deleted_at` timestamptz (NULL = active)
- Audit: `created_by`, `updated_by`, `created_at`, `updated_at`
- Amounts: in hellers/cents (integer), display via `formatAmount()`

### Rendering
- Homepage: ISR 86400 (1 day)
- Products/categories: ISR 3600 (1 hour) + on-demand revalidation
- References/blog: ISR 86400
- Portal: SSR (no-store, always fresh)
- Forms: Client Components (React Hook Form)
- Static pages (o-nas, podminky, gdpr): SSG

### Error handling
- Server Actions return `{ success: boolean, error?: string, data?: T }`
- API routes: standard HTTP codes, `{ error: string }` for errors
- Zod validation on both frontend and backend

### Styling
- Tailwind CSS 4 utilities only (no custom CSS files except `globals.css`)
- Brand colors: `dt-blue`, `samson-blue`, `elco-red`, `schroedahl-green`, `cta` (orange)
- Responsive: sm/md/lg/xl/2xl breakpoints

## Intranet integration

- **Shared PostgreSQL**: web reads intranet tables (orders, invoices, companies, service_requests, claims) via Drizzle, filtered by `company_id`
- **NEVER write to intranet tables directly** -- write to own tables or call intranet API
- **Intranet API**: `INTRANET_API_URL` + `INTRANET_API_KEY` for creating business cases, service requests, claims
- **Webhooks from intranet**: `X-API-Key` auth via `WEBHOOK_SECRET`, trigger portal notifications + ISR revalidation

## Deployment

- **Docker**: multi-stage Dockerfile, standalone Next.js output, port 3001
- **Host**: Mac Studio via Coolify
- **DB**: PostgreSQL 16 (shared with dt-intranet), local dev via `docker-compose.yml`
- **GitHub**: `hrzanm-sketch/dlouhy-web`
- No LaunchAgent (runs via Coolify/Docker)

## Environment variables

See `.env.example` for all required vars:
- `DATABASE_URL` -- shared PostgreSQL with intranet
- `AUTH_SECRET`, `AUTH_URL` -- NextAuth v5
- `PAYLOAD_SECRET` -- Payload CMS
- `RESEND_API_KEY` -- email sending
- `R2_*` -- Cloudflare R2 storage
- `INTRANET_API_URL`, `INTRANET_API_KEY` -- intranet API
- `WEBHOOK_SECRET` -- webhook auth
- `REVALIDATE_TOKEN` -- ISR revalidation

## Do NOT

- Add dependencies without approval
- Write to intranet DB tables (read-only access)
- Build monorepo structure (flat Next.js app)
- Add tRPC, Redis, BullMQ, AI chat, e-shop/cart, i18n translations
- Implement valve configurator (link to SAMSON SED instead)
- Start coding without an approved plan
