# DT Intranet — Technická specifikace

> Interní CRM/ERP systém pro Dlouhy Technology s.r.o.
> Verze dokumentu: 2026-03-02

## 1. Přehled systému

**Účel**: Interní systém pro řízení obchodu, servisu, skladu a fakturace. Pokrývá celý lifecycle zakázky od leadu po doručení.

### Stack

| Komponenta | Verze | Poznámka |
|---|---|---|
| Framework | Next.js 15 | App Router, Turbopack dev |
| Runtime | Node.js 22 | Alpine Docker image |
| ORM | Drizzle ORM 0.39+ | TypeScript-first, PostgreSQL driver |
| Database | PostgreSQL 16 | Alpine, sdílená s dlouhy-web |
| Styling | Tailwind CSS 4 | + CVA + clsx + tailwind-merge |
| Auth | NextAuth v4 | JWT sessions, 8h expiry |
| Email | Nodemailer 8.0.1 | SMTP, HTML templates |
| Validace | Zod 4 | Server + client |
| Formuláře | React Hook Form | Client-side state |
| Testy | Vitest 4.0 | Constants, pipeline, RBAC |
| Package manager | pnpm 10.30 | — |

### Deployment

- **Docker**: 3-stage build, `output: "standalone"`
- **Reverse proxy**: Traefik v3.3 + Let's Encrypt (auto SSL)
- **Doména**: `intranet.dlouhytechnology.com`
- **Port**: 3000 (dev), Docker container v produkci
- **Upload storage**: Volume mount `/app/uploads`
- **CI/CD**: GitHub Actions

---

## 2. Architektura

### App Router struktura

```
src/app/
├── (dashboard)/              # Chráněné routes (middleware)
│   ├── page.tsx              # Dashboard (role-based stats)
│   ├── pipeline/             # Kanban pipeline
│   ├── firmy/                # Companies CRUD
│   ├── nabidky/              # Offers CRUD
│   ├── objednavky/           # Orders CRUD
│   ├── faktury/              # Invoices CRUD
│   ├── servis/               # Service requests CRUD
│   ├── reklamace/            # Claims CRUD
│   ├── sklad/                # Spare parts CRUD
│   ├── ukoly/                # Tasks CRUD
│   ├── akce/                 # Business cases CRUD
│   ├── verejne-zakazky/      # Public tenders
│   ├── nastaveni/            # Settings (future)
│   └── reporty/              # Reports (future)
├── login/                    # Login page
└── api/
    ├── auth/[...nextauth]/   # NextAuth endpoints
    └── v1/                   # REST API
```

Každý modul má standardní CRUD strukturu:
- `page.tsx` — list
- `[id]/page.tsx` — detail
- `[id]/upravit/page.tsx` — edit
- `nova/page.tsx` nebo `novy/page.tsx` — create

### Middleware

Chrání všechny dashboard routes. Povoluje bez autentizace:
- `/login`
- `/api/auth/*` — NextAuth
- `/api/v1/cron/*` — cron joby (auth přes `CRON_SECRET`)
- `/manual/*`, `_next/static`, `_next/image`, `favicon.ico`

Neautentizované požadavky → redirect na `/login`.

### API vrstva

Všechny endpointy pod `/api/v1/`. Standardní vzor:
1. Auth check (`requirePermission` nebo `requireAuth`)
2. Zod validace request body
3. Drizzle query s `org_id` filtrací
4. JSON response

---

## 3. Moduly

### 3.1 Pipeline (Kanban obchodních akcí)

**Tabulka**: `business_cases`

Řízení lifecycle zakázky od leadu po dokončení. Kanban board seskupený podle fáze.

**State machine** (PIPELINE_TRANSITIONS):
```
lead → inquiry → offer → negotiation → order → realization → completed
                                                             ↘ lost → (reopen to lead)
```

