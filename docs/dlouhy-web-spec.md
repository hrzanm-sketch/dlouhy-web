# DT Web — Technická specifikace

> Veřejný web + zákaznický portál pro Dlouhy Technology s.r.o.
> Verze dokumentu: 2026-03-02

## 1. Přehled systému

**Účel**: Veřejný firemní web (produkty, reference, blog, formuláře) + zákaznický portál (objednávky, faktury, servis, reklamace). Napojeno na dt-intranet přes sdílenou DB a API.

### Stack

| Komponenta | Verze | Poznámka |
|---|---|---|
| Framework | Next.js 15 | App Router, Server Components |
| Runtime | Node.js | — |
| ORM | Drizzle ORM 0.45 | TypeScript-first |
| Database | PostgreSQL 16 | Sdílená s dt-intranet |
| CMS | Payload CMS 3.0 | Next.js plugin, admin `/admin` |
| Styling | Tailwind CSS 4 | Utility-first |
| Auth | NextAuth v5 (beta.30) | Credentials, JWT |
| Email | Resend 6.9.3 | + React Email templates |
| Animace | Motion v11 | Framer Motion wrapper |
| Images | Cloudflare R2 | CDN storage |
| Validace | Zod 4.3 | Server + client |
| Formuláře | React Hook Form 7.71 | Client-side state |
| Package manager | pnpm | — |

### Deployment

- **Hosting**: Mac Studio via Coolify, 24/7
- **Port**: 3001 (dev), 3000 = intranet
- **CI/CD**: GitHub Actions
- **Doména**: `dlouhy-technology.cz`

---

## 2. Veřejný web

### 2.1 Stránky

| Route | Stránka | Rendering | Revalidate |
|---|---|---|---|
| `/` | Homepage | ISR | 86400s (1 den) |
| `/o-nas` | O firmě | SSG | — |
| `/produkty` | Přehled produktů | ISR | 3600s (1 hod) |
| `/produkty/[kategorie]` | Kategorie produktů | ISR | 3600s |
| `/produkty/[kategorie]/[slug]` | Detail produktu | ISR | 3600s |
| `/servis` | Servisní služby | SSG | — |
| `/servis/poptavka` | Poptávka servisu | SSR | — |
| `/reference` | Reference | ISR | 86400s |
| `/reference/[slug]` | Detail reference | ISR | 86400s |
| `/novinky` | Blog | ISR | 3600s |
| `/novinky/[slug]` | Detail článku | ISR | 3600s |
| `/ke-stazeni` | Dokumenty k stažení | ISR | 86400s |
| `/kontakt` | Kontakt | SSG | — |
| `/poptavka` | Obecná poptávka | SSR | — |
| `/reklamace` | Reklamační formulář | SSR | — |
| `/podminky` | Obchodní podmínky | SSG | — |
| `/gdpr` | GDPR informace | SSG | — |
| `/dekujeme/*` | Potvrzovací stránky | SSG | — |

**On-demand revalidation**: `POST /api/web/revalidate` s `X-Revalidate-Token` headerem.

### 2.2 Formuláře

#### Poptávka (`/poptavka` → `POST /api/web/inquiry`)

| Pole | Typ | Povinné |
|------|-----|---------|
| `companyName` | string | ano |
| `contactName` | string | ano |
| `contactEmail` | email | ano |
| `contactPhone` | string | ne |
| `ico` | string | ne |
| `subject` | string (min 3) | ano |
| `message` | string (min 10) | ano |
| `productId` | UUID | ne |
| `gdprConsent` | boolean (true) | ano |
| `newsletterConsent` | boolean | ne |

**Flow**: Frontend validace → POST API → Zod validace → INSERT `web_leads` (type=`inquiry`) → Email `InquiryConfirmation` → Rate limit 10/min/IP

#### Reklamace (`/reklamace` → `POST /api/web/claim`)

| Pole | Typ | Povinné |
|------|-----|---------|
| `companyName` | string | ano |
| `contactName` | string | ano |
| `contactEmail` | email | ano |
| `contactPhone` | string | ne |
| `message` | string (min 10) | ano |
| `desiredResolution` | enum: repair/replacement/refund/discount | ano |
| `gdprConsent` | boolean (true) | ano |

**Flow**: → INSERT `web_leads` (type=`claim`) → Email `ClaimConfirmation`

#### Servisní poptávka (`/servis/poptavka` → `POST /api/web/service-inquiry`)

