# Architektový report: Nový web Dlouhý Technology

> Autor: Software Architect | Datum: 2026-03-01
> Vstupy: Market Scanner, Tech Scout, UX Researcher

---

## 1. Executive Summary

Stavíme nový web a zákaznický portál pro Dlouhý Technology — výhradního distributora SAMSON (regulační ventily) pro ČR a SK, s produkty SCHROEDAHL/CIRCOR (recirkulační ventily) a ELCO (hořáky). Cílová skupina jsou B2B zákazníci z energetiky, teplárenství a chemie (inženýři, technologové, nákupčí). Stack: Next.js 15 + Tailwind CSS 4 + Payload CMS 3.0 + NextAuth v5 + sdílená PostgreSQL 16 s existujícím intranetem, hosting na Mac Studio přes Coolify (~$5/měsíc). Realizace ve 7 sprintech, cca 14–16 týdnů (1 senior dev + Claude Code). Konkurence v regionu má podprůměrné weby — DT bude s tímto řešením jednoznačně nejlepší v oboru.

---

## 2. Tech Stack

| Oblast          | Technologie                   | Verze           | Proč                                                                    |
| --------------- | ----------------------------- | --------------- | ----------------------------------------------------------------------- |
| Framework       | Next.js                       | 15 (App Router) | Stejný stack jako intranet, Server Components, Turbopack, ISR           |
| Styling         | Tailwind CSS                  | 4.2             | CSS-first konfigurace, container queries, Lightning CSS compiler        |
| CMS             | Payload CMS                   | 3.0             | Next.js plugin, MIT licence, $0 self-host, TypeScript-first, PostgreSQL |
| Auth            | NextAuth (Auth.js)            | v5              | Nulový vendor lock-in, sdílená DB s intranetem, $0, magic link + heslo  |
| ORM             | Drizzle ORM                   | latest          | Sdílené schéma s intranetem, type-safe, PostgreSQL native               |
| Databáze        | PostgreSQL                    | 16              | Sdílená instance s intranetem, 1 backup, nulová duplicita               |
| Email           | Resend                        | latest          | React Email templates, 3K/měsíc free, nativní Next.js SDK               |
| Animace         | Motion (Framer Motion)        | v11+            | 2.5x rychlejší než GSAP, React-native, state-based animace              |
| Obrázky         | Next.js Image + Cloudflare R2 | —               | $0 egress, WebP/AVIF automaticky, custom loader                         |
| Hosting         | Coolify na Mac Studio         | v4              | $0 hardware (již vlastníme), Docker orchestrace, Let's Encrypt SSL      |
| Package manager | pnpm                          | latest          | Konzistence s intranetem                                                |
| Validace        | Zod                           | latest          | Sdílená validace frontend + backend, TypeScript inference               |
| Formuláře       | React Hook Form               | latest          | Performant, integruje se se Zod                                         |

### Měsíční provozní náklady

| Položka                        | Cena             |
| ------------------------------ | ---------------- |
| Hosting (Mac Studio + Coolify) | $0               |
| Cloudflare R2 (obrázky)        | $1–5             |
| Resend email                   | $0 (free tier)   |
| Payload CMS                    | $0 (self-hosted) |
| Doména                         | ~$15/rok         |
| **Celkem**                     | **~$5/měsíc**    |

---

## 3. Datový model

### Konvence (shodné s intranetem)

- UUID primary keys (`defaultRandom()`)
- Soft delete: `deleted_at` timestamp
- Audit trail: `created_by`, `updated_by`, `created_at`, `updated_at`
- Částky v haléřích/centech (integer)
- Prefix webových tabulek: `web_` pro tabulky specifické pro web (odlišení od intranetových)

### Existující intranetové tabulky (NEOPISUJEME — jen reference)

| Tabulka            | Klíčové sloupce                                 | Použití z webu                 |
| ------------------ | ----------------------------------------------- | ------------------------------ |
| `organizations`    | id, name, country                               | Organizace CZ/SK               |
| `companies`        | id, org_id, name, ico, contacts                 | FK pro portal_users            |
| `business_cases`   | id, company_id, status, source                  | Poptávky z webu → source='web' |
| `orders`           | id, company_id, order_number, status, amount    | Portál: přehled objednávek     |
| `invoices`         | id, company_id, invoice_number, status, amount  | Portál: faktury ke stažení     |
| `service_requests` | id, company_id, priority, status, technician_id | Portál: servisní požadavky     |
| `claims`           | id, company_id, status, sla_deadline            | Portál: reklamace              |
| `attachments`      | id, entity_type, entity_id, filename            | Polymorfní přílohy             |
| `users`            | id, email, role                                 | DT zaměstnanci (admin webu)    |

---

### NOVÉ tabulky pro web

#### `categories`

| Sloupec        | Typ                     | Popis                                      |
| -------------- | ----------------------- | ------------------------------------------ |
| `id`           | UUID PK                 |                                            |
| `slug`         | VARCHAR(200) UNIQUE     | URL slug, např. "regulacni-ventily"        |
| `name`         | VARCHAR(300) NOT NULL   | Zobrazovaný název                          |
| `description`  | TEXT                    | Popis kategorie (HTML)                     |
| `image`        | VARCHAR(500)            | URL hlavního obrázku                       |
| `parent_id`    | UUID FK → categories.id | NULL = top-level kategorie                 |
| `manufacturer` | VARCHAR(50)             | SAMSON / SCHROEDAHL / CIRCOR / ELCO / null |
| `sort_order`   | INTEGER DEFAULT 0       | Řazení v menu                              |
| `is_active`    | BOOLEAN DEFAULT true    |                                            |
| `created_at`   | TIMESTAMPTZ             |                                            |
| `updated_at`   | TIMESTAMPTZ             |                                            |
| `deleted_at`   | TIMESTAMPTZ             | Soft delete                                |

**Vztahy:** self-reference (parent_id → categories.id), 1:N → products

---

#### `products`

| Sloupec             | Typ                              | Popis                                  |
| ------------------- | -------------------------------- | -------------------------------------- |
| `id`                | UUID PK                          |                                        |
| `category_id`       | UUID FK → categories.id NOT NULL | Kategorie produktu                     |
| `slug`              | VARCHAR(300) UNIQUE              | URL slug                               |
| `name`              | VARCHAR(500) NOT NULL            | Název produktu                         |
| `type_code`         | VARCHAR(100)                     | Typové označení, např. "3241-1"        |
| `manufacturer`      | VARCHAR(50) NOT NULL             | SAMSON / SCHROEDAHL / CIRCOR / ELCO    |
| `short_description` | VARCHAR(300)                     | Max 160 znaků pro SEO meta description |
| `long_description`  | TEXT                             | Detailní popis (HTML/rich text)        |
| `main_image`        | VARCHAR(500)                     | URL hlavní fotky                       |
| `gallery_images`    | JSONB                            | Array URL fotek galerie                |
| `is_active`         | BOOLEAN DEFAULT true             |                                        |
| `is_featured`       | BOOLEAN DEFAULT false            | Zobrazit na homepage                   |
| `sort_order`        | INTEGER DEFAULT 0                |                                        |
| `seo_title`         | VARCHAR(200)                     | Custom SEO title (null = name)         |
| `seo_description`   | VARCHAR(300)                     | Custom meta description                |
| `created_by`        | UUID                             |                                        |
| `updated_by`        | UUID                             |                                        |
| `created_at`        | TIMESTAMPTZ                      |                                        |
| `updated_at`        | TIMESTAMPTZ                      |                                        |
| `deleted_at`        | TIMESTAMPTZ                      |                                        |