**Klíčová pole**:
- `status` — pipeline fáze (enum)
- `company_id` — navázaná firma
- `assigned_to` — zodpovědný obchodník
- `source` — `"web"` | `"phone"` | `"vz_monitor"` | `"referral"`

**Notifikace**: `pipeline_change` při změně stavu.

### 3.2 Firmy / CRM

**Tabulka**: `companies`

Adresář zákazníků a dodavatelů. Polymorfní JSONB sloupce pro flexibilní strukturu.

**Klíčová pole**:
- `addresses` (JSONB) — `{ street, city, zip, country, type: "billing"|"shipping" }[]`
- `contacts` (JSONB) — `{ name, email?, phone?, role?, isPrimary? }[]`
- `tags` (JSONB) — `string[]` pro custom labeling
- Full-text search přes name, ICO, address

### 3.3 Nabídky (Offers)

**Tabulka**: `offers`

Cenové nabídky s automatickým follow-up systémem a expirací.

**State machine**:
```
draft → sent → negotiating → won | lost | expired
```

**Klíčová pole**:
- `amount` (integer, haléře) + `currency`
- `type` — `"samson"` | `"schroedahl"` | `"elco"` | `"custom"`
- `follow_up_at` — trigger pro cron S4-02
- `valid_until` — trigger pro cron S4-03
- `lost_reason` — `"price"` | `"deadline"` | `"competition"` | `"other"` + `lost_note`

**Automatizace**:
- Cron S4-02: Follow-up reminder pokud `follow_up_at <= now`
- Cron S4-03: Auto-expire pokud `valid_until < today`

### 3.4 Objednávky (Orders)

**Tabulka**: `orders`

Odběratelské a dodavatelské objednávky s timeline.

**State machine**:
```
ordered → confirmed → shipped → delivered | cancelled
```

**Klíčová pole**:
- `type` — `"customer"` | `"supplier"`
- `amount` (haléře) + `currency`
- Timeline: `ordered_at`, `confirmed_at`, `shipped_at`, `delivery_date`, `delivered_at`
- Vazby: `case_id`, `company_id`, `offer_id`

### 3.5 Faktury (Invoices)

**Tabulka**: `invoices`

Proforma a daňové faktury s automatickým sledováním splatnosti.

**State machine**:
```
draft → sent → overdue | paid | cancelled
```

**Klíčová pole**:
- `type` — `"proforma"` | `"invoice"`
- `amount` (haléře) + `currency`
- `issue_date`, `due_date`, `sent_at`, `paid_at`
- `flexi_id` — reference do Pohoda mServer

**Automatizace**:
- Cron S4-05: Auto-update `sent` → `overdue` po splatnosti

### 3.6 Servis (Service Requests)

**Tabulka**: `service_requests`

Servisní požadavky s přiřazením technika a SLA sledováním.

**State machine**:
```
new → assigned → in_progress → waiting_parts | completed | cancelled
```

**Klíčová pole**:
- `priority` — `"critical"` | `"high"` | `"normal"` | `"low"`
- `technician_id` — přiřazený technik
- `sla_deadline` — deadline pro vyřízení
- `scheduled_date`, `completed_at`

**Automatizace**:
- Cron S4-04: SLA warning pokud `sla_deadline <= now + 24h`

### 3.7 Reklamace (Claims)

**Tabulka**: `claims`

Reklamační řízení zákazník → dodavatel s SLA.

**State machine**:
```
received → evaluating → sent_to_supplier | resolved | rejected
```

**Klíčová pole**:
- `sla_deadline`, `supplier_sent_at`, `resolved_at`
- Vazba na `company_id` + volitelně `case_id`

**Automatizace**:
- Cron S4-04: SLA warning (sdílený s service requests)

### 3.8 Sklad (Spare Parts)

**Tabulka**: `spare_parts`

Skladové zásoby náhradních dílů s reorder alertem.

