# Dlouhý Technology — Web + Zákaznický portál

Nový web a zákaznický portál pro Dlouhý Technology s.r.o. — výhradní distributor SAMSON (regulační ventily) pro ČR a SK, produkty SCHROEDAHL/CIRCOR (recirkulační ventily) a ELCO (hořáky).

## Tech stack

- **Framework**: Next.js 15 (App Router)
- **ORM**: Drizzle ORM
- **Databáze**: PostgreSQL 16 (sdílená s dt-intranet)
- **Styling**: Tailwind CSS 4.2
- **Auth**: NextAuth v5 (magic link přes Resend + credentials)
- **CMS**: Payload CMS 3.0 (Next.js plugin, admin na `/admin`)
- **Email**: Resend (React Email templates)
- **Animace**: Motion v11 (Framer Motion)
- **Obrázky**: Cloudflare R2 + Next.js Image
- **Validace**: Zod + React Hook Form
- **Hosting**: Mac Studio přes Coolify
- **Package manager**: pnpm

## Struktura projektu

```
dlouhy-web/
├── src/
│   ├── app/
│   │   ├── (web)/                  # Veřejný web
│   │   │   ├── page.tsx            # Homepage
│   │   │   ├── o-nas/
│   │   │   ├── produkty/
│   │   │   │   ├── page.tsx        # Grid produktů
│   │   │   │   └── [kategorie]/
│   │   │   │       ├── page.tsx    # Kategorie
│   │   │   │       └── [slug]/
│   │   │   │           └── page.tsx # Detail produktu
│   │   │   ├── servis/
│   │   │   │   ├── page.tsx        # Servisní služby
│   │   │   │   └── poptavka/
│   │   │   ├── reference/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   ├── novinky/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   ├── ke-stazeni/
│   │   │   ├── kontakt/
│   │   │   ├── poptavka/
│   │   │   ├── reklamace/
│   │   │   ├── podminky/
│   │   │   ├── gdpr/
│   │   │   └── dekujeme/
│   │   │       ├── poptavka/
│   │   │       ├── reklamace/
│   │   │       └── servis/
│   │   ├── (portal)/               # Zákaznický portál (za loginem)
│   │   │   ├── layout.tsx          # Sidebar layout
│   │   │   └── portal/
│   │   │       ├── login/
│   │   │       ├── reset-hesla/
│   │   │       ├── prvni-prihlaseni/
│   │   │       ├── dashboard/
│   │   │       ├── objednavky/
│   │   │       │   ├── page.tsx
│   │   │       │   └── [id]/
│   │   │       ├── faktury/
│   │   │       │   ├── page.tsx
│   │   │       │   └── [id]/
│   │   │       ├── servis/
│   │   │       │   ├── page.tsx
│   │   │       │   ├── novy/
│   │   │       │   └── [id]/
│   │   │       ├── reklamace/
│   │   │       │   ├── page.tsx
│   │   │       │   ├── nova/
│   │   │       │   └── [id]/
│   │   │       ├── dokumenty/
│   │   │       └── profil/
│   │   ├── (payload)/              # Payload CMS admin
│   │   │   └── admin/
│   │   │       └── [[...segments]]/
│   │   └── api/
│   │       ├── auth/[...nextauth]/ # NextAuth routes
│   │       └── web/                # Web API
│   │           ├── products/
│   │           ├── categories/
│   │           ├── references/
│   │           ├── articles/
│   │           ├── downloads/
│   │           ├── search/
│   │           ├── inquiry/
│   │           ├── service-inquiry/
│   │           ├── claim/
│   │           ├── contact/
│   │           ├── portal/
│   │           │   ├── dashboard/
│   │           │   ├── orders/
│   │           │   ├── invoices/
│   │           │   ├── service-requests/
│   │           │   ├── claims/
│   │           │   ├── documents/
│   │           │   ├── notifications/
│   │           │   └── profile/
│   │           ├── admin/
│   │           │   ├── leads/
│   │           │   └── portal-users/
│   │           ├── webhooks/
│   │           │   ├── order-status/
│   │           │   ├── new-invoice/
│   │           │   ├── service-update/
│   │           │   └── claim-update/
│   │           └── revalidate/
│   ├── components/
│   │   ├── ui/                     # Základní UI (Button, Card, Input, Badge, Table...)
│   │   ├── layout/                 # Header, Footer, Sidebar, Navigation
│   │   ├── products/               # ProductCard, ProductGrid, FilterSidebar, SpecsTable
│   │   ├── forms/                  # InquiryForm, ClaimForm, ServiceForm, ContactForm
│   │   ├── portal/                 # KPICards, OrderTimeline, NotificationList
│   │   └── shared/                 # Hero, CTABlock, ReferenceCard, ArticleCard
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts            # Drizzle client (sdílená PostgreSQL)
│   │   │   ├── schema/
│   │   │   │   ├── categories.ts
│   │   │   │   ├── products.ts
│   │   │   │   ├── product-parameters.ts
│   │   │   │   ├── product-documents.ts
│   │   │   │   ├── product-relations.ts
│   │   │   │   ├── references.ts
│   │   │   │   ├── articles.ts
│   │   │   │   ├── downloads.ts
│   │   │   │   ├── portal-users.ts
│   │   │   │   ├── portal-notifications.ts
│   │   │   │   ├── web-leads.ts
│   │   │   │   ├── web-page-content.ts
│   │   │   │   └── index.ts
│   │   │   └── seed.ts
│   │   ├── auth.ts                 # NextAuth v5 konfigurace
│   │   ├── email/                  # Resend client + React Email templates
│   │   │   ├── client.ts
│   │   │   └── templates/
│   │   │       ├── inquiry-confirmation.tsx
│   │   │       ├── claim-confirmation.tsx
│   │   │       ├── service-confirmation.tsx
│   │   │       ├── order-status.tsx
│   │   │       ├── invoice-notification.tsx
│   │   │       ├── portal-invite.tsx
│   │   │       └── magic-link.tsx
│   │   ├── validations/            # Zod schémata (sdílená frontend + backend)
│   │   │   ├── inquiry.ts
│   │   │   ├── claim.ts
│   │   │   ├── service-request.ts
│   │   │   └── contact.ts
│   │   ├── constants.ts            # Manufacturers, industries, form options
│   │   └── utils.ts                # cn(), formatAmount(), formatDate()
│   └── payload/
│       ├── collections/
│       │   ├── Products.ts
│       │   ├── Categories.ts
│       │   ├── References.ts
│       │   ├── Articles.ts
│       │   ├── Downloads.ts
│       │   ├── PortalUsers.ts
│       │   └── Media.ts
│       └── globals/
│           ├── Homepage.ts
│           └── SiteSettings.ts
├── public/
│   ├── images/                     # Statické obrázky (loga partnerů, ikony)
│   └── fonts/
├── drizzle/                        # Migrace
├── drizzle.config.ts
├── payload.config.ts               # Payload CMS konfigurace
├── next.config.ts
├── tailwind.css                    # Tailwind v4 CSS-first konfigurace
├── docker-compose.yml              # PostgreSQL 16 pro lokální dev
├── Dockerfile                      # Multi-stage produkční build
├── vitest.config.ts
└── package.json
```

