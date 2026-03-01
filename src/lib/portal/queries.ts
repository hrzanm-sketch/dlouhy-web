import { db } from "@/lib/db"
import {
  intranetOrders,
  intranetInvoices,
  intranetServiceRequests,
  intranetClaims,
  intranetCompanies,
} from "@/lib/db/schema/intranet"
import type { CompanyAddress, CompanyContact } from "@/lib/db/schema/intranet"
import { downloads } from "@/lib/db/schema"
import { portalNotifications } from "@/lib/db/schema/portal-notifications"
import { portalUsers } from "@/lib/db/schema/portal-users"
import { eq, and, isNull, desc, count, sql } from "drizzle-orm"

// ─── Types ───────────────────────────────────────────────────────────

export type Order = {
  id: string
  orderNumber: string
  title: string
  date: string
  status: string
  amount: number
  currency: string
  deliveryDate: string | null
}

export type OrderDetail = Order & {
  note: string | null
  confirmedAt: string | null
  shippedAt: string | null
  deliveredAt: string | null
}

export type Invoice = {
  id: string
  invoiceNumber: string
  title: string
  date: string
  dueDate: string
  status: string
  amount: number
  currency: string
}

export type InvoiceDetail = Invoice & {
  orderId: string | null
  paidAt: string | null
  note: string | null
}

export type ServiceRequest = {
  id: string
  title: string
  description: string | null
  priority: string
  status: string
  scheduledDate: string | null
  createdAt: string
}

export type Claim = {
  id: string
  title: string
  description: string | null
  status: string
  createdAt: string
  resolvedAt: string | null
}

export type DashboardData = {
  ordersCount: number
  invoicesCount: number
  serviceCount: number
  claimsCount: number
  unreadNotifications: number
  recentOrders: Order[]
  unpaidInvoices: Invoice[]
}

export type CompanyInfo = {
  id: string
  name: string
  ico: string | null
  dic: string | null
  addresses: CompanyAddress[]
  contacts: CompanyContact[]
}

export type Document = {
  id: string
  name: string
  description: string | null
  category: string
  manufacturer: string
  fileUrl: string
  fileSize: number | null
}

// ─── Mock data (PORTAL_MOCK=true) ───────────────────────────────────

const MOCK_ORDERS: Order[] = [
  { id: "1", orderNumber: "OBJ-2026-0042", title: "SAMSON 3241 DN50 + příslušenství", date: "2026-02-15", status: "shipped", amount: 1250000, currency: "CZK", deliveryDate: "2026-03-05" },
  { id: "2", orderNumber: "OBJ-2026-0038", title: "SAMSON 3241 DN25", date: "2026-02-01", status: "delivered", amount: 875000, currency: "CZK", deliveryDate: null },
  { id: "3", orderNumber: "OBJ-2026-0035", title: "SAMSON 3241 DN100 + montážní sada", date: "2026-01-20", status: "delivered", amount: 2340000, currency: "CZK", deliveryDate: null },
]

const MOCK_INVOICES: Invoice[] = [
  { id: "1", invoiceNumber: "FA-2026-0042", title: "Faktura k OBJ-2026-0042", date: "2026-02-20", dueDate: "2026-03-20", status: "sent", amount: 1250000, currency: "CZK" },
  { id: "2", invoiceNumber: "FA-2026-0038", title: "Faktura k OBJ-2026-0038", date: "2026-02-05", dueDate: "2026-03-05", status: "paid", amount: 875000, currency: "CZK" },
  { id: "3", invoiceNumber: "FA-2026-0035", title: "Faktura k OBJ-2026-0035", date: "2026-01-25", dueDate: "2026-02-25", status: "overdue", amount: 2340000, currency: "CZK" },
]

const MOCK_SERVICE_REQUESTS: ServiceRequest[] = [
  { id: "1", title: "Servis regulačního ventilu SAMSON 3241", description: "Výměna pohonu a seřízení", priority: "high", status: "in_progress", scheduledDate: "2026-03-10", createdAt: "2026-02-10" },
  { id: "2", title: "Preventivní údržba ventilové baterie", description: "Plánovaná údržba 5 ventilů", priority: "normal", status: "completed", scheduledDate: null, createdAt: "2025-11-05" },
]

const MOCK_CLAIMS: Claim[] = [
  { id: "1", title: "Vadný ventil typ 3241 — netěsnost", description: "Ventil vykazuje netěsnost po 2 měsících provozu", status: "evaluating", createdAt: "2026-01-15", resolvedAt: null },
]

