// TODO: Replace with real Drizzle queries against intranet tables

export type Order = {
  id: string
  orderNumber: string
  date: string
  status: "pending" | "confirmed" | "shipped" | "completed"
  amount: number // in halere
  itemCount: number
}

export type Invoice = {
  id: string
  invoiceNumber: string
  date: string
  dueDate: string
  status: "unpaid" | "paid" | "overdue"
  amount: number
}

export type DashboardData = {
  ordersCount: number
  invoicesCount: number
  serviceCount: number
  claimsCount: number
  recentOrders: Order[]
  unpaidInvoices: Invoice[]
}

// Mock data
const MOCK_ORDERS: Order[] = [
  {
    id: "1",
    orderNumber: "OBJ-2026-0042",
    date: "2026-02-15",
    status: "shipped",
    amount: 1250000,
    itemCount: 3,
  },
  {
    id: "2",
    orderNumber: "OBJ-2026-0038",
    date: "2026-02-01",
    status: "completed",
    amount: 875000,
    itemCount: 1,
  },
  {
    id: "3",
    orderNumber: "OBJ-2026-0035",
    date: "2026-01-20",
    status: "completed",
    amount: 2340000,
    itemCount: 5,
  },
  {
    id: "4",
    orderNumber: "OBJ-2025-0198",
    date: "2025-12-10",
    status: "completed",
    amount: 456000,
    itemCount: 2,
  },
  {
    id: "5",
    orderNumber: "OBJ-2025-0187",
    date: "2025-11-28",
    status: "completed",
    amount: 1890000,
    itemCount: 4,
  },
]

const MOCK_INVOICES: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "FA-2026-0042",
    date: "2026-02-20",
    dueDate: "2026-03-20",
    status: "unpaid",
    amount: 1250000,
  },
  {
    id: "2",
    invoiceNumber: "FA-2026-0038",
    date: "2026-02-05",
    dueDate: "2026-03-05",
    status: "paid",
    amount: 875000,
  },
  {
    id: "3",
    invoiceNumber: "FA-2026-0035",
    date: "2026-01-25",
    dueDate: "2026-02-25",
    status: "overdue",
    amount: 2340000,
  },
  {
    id: "4",
    invoiceNumber: "FA-2025-0198",
    date: "2025-12-15",
    dueDate: "2026-01-15",
    status: "paid",
    amount: 456000,
  },
  {
    id: "5",
    invoiceNumber: "FA-2025-0187",
    date: "2025-12-02",
    dueDate: "2026-01-02",
    status: "paid",
    amount: 1890000,
  },
]

export async function getOrders(_companyId: string): Promise<Order[]> {
  // TODO: SELECT * FROM orders WHERE company_id = companyId
  return MOCK_ORDERS
}

export async function getOrderById(_companyId: string, orderId: string) {
  // TODO: Real query
  return MOCK_ORDERS.find((o) => o.id === orderId) ?? null
}

export async function getInvoices(_companyId: string): Promise<Invoice[]> {
  return MOCK_INVOICES
}

export async function getInvoiceById(_companyId: string, invoiceId: string) {
  return MOCK_INVOICES.find((i) => i.id === invoiceId) ?? null
}

export async function getDashboardData(
  _companyId: string,
): Promise<DashboardData> {
  return {
    ordersCount: 5,
    invoicesCount: 5,
    serviceCount: 2,
    claimsCount: 1,
    recentOrders: MOCK_ORDERS.slice(0, 3),
    unpaidInvoices: MOCK_INVOICES.filter((i) => i.status !== "paid"),
  }
}