**Vztahy:** N:1 → categories, 1:N → product_parameters, 1:N → product_documents, M:N → product_relations

---

#### `product_parameters`

| Sloupec      | Typ                            | Popis                                        |
| ------------ | ------------------------------ | -------------------------------------------- |
| `id`         | UUID PK                        |                                              |
| `product_id` | UUID FK → products.id NOT NULL |                                              |
| `name`       | VARCHAR(200) NOT NULL          | Název parametru, např. "Jmenovitý průměr DN" |
| `value`      | VARCHAR(500) NOT NULL          | Hodnota, např. "15–500"                      |
| `unit`       | VARCHAR(50)                    | Jednotka, např. "mm"                         |
| `sort_order` | INTEGER DEFAULT 0              | Pořadí zobrazení                             |

**Vztahy:** N:1 → products

---

#### `product_documents`

| Sloupec       | Typ                              | Popis                                                 |
| ------------- | -------------------------------- | ----------------------------------------------------- |
| `id`          | UUID PK                          |                                                       |
| `product_id`  | UUID FK → products.id NOT NULL   |                                                       |
| `name`        | VARCHAR(300) NOT NULL            | Název dokumentu                                       |
| `type`        | VARCHAR(50) NOT NULL             | datasheet / manual / certificate / drawing / brochure |
| `language`    | VARCHAR(5) NOT NULL DEFAULT 'cs' | cs / en / de / sk                                     |
| `file_url`    | VARCHAR(500) NOT NULL            | URL v Cloudflare R2                                   |
| `file_size`   | INTEGER                          | Velikost v bytech                                     |
| `uploaded_at` | TIMESTAMPTZ DEFAULT NOW()        |                                                       |

**Vztahy:** N:1 → products

---

#### `product_relations`

| Sloupec              | Typ                   | Popis                             |
| -------------------- | --------------------- | --------------------------------- |
| `product_id`         | UUID FK → products.id |                                   |
| `related_product_id` | UUID FK → products.id |                                   |
| `relation_type`      | VARCHAR(30) NOT NULL  | accessory / similar / replacement |

**PK:** (product_id, related_product_id)
**Vztahy:** M:N mezi products

---

#### `references` (case studies)

| Sloupec            | Typ                     | Popis                                                  |
| ------------------ | ----------------------- | ------------------------------------------------------ |
| `id`               | UUID PK                 |                                                        |
| `slug`             | VARCHAR(300) UNIQUE     |                                                        |
| `title`            | VARCHAR(500) NOT NULL   | Název projektu                                         |
| `customer_name`    | VARCHAR(300) NOT NULL   | Název zákazníka                                        |
| `customer_logo`    | VARCHAR(500)            | URL loga                                               |
| `industry`         | VARCHAR(50) NOT NULL    | teplarenstvi / energetika / chemie / prumysl / ostatni |
| `location_city`    | VARCHAR(200)            |                                                        |
| `location_country` | VARCHAR(2) DEFAULT 'CZ' | CZ / SK                                                |
| `year`             | INTEGER                 | Rok realizace                                          |
| `challenge`        | TEXT                    | Výchozí situace (HTML)                                 |
| `solution`         | TEXT                    | Řešení (HTML)                                          |
| `result`           | TEXT                    | Výsledek (HTML)                                        |
| `images`           | JSONB                   | Array URL fotek                                        |
| `is_published`     | BOOLEAN DEFAULT false   |                                                        |
| `is_featured`      | BOOLEAN DEFAULT false   | Na homepage                                            |
| `published_at`     | TIMESTAMPTZ             |                                                        |
| `created_by`       | UUID                    |                                                        |
| `updated_by`       | UUID                    |                                                        |
| `created_at`       | TIMESTAMPTZ             |                                                        |
| `updated_at`       | TIMESTAMPTZ             |                                                        |
| `deleted_at`       | TIMESTAMPTZ             |                                                        |

**Vztahy:** M:N → products (přes `reference_products` join tabulku)

---

#### `reference_products` (join tabulka)

| Sloupec        | Typ                     | Popis |
| -------------- | ----------------------- | ----- |
| `reference_id` | UUID FK → references.id |       |
| `product_id`   | UUID FK → products.id   |       |

**PK:** (reference_id, product_id)

---

#### `articles` (blog/novinky)

| Sloupec           | Typ                   | Popis                               |
| ----------------- | --------------------- | ----------------------------------- |
| `id`              | UUID PK               |                                     |
| `slug`            | VARCHAR(300) UNIQUE   |                                     |
| `title`           | VARCHAR(500) NOT NULL |                                     |
| `perex`           | VARCHAR(500)          | Krátký úvod (max 200 znaků)         |
| `content`         | TEXT NOT NULL         | Obsah článku (HTML)                 |
| `category`        | VARCHAR(50) NOT NULL  | novinka / technika / produkt / akce |
| `author_name`     | VARCHAR(200)          |                                     |
| `author_photo`    | VARCHAR(500)          |                                     |
| `thumbnail`       | VARCHAR(500)          | URL náhledového obrázku             |
| `is_published`    | BOOLEAN DEFAULT false |                                     |
| `published_at`    | TIMESTAMPTZ           |                                     |
| `seo_title`       | VARCHAR(200)          |                                     |
| `seo_description` | VARCHAR(300)          |                                     |
| `created_by`      | UUID                  |                                     |
| `updated_by`      | UUID                  |                                     |
| `created_at`      | TIMESTAMPTZ           |                                     |
| `updated_at`      | TIMESTAMPTZ           |                                     |
| `deleted_at`      | TIMESTAMPTZ           |                                     |

---

#### `downloads` (veřejné dokumenty)