const MOCK_COMPANY: CompanyInfo = {
  id: "mock-company",
  name: "Demo Firma s.r.o.",
  ico: "12345678",
  dic: "CZ12345678",
  addresses: [{ street: "Průmyslová 42", city: "Praha 1", zip: "110 00", country: "CZ", type: "billing" }],
  contacts: [{ name: "Jan Novák", email: "novak@demo.cz", phone: "+420 123 456 789", role: "Nákupčí", isPrimary: true }],
}

const useMock = () => process.env.PORTAL_MOCK === "true"

// ─── Queries ─────────────────────────────────────────────────────────

export async function getDashboardData(companyId: string): Promise<DashboardData> {
  if (useMock()) {
    return {
      ordersCount: MOCK_ORDERS.length,
      invoicesCount: MOCK_INVOICES.length,
      serviceCount: MOCK_SERVICE_REQUESTS.length,
      claimsCount: MOCK_CLAIMS.length,
      unreadNotifications: 0,
      recentOrders: MOCK_ORDERS.slice(0, 3),
      unpaidInvoices: MOCK_INVOICES.filter((i) => i.status !== "paid"),
    }
  }

  const [ordersResult, invoicesResult, serviceResult, claimsResult, notifResult, recentOrders, unpaidInvoices] =
    await Promise.all([
      db.select({ count: count() }).from(intranetOrders).where(and(eq(intranetOrders.companyId, companyId), eq(intranetOrders.type, "customer"), isNull(intranetOrders.deletedAt))),
      db.select({ count: count() }).from(intranetInvoices).where(and(eq(intranetInvoices.companyId, companyId), isNull(intranetInvoices.deletedAt))),
      db.select({ count: count() }).from(intranetServiceRequests).where(and(eq(intranetServiceRequests.companyId, companyId), isNull(intranetServiceRequests.deletedAt))),
      db.select({ count: count() }).from(intranetClaims).where(and(eq(intranetClaims.companyId, companyId), isNull(intranetClaims.deletedAt))),
      // Unread notifications count
      (async () => {
        const users = await db.select({ id: portalUsers.id }).from(portalUsers).where(and(eq(portalUsers.companyId, companyId), eq(portalUsers.isActive, true), isNull(portalUsers.deletedAt)))
        if (users.length === 0) return [{ count: 0 }]
        return db.select({ count: count() }).from(portalNotifications).where(and(eq(portalNotifications.userId, users[0].id), eq(portalNotifications.isRead, false)))
      })(),
      // Recent orders
      db
        .select({
          id: intranetOrders.id,
          orderNumber: intranetOrders.orderNumber,
          title: intranetOrders.title,
          orderedAt: intranetOrders.orderedAt,
          status: intranetOrders.status,
          amount: intranetOrders.amount,
          currency: intranetOrders.currency,
          deliveryDate: intranetOrders.deliveryDate,
        })
        .from(intranetOrders)
        .where(and(eq(intranetOrders.companyId, companyId), eq(intranetOrders.type, "customer"), isNull(intranetOrders.deletedAt)))
        .orderBy(desc(intranetOrders.orderedAt))
        .limit(5),
      // Unpaid invoices
      db
        .select({
          id: intranetInvoices.id,
          invoiceNumber: intranetInvoices.invoiceNumber,
          title: intranetInvoices.title,
          issueDate: intranetInvoices.issueDate,
          dueDate: intranetInvoices.dueDate,
          status: intranetInvoices.status,
          amount: intranetInvoices.amount,
          currency: intranetInvoices.currency,
        })
        .from(intranetInvoices)
        .where(
          and(
            eq(intranetInvoices.companyId, companyId),
            isNull(intranetInvoices.deletedAt),
            sql`${intranetInvoices.status} IN ('sent', 'overdue')`,
          ),
        )
        .orderBy(desc(intranetInvoices.dueDate))
        .limit(5),
    ])

  return {
    ordersCount: ordersResult[0]?.count ?? 0,
    invoicesCount: invoicesResult[0]?.count ?? 0,
    serviceCount: serviceResult[0]?.count ?? 0,
    claimsCount: claimsResult[0]?.count ?? 0,
    unreadNotifications: notifResult[0]?.count ?? 0,
    recentOrders: recentOrders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      title: o.title,
      date: o.orderedAt.toISOString(),
      status: o.status,
      amount: o.amount,
      currency: o.currency,
      deliveryDate: o.deliveryDate,
    })),
    unpaidInvoices: unpaidInvoices.map((i) => ({
      id: i.id,
      invoiceNumber: i.invoiceNumber,
      title: i.title,
      date: i.issueDate,
      dueDate: i.dueDate,
      status: i.status,
      amount: i.amount,
      currency: i.currency,
    })),
  }
}