**Klíčová pole**:
- `sku` — katalogové číslo
- `stock_qty` — aktuální množství
- `min_qty` — minimální hladina (reorder threshold)
- `price` (haléře) + `currency`
- `location` — fyzické umístění ve skladu
- `last_used` — timestamp posledního použití

**Automatizace**:
- Cron S4-06: Low stock alert pokud `stock_qty <= min_qty`

### 3.9 Úkoly (Tasks)

**Tabulka**: `tasks`

Polymorfní úkoly navázané na libovolnou entitu.

**State machine**:
```
open → in_progress → done | cancelled
```

**Klíčová pole**:
- `assignee_id` — přiřazený uživatel
- `priority` — `"high"` | `"normal"` | `"low"`
- `due_date`, `meeting_date`
- Polymorfní vazba: `related_type` + `related_id` + `related_title`
  - `related_type`: `"offer"` | `"order"` | `"invoice"` | `"case"` | `"service_request"` | `"claim"`

### 3.10 Veřejné zakázky (Public Tenders)

**Tabulka**: `public_tenders`

Monitoring veřejných zakázek s AI hodnocením relevance.

**State machine**:
```
draft → monitoring → bidding → submitted → won | lost | expired
```

**Klíčová pole**:
- `evidence_number` (UNIQUE) — evidenční číslo zakázky
- `ai_score` (0–100) — skóre relevance
- `ai_rationale` — AI vyhodnocení
- `contracting_authority` — zadavatel
- `estimated_value` (haléře) + `currency`
- `submission_deadline`, `source_url`

**Import API** (`POST /api/v1/public-tenders/import`):
- Auth přes `X-API-Key` header
- Upsert podle `evidence_number`
- Podporuje jednotlivý objekt i pole

---

## 4. DB schéma

### Přehled tabulek (16)

| # | Tabulka | Účel | Klíčové vazby |
|---|---------|------|--------------|
| 1 | `organizations` | Multi-tenant root | — |
| 2 | `users` | Uživatelé systému | → organizations |
| 3 | `companies` | Firmy (zákazníci/dodavatelé) | → organizations |
| 4 | `business_cases` | Pipeline/obchodní případy | → companies, → users |
| 5 | `offers` | Nabídky | → business_cases, → companies |
| 6 | `orders` | Objednávky | → business_cases, → companies, → offers |
| 7 | `invoices` | Faktury | → companies, → orders, → business_cases |
| 8 | `service_requests` | Servisní požadavky | → companies, → users (technician) |
| 9 | `claims` | Reklamace | → companies, → business_cases |
| 10 | `tasks` | Úkoly | → users (assignee), polymorfní vazba |
| 11 | `spare_parts` | Sklad | → organizations |
| 12 | `public_tenders` | Veřejné zakázky | → users (assigned) |
| 13 | `notifications` | Notifikace | → users (recipient) |
| 14 | `attachments` | Přílohy | Polymorfní (entity_type + entity_id) |
| 15 | `audit_log` | Audit trail | → users |

### Konvence

- **Monetary values**: INTEGER v haléřích (1 250 000 = 12 500,00 CZK). Formátování: `formatAmount(amount, currency)`
- **UUID**: Defaultní `defaultRandom()` (v7 preferred)
- **Soft delete**: `deleted_at` TIMESTAMP na transačních tabulkách
- **Audit trail**: `created_by`, `updated_by`, `created_at`, `updated_at` na všech core tabulkách
- **Multi-tenancy**: `org_id` (UUID, FK → organizations) na každé tabulce
- **Enums**: PostgreSQL custom types pro statusy a role

### Detailní schéma — organizations

```sql
id          UUID PK DEFAULT random
name        VARCHAR(255) NOT NULL
country     VARCHAR(2) NOT NULL         -- CZ, SK, GE
ico         VARCHAR(20)
dic         VARCHAR(20)
flexi_config VARCHAR(500)               -- ABRA Flexi JSON
is_active   BOOLEAN DEFAULT true
created_at  TIMESTAMPTZ DEFAULT now()
updated_at  TIMESTAMPTZ DEFAULT now()
```

