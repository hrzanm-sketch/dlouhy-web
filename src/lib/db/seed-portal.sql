-- Seed portal data for ČEZ Distribuce (company_id: 92a9747a-7e85-4735-88d8-e9c4d0370efa)
-- org_id: c77b8edd-ed3b-4b00-a151-4094e2246f6b
-- Run: /opt/homebrew/opt/postgresql@16/bin/psql "postgresql://dt:dt_local_dev@localhost:5432/dt_intranet" -f src/lib/db/seed-portal.sql

BEGIN;

-- ─── Business Cases (pro navázání objednávek) ─────────────────────────

INSERT INTO business_cases (id, org_id, company_id, title, status, source, created_at, updated_at)
VALUES
  ('e5000001-0000-4000-8000-000000000001', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'ČEZ — SAMSON 3241 DN80 PN40', 'order', 'web', '2026-02-28 10:00:00+01', '2026-03-01 10:00:00+01'),
  ('e5000001-0000-4000-8000-000000000002', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'ČEZ — trojcestný ventil 3321', 'order', 'web', '2026-02-23 14:00:00+01', '2026-02-25 14:30:00+01'),
  ('e5000001-0000-4000-8000-000000000003', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'ČEZ — ELCO NEXTRON 8 hořák', 'order', 'web', '2026-02-18 09:00:00+01', '2026-02-20 09:15:00+01'),
  ('e5000001-0000-4000-8000-000000000004', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'ČEZ — regulátor tlaku 241-7', 'order', 'email', '2026-02-08 11:00:00+01', '2026-02-10 11:00:00+01'),
  ('e5000001-0000-4000-8000-000000000005', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'ČEZ — pohony 3510 5ks', 'order', 'email', '2026-02-03 16:00:00+01', '2026-02-05 16:00:00+01'),
  ('e5000001-0000-4000-8000-000000000006', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'ČEZ — SCHROEDAHL TDL DN32', 'realization', 'phone', '2026-01-15 10:00:00+01', '2026-01-20 10:00:00+01'),
  ('e5000001-0000-4000-8000-000000000007', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'ČEZ — SAMSON 3244 DN100', 'realization', 'email', '2026-01-05 13:00:00+01', '2026-01-10 13:00:00+01'),
  ('e5000001-0000-4000-8000-000000000008', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'ČEZ — TROVIS 6400 3ks', 'completed', 'web', '2025-11-28 09:00:00+01', '2025-12-27 14:30:00+01'),
  ('e5000001-0000-4000-8000-000000000009', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'ČEZ — SCHROEDAHL BNA DN25', 'completed', 'email', '2025-11-10 11:00:00+01', '2025-12-16 10:00:00+01'),
  ('e5000001-0000-4000-8000-000000000010', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'ČEZ — regulátor teploty 2488', 'lost', 'web', '2025-10-15 14:00:00+01', '2025-10-25 09:00:00+01')
ON CONFLICT (id) DO NOTHING;

-- ─── Orders (10 kusů) ──────────────────────────────────────────────────