export async function getOrders(companyId: string, statusFilter?: string): Promise<Order[]> {
  if (useMock()) {
    const filtered = statusFilter ? MOCK_ORDERS.filter((o) => o.status === statusFilter) : MOCK_ORDERS
    return filtered
  }

  const conditions = [
    eq(intranetOrders.companyId, companyId),
    eq(intranetOrders.type, "customer"),
    isNull(intranetOrders.deletedAt),
  ]
  if (statusFilter) {
    conditions.push(eq(intranetOrders.status, statusFilter))
  }

  const rows = await db
    .select({
      id: intranetOrders.id,
      orderNumber: intranetOrders.orderNumber,
      title: intranetOrders.title,
      orderedAt: intranetOrders.orderedAt,
      status: intranetOrders.status,
      amount: intranetOrders.amount,
      currency: intranetOrders.currency,
      deliveryDate: intranetOrders.deliveryDate,
    })
    .from(intranetOrders)
    .where(and(...conditions))
    .orderBy(desc(intranetOrders.orderedAt))

  return rows.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    title: o.title,
    date: o.orderedAt.toISOString(),
    status: o.status,
    amount: o.amount,
    currency: o.currency,
    deliveryDate: o.deliveryDate,
  }))
}

export async function getOrderById(companyId: string, orderId: string): Promise<OrderDetail | null> {
  if (useMock()) {
    const o = MOCK_ORDERS.find((o) => o.id === orderId)
    return o ? { ...o, note: null, confirmedAt: null, shippedAt: null, deliveredAt: null } : null
  }

  const [row] = await db
    .select()
    .from(intranetOrders)
    .where(
      and(
        eq(intranetOrders.id, orderId),
        eq(intranetOrders.companyId, companyId),
        eq(intranetOrders.type, "customer"),
        isNull(intranetOrders.deletedAt),
      ),
    )
    .limit(1)

  if (!row) return null

  return {
    id: row.id,
    orderNumber: row.orderNumber,
    title: row.title,
    date: row.orderedAt.toISOString(),
    status: row.status,
    amount: row.amount,
    currency: row.currency,
    deliveryDate: row.deliveryDate,
    note: row.note,
    confirmedAt: row.confirmedAt?.toISOString() ?? null,
    shippedAt: row.shippedAt?.toISOString() ?? null,
    deliveredAt: row.deliveredAt?.toISOString() ?? null,
  }
}

export async function getInvoices(companyId: string, statusFilter?: string): Promise<Invoice[]> {
  if (useMock()) {
    const filtered = statusFilter ? MOCK_INVOICES.filter((i) => i.status === statusFilter) : MOCK_INVOICES
    return filtered
  }

  const conditions = [
    eq(intranetInvoices.companyId, companyId),
    isNull(intranetInvoices.deletedAt),
  ]
  if (statusFilter) {
    conditions.push(eq(intranetInvoices.status, statusFilter))
  }

  const rows = await db
    .select({
      id: intranetInvoices.id,
      invoiceNumber: intranetInvoices.invoiceNumber,
      title: intranetInvoices.title,
      issueDate: intranetInvoices.issueDate,
      dueDate: intranetInvoices.dueDate,
      status: intranetInvoices.status,
      amount: intranetInvoices.amount,
      currency: intranetInvoices.currency,
    })
    .from(intranetInvoices)
    .where(and(...conditions))
    .orderBy(desc(intranetInvoices.issueDate))

  return rows.map((i) => ({
    id: i.id,
    invoiceNumber: i.invoiceNumber,
    title: i.title,
    date: i.issueDate,
    dueDate: i.dueDate,
    status: i.status,
    amount: i.amount,
    currency: i.currency,
  }))
}

export async function getInvoiceById(companyId: string, invoiceId: string): Promise<InvoiceDetail | null> {
  if (useMock()) {
    const i = MOCK_INVOICES.find((i) => i.id === invoiceId)
    return i ? { ...i, orderId: null, paidAt: null, note: null } : null
  }

  const [row] = await db
    .select()
    .from(intranetInvoices)
    .where(
      and(
        eq(intranetInvoices.id, invoiceId),
        eq(intranetInvoices.companyId, companyId),
        isNull(intranetInvoices.deletedAt),
      ),
    )
    .limit(1)

  if (!row) return null

  return {
    id: row.id,
    invoiceNumber: row.invoiceNumber,
    title: row.title,
    date: row.issueDate,
    dueDate: row.dueDate,
    status: row.status,
    amount: row.amount,
    currency: row.currency,
    orderId: row.orderId,
    paidAt: row.paidAt?.toISOString() ?? null,
    note: row.note,
  }
}