| Sloupec        | Typ                     | Popis                                                    |
| -------------- | ----------------------- | -------------------------------------------------------- |
| `id`           | UUID PK                 |                                                          |
| `name`         | VARCHAR(300) NOT NULL   | Název dokumentu                                          |
| `description`  | TEXT                    |                                                          |
| `category`     | VARCHAR(50) NOT NULL    | katalog / certifikat / technicka-dokumentace / formulare |
| `manufacturer` | VARCHAR(50)             | SAMSON / SCHROEDAHL / ELCO / CIRCOR / DT / null          |
| `file_url`     | VARCHAR(500) NOT NULL   |                                                          |
| `file_size`    | INTEGER                 | v bytech                                                 |
| `language`     | VARCHAR(5) DEFAULT 'cs' | cs / en / de / sk                                        |
| `is_public`    | BOOLEAN DEFAULT true    | false = jen po přihlášení                                |
| `sort_order`   | INTEGER DEFAULT 0       |                                                          |
| `created_at`   | TIMESTAMPTZ             |                                                          |
| `updated_at`   | TIMESTAMPTZ             |                                                          |
| `deleted_at`   | TIMESTAMPTZ             |                                                          |

---

#### `portal_users` (zákaznické účty)

| Sloupec               | Typ                                      | Popis                                                       |
| --------------------- | ---------------------------------------- | ----------------------------------------------------------- |
| `id`                  | UUID PK                                  |                                                             |
| `email`               | VARCHAR(255) UNIQUE NOT NULL             | Přihlašovací email                                          |
| `password_hash`       | VARCHAR(255)                             | NULL pokud jen magic link                                   |
| `first_name`          | VARCHAR(200) NOT NULL                    |                                                             |
| `last_name`           | VARCHAR(200) NOT NULL                    |                                                             |
| `phone`               | VARCHAR(50)                              |                                                             |
| `job_title`           | VARCHAR(200)                             | Pozice ve firmě                                             |
| `company_id`          | UUID FK → intranet companies.id NOT NULL | Klíčová vazba na intranet                                   |
| `role`                | VARCHAR(30) DEFAULT 'portal_user'        | portal_admin / portal_user                                  |
| `is_active`           | BOOLEAN DEFAULT false                    | Aktivuje DT admin                                           |
| `email_notifications` | JSONB DEFAULT '{}'                       | Nastavení emailových notifikací (orders, invoices, service) |
| `last_login_at`       | TIMESTAMPTZ                              |                                                             |
| `invited_by`          | UUID                                     | DT zaměstnanec, který vytvořil účet                         |
| `invite_token`        | VARCHAR(255)                             | Pro první přihlášení                                        |
| `invite_expires_at`   | TIMESTAMPTZ                              |                                                             |
| `created_at`          | TIMESTAMPTZ                              |                                                             |
| `updated_at`          | TIMESTAMPTZ                              |                                                             |
| `deleted_at`          | TIMESTAMPTZ                              |                                                             |

**Vztahy:** N:1 → intranet companies (sdílená DB), 1:N → portal_notifications

---

#### `portal_notifications`

| Sloupec      | Typ                                | Popis                                                                           |
| ------------ | ---------------------------------- | ------------------------------------------------------------------------------- |
| `id`         | UUID PK                            |                                                                                 |
| `user_id`    | UUID FK → portal_users.id NOT NULL |                                                                                 |
| `type`       | VARCHAR(50) NOT NULL               | new_order / order_status / new_invoice / service_update / claim_update / system |
| `title`      | VARCHAR(300) NOT NULL              |                                                                                 |
| `body`       | TEXT                               |                                                                                 |
| `link_url`   | VARCHAR(500)                       | Odkaz v portálu                                                                 |
| `is_read`    | BOOLEAN DEFAULT false              |                                                                                 |
| `created_at` | TIMESTAMPTZ                        |                                                                                 |

**Vztahy:** N:1 → portal_users

---

#### `web_leads` (poptávky z webu)

| Sloupec              | Typ                            | Popis                                                |
| -------------------- | ------------------------------ | ---------------------------------------------------- |
| `id`                 | UUID PK                        |                                                      |
| `type`               | VARCHAR(30) NOT NULL           | inquiry / service / claim / contact                  |
| `status`             | VARCHAR(30) DEFAULT 'new'      | new / sent_to_intranet / failed / processed          |
| `intranet_case_id`   | UUID                           | FK → intranet business_cases.id (po odeslání)        |
| `company_name`       | VARCHAR(300) NOT NULL          |                                                      |
| `contact_name`       | VARCHAR(300) NOT NULL          |                                                      |
| `contact_email`      | VARCHAR(255) NOT NULL          |                                                      |
| `contact_phone`      | VARCHAR(50)                    |                                                      |
| `ico`                | VARCHAR(20)                    |                                                      |
| `product_id`         | UUID FK → products.id          | Pokud poptávka na konkrétní produkt                  |
| `subject`            | VARCHAR(500)                   | Předmět poptávky                                     |
| `message`            | TEXT NOT NULL                  |                                                      |
| `urgency`            | VARCHAR(30)                    | normal / urgent / critical                           |
| `preferred_date`     | DATE                           | Preferovaný termín (servis)                          |
| `location`           | VARCHAR(200)                   | Lokalita (servis)                                    |
| `desired_resolution` | VARCHAR(50)                    | repair / replacement / refund / discount (reklamace) |
| `metadata`           | JSONB DEFAULT '{}'             | Extra data dle typu formuláře                        |
| `source_url`         | VARCHAR(500)                   | Z které stránky přišel                               |
| `ip_address`         | VARCHAR(45)                    | Pro rate limiting                                    |
| `gdpr_consent`       | BOOLEAN NOT NULL DEFAULT false |                                                      |
| `newsletter_consent` | BOOLEAN DEFAULT false          |                                                      |
| `created_at`         | TIMESTAMPTZ                    |                                                      |
| `updated_at`         | TIMESTAMPTZ                    |                                                      |

**Vztahy:** N:1 → products (volitelně), 1:1 → intranet business_cases (po zpracování)

---

#### `web_page_content` (CMS statický obsah)

| Sloupec        | Typ                          | Popis                                                        |
| -------------- | ---------------------------- | ------------------------------------------------------------ |
| `id`           | UUID PK                      |                                                              |
| `page_key`     | VARCHAR(100) UNIQUE NOT NULL | Identifikátor stránky: homepage_hero, about_us, service_info |
| `title`        | VARCHAR(500)                 |                                                              |
| `content`      | TEXT                         | HTML obsah                                                   |
| `metadata`     | JSONB DEFAULT '{}'           | Strukturovaná data (CTA texty, čísla, ikony)                 |
| `locale`       | VARCHAR(5) DEFAULT 'cs'      | cs / sk / en                                                 |
| `published_at` | TIMESTAMPTZ                  |                                                              |
| `created_by`   | UUID                         |                                                              |
| `updated_by`   | UUID                         |                                                              |
| `created_at`   | TIMESTAMPTZ                  |                                                              |
| `updated_at`   | TIMESTAMPTZ                  |                                                              |