### Detailní schéma — users

```sql
id            UUID PK DEFAULT random
org_id        UUID FK → organizations NOT NULL
email         VARCHAR(255) UNIQUE NOT NULL
name          VARCHAR(255) NOT NULL
password_hash VARCHAR(255) NOT NULL      -- bcryptjs
role          ENUM NOT NULL DEFAULT 'viewer'
              -- manager | sales | technician | office | viewer
is_active     BOOLEAN DEFAULT true
created_at    TIMESTAMPTZ DEFAULT now()
updated_at    TIMESTAMPTZ DEFAULT now()
```

### Detailní schéma — companies

```sql
id          UUID PK DEFAULT random
org_id      UUID FK NOT NULL
name        VARCHAR(500) NOT NULL
ico         VARCHAR(20)
dic         VARCHAR(20)
addresses   JSONB DEFAULT []   -- { street, city, zip, country, type }[]
contacts    JSONB DEFAULT []   -- { name, email?, phone?, role?, isPrimary? }[]
tags        JSONB DEFAULT []   -- string[]
note        TEXT
created_by  UUID
updated_by  UUID
created_at  TIMESTAMPTZ DEFAULT now()
updated_at  TIMESTAMPTZ DEFAULT now()
deleted_at  TIMESTAMPTZ                -- soft delete
```

### Detailní schéma — business_cases

```sql
id          UUID PK DEFAULT random
org_id      UUID FK NOT NULL
company_id  UUID FK → companies NOT NULL
title       VARCHAR(500) NOT NULL
description TEXT
status      ENUM NOT NULL DEFAULT 'lead'
            -- lead | inquiry | offer | negotiation | order | realization | completed | lost
assigned_to UUID FK → users
source      VARCHAR(100)                -- web | phone | vz_monitor | referral
created_by  UUID
updated_by  UUID
created_at  TIMESTAMPTZ DEFAULT now()
updated_at  TIMESTAMPTZ DEFAULT now()
deleted_at  TIMESTAMPTZ
```

### Detailní schéma — offers

```sql
id            UUID PK DEFAULT random
org_id        UUID FK NOT NULL
case_id       UUID FK → business_cases NOT NULL
company_id    UUID FK → companies NOT NULL
offer_number  VARCHAR(50) NOT NULL
title         VARCHAR(500) NOT NULL
type          ENUM DEFAULT 'custom'     -- samson | schroedahl | elco | custom
amount        INTEGER DEFAULT 0         -- haléře
currency      VARCHAR(3) DEFAULT 'CZK'
status        ENUM NOT NULL DEFAULT 'draft'
              -- draft | sent | negotiating | won | lost | expired
lost_reason   ENUM                      -- price | deadline | competition | other
lost_note     TEXT
sent_at       TIMESTAMPTZ
follow_up_at  TIMESTAMPTZ               -- auto-reminder trigger
valid_until   DATE                       -- expiry date
items         TEXT                        -- JSON string of line items
note          TEXT
created_by    UUID
updated_by    UUID
created_at    TIMESTAMPTZ DEFAULT now()
updated_at    TIMESTAMPTZ DEFAULT now()
deleted_at    TIMESTAMPTZ
```

### Detailní schéma — orders