export async function getServiceRequests(companyId: string, statusFilter?: string): Promise<ServiceRequest[]> {
  if (useMock()) {
    const filtered = statusFilter ? MOCK_SERVICE_REQUESTS.filter((s) => s.status === statusFilter) : MOCK_SERVICE_REQUESTS
    return filtered
  }

  const conditions = [
    eq(intranetServiceRequests.companyId, companyId),
    isNull(intranetServiceRequests.deletedAt),
  ]
  if (statusFilter) {
    conditions.push(eq(intranetServiceRequests.status, statusFilter))
  }

  const rows = await db
    .select()
    .from(intranetServiceRequests)
    .where(and(...conditions))
    .orderBy(desc(intranetServiceRequests.createdAt))

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    priority: r.priority,
    status: r.status,
    scheduledDate: r.scheduledDate,
    createdAt: r.createdAt.toISOString(),
  }))
}

export async function getServiceRequestById(companyId: string, id: string): Promise<ServiceRequest | null> {
  if (useMock()) {
    return MOCK_SERVICE_REQUESTS.find((s) => s.id === id) ?? null
  }

  const [row] = await db
    .select()
    .from(intranetServiceRequests)
    .where(
      and(
        eq(intranetServiceRequests.id, id),
        eq(intranetServiceRequests.companyId, companyId),
        isNull(intranetServiceRequests.deletedAt),
      ),
    )
    .limit(1)

  if (!row) return null

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    priority: row.priority,
    status: row.status,
    scheduledDate: row.scheduledDate,
    createdAt: row.createdAt.toISOString(),
  }
}

export async function getClaims(companyId: string, statusFilter?: string): Promise<Claim[]> {
  if (useMock()) {
    const filtered = statusFilter ? MOCK_CLAIMS.filter((c) => c.status === statusFilter) : MOCK_CLAIMS
    return filtered
  }

  const conditions = [
    eq(intranetClaims.companyId, companyId),
    isNull(intranetClaims.deletedAt),
  ]
  if (statusFilter) {
    conditions.push(eq(intranetClaims.status, statusFilter))
  }

  const rows = await db
    .select()
    .from(intranetClaims)
    .where(and(...conditions))
    .orderBy(desc(intranetClaims.createdAt))

  return rows.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    status: c.status,
    createdAt: c.createdAt.toISOString(),
    resolvedAt: c.resolvedAt?.toISOString() ?? null,
  }))
}

export async function getClaimById(companyId: string, id: string): Promise<Claim | null> {
  if (useMock()) {
    return MOCK_CLAIMS.find((c) => c.id === id) ?? null
  }

  const [row] = await db
    .select()
    .from(intranetClaims)
    .where(
      and(
        eq(intranetClaims.id, id),
        eq(intranetClaims.companyId, companyId),
        isNull(intranetClaims.deletedAt),
      ),
    )
    .limit(1)

  if (!row) return null

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    resolvedAt: row.resolvedAt?.toISOString() ?? null,
  }
}

export async function getDocuments(_companyId: string): Promise<Document[]> {
  if (useMock()) {
    return [
      { id: "1", name: "Certifikát ventilu SAMSON 3241", description: null, category: "certificate", manufacturer: "SAMSON", fileUrl: "/documents/cert-3241.pdf", fileSize: 1200000 },
      { id: "2", name: "Protokol o zkoušce", description: null, category: "protocol", manufacturer: "SAMSON", fileUrl: "/documents/test-report-42.pdf", fileSize: 800000 },
    ]
  }

  // For now, return public downloads. Later: add company-specific documents.
  const rows = await db
    .select({
      id: downloads.id,
      name: downloads.name,
      description: downloads.description,
      category: downloads.category,
      manufacturer: downloads.manufacturer,
      fileUrl: downloads.fileUrl,
      fileSize: downloads.fileSize,
    })
    .from(downloads)
    .where(and(eq(downloads.isPublic, true), isNull(downloads.deletedAt)))
    .orderBy(desc(downloads.createdAt))

  return rows
}

export async function getCompanyInfo(companyId: string): Promise<CompanyInfo | null> {
  if (useMock()) {
    return MOCK_COMPANY
  }

  const [row] = await db
    .select()
    .from(intranetCompanies)
    .where(
      and(
        eq(intranetCompanies.id, companyId),
        isNull(intranetCompanies.deletedAt),
      ),
    )
    .limit(1)

  if (!row) return null

  return {
    id: row.id,
    name: row.name,
    ico: row.ico,
    dic: row.dic,
    addresses: (row.addresses as CompanyAddress[]) ?? [],
    contacts: (row.contacts as CompanyContact[]) ?? [],
  }
}