**Poznámka:** Tato tabulka je pro statický CMS obsah (hero texty, "O nás", atp.). Payload CMS ji spravuje přes admin panel. Alternativně Payload CMS vytvoří vlastní `payload_*` tabulky automaticky — v tom případě tuto tabulku nepoužívat a jít čistě přes Payload Globals.

---

### ER diagram (klíčové vztahy)

```
categories ─1:N─→ products ─1:N─→ product_parameters
                           ─1:N─→ product_documents
                           ─M:N─→ product_relations (self)
                           ─M:N─→ references (přes reference_products)

portal_users ──N:1──→ [intranet] companies
             ──1:N──→ portal_notifications

web_leads ──N:1──→ products (volitelně)
          ──1:1──→ [intranet] business_cases (po zpracování)

[intranet] orders     ← čte portál přes company_id
[intranet] invoices   ← čte portál přes company_id
[intranet] service_requests ← čte/píše portál přes company_id
[intranet] claims     ← čte/píše portál přes company_id
```

---

## 4. API Endpointy

Všechny webové API endpointy pod prefixem `/api/web/`. Intranetové endpointy (`/api/v1/*`) existují v dt-intranet a volají se interně (sdílená DB nebo HTTP).

### Veřejné (public)

| Metoda | URL                          | Popis                                                                  | Auth   |
| ------ | ---------------------------- | ---------------------------------------------------------------------- | ------ |
| GET    | `/api/web/products`          | Seznam produktů (filtry: category, manufacturer, medium, search, page) | public |
| GET    | `/api/web/products/[slug]`   | Detail produktu s parametry, dokumenty, relacemi                       | public |
| GET    | `/api/web/categories`        | Strom kategorií                                                        | public |
| GET    | `/api/web/references`        | Seznam referencí (filtry: industry, year, page)                        | public |
| GET    | `/api/web/references/[slug]` | Detail reference                                                       | public |
| GET    | `/api/web/articles`          | Seznam článků (filtry: category, page)                                 | public |
| GET    | `/api/web/articles/[slug]`   | Detail článku                                                          | public |
| GET    | `/api/web/downloads`         | Seznam dokumentů ke stažení (filtry: category, manufacturer)           | public |
| POST   | `/api/web/inquiry`           | Odeslání obecné poptávky                                               | public |
| POST   | `/api/web/service-inquiry`   | Odeslání poptávky servisu (veřejný formulář)                           | public |
| POST   | `/api/web/claim`             | Odeslání reklamace (veřejný formulář)                                  | public |
| POST   | `/api/web/contact`           | Odeslání kontaktního formuláře                                         | public |
| GET    | `/api/web/search`            | Full-text vyhledávání produktů                                         | public |

### Portál (portal — vyžaduje přihlášení zákaznickým účtem)

| Metoda | URL                                       | Popis                                                 | Auth   |
| ------ | ----------------------------------------- | ----------------------------------------------------- | ------ |
| GET    | `/api/web/portal/dashboard`               | Přehled: počty objednávek, faktur, servisů, reklamací | portal |
| GET    | `/api/web/portal/orders`                  | Seznam objednávek zákazníka (filtr: status, page)     | portal |
| GET    | `/api/web/portal/orders/[id]`             | Detail objednávky (položky, timeline, dokumenty)      | portal |
| GET    | `/api/web/portal/invoices`                | Seznam faktur (filtr: status, page)                   | portal |
| GET    | `/api/web/portal/invoices/[id]`           | Detail faktury + download PDF                         | portal |
| GET    | `/api/web/portal/invoices/[id]/pdf`       | Stažení faktury jako PDF                              | portal |
| GET    | `/api/web/portal/service-requests`        | Seznam servisních požadavků                           | portal |
| GET    | `/api/web/portal/service-requests/[id]`   | Detail servisního požadavku (timeline, technik)       | portal |
| POST   | `/api/web/portal/service-requests`        | Nový servisní požadavek                               | portal |
| GET    | `/api/web/portal/claims`                  | Seznam reklamací                                      | portal |
| GET    | `/api/web/portal/claims/[id]`             | Detail reklamace (stav, komunikace)                   | portal |
| POST   | `/api/web/portal/claims`                  | Nová reklamace (s vazbou na objednávku)               | portal |
| GET    | `/api/web/portal/documents`               | Dokumenty zákazníka (faktury, dodací listy, smlouvy)  | portal |
| GET    | `/api/web/portal/notifications`           | Seznam notifikací (badge count)                       | portal |
| PATCH  | `/api/web/portal/notifications/[id]`      | Označit notifikaci jako přečtenou                     | portal |
| GET    | `/api/web/portal/profile`                 | Profil uživatele a firmy                              | portal |
| PATCH  | `/api/web/portal/profile`                 | Aktualizace profilu                                   | portal |
| POST   | `/api/web/portal/profile/change-password` | Změna hesla                                           | portal |

### Auth

| Metoda | URL                                    | Popis                                                | Auth   |
| ------ | -------------------------------------- | ---------------------------------------------------- | ------ |
| POST   | `/api/auth/signin`                     | NextAuth — přihlášení (magic link / credentials)     | public |
| POST   | `/api/auth/signout`                    | NextAuth — odhlášení                                 | portal |
| GET    | `/api/auth/session`                    | NextAuth — session info                              | public |
| POST   | `/api/web/auth/reset-password`         | Požadavek na reset hesla                             | public |
| POST   | `/api/web/auth/reset-password/confirm` | Potvrzení resetu hesla (s tokenem)                   | public |
| POST   | `/api/web/auth/first-login`            | Nastavení hesla při prvním přihlášení (invite token) | public |

### Admin (DT zaměstnanci — Payload CMS)

| Metoda | URL                                | Popis                                                                 | Auth  |
| ------ | ---------------------------------- | --------------------------------------------------------------------- | ----- |
| \*     | `/admin/*`                         | Payload CMS admin panel (CRUD produkty, reference, články, downloads) | admin |
| GET    | `/api/web/admin/leads`             | Fronty poptávek z webu                                                | admin |
| PATCH  | `/api/web/admin/leads/[id]`        | Aktualizace stavu poptávky                                            | admin |
| POST   | `/api/web/admin/portal-users`      | Vytvoření zákaznického účtu (odeslání pozvánky)                       | admin |
| PATCH  | `/api/web/admin/portal-users/[id]` | Aktivace/deaktivace zákaznického účtu                                 | admin |
| GET    | `/api/web/admin/portal-users`      | Seznam zákaznických účtů                                              | admin |

### Webhooky (interní, z intranetu)