## Co NEDĚLAT

- **Nebudovat monorepo** — flat Next.js app, žádné packages/, žádné Turborepo
- **Nepoužívat tRPC** — čisté REST API (`/api/web/*`) + Server Actions pro formuláře
- **Nepsat vlastní auth** — NextAuth v5 je dostatečný, žádný custom JWT
- **Neimplementovat konfigurátor ventilů** — SAMSON má SED konfigurátor, DT na něj odkazuje
- **Neřešit vícejazyčnost** v první verzi — jen čeština, i18n struktura připravena (next-intl) ale nepřekládat
- **Nedělat e-shop / košík** — DT prodává konzultativně, poptávkový formulář stačí
- **Nepřidávat AI chat** — bez strukturované knowledge base by produkoval nesmysly
- **Nepřidávat Redis/BullMQ** — pro B2B web se stovkami návštěv denně je to zbytečné
- **Neměnit intranetové tabulky** — web čte intranetová data přes sdílenou DB, ale NIKDY nepíše do intranetových tabulek přímo
- **Nepřidávat závislosti bez schválení** — každý nový npm package musí mít důvod

## Konvence

### Naming

- **Soubory**: kebab-case (`product-card.tsx`, `web-leads.ts`)
- **Komponenty**: PascalCase (`ProductCard`, `InquiryForm`)
- **DB tabulky**: snake_case (`product_parameters`, `portal_users`)
- **API routes**: kebab-case (`/api/web/service-inquiry`)
- **URL slugy**: kebab-case, čeština bez diakritiky (`regulacni-ventily`)