```sql
id            UUID PK DEFAULT random
org_id        UUID FK NOT NULL
case_id       UUID FK → business_cases NOT NULL
company_id    UUID FK → companies NOT NULL
offer_id      UUID FK → offers
order_number  VARCHAR(50) NOT NULL
title         VARCHAR(500) NOT NULL
type          ENUM NOT NULL DEFAULT 'customer'  -- customer | supplier
amount        INTEGER DEFAULT 0                 -- haléře
currency      VARCHAR(3) DEFAULT 'CZK'
status        ENUM NOT NULL DEFAULT 'ordered'
              -- ordered | confirmed | shipped | delivered | cancelled
ordered_at    TIMESTAMPTZ DEFAULT now()
confirmed_at  TIMESTAMPTZ
shipped_at    TIMESTAMPTZ
delivery_date DATE
delivered_at  TIMESTAMPTZ
note          TEXT
created_by    UUID
updated_by    UUID
created_at    TIMESTAMPTZ DEFAULT now()
updated_at    TIMESTAMPTZ DEFAULT now()
deleted_at    TIMESTAMPTZ
```

### Detailní schéma — invoices

```sql
id              UUID PK DEFAULT random
org_id          UUID FK NOT NULL
case_id         UUID FK → business_cases
company_id      UUID FK → companies NOT NULL
order_id        UUID FK → orders
invoice_number  VARCHAR(50) NOT NULL
title           VARCHAR(500) NOT NULL
type            ENUM NOT NULL DEFAULT 'invoice'  -- proforma | invoice
amount          INTEGER DEFAULT 0                -- haléře
currency        VARCHAR(3) DEFAULT 'CZK'
status          ENUM NOT NULL DEFAULT 'draft'
                -- draft | sent | overdue | paid | cancelled
issue_date      DATE NOT NULL
due_date        DATE NOT NULL
sent_at         TIMESTAMPTZ
paid_at         TIMESTAMPTZ
note            TEXT
flexi_id        VARCHAR(100)                     -- Pohoda mServer reference
created_by      UUID
updated_by      UUID
created_at      TIMESTAMPTZ DEFAULT now()
updated_at      TIMESTAMPTZ DEFAULT now()
deleted_at      TIMESTAMPTZ
```

### Detailní schéma — service_requests

```sql
id              UUID PK DEFAULT random
org_id          UUID FK NOT NULL
company_id      UUID FK → companies NOT NULL
title           VARCHAR(500) NOT NULL
description     TEXT
priority        ENUM NOT NULL DEFAULT 'normal'
                -- critical | high | normal | low
status          ENUM NOT NULL DEFAULT 'new'
                -- new | assigned | in_progress | waiting_parts | completed | cancelled
technician_id   UUID FK → users
sla_deadline    TIMESTAMPTZ
scheduled_date  DATE
completed_at    TIMESTAMPTZ
created_by      UUID
updated_by      UUID
created_at      TIMESTAMPTZ DEFAULT now()
updated_at      TIMESTAMPTZ DEFAULT now()
deleted_at      TIMESTAMPTZ
```

### Detailní schéma — claims

```sql
id              UUID PK DEFAULT random
org_id          UUID FK NOT NULL
company_id      UUID FK → companies NOT NULL
case_id         UUID FK → business_cases
title           VARCHAR(500) NOT NULL
description     TEXT
status          ENUM NOT NULL DEFAULT 'received'
                -- received | evaluating | sent_to_supplier | resolved | rejected
sla_deadline    TIMESTAMPTZ
supplier_sent_at TIMESTAMPTZ
resolved_at     TIMESTAMPTZ
created_by      UUID
updated_by      UUID
created_at      TIMESTAMPTZ DEFAULT now()
updated_at      TIMESTAMPTZ DEFAULT now()
deleted_at      TIMESTAMPTZ
```

### Detailní schéma — tasks

```sql
id            UUID PK DEFAULT random
org_id        UUID FK NOT NULL
title         VARCHAR(500) NOT NULL
description   TEXT
assignee_id   UUID FK → users
status        ENUM NOT NULL DEFAULT 'open'
              -- open | in_progress | done | cancelled
priority      ENUM NOT NULL DEFAULT 'normal'
              -- high | normal | low
due_date      DATE
related_type  VARCHAR(50)        -- offer | order | invoice | case | service_request | claim
related_id    UUID               -- polymorfní FK
related_title VARCHAR(500)       -- cached title
meeting_date  DATE
created_by    UUID
updated_by    UUID
created_at    TIMESTAMPTZ DEFAULT now()
updated_at    TIMESTAMPTZ DEFAULT now()
deleted_at    TIMESTAMPTZ
```