| Pole | Typ | Povinné |
|------|-----|---------|
| `contactName` | string | ne |
| `contactEmail` | email | ne |
| `contactPhone` | string | ne |
| `urgency` | enum: normal/urgent/critical | ano |
| `preferredDate` | string | ne |
| `location` | string | ne |
| `message` | string (min 10) | ano |
| `gdprConsent` | boolean (true) | ano |

**Flow**: → INSERT `web_leads` (type=`service_request`) → Email `ServiceConfirmation`

#### Kontaktní formulář (`/kontakt` → `POST /api/web/contact`)

| Pole | Typ | Povinné |
|------|-----|---------|
| `name` | string | ano |
| `email` | email | ano |
| `phone` | string | ne |
| `message` | string (min 10) | ano |
| `gdprConsent` | boolean (true) | ano |

**Flow**: → INSERT `web_leads` (type=`contact`) → Email `ContactConfirmation`

### 2.3 CMS (Payload 3.0)

Admin UI na `/admin`. Collections:

#### Products
- `name`, `slug` (unique), `typeCode`, `manufacturer` (SAMSON/SCHROEDAHL/CIRCOR/ELCO)
- `category` (→ categories), `shortDescription`, `longDescription` (richText)
- `mainImage`, `galleryImages` (array)
- `isActive`, `isFeatured`, `sortOrder`
- `seoTitle`, `seoDescription`

#### Categories (hierarchické)
- `name`, `slug` (unique), `description` (richText), `image`
- `parent` (self-referential → categories)
- `manufacturer`, `sortOrder`, `isActive`

#### Articles (blog)
- `title`, `slug` (unique), `perex` (max 500), `content` (richText)
- `category` (novinka/technika/produkt/akce)
- `date`, `image`, `author`

#### References (case studies)
- `customer`, `slug` (unique), `industry` (teplarenstvi/energetika/chemie/prumysl/ostatni)
- `excerpt` (max 500), `content` (richText), `year`, `image`

#### Downloads
- `name`, `description`, `category` (katalog/certifikat/technicka-dokumentace/formulare)
- `manufacturer`, `file`, `language` (cs/en/de/sk), `isPublic`, `sortOrder`

#### Media
- Upload images/PDFs do `public/media`
- Pole: `alt` (text)

#### Globals
- **Homepage** — editovatelný obsah homepage
- **SiteSettings** — globální nastavení webu

### 2.4 SEO & rendering

| Typ stránky | Strategie | Poznámka |
|---|---|---|
| CMS obsah (produkty, články, reference, downloads) | ISR | Revalidace 1–24h |
| Statické stránky (o-nas, podmínky, GDPR, servis, kontakt) | SSG | Build-time |
| Formuláře (poptávka, reklamace, servisní poptávka) | SSR | Server Actions + validace |
| Portálové stránky | SSR | `force-dynamic`, vždy čerstvá data |
| Error pages (404, 500) | SSG | — |

---

## 3. Zákaznický portál

### 3.1 Stránky

#### Veřejné (bez přihlášení)

| Route | Stránka | Popis |
|---|---|---|
| `/portal/login` | Přihlášení | Email + heslo |
| `/portal/reset-hesla` | Reset hesla | Zadání emailu |
| `/portal/reset-hesla/[token]` | Nové heslo | Token validace + nový password |
| `/portal/prvni-prihlaseni/[token]` | První přihlášení | Nastavení hesla z invite |

#### Chráněné (vyžadují přihlášení)

| Route | Stránka | Data source |
|---|---|---|
| `/portal/dashboard` | Dashboard | Intranet (read-only) |
| `/portal/objednavky` | Objednávky — list | `intranet.orders` |
| `/portal/objednavky/[id]` | Objednávka — detail + timeline | `intranet.orders` |
| `/portal/faktury` | Faktury — list | `intranet.invoices` |
| `/portal/faktury/[id]` | Faktura — detail | `intranet.invoices` |
| `/portal/faktury/[id]/pdf` | Faktura — PDF download | `intranet.invoices` |
| `/portal/servis` | Servisní požadavky — list | `intranet.service_requests` |
| `/portal/servis/novy` | Nový servisní požadavek | → Intranet API |
| `/portal/servis/[id]` | Servisní požadavek — detail | `intranet.service_requests` |
| `/portal/reklamace` | Reklamace — list | `intranet.claims` |
| `/portal/reklamace/nova` | Nová reklamace | → Intranet API |
| `/portal/reklamace/[id]` | Reklamace — detail | `intranet.claims` |
| `/portal/dokumenty` | Dokumenty ke stažení | `downloads` |
| `/portal/profil` | Profil uživatele | `portal_users` |
| `/portal/profil/zmena-hesla` | Změna hesla | `portal_users` |