### Styling

- Tailwind CSS 4 utility classes — žádné custom CSS soubory (kromě `tailwind.css`)
- Container queries pro karty produktů (`@container`)
- Responzivní breakpointy: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
- Barvy: definované v `tailwind.css` — `dt-blue`, `samson-blue`, `elco-red`, `neutral-*`

### Error handling

- Server Actions: vrací `{ success: boolean, error?: string, data?: T }`
- API routes: standardní HTTP kódy, JSON response `{ error: string }` pro chyby
- Formuláře: Zod validace na frontendu (React Hook Form) i backendu (Server Action)
- Chyby logovat přes `console.error` (v produkci nahradit structured logging)

### DB konvence (shodné s intranetem)

- **UUID primary keys**: `defaultRandom()`
- **Soft delete**: `deleted_at` TIMESTAMPTZ (NULL = aktivní)
- **Audit trail**: `created_by`, `updated_by`, `created_at`, `updated_at`
- **Částky**: v haléřích/centech (integer), zobrazení přes `formatAmount()`
- **Importy**: `@/` alias (`@/lib/db`, `@/components/ui/card`)

### Rendering strategie

- **Homepage**: ISR, revalidate: 86400 (1 den)
- **Produkty**: ISR, revalidate: 3600 (1 hodina) + on-demand revalidace z CMS
- **Kategorie**: ISR, revalidate: 3600
- **Reference, blog**: ISR, revalidate: 86400
- **Portál**: SSR (no-store) — vždy čerstvá data
- **Formuláře**: Client Components (React Hook Form)
- **Statické stránky** (o-nas, podminky, gdpr): SSG

## Příkazy

```bash
pnpm dev              # Dev server (localhost:3001 — port 3000 je intranet)
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # ESLint
pnpm type-check       # TypeScript check
pnpm test             # Vitest unit testy
pnpm test:e2e         # Playwright E2E testy
pnpm db:generate      # Generuj Drizzle migrace
pnpm db:migrate       # Aplikuj migrace
pnpm db:seed          # Nahraj seed data
pnpm db:studio        # Drizzle Studio (port 4984)
```

## API endpointy

### Veřejné (public)

```
GET  /api/web/products                    # Seznam produktů (query: category, manufacturer, medium, search, page, limit)
GET  /api/web/products/[slug]             # Detail produktu
GET  /api/web/categories                  # Strom kategorií
GET  /api/web/references                  # Seznam referencí (query: industry, year, page)
GET  /api/web/references/[slug]           # Detail reference
GET  /api/web/articles                    # Seznam článků (query: category, page)
GET  /api/web/articles/[slug]             # Detail článku
GET  /api/web/downloads                   # Dokumenty ke stažení (query: category, manufacturer)
GET  /api/web/search                      # Full-text search produktů
POST /api/web/inquiry                     # Obecná poptávka
POST /api/web/service-inquiry             # Poptávka servisu
POST /api/web/claim                       # Reklamace
POST /api/web/contact                     # Kontaktní formulář
```

### Portal (vyžaduje přihlášení)