### Detailní schéma — spare_parts

```sql
id          UUID PK DEFAULT random
org_id      UUID FK NOT NULL
name        VARCHAR(500) NOT NULL
sku         VARCHAR(100) NOT NULL
stock_qty   INTEGER DEFAULT 0
min_qty     INTEGER DEFAULT 0
location    VARCHAR(255)
last_used   TIMESTAMPTZ
price       INTEGER DEFAULT 0      -- haléře
currency    VARCHAR(3) DEFAULT 'CZK'
created_at  TIMESTAMPTZ DEFAULT now()
updated_at  TIMESTAMPTZ DEFAULT now()
deleted_at  TIMESTAMPTZ
```

### Detailní schéma — public_tenders

```sql
id                    UUID PK DEFAULT random
org_id                UUID FK NOT NULL
evidence_number       VARCHAR(255) UNIQUE
title                 VARCHAR(500) NOT NULL
description           TEXT
contracting_authority VARCHAR(500)
estimated_value       INTEGER          -- haléře
currency              VARCHAR(3) DEFAULT 'CZK'
status                ENUM NOT NULL DEFAULT 'draft'
                      -- draft | monitoring | bidding | submitted | won | lost | expired
ai_score              INTEGER          -- 0–100
ai_rationale          TEXT
submission_deadline   TIMESTAMPTZ
published_at          TIMESTAMPTZ
assigned_to           UUID FK → users
note                  TEXT
source_url            VARCHAR(2000)
created_by            UUID
updated_by            UUID
created_at            TIMESTAMPTZ DEFAULT now()
updated_at            TIMESTAMPTZ DEFAULT now()
deleted_at            TIMESTAMPTZ
```

### Detailní schéma — notifications

```sql
id          UUID PK DEFAULT random
org_id      UUID FK NOT NULL
user_id     UUID NOT NULL
type        ENUM NOT NULL
            -- follow_up | offer_expiry | invoice_overdue | sla_warning | low_stock
            -- pipeline_change | info | record_created | status_changed | assignment
title       VARCHAR(500) NOT NULL
message     TEXT
link        VARCHAR(500)         -- app link (/nabidky/uuid)
read        BOOLEAN DEFAULT false
created_at  TIMESTAMPTZ DEFAULT now()
```

### Detailní schéma — attachments

```sql
id            UUID PK DEFAULT random
org_id        UUID FK NOT NULL
entity_type   VARCHAR(50) NOT NULL  -- offer | order | invoice | case | service_request | claim | company
entity_id     UUID NOT NULL         -- polymorfní FK
filename      VARCHAR(500) NOT NULL -- stored filename (hash)
original_name VARCHAR(500) NOT NULL -- user-friendly name
mime_type     VARCHAR(100) NOT NULL
size          INTEGER NOT NULL      -- bytes
uploaded_by   UUID
created_at    TIMESTAMPTZ DEFAULT now()
```

### Detailní schéma — audit_log

```sql
id          UUID PK DEFAULT random
user_id     UUID
entity_type VARCHAR(50) NOT NULL
entity_id   UUID NOT NULL
action      VARCHAR(20) NOT NULL   -- create | update | delete | status_change
diff_json   JSONB                  -- { field: { old: x, new: y } }
created_at  TIMESTAMPTZ DEFAULT now()
```

---

## 5. API reference

### Autentizace

Všechny `/api/v1/*` endpointy vyžadují platnou NextAuth JWT session (cookie).

Výjimky:
- `GET /api/v1/health` — bez autentizace
- `POST /api/v1/public-tenders/import` — `X-API-Key` header
- `POST /api/v1/cron/*` — `Authorization: Bearer {CRON_SECRET}`