### 3.2 Dashboard

KPI karty:
- Počet objednávek
- Počet faktur (+ upozornění na neuhrazené)
- Počet servisních požadavků
- Počet reklamací
- Nepřečtené notifikace
- Nedávné objednávky
- Neuhrazené faktury

### 3.3 Objednávky

**List**: Filtrování podle stavu, stránkování.

**Detail + Timeline**: Status progression s timestamps:
```
ordered → confirmed → shipped → delivered
```
Pole: orderNumber, title, amount (formátovaná), currency, deliveryDate, note.

### 3.4 Faktury

**List**: Status: draft/sent/overdue/paid. Filtrování.

**Detail**: invoiceNumber, amount, dueDate, status, paidAt, linked order.

**PDF download**: `GET /api/web/portal/invoices/[id]/pdf` → PDF blob.

### 3.5 Servisní požadavky

**List**: Statusy, stránkování.

**Nový požadavek**: Formulář → `POST /api/web/portal/service-requests` → volá Intranet API (`POST /api/v1/service-requests`).

**Detail**: Status timeline, popis, priorita.

### 3.6 Reklamace

**List**: Statusy, stránkování.

**Nová reklamace**: Formulář → `POST /api/web/portal/claims` → volá Intranet API (`POST /api/v1/claims`).

**Detail**: Status, SLA deadline, popis.

### 3.7 Dokumenty

Veřejné ke stažení + firemně specifické dokumenty (certifikáty, protokoly).

### 3.8 Profil

- Editace: firstName, lastName, phone, jobTitle
- Nastavení notifikací (emailNotifications JSONB): order_status, new_invoice, service_update, claim_update
- Změna hesla: old + new password, bcrypt

### 3.9 Notifikační systém

- **UI**: Bell icon s unread badge
- **Typy**: `order_status`, `new_invoice`, `service_update`, `claim_update`
- **DB**: tabulka `portal_notifications`
- **Polling**: `GET /api/web/portal/notifications`
- **Mark as read**: `PATCH /api/web/portal/notifications/[id]`
- **Mark all read**: `POST /api/web/portal/notifications/read-all`

---

## 4. DB schéma

### Web-owned tabulky

#### products

```sql
id                UUID PK
categoryId        UUID FK → categories
slug              VARCHAR(300) UNIQUE
name              VARCHAR(500)
typeCode          VARCHAR(100)
manufacturer      VARCHAR(50)       -- SAMSON | SCHROEDAHL | CIRCOR | ELCO
shortDescription  VARCHAR(300)
longDescription   TEXT
mainImage         VARCHAR(500)
galleryImages     JSONB             -- string[]
isActive          BOOLEAN DEFAULT true
isFeatured        BOOLEAN DEFAULT false
sortOrder         INTEGER
seoTitle          VARCHAR(200)
seoDescription    VARCHAR(300)
createdBy         UUID
updatedBy         UUID
createdAt         TIMESTAMPTZ
updatedAt         TIMESTAMPTZ
deletedAt         TIMESTAMPTZ
```

#### categories

```sql
id            UUID PK
slug          VARCHAR(200) UNIQUE
name          VARCHAR(300)
description   TEXT
image         VARCHAR(500)
parentId      UUID FK → categories    -- self-referential (hierarchie)
manufacturer  VARCHAR(50)
sortOrder     INTEGER
isActive      BOOLEAN
createdAt     TIMESTAMPTZ
updatedAt     TIMESTAMPTZ
deletedAt     TIMESTAMPTZ
```

#### product_parameters

```sql
id          UUID PK
productId   UUID FK → products
name        VARCHAR(200)
value       VARCHAR(500)
unit        VARCHAR(50)
sortOrder   INTEGER
```

#### product_documents

```sql
id          UUID PK
productId   UUID FK → products
name        VARCHAR(300)
type        VARCHAR(50)          -- manual | datasheet | certificate
language    VARCHAR(5) DEFAULT 'cs'
fileUrl     VARCHAR(500)
fileSize    INTEGER              -- bytes
uploadedAt  TIMESTAMPTZ
```

#### product_relations

```sql
productId         UUID FK → products    -- PK
relatedProductId  UUID FK → products    -- PK
relationType      VARCHAR(30)           -- accessory | compatible | alternative
```

#### references