| Metoda | URL                                | Popis                                           | Auth      |
| ------ | ---------------------------------- | ----------------------------------------------- | --------- |
| POST   | `/api/web/webhooks/order-status`   | Změna stavu objednávky → notifikace zákazníkovi | X-API-Key |
| POST   | `/api/web/webhooks/new-invoice`    | Nová faktura → notifikace zákazníkovi           | X-API-Key |
| POST   | `/api/web/webhooks/service-update` | Update servisního požadavku → notifikace        | X-API-Key |
| POST   | `/api/web/webhooks/claim-update`   | Update reklamace → notifikace                   | X-API-Key |

### Revalidace (Payload CMS → ISR)

| Metoda | URL                   | Popis                                   | Auth               |
| ------ | --------------------- | --------------------------------------- | ------------------ |
| POST   | `/api/web/revalidate` | On-demand ISR revalidace po změně v CMS | X-Revalidate-Token |

---

## 5. Stránky / Obrazovky

### Veřejná část

| Route                          | Co zobrazuje                                                   | Rendering    | Klíčové komponenty                                                               |
| ------------------------------ | -------------------------------------------------------------- | ------------ | -------------------------------------------------------------------------------- |
| `/`                            | Homepage — hero, partneři, kategorie, reference, CTA, novinky  | ISR (86400s) | Hero, PartnerBar, CategoryCards, ReferenceCards, CTABlock, ArticleCards, Footer  |
| `/o-nas`                       | O firmě — historie, hodnoty, certifikáty, mapa provozoven      | SSG          | PageHeader, Timeline, CertBadges, MapEmbed                                       |
| `/produkty`                    | Filtrovatelný grid produktů (výrobce, kategorie, medium, DN)   | ISR (3600s)  | FilterSidebar, ProductGrid, ProductCard, Pagination                              |
| `/produkty/[kategorie]`        | Produkty v kategorii — filtrovaný grid                         | ISR (3600s)  | CategoryHeader, FilterSidebar, ProductGrid                                       |
| `/produkty/[kategorie]/[slug]` | Detail produktu — galerie, parametry, dokumenty, příslušenství | ISR (3600s)  | ProductHero, ImageGallery, SpecsTable, DocumentsTable, RelatedProducts, CTABlock |
| `/servis`                      | Servisní služby — popis, SLA, pokrytí, CTA                     | SSG          | ServiceHero, SLATable, CoverageMap, CTABlock                                     |
| `/servis/poptavka`             | Formulář poptávky servisu (veřejný)                            | SSR          | ServiceInquiryForm, FormSuccess                                                  |
| `/reference`                   | Grid referencí (filtr: odvětví, rok)                           | ISR (86400s) | ReferenceGrid, ReferenceCard, IndustryFilter                                     |
| `/reference/[slug]`            | Detail reference — challenge/solution/result, fotky, produkty  | ISR (86400s) | ReferenceHero, ChallengeSection, ProductLinks                                    |
| `/novinky`                     | Blog — seznam článků (filtr: kategorie)                        | ISR (3600s)  | ArticleList, ArticleCard, CategoryFilter                                         |
| `/novinky/[slug]`              | Detail článku                                                  | ISR (3600s)  | ArticleHeader, RichContent, ShareButtons, RelatedArticles                        |
| `/ke-stazeni`                  | Dokumenty ke stažení (filtr: kategorie, výrobce)               | ISR (86400s) | DownloadGrid, DownloadCard, CategoryFilter                                       |
| `/kontakt`                     | Kontaktní stránka — formulář, mapa, adresy, telefony           | SSG          | ContactForm, GoogleMap, AddressCards                                             |
| `/poptavka`                    | Formulář obecné poptávky (s předvyplněním produktu z query)    | SSR          | InquiryForm, ProductPreview, FormSuccess                                         |
| `/reklamace`                   | Formulář reklamace (veřejný, bez přihlášení)                   | SSR          | ClaimForm, FileUpload, FormSuccess                                               |
| `/podminky`                    | Obchodní podmínky                                              | SSG          | LegalContent                                                                     |
| `/gdpr`                        | GDPR — zásady ochrany osobních údajů                           | SSG          | LegalContent                                                                     |
| `/dekujeme/poptavka`           | Success page po poptávce — číslo tiketu, co dál                | SSG          | SuccessMessage                                                                   |
| `/dekujeme/reklamace`          | Success page po reklamaci                                      | SSG          | SuccessMessage                                                                   |
| `/dekujeme/servis`             | Success page po servisním požadavku                            | SSG          | SuccessMessage                                                                   |

### Portál (za loginem)

| Route                              | Co zobrazuje                                                                  | Rendering | Klíčové komponenty                                                  |
| ---------------------------------- | ----------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------- |
| `/portal/login`                    | Přihlášení — magic link (default) + heslo (fallback)                          | SSR       | LoginForm, MagicLinkInput                                           |
| `/portal/reset-hesla`              | Požadavek na reset hesla (krok 1: zadej email)                                | SSR       | ResetPasswordForm                                                   |
| `/portal/reset-hesla/[token]`      | Nastavení nového hesla (krok 2)                                               | SSR       | NewPasswordForm                                                     |
| `/portal/prvni-prihlaseni/[token]` | Nastavení hesla pro nový účet (invite)                                        | SSR       | SetPasswordForm                                                     |
| `/portal/dashboard`                | Dashboard — KPI karty, poslední objednávky, servis, notifikace, quick actions | SSR       | KPICards, OrdersTable, ServiceTable, NotificationList, QuickActions |
| `/portal/objednavky`               | Seznam objednávek (tabulka, filtr dle stavu)                                  | SSR       | OrdersTable, StatusFilter, Pagination                               |
| `/portal/objednavky/[id]`          | Detail objednávky — timeline, položky, dokumenty, akce                        | SSR       | OrderTimeline, OrderItems, DocumentList                             |
| `/portal/faktury`                  | Seznam faktur (tabulka, filtr dle stavu)                                      | SSR       | InvoicesTable, StatusFilter                                         |
| `/portal/faktury/[id]`             | Detail faktury + download PDF                                                 | SSR       | InvoiceDetail, DownloadButton                                       |
| `/portal/servis`                   | Seznam servisních požadavků                                                   | SSR       | ServiceTable, StatusFilter                                          |
| `/portal/servis/novy`              | Nový servisní požadavek (formulář)                                            | SSR       | ServiceRequestForm, DeviceSelect                                    |
| `/portal/servis/[id]`              | Detail servisního požadavku — timeline, technik, komunikace                   | SSR       | ServiceTimeline, TechnicianCard, ChatThread                         |
| `/portal/reklamace`                | Seznam reklamací                                                              | SSR       | ClaimsTable, StatusFilter                                           |
| `/portal/reklamace/nova`           | Nová reklamace (formulář, s předvyplněním z objednávky)                       | SSR       | ClaimForm, OrderSelect, FileUpload                                  |
| `/portal/reklamace/[id]`           | Detail reklamace — stav, komunikace                                           | SSR       | ClaimTimeline, ChatThread                                           |
| `/portal/dokumenty`                | Dokumenty zákazníka (faktury, dodací listy, smlouvy)                          | SSR       | DocumentsTable, CategoryFilter                                      |
| `/portal/profil`                   | Profil firmy + kontaktní osoby                                                | SSR       | CompanyInfo, UserProfile                                            |
| `/portal/profil/zmena-hesla`       | Změna hesla                                                                   | SSR       | ChangePasswordForm                                                  |