```
GET   /api/web/portal/dashboard           # Dashboard data (KPI)
GET   /api/web/portal/orders              # Objednávky zákazníka
GET   /api/web/portal/orders/[id]         # Detail objednávky
GET   /api/web/portal/invoices            # Faktury zákazníka
GET   /api/web/portal/invoices/[id]       # Detail faktury
GET   /api/web/portal/invoices/[id]/pdf   # Download PDF faktury
GET   /api/web/portal/service-requests    # Servisní požadavky
GET   /api/web/portal/service-requests/[id]
POST  /api/web/portal/service-requests    # Nový servisní požadavek
GET   /api/web/portal/claims              # Reklamace
GET   /api/web/portal/claims/[id]
POST  /api/web/portal/claims              # Nová reklamace
GET   /api/web/portal/documents           # Dokumenty zákazníka
GET   /api/web/portal/notifications       # Notifikace
PATCH /api/web/portal/notifications/[id]  # Mark as read
GET   /api/web/portal/profile             # Profil
PATCH /api/web/portal/profile             # Update profilu
POST  /api/web/portal/profile/change-password
```

### Auth

```
POST /api/auth/signin                     # NextAuth login
POST /api/auth/signout                    # NextAuth logout
GET  /api/auth/session                    # Session info
POST /api/web/auth/reset-password         # Request reset
POST /api/web/auth/reset-password/confirm # Confirm reset
POST /api/web/auth/first-login            # Set password from invite
```

### Admin

```
*     /admin/*                            # Payload CMS admin panel
GET   /api/web/admin/leads                # Poptávky z webu
PATCH /api/web/admin/leads/[id]           # Update stavu poptávky
GET   /api/web/admin/portal-users         # Seznam zákaznických účtů
POST  /api/web/admin/portal-users         # Nový zákaznický účet + invite
PATCH /api/web/admin/portal-users/[id]    # Aktivace/deaktivace
```

### Webhooky (z intranetu, X-API-Key auth)

```
POST /api/web/webhooks/order-status       # Změna stavu objednávky
POST /api/web/webhooks/new-invoice        # Nová faktura
POST /api/web/webhooks/service-update     # Update servisního požadavku
POST /api/web/webhooks/claim-update       # Update reklamace
```

### Revalidace

```
POST /api/web/revalidate                  # On-demand ISR (X-Revalidate-Token)
```

## Routes (všechny stránky)

### Veřejná část

```
/                                         # Homepage (ISR 86400)
/o-nas                                    # O firmě (SSG)
/produkty                                 # Přehled produktů (ISR 3600)
/produkty/[kategorie]                     # Kategorie (ISR 3600)
/produkty/[kategorie]/[slug]              # Detail produktu (ISR 3600)
/servis                                   # Servisní služby (SSG)
/servis/poptavka                          # Poptávka servisu (SSR)
/reference                                # Reference (ISR 86400)
/reference/[slug]                         # Detail reference (ISR 86400)
/novinky                                  # Blog (ISR 3600)
/novinky/[slug]                           # Detail článku (ISR 3600)
/ke-stazeni                               # Dokumenty ke stažení (ISR 86400)
/kontakt                                  # Kontakt (SSG)
/poptavka                                 # Obecná poptávka (SSR)
/reklamace                                # Reklamace (SSR)
/podminky                                 # Obchodní podmínky (SSG)
/gdpr                                     # GDPR (SSG)
/dekujeme/poptavka                        # Success page (SSG)
/dekujeme/reklamace                       # Success page (SSG)
/dekujeme/servis                          # Success page (SSG)
```

### Portál (za loginem)

```
/portal/login                             # Přihlášení (SSR)
/portal/reset-hesla                       # Reset hesla (SSR)
/portal/reset-hesla/[token]               # Nové heslo (SSR)
/portal/prvni-prihlaseni/[token]          # First login (SSR)
/portal/dashboard                         # Dashboard (SSR)
/portal/objednavky                        # Objednávky (SSR)
/portal/objednavky/[id]                   # Detail objednávky (SSR)
/portal/faktury                           # Faktury (SSR)
/portal/faktury/[id]                      # Detail faktury (SSR)
/portal/servis                            # Servisní požadavky (SSR)
/portal/servis/novy                       # Nový požadavek (SSR)
/portal/servis/[id]                       # Detail požadavku (SSR)
/portal/reklamace                         # Reklamace (SSR)
/portal/reklamace/nova                    # Nová reklamace (SSR)
/portal/reklamace/[id]                    # Detail reklamace (SSR)
/portal/dokumenty                         # Dokumenty (SSR)
/portal/profil                            # Profil (SSR)
/portal/profil/zmena-hesla                # Změna hesla (SSR)
```