```sql
id          UUID PK
slug        VARCHAR(300) UNIQUE
customer    VARCHAR(300)
industry    VARCHAR(50)          -- teplarenstvi | energetika | chemie | prumysl | ostatni
excerpt     VARCHAR(500)
content     TEXT
year        INTEGER
imageUrl    VARCHAR(500)
createdBy   UUID
updatedBy   UUID
createdAt   TIMESTAMPTZ
updatedAt   TIMESTAMPTZ
deletedAt   TIMESTAMPTZ
```

#### articles

```sql
id          UUID PK
slug        VARCHAR(300) UNIQUE
title       VARCHAR(500)
perex       VARCHAR(500)
content     TEXT
category    VARCHAR(50)          -- novinka | technika | produkt | akce
date        TIMESTAMPTZ
imageUrl    VARCHAR(500)
author      VARCHAR(200)
createdBy   UUID
updatedBy   UUID
createdAt   TIMESTAMPTZ
updatedAt   TIMESTAMPTZ
deletedAt   TIMESTAMPTZ
```

#### downloads

```sql
id            UUID PK
name          VARCHAR(300)
description   TEXT
category      VARCHAR(50)        -- katalog | certifikat | technicka-dokumentace | formulare
manufacturer  VARCHAR(50)
fileUrl       VARCHAR(500)
fileSize      INTEGER
language      VARCHAR(5) DEFAULT 'cs'
isPublic      BOOLEAN DEFAULT true
sortOrder     INTEGER
createdAt     TIMESTAMPTZ
updatedAt     TIMESTAMPTZ
deletedAt     TIMESTAMPTZ
```

#### web_page_content

```sql
id          UUID PK
pageKey     VARCHAR(100) UNIQUE  -- homepage_hero, about_section, etc.
title       VARCHAR(500)
content     TEXT
metadata    JSONB
locale      VARCHAR(5) DEFAULT 'cs'
publishedAt TIMESTAMPTZ
createdBy   UUID
updatedBy   UUID
createdAt   TIMESTAMPTZ
updatedAt   TIMESTAMPTZ
```

#### web_leads

```sql
id                  UUID PK
type                VARCHAR(30)      -- inquiry | claim | service_request | contact
status              VARCHAR(30)      -- new | in_progress | resolved | archived
intranetCaseId      UUID             -- navázaný intranet case
companyName         VARCHAR(300)
contactName         VARCHAR(300)
contactEmail        VARCHAR(255)
contactPhone        VARCHAR(50)
ico                 VARCHAR(20)
productId           UUID FK → products
subject             VARCHAR(500)
message             TEXT
urgency             VARCHAR(30)      -- normal | urgent | critical
preferredDate       DATE
location            VARCHAR(200)
desiredResolution   VARCHAR(50)      -- repair | replacement | refund | discount
metadata            JSONB
sourceUrl           VARCHAR(500)
ipAddress           VARCHAR(45)
gdprConsent         BOOLEAN
newsletterConsent   BOOLEAN
createdAt           TIMESTAMPTZ
updatedAt           TIMESTAMPTZ
```

#### portal_users

```sql
id                  UUID PK
email               VARCHAR(255) UNIQUE
passwordHash        VARCHAR(255)         -- bcrypt
firstName           VARCHAR(200)
lastName            VARCHAR(200)
phone               VARCHAR(50)
jobTitle            VARCHAR(200)
companyId           UUID FK → intranet.companies
role                VARCHAR(30) DEFAULT 'portal_user'  -- portal_user | admin
isActive            BOOLEAN DEFAULT false
emailNotifications  JSONB                -- { order_status?, new_invoice?, service_update?, claim_update? }
lastLoginAt         TIMESTAMPTZ
invitedBy           UUID FK → portal_users
inviteToken         VARCHAR(255)
inviteExpiresAt     TIMESTAMPTZ
createdAt           TIMESTAMPTZ
updatedAt           TIMESTAMPTZ
deletedAt           TIMESTAMPTZ
```

#### portal_notifications

```sql
id          UUID PK
userId      UUID FK → portal_users
type        VARCHAR(50)          -- order_status | new_invoice | service_update | claim_update
title       VARCHAR(300)
body        TEXT
linkUrl     VARCHAR(500)         -- /portal/objednavky/123
isRead      BOOLEAN DEFAULT false
createdAt   TIMESTAMPTZ
```

### Intranet tabulky (READ-ONLY)

Web čte z intranetových tabulek přes Drizzle schema kopie:

| Tabulka | Klíčová pole | Filtr |
|---------|-------------|-------|
| `orders` | id, companyId, orderNumber, title, type, amount, currency, status, timestamps | `companyId` |
| `invoices` | id, companyId, orderId, invoiceNumber, title, type, amount, currency, status, dates | `companyId` |
| `service_requests` | id, companyId, title, description, priority, status, timestamps | `companyId` |
| `claims` | id, companyId, title, description, status, slaDeadline, timestamps | `companyId` |
| `companies` | id, name, ico, dic, addresses, contacts, note | `id` |

**Pravidlo**: Web NIKDY nezapisuje přímo do intranetových tabulek.

---

## 5. API reference

### Veřejné endpointy (bez autentizace)

```
GET  /api/web/products?category=&manufacturer=&search=&page=&limit=
GET  /api/web/products/[slug]
GET  /api/web/categories                              -- hierarchický strom
GET  /api/web/references?industry=&year=&page=
GET  /api/web/references/[slug]
GET  /api/web/articles?category=&page=
GET  /api/web/articles/[slug]
GET  /api/web/downloads?category=&manufacturer=
GET  /api/web/search?q=QUERY
```

### Formuláře (veřejné, rate-limited)

```
POST /api/web/inquiry              -- poptávka
POST /api/web/claim                -- reklamace
POST /api/web/service-inquiry      -- servisní poptávka
POST /api/web/contact              -- kontakt
```

### Portálové endpointy (vyžadují JWT session)

```
GET  /api/web/portal/dashboard
GET  /api/web/portal/orders
GET  /api/web/portal/orders/[id]
GET  /api/web/portal/invoices
GET  /api/web/portal/invoices/[id]
GET  /api/web/portal/invoices/[id]/pdf
GET  /api/web/portal/service-requests
POST /api/web/portal/service-requests          -- nový (→ intranet API)
GET  /api/web/portal/service-requests/[id]
GET  /api/web/portal/claims
POST /api/web/portal/claims                    -- nová (→ intranet API)
GET  /api/web/portal/claims/[id]
GET  /api/web/portal/documents
GET  /api/web/portal/notifications
PATCH /api/web/portal/notifications/[id]       -- mark read
POST /api/web/portal/notifications/read-all
GET  /api/web/portal/profile
PATCH /api/web/portal/profile
POST /api/web/portal/profile/change-password
```

### Admin endpointy (role: admin)

```
GET   /api/web/admin/leads
PATCH /api/web/admin/leads/[id]
GET   /api/web/admin/portal-users
POST  /api/web/admin/portal-users              -- invite (odešle email)
PATCH /api/web/admin/portal-users/[id]
```

### Auth endpointy

```
POST /api/auth/signin
POST /api/auth/signout
GET  /api/auth/session
POST /api/web/auth/reset-password
POST /api/web/auth/reset-password/confirm
POST /api/web/auth/first-login
```

### Webhook endpointy (z intranetu)

```
POST /api/web/webhooks/order-status
POST /api/web/webhooks/new-invoice
POST /api/web/webhooks/service-update
POST /api/web/webhooks/claim-update
```

Auth: `X-API-Key: ${WEBHOOK_SECRET}` header.

### Revalidation

```
POST /api/web/revalidate
Header: X-Revalidate-Token: ${REVALIDATE_TOKEN}
Body: { paths: string[] } | { tags: string[] }
```

---

## 6. Autentizace portálu

### NextAuth v5 (beta.30)

**Provider**: Credentials (email + heslo)
**Strategie**: JWT

**Session struktura**:
```typescript
{
  user: {
    id: string         // UUID
    email: string
    companyId: string  // UUID → intranet.companies
    role: string       // "portal_user" | "admin"
    firstName: string
    lastName: string
  }
}
```

### Invite flow (první přihlášení)

1. Admin vytvoří uživatele: `POST /api/web/admin/portal-users`
2. Systém odešle email s `inviteToken` + URL: `/portal/prvni-prihlaseni/[token]`
3. Uživatel nastaví heslo (bcrypt hash)
4. Aktivace: `isActive = true`
5. Uživatel se může přihlásit

### Reset hesla

1. `POST /api/web/auth/reset-password` → email s tokenem
2. `/portal/reset-hesla/[token]` → formulář
3. `POST /api/web/auth/reset-password/confirm` → update passwordHash
4. Token zneplatněn

### Izolace dat

Každý portal_user má `companyId` (FK → intranet.companies). Všechny queries filtrují:
```typescript
where(eq(table.companyId, session.user.companyId))
```