### Admin (Payload CMS)

| Route                             | Co zobrazuje                        | Rendering | Poznámka                           |
| --------------------------------- | ----------------------------------- | --------- | ---------------------------------- |
| `/admin`                          | Payload CMS admin dashboard         | SSR       | Automaticky generováno Payload CMS |
| `/admin/collections/products`     | CRUD produktů                       | SSR       | Payload Collection                 |
| `/admin/collections/categories`   | CRUD kategorií                      | SSR       | Payload Collection                 |
| `/admin/collections/references`   | CRUD referencí                      | SSR       | Payload Collection                 |
| `/admin/collections/articles`     | CRUD článků                         | SSR       | Payload Collection                 |
| `/admin/collections/downloads`    | CRUD dokumentů ke stažení           | SSR       | Payload Collection                 |
| `/admin/collections/portal-users` | Správa zákaznických účtů            | SSR       | Payload Collection                 |
| `/admin/globals/homepage`         | Editace homepage obsahu             | SSR       | Payload Global                     |
| `/admin/globals/site-settings`    | Nastavení webu (kontakt, loga, SEO) | SSR       | Payload Global                     |

---

## 6. Automatizace

### Must (Sprint 3+)

| #   | Trigger                                            | Akce                                                                                                                                                                                                    | Priorita |
| --- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| A1  | POST `/api/web/inquiry` — nová poptávka z webu     | 1. Uložit do `web_leads`<br>2. Vytvořit `business_case` v intranetu (source='web')<br>3. Email obchodníkovi (přiřazení dle round-robin nebo lokace)<br>4. Auto-reply zákazníkovi s číslem tiketu        | Must     |
| A2  | POST `/api/web/service-inquiry` — poptávka servisu | 1. Uložit do `web_leads` (type='service')<br>2. Vytvořit `service_request` v intranetu<br>3. Pokud urgence='critical': Telegram notifikace dispečerovi<br>4. Email dispečerovi + auto-reply zákazníkovi | Must     |
| A3  | POST `/api/web/claim` — reklamace z webu           | 1. Uložit do `web_leads` (type='claim')<br>2. Vytvořit `claim` v intranetu<br>3. Email reklamačnímu oddělení + auto-reply zákazníkovi s číslem a lhůtou 30 dní                                          | Must     |

### Should (Sprint 5)

| #   | Trigger                                     | Akce                                                                                                      | Priorita |
| --- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------- |
| A4  | Webhook: změna stavu objednávky v intranetu | 1. Vytvořit `portal_notification`<br>2. Email zákazníkovi (confirmed/shipped/completed)                   | Should   |
| A5  | Webhook: nová faktura v intranetu           | 1. Vytvořit `portal_notification`<br>2. Email zákazníkovi (pokud má zapnuté email notifikace)             | Should   |
| A6  | Webhook: update servisního požadavku        | 1. Vytvořit `portal_notification`<br>2. Email zákazníkovi (nový technik, naplánovaná návštěva, dokončeno) | Should   |
| A7  | Webhook: update reklamace                   | 1. Vytvořit `portal_notification`<br>2. Email zákazníkovi                                                 | Should   |

### Nice to have (Sprint 6+)

| #   | Trigger                                 | Akce                                                                           | Priorita |
| --- | --------------------------------------- | ------------------------------------------------------------------------------ | -------- |
| A8  | Cron denně 6:00 — SLA deadline check    | Servisní požadavky s deadline < 48h: email technikovi, < 24h: email manažerovi | Nice     |
| A9  | Cron denně 8:00 — faktury po splatnosti | Portal notifikace zákazníkovi: "Faktura XY je po splatnosti"                   | Nice     |
| A10 | Payload CMS: publikování/změna produktu | On-demand ISR revalidace (`/api/web/revalidate`)                               | Nice     |
| A11 | Nový portal_user vytvořen adminem       | Email s pozvánkou + invite link → `/portal/prvni-prihlaseni/[token]`           | Nice     |

---

## 7. Sprint plán (S1–S7)

### S1: Základ (2 týdny)

| ID    | Úkol                                                                                                      | Priorita |
| ----- | --------------------------------------------------------------------------------------------------------- | -------- |
| S1-01 | Inicializace Next.js 15 projektu (`~/projects/dlouhy-web`) s App Router                                   | Must     |
| S1-02 | Tailwind CSS 4 konfigurace — custom barvy (DT modrá, SAMSON modrá, ELCO červená), typografie, breakpointy | Must     |
| S1-03 | Drizzle ORM setup — sdílená PostgreSQL, connection pooling (max 5 pro web)                                | Must     |
| S1-04 | Drizzle schéma: categories, products, product_parameters, product_documents, product_relations            | Must     |
| S1-05 | Drizzle schéma: web_leads, web_page_content                                                               | Must     |
| S1-06 | Drizzle migrace + seed data (10 vzorových produktů, 3 kategorie)                                          | Must     |
| S1-07 | Layout: Header (sticky, desktop + mobile hamburger), Footer, základní metadata                            | Must     |
| S1-08 | CLAUDE.md pro projekt — konvence, struktura, příkazy                                                      | Must     |
| S1-09 | Payload CMS 3.0 integrace — instalace jako Next.js plugin, admin na `/admin`                              | Should   |
| S1-10 | Cloudflare R2 setup — bucket, custom image loader v next.config.ts                                        | Should   |
| S1-11 | ESLint + Prettier konfigurace                                                                             | Must     |
| S1-12 | Docker Compose pro lokální dev (PostgreSQL)                                                               | Must     |

### S2: Produktový katalog (2 týdny)