### Admin (Payload CMS)

```
/admin                                    # Payload CMS dashboard
/admin/collections/products               # CRUD produkty
/admin/collections/categories             # CRUD kategorie
/admin/collections/references             # CRUD reference
/admin/collections/articles               # CRUD články
/admin/collections/downloads              # CRUD dokumenty
/admin/collections/portal-users           # Správa zákaznických účtů
/admin/globals/homepage                   # Editace homepage
/admin/globals/site-settings              # Nastavení webu
```

## Kritické pravidlo

**Před implementací vždy explicitně řekni:**

1. Co přesně uděláš
2. Které soubory změníš
3. Jak ověříš že to funguje

NIKDY nezačínej kódovat bez schváleného plánu.

## Napojení na intranet

### Sdílená databáze

Web i intranet sdílí stejnou PostgreSQL 16 instanci. Web má vlastní tabulky (prefix-free, oddělené schématem v Drizzle), ale ČTENÍ intranetových tabulek je povolené:

```ts
// src/lib/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://dt:dt_local_dev@localhost:5432/dt_intranet"

// Web má omezený connection pool
const client = postgres(connectionString, { max: 5 })
export const db = drizzle(client, { schema })
```

### Čtení intranetových dat (portál)

Portál čte objednávky, faktury, servisní požadavky a reklamace přímo z intranetových tabulek, filtrováno přes `company_id` ze session:

```ts
// Příklad: načtení objednávek zákazníka
import { orders } from "@/lib/db/schema/intranet" // importy intranetových tabulek
import { eq } from "drizzle-orm"

const customerOrders = await db
  .select()
  .from(orders)
  .where(eq(orders.companyId, session.user.companyId))
```

**PRAVIDLO: Web NIKDY nepíše do intranetových tabulek přímo.** Zápis vždy přes:

1. Server Actions → vlastní webové tabulky (web_leads, portal_users, portal_notifications)
2. HTTP volání na intranet API (`/api/v1/*`) pro vytvoření business_case, service_request, claim

### Volání intranet API

```ts
// src/lib/intranet-client.ts
const INTRANET_URL = process.env.INTRANET_API_URL || "http://localhost:3000"
const INTRANET_API_KEY = process.env.INTRANET_API_KEY

export async function createBusinessCase(data: NewCaseData) {
  const res = await fetch(`${INTRANET_URL}/api/v1/cases`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": INTRANET_API_KEY!,
    },
    body: JSON.stringify({ ...data, source: "web" }),
  })
  if (!res.ok) throw new Error(`Intranet API error: ${res.status}`)
  return res.json()
}
```

### Webhooky z intranetu

Intranet volá web webhooky při změnách stavu. Autentizace přes `X-API-Key` header:

```ts
// src/app/api/web/webhooks/order-status/route.ts
export async function POST(req: Request) {
  const apiKey = req.headers.get("X-API-Key")
  if (apiKey !== process.env.WEBHOOK_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  // zpracování...
}
```

## Environment variables

```env
# Database (sdílená s intranetem)
DATABASE_URL=postgresql://dt:xxx@localhost:5432/dt_intranet

# NextAuth v5
AUTH_SECRET=xxx
AUTH_URL=https://dlouhy-technology.cz

# Resend
RESEND_API_KEY=re_xxx

# Cloudflare R2
R2_ACCOUNT_ID=xxx
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET_NAME=dt-web
R2_PUBLIC_URL=https://pub-xxx.r2.dev

# Intranet API
INTRANET_API_URL=http://localhost:3000
INTRANET_API_KEY=xxx

# Webhooky
WEBHOOK_SECRET=xxx

# ISR revalidace
REVALIDATE_TOKEN=xxx

# Payload CMS
PAYLOAD_SECRET=xxx
```