### CRUD endpointy (standardní vzor)

Každý CRUD modul má:
```
GET    /api/v1/{resource}         — list (paginated, filterable)
POST   /api/v1/{resource}         — create
GET    /api/v1/{resource}/:id     — detail
PATCH  /api/v1/{resource}/:id     — update
DELETE /api/v1/{resource}/:id     — soft delete
```

| Resource | Filtry | Řazení |
|----------|--------|--------|
| `/companies` | `q`, `tag`, `limit`, `offset` | name |
| `/cases` | `status`, `pipeline_stage`, `limit`, `offset` | created_at desc |
| `/offers` | `status`, `company_id`, `sent_before`, `sort`, `fields`, `limit`, `offset` | custom |
| `/orders` | `status`, `type`, `limit`, `offset` | created_at desc |
| `/invoices` | `status`, `type`, `due_before`, `limit`, `offset` | created_at desc |
| `/service-requests` | `status`, `priority`, `technician_id`, `limit`, `offset` | created_at desc |
| `/claims` | `status`, `limit`, `offset` | created_at desc |
| `/tasks` | `status`, `assignee_id`, `limit`, `offset` | due_date asc |
| `/spare-parts` | `min_qty` (bool: low stock), `limit`, `offset` | name |
| `/attachments` | `entity_type`, `entity_id` | created_at desc |

### Speciální endpointy

```
GET    /api/v1/health                    — health check (no auth)
GET    /api/v1/search?q=QUERY            — full-text search (companies, offers, cases, orders, invoices, tenders)
GET    /api/v1/export?entity=X&format=csv — CSV export
```

### Public tenders import

```
POST   /api/v1/public-tenders/import
Header: X-API-Key: {API_IMPORT_KEY}
Body:   { evidence_number, title, ... } | array
Return: { imported, errors, results: [{ evidence_number, action, id }] }
```

### Notifikace

```
GET    /api/v1/notifications?limit=20&offset=0    — list (user's only)
PATCH  /api/v1/notifications                       — bulk action
       Body: { notification_ids: uuid[], action: "mark_read"|"mark_unread"|"delete" }
GET    /api/v1/notifications/subscribe             — SSE stream (real-time)
```

### Cron joby

Všechny `POST`, auth přes `Authorization: Bearer {CRON_SECRET}`:

| Endpoint | Kód | Popis | Frekvence |
|----------|-----|-------|-----------|
| `/cron/follow-ups` | S4-02 | Follow-up reminders pro nabídky | Denně |
| `/cron/offer-expiry` | S4-03 | Auto-expire prošlých nabídek | Denně |
| `/cron/sla-warning` | S4-04 | SLA deadline warnings | 2× denně |
| `/cron/invoice-overdue` | S4-05 | Auto-update faktur na "overdue" | Denně |
| `/cron/low-stock` | S4-06 | Alerty nízké zásoby | Denně |
| `/cron/daily-digest` | S4-09 | Denní email souhrn | 07:00 |

---

## 6. RBAC

### Role

| Role | Popis |
|------|-------|
| `manager` | Plný přístup ke všem modulům a akcím |
| `sales` | Obchod — firmy, pipeline, nabídky, objednávky, úkoly, veřejné zakázky |
| `office` | Administrativa — firmy (RW), nabídky (R), objednávky (RW), faktury (RW), úkoly |
| `technician` | Technik — firmy (R), servis (RW), reklamace (RW), sklad (RW), úkoly |
| `viewer` | Pouze čtení všech modulů |

### Matice oprávnění