| ID    | Úkol                                                                                            | Priorita |
| ----- | ----------------------------------------------------------------------------------------------- | -------- |
| S2-01 | Homepage — Hero sekce (fullscreen foto, 2 CTA), partnerský pruh (loga SAMSON/SCHROEDAHL/ELCO)   | Must     |
| S2-02 | Homepage — sekce produktové kategorie (3 karty), "Proč DT" (4 ikony), CTA blok                  | Must     |
| S2-03 | Homepage — reference (3 karty), novinky (3 nejnovější), footer                                  | Should   |
| S2-04 | `/produkty` — filtrovatelný grid (výrobce, kategorie, medium), pagination                       | Must     |
| S2-05 | `/produkty/[kategorie]` — filtrovaná verze s category header                                    | Must     |
| S2-06 | `/produkty/[kategorie]/[slug]` — detail produktu (galerie, parametry, dokumenty, příslušenství) | Must     |
| S2-07 | Product Card komponenta (foto, badge výrobce, název, typové označení, CTA)                      | Must     |
| S2-08 | Payload CMS Collections: Products, Categories, ProductParameters, ProductDocuments              | Must     |
| S2-09 | ISR konfigurace pro produktové stránky (revalidate: 3600)                                       | Must     |
| S2-10 | `/ke-stazeni` — grid dokumentů ke stažení (filtr: kategorie, výrobce)                           | Should   |
| S2-11 | Payload CMS Collection: Downloads                                                               | Should   |
| S2-12 | SEO: Metadata API pro každou stránku, Open Graph, structured data (Product, BreadcrumbList)     | Should   |
| S2-13 | Full-text search endpoint (`/api/web/search`) + search bar v headeru                            | Should   |

### S3: Formuláře + napojení na intranet (2 týdny)

| ID    | Úkol                                                                                     | Priorita |
| ----- | ---------------------------------------------------------------------------------------- | -------- |
| S3-01 | Drizzle schéma: web_leads (finální verze)                                                | Must     |
| S3-02 | Formulář: Obecná poptávka `/poptavka` — Zod validace, React Hook Form, file upload       | Must     |
| S3-03 | Server Action: uložení do web_leads + vytvoření business_case v intranetu (source='web') | Must     |
| S3-04 | Formulář: Poptávka servisu `/servis/poptavka` — urgence, lokalita, přílohy               | Must     |
| S3-05 | Formulář: Reklamace `/reklamace` — fotodokumentace (povinná), požadované řešení          | Must     |
| S3-06 | Formulář: Kontaktní `/kontakt` — jednoduchý, inline success message                      | Must     |
| S3-07 | Resend integrace — React Email templates (potvrzení poptávky, reklamace, servis)         | Must     |
| S3-08 | Automatizace A1: poptávka → intranet business_case + email obchodníkovi                  | Must     |
| S3-09 | Automatizace A2: servis → intranet service_request + email dispečerovi                   | Must     |
| S3-10 | Automatizace A3: reklamace → intranet claim + email reklamačnímu odd.                    | Must     |
| S3-11 | Rate limiting na formulářové endpointy (IP-based, max 5/min)                             | Must     |
| S3-12 | Success stránky: `/dekujeme/poptavka`, `/dekujeme/reklamace`, `/dekujeme/servis`         | Must     |
| S3-13 | Předvyplnění produktu z query param (`/poptavka?produkt=[id]`)                           | Should   |
| S3-14 | Stránky: `/o-nas`, `/servis`, `/kontakt` — statický obsah                                | Should   |

### S4: Auth + Zákaznický portál základ (2 týdny)

| ID    | Úkol                                                                                             | Priorita |
| ----- | ------------------------------------------------------------------------------------------------ | -------- |
| S4-01 | Drizzle schéma: portal_users, portal_notifications                                               | Must     |
| S4-02 | NextAuth v5 konfigurace — Resend provider (magic link) + Credentials (heslo)                     | Must     |
| S4-03 | `/portal/login` — magic link jako default, heslo jako fallback                                   | Must     |
| S4-04 | `/portal/reset-hesla` — request + confirm flow                                                   | Must     |
| S4-05 | `/portal/prvni-prihlaseni/[token]` — nastavení hesla z invite                                    | Must     |
| S4-06 | Middleware: ochrana `/portal/*` routes (redirect na login)                                       | Must     |
| S4-07 | Portal Layout: sidebar (navigace, firma, notifikace badge) + hlavní obsah                        | Must     |
| S4-08 | `/portal/dashboard` — KPI karty (objednávky, faktury, servis, reklamace), quick actions          | Must     |
| S4-09 | `/portal/objednavky` — tabulka objednávek (čtení z intranetové `orders` tabulky přes company_id) | Must     |
| S4-10 | `/portal/objednavky/[id]` — detail objednávky (timeline, položky, dokumenty)                     | Must     |
| S4-11 | `/portal/faktury` — tabulka faktur + download PDF                                                | Must     |
| S4-12 | `/portal/faktury/[id]` — detail faktury                                                          | Should   |
| S4-13 | Multi-tenant izolace: každý DB dotaz filtruje přes `company_id` ze session                       | Must     |
| S4-14 | `/portal/profil` — profil uživatele + firmy, změna hesla                                         | Should   |

### S5: Portálové formuláře + notifikace (2 týdny)

| ID    | Úkol                                                                                   | Priorita |
| ----- | -------------------------------------------------------------------------------------- | -------- |
| S5-01 | `/portal/servis` — seznam servisních požadavků zákazníka                               | Must     |
| S5-02 | `/portal/servis/novy` — formulář nového servisního požadavku (výběr zařízení, urgence) | Must     |
| S5-03 | `/portal/servis/[id]` — detail s timeline, přiřazený technik, komunikace               | Must     |
| S5-04 | `/portal/reklamace` — seznam reklamací                                                 | Must     |
| S5-05 | `/portal/reklamace/nova` — formulář nové reklamace (s vazbou na objednávku)            | Must     |
| S5-06 | `/portal/reklamace/[id]` — detail reklamace (stav, komunikace)                         | Must     |
| S5-07 | Webhook endpointy: order-status, new-invoice, service-update, claim-update             | Must     |
| S5-08 | Automatizace A4–A7: webhooky → portal_notifications + email                            | Must     |
| S5-09 | Notifikační systém: badge v sidebar, seznam notifikací, mark as read                   | Must     |
| S5-10 | `/portal/dokumenty` — souhrnný seznam dokumentů zákazníka                              | Should   |
| S5-11 | Admin: vytvoření zákaznického účtu + odeslání invite emailu (automatizace A11)         | Should   |
| S5-12 | Email templates: potvrzení servisního požadavku, potvrzení reklamace, notifikace stavu | Must     |

### S6: Reference, blog, SEO, analytics (2 týdny)