INSERT INTO orders (id, org_id, case_id, company_id, order_number, title, type, amount, currency, status, ordered_at, confirmed_at, shipped_at, delivery_date, delivered_at, note, created_at, updated_at)
VALUES
  -- 3× ordered
  ('a1000001-0000-4000-8000-000000000001', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', 'e5000001-0000-4000-8000-000000000001', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'OBJ-2026-0051', 'SAMSON Type 3241 DN80 PN40 — regulační ventil', 'customer', 1850000, 'CZK', 'ordered', '2026-03-01 10:00:00+01', NULL, NULL, NULL, NULL, 'Urgentní dodávka pro odstávku', '2026-03-01 10:00:00+01', '2026-03-01 10:00:00+01'),
  ('a1000001-0000-4000-8000-000000000002', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', 'e5000001-0000-4000-8000-000000000002', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'OBJ-2026-0049', 'SAMSON Type 3321 DN50 — trojcestný ventil + pohon', 'customer', 980000, 'CZK', 'ordered', '2026-02-25 14:30:00+01', NULL, NULL, NULL, NULL, NULL, '2026-02-25 14:30:00+01', '2026-02-25 14:30:00+01'),
  ('a1000001-0000-4000-8000-000000000003', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', 'e5000001-0000-4000-8000-000000000003', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'OBJ-2026-0047', 'ELCO NEXTRON 8 — plynový hořák 800kW', 'customer', 2450000, 'CZK', 'ordered', '2026-02-20 09:15:00+01', NULL, NULL, NULL, NULL, 'Včetně montážní sady a řídící jednotky', '2026-02-20 09:15:00+01', '2026-02-20 09:15:00+01'),
  -- 2× confirmed
  ('a1000001-0000-4000-8000-000000000004', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', 'e5000001-0000-4000-8000-000000000004', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'OBJ-2026-0043', 'SAMSON Type 241-7 DN40 — regulátor tlaku', 'customer', 320000, 'CZK', 'confirmed', '2026-02-10 11:00:00+01', '2026-02-12 08:00:00+01', NULL, '2026-03-15', NULL, NULL, '2026-02-10 11:00:00+01', '2026-02-12 08:00:00+01'),
  ('a1000001-0000-4000-8000-000000000005', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', 'e5000001-0000-4000-8000-000000000005', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'OBJ-2026-0041', 'SAMSON Type 3510 elektrický pohon — 5 ks', 'customer', 750000, 'CZK', 'confirmed', '2026-02-05 16:00:00+01', '2026-02-07 09:30:00+01', NULL, '2026-03-20', NULL, 'Pohony pro stávající ventily v kotelně K3', '2026-02-05 16:00:00+01', '2026-02-07 09:30:00+01'),
  -- 2× shipped
  ('a1000001-0000-4000-8000-000000000006', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', 'e5000001-0000-4000-8000-000000000006', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'OBJ-2026-0036', 'SCHROEDAHL TDL DN32 — recirkulační ventil', 'customer', 580000, 'CZK', 'shipped', '2026-01-20 10:00:00+01', '2026-01-22 11:00:00+01', '2026-02-28 14:00:00+01', '2026-03-05', NULL, NULL, '2026-01-20 10:00:00+01', '2026-02-28 14:00:00+01'),
  ('a1000001-0000-4000-8000-000000000007', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', 'e5000001-0000-4000-8000-000000000007', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'OBJ-2026-0033', 'SAMSON Type 3244 DN100 PN16 — membránový ventil', 'customer', 1420000, 'CZK', 'shipped', '2026-01-10 13:00:00+01', '2026-01-13 10:00:00+01', '2026-02-20 09:00:00+01', '2026-03-01', NULL, 'Dodání na adresu Elektrárna Dětmarovice', '2026-01-10 13:00:00+01', '2026-02-20 09:00:00+01'),
  -- 2× delivered
  ('a1000001-0000-4000-8000-000000000008', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', 'e5000001-0000-4000-8000-000000000008', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'OBJ-2025-0128', 'SAMSON TROVIS 6400 — kompaktní regulátor 3 ks', 'customer', 285000, 'CZK', 'delivered', '2025-12-05 09:00:00+01', '2025-12-08 10:00:00+01', '2025-12-20 08:00:00+01', '2025-12-28', '2025-12-27 14:30:00+01', NULL, '2025-12-05 09:00:00+01', '2025-12-27 14:30:00+01'),
  ('a1000001-0000-4000-8000-000000000009', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', 'e5000001-0000-4000-8000-000000000009', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'OBJ-2025-0115', 'SCHROEDAHL BNA DN25 — automatická recirkulace', 'customer', 410000, 'CZK', 'delivered', '2025-11-15 11:00:00+01', '2025-11-18 09:00:00+01', '2025-12-10 13:00:00+01', '2025-12-18', '2025-12-16 10:00:00+01', NULL, '2025-11-15 11:00:00+01', '2025-12-16 10:00:00+01'),
  -- 1× cancelled
  ('a1000001-0000-4000-8000-000000000010', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', 'e5000001-0000-4000-8000-000000000010', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'OBJ-2025-0098', 'SAMSON Type 2488 — regulátor teploty DN50', 'customer', 195000, 'CZK', 'cancelled', '2025-10-20 14:00:00+01', NULL, NULL, NULL, NULL, 'Zrušeno zákazníkem — změna projektu', '2025-10-20 14:00:00+01', '2025-10-25 09:00:00+01')
ON CONFLICT (id) DO NOTHING;

-- ─── Invoices (10 kusů) ────────────────────────────────────────────────

INSERT INTO invoices (id, org_id, company_id, order_id, invoice_number, title, type, amount, currency, status, issue_date, due_date, sent_at, paid_at, note, created_at, updated_at)
VALUES
  -- 2× draft
  ('b2000001-0000-4000-8000-000000000001', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'a1000001-0000-4000-8000-000000000001', 'FA-2026-0051', 'Zálohová faktura — SAMSON 3241 DN80', 'proforma', 925000, 'CZK', 'draft', '2026-03-01', '2026-03-15', NULL, NULL, '50% záloha', '2026-03-01 12:00:00+01', '2026-03-01 12:00:00+01'),
  ('b2000001-0000-4000-8000-000000000002', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'a1000001-0000-4000-8000-000000000003', 'FA-2026-0047', 'Zálohová faktura — ELCO NEXTRON 8', 'proforma', 1225000, 'CZK', 'draft', '2026-02-21', '2026-03-07', NULL, NULL, '50% záloha', '2026-02-21 10:00:00+01', '2026-02-21 10:00:00+01'),
  -- 3× sent
  ('b2000001-0000-4000-8000-000000000003', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'a1000001-0000-4000-8000-000000000004', 'FA-2026-0043', 'Faktura — regulátor tlaku Type 241-7', 'invoice', 320000, 'CZK', 'sent', '2026-02-12', '2026-03-12', '2026-02-12 14:00:00+01', NULL, NULL, '2026-02-12 14:00:00+01', '2026-02-12 14:00:00+01'),
  ('b2000001-0000-4000-8000-000000000004', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'a1000001-0000-4000-8000-000000000006', 'FA-2026-0036', 'Faktura — SCHROEDAHL TDL DN32', 'invoice', 580000, 'CZK', 'sent', '2026-02-28', '2026-03-28', '2026-02-28 15:00:00+01', NULL, NULL, '2026-02-28 15:00:00+01', '2026-02-28 15:00:00+01'),
  ('b2000001-0000-4000-8000-000000000005', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'a1000001-0000-4000-8000-000000000007', 'FA-2026-0033', 'Faktura — SAMSON 3244 DN100', 'invoice', 1420000, 'CZK', 'sent', '2026-02-20', '2026-03-20', '2026-02-20 10:00:00+01', NULL, 'Dodáno na Elektrárnu Dětmarovice', '2026-02-20 10:00:00+01', '2026-02-20 10:00:00+01'),
  -- 2× paid
  ('b2000001-0000-4000-8000-000000000006', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'a1000001-0000-4000-8000-000000000008', 'FA-2025-0128', 'Faktura — SAMSON TROVIS 6400 3ks', 'invoice', 285000, 'CZK', 'paid', '2025-12-20', '2026-01-20', '2025-12-20 10:00:00+01', '2026-01-10 09:00:00+01', NULL, '2025-12-20 10:00:00+01', '2026-01-10 09:00:00+01'),
  ('b2000001-0000-4000-8000-000000000007', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'a1000001-0000-4000-8000-000000000009', 'FA-2025-0115', 'Faktura — SCHROEDAHL BNA DN25', 'invoice', 410000, 'CZK', 'paid', '2025-12-10', '2026-01-10', '2025-12-10 11:00:00+01', '2025-12-28 14:00:00+01', NULL, '2025-12-10 11:00:00+01', '2025-12-28 14:00:00+01'),
  -- 2× overdue
  ('b2000001-0000-4000-8000-000000000008', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', NULL, 'FA-2025-0105', 'Faktura — servisní práce Q4/2025', 'invoice', 165000, 'CZK', 'overdue', '2025-11-01', '2025-12-01', '2025-11-01 10:00:00+01', NULL, 'Servisní práce na ventilové baterii', '2025-11-01 10:00:00+01', '2025-12-02 08:00:00+01'),
  ('b2000001-0000-4000-8000-000000000009', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', NULL, 'FA-2025-0092', 'Faktura — náhradní díly pro SAMSON 3241', 'invoice', 87000, 'CZK', 'overdue', '2025-10-15', '2025-11-15', '2025-10-15 12:00:00+01', NULL, NULL, '2025-10-15 12:00:00+01', '2025-11-16 08:00:00+01'),
  -- 1× cancelled
  ('b2000001-0000-4000-8000-000000000010', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'a1000001-0000-4000-8000-000000000010', 'FA-2025-0098', 'Storno — regulátor teploty Type 2488', 'invoice', 195000, 'CZK', 'cancelled', '2025-10-22', '2025-11-22', NULL, NULL, 'Stornováno — objednávka zrušena', '2025-10-22 10:00:00+01', '2025-10-25 09:00:00+01')
ON CONFLICT (id) DO NOTHING;

-- ─── Service Requests (9 nových k existujícímu 1) ─────────────────────

INSERT INTO service_requests (id, org_id, company_id, title, description, priority, status, scheduled_date, completed_at, created_at, updated_at)
VALUES
  -- 2× new
  ('c3000001-0000-4000-8000-000000000001', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'Kalibrace regulačního ventilu SAMSON 3241 DN80', 'Požadujeme kalibraci ventilu po roční odstávce. Ventil je na lince L4, přístup zajištěn.', 'normal', 'new', NULL, NULL, '2026-03-01 09:00:00+01', '2026-03-01 09:00:00+01'),
  ('c3000001-0000-4000-8000-000000000002', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'Výměna těsnění na trojcestném ventilu Type 3321', 'Zjištěn únik média přes ucpávku. Nutná výměna těsnící sady.', 'high', 'new', NULL, NULL, '2026-02-28 14:00:00+01', '2026-02-28 14:00:00+01'),
  -- 2× assigned
  ('c3000001-0000-4000-8000-000000000003', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'Preventivní prohlídka ventilové baterie — kotelna K2', 'Plánovaná preventivní prohlídka 8 regulačních ventilů v kotelně K2. Zahrnuje vizuální kontrolu, test funkce a mazání pohonů.', 'normal', 'assigned', '2026-03-15', NULL, '2026-02-20 10:00:00+01', '2026-02-22 08:00:00+01'),
  ('c3000001-0000-4000-8000-000000000004', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'Oprava elektrického pohonu SAMSON 3510', 'Pohon na ventilu V-412 nereaguje na signál 4-20mA. Diagnostika a oprava/výměna.', 'high', 'assigned', '2026-03-10', NULL, '2026-02-15 11:00:00+01', '2026-02-17 09:00:00+01'),
  -- 2× in_progress
  ('c3000001-0000-4000-8000-000000000005', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'Seřízení hořáku ELCO NEXTRON 8 — optimalizace spalování', 'Zvýšená spotřeba plynu o 15%. Požadujeme seřízení a optimalizaci spalovacího procesu, analýzu spalin.', 'critical', 'in_progress', '2026-02-25', NULL, '2026-02-10 08:00:00+01', '2026-02-25 10:00:00+01'),
  ('c3000001-0000-4000-8000-000000000006', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'Výměna regulátoru TROVIS 6400 — upgrade firmware', 'Upgrade firmware regulátoru na verzi 4.2 + rekonfigurace PID smyček.', 'normal', 'in_progress', '2026-02-20', NULL, '2026-02-05 13:00:00+01', '2026-02-20 09:00:00+01'),
  -- 1× waiting_parts
  ('c3000001-0000-4000-8000-000000000007', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'Oprava recirkulačního ventilu SCHROEDAHL TDL', 'Hlučnost a vibrace při provozu. Diagnostika ukázala opotřebení vnitřních dílů. Objednány náhradní díly z Německa.', 'high', 'waiting_parts', '2026-03-20', NULL, '2026-01-25 10:00:00+01', '2026-02-15 11:00:00+01'),
  -- 2× completed
  ('c3000001-0000-4000-8000-000000000008', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'Roční servis regulátorů tlaku Type 241 — 4 kusy', 'Kompletní servis a kalibrace 4 regulátorů tlaku za sebou v rozvodně R5. Včetně výměny filtrů a manometrů.', 'normal', 'completed', '2025-12-15', '2025-12-18 16:00:00+01', '2025-11-20 09:00:00+01', '2025-12-18 16:00:00+01'),
  -- 1× cancelled
  ('c3000001-0000-4000-8000-000000000009', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'Instalace nového ventilu SAMSON 3244 DN150', 'Zrušeno — projekt odložen na Q2 2026.', 'low', 'cancelled', NULL, NULL, '2025-11-01 14:00:00+01', '2025-11-10 09:00:00+01')
ON CONFLICT (id) DO NOTHING;

-- ─── Claims (10 kusů) ──────────────────────────────────────────────────

INSERT INTO claims (id, org_id, company_id, title, description, status, sla_deadline, resolved_at, created_at, updated_at)
VALUES
  -- 2× received
  ('d4000001-0000-4000-8000-000000000001', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'Netěsnost ventilu SAMSON 3241 DN50 — únik média', 'Ventil dodaný v lednu 2026 vykazuje netěsnost na ucpávce po 6 týdnech provozu. Provozní tlak v rámci specifikace (PN16). Žádáme opravu v záruce.', 'received', '2026-03-15 00:00:00+01', NULL, '2026-03-01 08:00:00+01', '2026-03-01 08:00:00+01'),
  ('d4000001-0000-4000-8000-000000000002', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'Poškozený hořák ELCO NEXTRON 8 — prasklá keramika', 'Při první odstávce po 3 měsících provozu zjištěna prasklá keramická vložka spalovací komory. Hořák dodán v listopadu 2025.', 'received', '2026-03-20 00:00:00+01', NULL, '2026-02-27 10:00:00+01', '2026-02-27 10:00:00+01'),
  -- 2× evaluating
  ('d4000001-0000-4000-8000-000000000003', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'Vadný pohon SAMSON 3510 — intermitentní výpadky', 'Elektrický pohon náhodně ztrácí polohu a vrací se do bezpečnostní pozice. Problém se vyskytuje cca 2× týdně, trvá cca 30 vteřin.', 'evaluating', '2026-03-10 00:00:00+01', NULL, '2026-02-15 14:00:00+01', '2026-02-20 09:00:00+01'),
  ('d4000001-0000-4000-8000-000000000004', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'Chybějící dokumentace k ventilu Type 3321', 'K dodanému trojcestnému ventilu chybí certifikát materiálu 3.1 dle EN 10204 a zkušební protokol. Dokumentace je vyžadována pro kolaudaci.', 'evaluating', '2026-03-05 00:00:00+01', NULL, '2026-02-10 11:00:00+01', '2026-02-14 08:00:00+01'),
  -- 2× sent_to_supplier
  ('d4000001-0000-4000-8000-000000000005', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'Koroze na regulátoru tlaku SAMSON Type 241', 'Předčasná koroze na tělese ventilu po 8 měsících provozu. Médium je teplá voda, materiál dle specifikace GGG-40. Zasláno k posouzení výrobci SAMSON.', 'sent_to_supplier', '2026-03-25 00:00:00+01', NULL, '2026-01-20 09:00:00+01', '2026-02-05 10:00:00+01'),
  ('d4000001-0000-4000-8000-000000000006', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'Neshodná dimenze — SCHROEDAHL BNA DN25 místo DN32', 'Objednán ventil DN32, dodán DN25. Číslo objednávky OBJ-2025-0115. Ventil nelze instalovat, požadujeme výměnu.', 'sent_to_supplier', '2026-02-28 00:00:00+01', NULL, '2026-01-05 13:00:00+01', '2026-01-15 10:00:00+01'),
  -- 2× resolved
  ('d4000001-0000-4000-8000-000000000007', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'Zpožděná dodávka regulátoru TROVIS 6400', 'Regulátor doručen o 3 týdny později než potvrzený termín. Požadujeme slevu z důvodu prostoje.', 'resolved', NULL, '2026-01-15 10:00:00+01', '2025-12-10 09:00:00+01', '2026-01-15 10:00:00+01'),
  ('d4000001-0000-4000-8000-000000000008', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'Chybný kalibrační certifikát — SAMSON 3241 DN100', 'Na kalibračním certifikátu uveden jiný výrobní číslo než na ventilu. Dodán opravený certifikát.', 'resolved', NULL, '2025-12-20 14:00:00+01', '2025-11-25 10:00:00+01', '2025-12-20 14:00:00+01'),
  -- 2× rejected
  ('d4000001-0000-4000-8000-000000000009', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'Hlučnost ventilu SAMSON 3244 — údajně nadměrná', 'Hlučnost ventilu je v rámci specifikace výrobce. Šetřením zjištěno, že hluk způsobuje kavitace v potrubí za ventilem (nevhodný tlakový spád). Doporučen anti-kavitační trim.', 'rejected', NULL, '2025-12-01 09:00:00+01', '2025-10-15 11:00:00+01', '2025-12-01 09:00:00+01'),
  ('d4000001-0000-4000-8000-000000000010', 'c77b8edd-ed3b-4b00-a151-4094e2246f6b', '92a9747a-7e85-4735-88d8-e9c4d0370efa', 'Poškození obalu při dopravě — SAMSON Type 2488', 'Obal poškozen při přepravě, ale ventil bez poškození. Funkční test proveden — bez závad. Reklamace zamítnuta — produkt v pořádku.', 'rejected', NULL, '2025-11-20 10:00:00+01', '2025-10-25 08:00:00+01', '2025-11-20 10:00:00+01')
ON CONFLICT (id) DO NOTHING;

COMMIT;