| Modul | manager | sales | office | technician | viewer |
|-------|---------|-------|--------|------------|--------|
| Dashboard | RWD | R | R | R | R |
| Pipeline | RWD | RW | — | — | R |
| Nabídky | RWD | RW | R | — | R |
| Objednávky | RWD | RW | RW | — | R |
| Faktury | RWD | — | RW | — | R |
| Firmy | RWD | RW | RW | R | R |
| Servis | RWD | — | — | RW | R |
| Sklad | RWD | — | — | RW | R |
| Reklamace | RWD | — | — | RW | R |
| Úkoly | RWD | RW | RW | RW | R |
| Veřejné zakázky | RWD | RW | — | — | R |

*R = read, W = write, D = delete*

### Enforcement points

1. **Middleware** — chrání dashboard routes
2. **API routes** — `requirePermission(resource, action)` → 401/403
3. **Server components** — `requireModuleAccess(pathname)` → redirect
4. **Sidebar navigace** — `getNavigationForRole(role)` → filtrované menu

---

## 7. Notifikace

### In-app notifikace (SSE)

**Event Bus**: In-memory `EventEmitter` singleton v procesu.

**Flow**:
1. Akce v systému (create, update status, cron)
2. `createNotification()` → insert do DB + emit SSE event
3. `notifyOrgManagers()` → bulk notifikace pro managery + extra příjemce
4. Klient připojený přes `EventSource('/api/v1/notifications/subscribe')` dostane update

**SSE endpoint** (`GET /api/v1/notifications/subscribe`):
- Auth: JWT session
- Content-Type: `text/event-stream`
- Ping: každých 30s
- Event: `notification:${userId}`

### Typy notifikací

| Typ | Trigger | Příjemci |
|-----|---------|----------|
| `follow_up` | Cron S4-02 | Autor nabídky |
| `offer_expiry` | Cron S4-03 | Autor nabídky |
| `invoice_overdue` | Cron S4-05 | Office + manageři |
| `sla_warning` | Cron S4-04 | Technik + manageři |
| `low_stock` | Cron S4-06 | Technici + manageři |
| `pipeline_change` | Změna stavu case | Manageři |
| `record_created` | Vytvoření entity | Manageři |
| `status_changed` | Změna stavu entity | Manageři |
| `assignment` | Přiřazení úkolu/SR | Přiřazený + manageři |

### Email (Nodemailer)

- **SMTP konfigurace**: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- **Stub mode**: Pokud SMTP není nakonfigurováno, loguje do konzole
- **Šablony**: `followUpEmail()`, `slaWarningEmail()`, `invoiceOverdueEmail()`, `dailyDigestEmail()`
- **Branding**: HTML layout s DT styly

---

## 8. Autentizace

### NextAuth v4

**Provider**: Credentials (email + heslo)
- Hesla hashovaná bcryptjs
- Ověření: `bcryptjs.compare()`

**Strategie**: JWT
- Max age: **8 hodin**
- Refresh: automatický při page reload

**Session struktura**:
```typescript
{
  user: {
    id: string       // UUID
    email: string
    name: string
    role: UserRole   // manager | sales | office | technician | viewer
    orgId: string    // UUID organizace
  }
}
```

**Login page**: `/login`

### Multi-tenant izolace

Každý uživatel patří k jedné organizaci (`org_id`). Všechny DB queries implicitně filtrují:

```typescript
where(eq(table.org_id, session.user.orgId))
```

Uživatel vidí pouze data své organizace. Žádný cross-org přístup.

### Organizace

| Organizace | Země |
|------------|------|
| Dlouhy Technology s.r.o. | CZ |
| Dlouhy Technology s.k. | SK |

### Env proměnné

```
NEXTAUTH_URL=https://intranet.dlouhytechnology.com
NEXTAUTH_SECRET=<generated-secret>
DATABASE_URL=postgresql://dt:<password>@postgres:5432/dt_intranet
CRON_SECRET=<random-token>
SMTP_HOST=<smtp-server>
SMTP_PORT=587
SMTP_USER=<email>
SMTP_PASS=<password>
EMAIL_FROM=DT Intranet <noreply@dlouhytechnology.com>
```