| ID    | Úkol                                                                                | Priorita |
| ----- | ----------------------------------------------------------------------------------- | -------- |
| S6-01 | Drizzle schéma: references, reference_products, articles                            | Must     |
| S6-02 | `/reference` — grid referencí (filtr: odvětví, rok)                                 | Must     |
| S6-03 | `/reference/[slug]` — detail reference (challenge/solution/result, produkty, fotky) | Must     |
| S6-04 | Payload CMS Collection: References                                                  | Must     |
| S6-05 | `/novinky` — blog seznam (filtr: kategorie)                                         | Must     |
| S6-06 | `/novinky/[slug]` — detail článku                                                   | Must     |
| S6-07 | Payload CMS Collection: Articles                                                    | Must     |
| S6-08 | SEO: sitemap.xml (dynamický), robots.txt, canonical URLs                            | Must     |
| S6-09 | SEO: structured data — Product (JSON-LD), Organization, BreadcrumbList, FAQPage     | Should   |
| S6-10 | Google Analytics 4 integrace                                                        | Must     |
| S6-11 | Stránky: `/podminky`, `/gdpr`                                                       | Must     |
| S6-12 | On-demand ISR revalidace z Payload CMS (automatizace A10)                           | Should   |
| S6-13 | Automatizace A8–A9: cron SLA deadline + faktury po splatnosti                       | Nice     |
| S6-14 | Open Graph images — automatická generace pro produkty a články                      | Nice     |

### S7: Deploy, CI/CD, testy, performance (2 týdny)

| ID    | Úkol                                                                           | Priorita |
| ----- | ------------------------------------------------------------------------------ | -------- |
| S7-01 | Dockerfile pro produkci (multi-stage build, Next.js standalone output)         | Must     |
| S7-02 | Coolify konfigurace — deploy dlouhy-web, SSL certifikát, environment variables | Must     |
| S7-03 | GitHub Actions: CI pipeline (lint, type-check, build) na push                  | Must     |
| S7-04 | GitHub Actions: CD pipeline (deploy na Coolify přes webhook na push do main)   | Must     |
| S7-05 | Vitest: unit testy pro Server Actions (formuláře, validace)                    | Must     |
| S7-06 | Vitest: unit testy pro API endpointy (portal, webhooky)                        | Should   |
| S7-07 | Playwright: E2E testy — homepage, produkt detail, poptávkový formulář          | Should   |
| S7-08 | Performance audit: Lighthouse ≥90 na všech Core Web Vitals                     | Must     |
| S7-09 | Security: CSP headers, X-Frame-Options, rate limiting audit                    | Must     |
| S7-10 | Security: CORS konfigurace pro webhook endpointy                               | Must     |
| S7-11 | Monitoring: health check endpoint, uptime monitoring (UptimeRobot free)        | Should   |
| S7-12 | Backup strategie: PostgreSQL daily dump (cron na Mac Studio)                   | Must     |
| S7-13 | Dokumentace: aktualizace CLAUDE.md, README pro deploy                          | Should   |
| S7-14 | DNS konfigurace: dlouhy-technology.cz → Mac Studio (Cloudflare DNS)            | Must     |
| S7-15 | Stress test: k6 load test na produktový katalog a formuláře                    | Nice     |

---

## 8. CLAUDE.md

Kompletní obsah CLAUDE.md pro projekt dlouhy-web je v samostatném souboru: `/tmp/claude-md-dlouhy-web.md`

---

## 9. Rizika & Doporučení

### Top 5 rizik

| #   | Riziko                                                                                                        | Dopad   | Mitigace                                                                                                                                                                          |
| --- | ------------------------------------------------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | **Sdílená DB = tight coupling** — web dotaz může zpomalit intranet                                            | Vysoký  | Oddělené connection pooly (web max 5, intranet max 20). Web NIKDY nepíše do intranetových tabulek přímo — vždy přes intranet API nebo dedikované Server Actions s jasnou izolací. |
| R2  | **Payload CMS 3.0 je relativně nový** — mohou být edge cases                                                  | Střední | Payload 3.0 je stable od Q3 2025, komunita roste. Fallback: Payload Collections pro data, custom admin UI pro edge cases. Nepsat vlastní CMS.                                     |
| R3  | **Mac Studio hosting = single point of failure** — výpadek proudu, update macOS                               | Vysoký  | UPS pro Mac Studio. Hetzner VPS ($5/měsíc) jako hot standby. DB replikace (pg_dump cron denně + offsite). Monitoring s alertingem.                                                |
| R4  | **Intranet API endpointy nemusí existovat všechny** — portál potřebuje data, která intranet ještě nevystavuje | Střední | Před S4 (portál) zrevidovat intranetové API. Chybějící endpointy doimplementovat v intranetu jako prerequisite. Sdílená DB umožňuje přímý read jako fallback.                     |
| R5  | **Obsah webu — kdo ho dodá?** — produktové texty, fotky, reference                                            | Vysoký  | Před S2 dohodnout s DT: kdo dodá fotky produktů, technické popisy, reference. Připravit šablonu (spreadsheet) pro sběr dat. Bez obsahu web nebude mít smysl.                      |

### Co udělat jako první

1. **Dohodnout obsah s DT** — fotky produktů, technické popisy, reference. Bez dat se nedá naplnit katalog. Připravit Google Sheet šablonu.
2. **Zrevidovat intranet API** — ověřit, že endpointy pro orders, invoices, service-requests, claims podporují filtrování přes `company_id` a vrací data potřebná pro portál.
3. **S1 — scaffold projektu** — Next.js + Tailwind + Drizzle + Payload CMS. Mít funkční skeleton s jednou produktovou stránkou.
4. **DNS a doména** — ověřit vlastnictví `dlouhy-technology.cz`, nastavit Cloudflare DNS.
5. **Testovací data** — seed 10 reálných produktů SAMSON (z existujícího katalogu), 3 reference, 5 dokumentů ke stažení.

### Co NEDĚLAT

1. **NEBUDOVAT monorepo** — intranet je flat Next.js app, web taky. Sdílení přes sdílenou DB, ne přes npm packages. Monorepo by přidalo komplexitu bez benefitu pro 1 vývojáře.
2. **NEIMPLEMENTOVAT konfigurátor ventilů** — SAMSON má vlastní SED konfigurátor. DT web má odkazovat na SED, ne ho replikovat. Konfigurátor je 6+ měsíců práce.
3. **NEŘEŠIT vícejazyčnost v S1–S5** — první verze jen česky. SK a EN mutace přidat až po ověření funkčního webu. i18n framework (next-intl) připravit ve struktuře, ale nepřekládat.
4. **NEPSAT vlastní auth řešení** — NextAuth v5 je dostatečný. Žádný custom JWT, žádný custom session store.
5. **NEOPTIMALIZOVAT předčasně** — žádný Redis cache, žádný CDN pro HTML, žádný edge runtime. ISR + PostgreSQL stačí pro stovky B2B návštěvníků denně.
6. **NEDĚLAT e-shop / nákupní košík** — DT prodává konzultativně, ne přes košík. Poptávkový formulář je dostatečný.
7. **NEPŘIDÁVAT AI chat / chatbota** — hezká myšlenka, ale bez strukturovaných dat (FAQ, knowledge base) bude produkovat nesmysly o ventilech. Přidat až ve fázi 2 po naplnění katalogu.