Zákazník vidí pouze data své firmy.

---

## 7. Email systém

### Resend + React Email

**FROM**: `Dlouhy Technology <noreply@dlouhy-technology.cz>`

### Šablony

| Šablona | Účel | Trigger |
|---------|------|---------|
| `inquiry-confirmation.tsx` | Potvrzení poptávky | Veřejný formulář |
| `claim-confirmation.tsx` | Potvrzení reklamace | Veřejný formulář |
| `service-confirmation.tsx` | Potvrzení servisní poptávky | Veřejný formulář |
| `contact-confirmation.tsx` | Potvrzení kontaktu | Veřejný formulář |
| `portal-invite.tsx` | Pozvánka do portálu | Admin invite |
| `password-reset.tsx` | Reset hesla | Auth flow |
| `order-status-notification.tsx` | Změna stavu objednávky | Webhook z intranetu |
| `invoice-notification.tsx` | Nová faktura | Webhook z intranetu |
| `service-update-notification.tsx` | Update servisu | Webhook z intranetu |
| `claim-update-notification.tsx` | Update reklamace | Webhook z intranetu |
| `portal-claim-confirmation.tsx` | Potvrzení portálové reklamace | Portálový formulář |
| `portal-service-confirmation.tsx` | Potvrzení portálového servisu | Portálový formulář |

### Použití

```typescript
import { sendEmail } from "@/lib/email/send"
import { SomeTemplate } from "@/lib/email/templates/some-template"

await sendEmail({
  to: "user@example.com",
  subject: "Subject line",
  react: SomeTemplate({ prop1, prop2 })
})
```

---

## 8. File structure

```
src/
├── app/
│   ├── (web)/                           # Veřejný web
│   │   ├── page.tsx                     # Homepage
│   │   ├── o-nas/, produkty/, servis/, reference/, novinky/
│   │   ├── ke-stazeni/, kontakt/, poptavka/, reklamace/
│   │   └── podminky/, gdpr/, dekujeme/
│   ├── (portal)/                        # Zákaznický portál
│   │   └── portal/
│   │       ├── login/, reset-hesla/, prvni-prihlaseni/
│   │       ├── dashboard/, objednavky/, faktury/
│   │       ├── servis/, reklamace/, dokumenty/, profil/
│   ├── (payload)/admin/                 # CMS admin
│   └── api/
│       ├── auth/[...nextauth]/
│       └── web/
│           ├── products/, categories/, references/, articles/
│           ├── downloads/, search/
│           ├── inquiry/, claim/, contact/, service-inquiry/
│           ├── portal/ (dashboard, orders, invoices, ...)
│           ├── admin/ (leads, portal-users)
│           ├── webhooks/ (order-status, new-invoice, ...)
│           └── revalidate/
├── components/
│   ├── ui/                              # Base components
│   ├── layout/                          # Header, Footer, Sidebar
│   ├── products/                        # ProductCard, Grid, Filters
│   ├── forms/                           # InquiryForm, ClaimForm, ...
│   ├── portal/                          # KPICards, Timeline, ...
│   └── shared/                          # Hero, CTA, ...
├── lib/
│   ├── db/
│   │   ├── schema/                      # Web-owned tables
│   │   └── schema/intranet/             # Read-only intranet tables
│   ├── auth.ts                          # NextAuth v5 config
│   ├── intranet-client.ts               # HTTP client pro intranet API
│   ├── email/
│   │   ├── client.ts                    # Resend client
│   │   └── templates/                   # React Email šablony
│   ├── portal/
│   │   ├── queries.ts                   # Intranet data fetching
│   │   ├── notifications.ts             # Notification CRUD
│   │   └── get-session.ts               # Auth helper
│   └── validations/                     # Zod schemas
├── payload/
│   ├── collections/                     # Products, Categories, ...
│   └── globals/                         # Homepage, SiteSettings
└── drizzle/                             # Migrace
```

---

## 9. Env proměnné

```env
# Database
DATABASE_URL=postgresql://dt:password@localhost:5432/dt_intranet

# NextAuth v5
AUTH_SECRET=<random-secret>
AUTH_URL=https://dlouhy-technology.cz

# Email
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

# Webhooks
WEBHOOK_SECRET=xxx

# ISR Revalidation
REVALIDATE_TOKEN=xxx

# Payload CMS
PAYLOAD_SECRET=xxx

# Mock mode (portál bez intranetu)
PORTAL_MOCK=false
```
