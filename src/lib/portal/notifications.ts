// TODO: Replace with real Drizzle queries against portal_notifications table

export type PortalNotification = {
  id: string
  companyId: string
  type: "order_status" | "new_invoice" | "service_update" | "claim_update"
  title: string
  message: string
  relatedId: string
  relatedUrl: string
  isRead: boolean
  createdAt: string
}

// In-memory store for development (replaced by DB in production)
const notifications: PortalNotification[] = []

export async function createNotification(data: Omit<PortalNotification, "id" | "isRead" | "createdAt">): Promise<PortalNotification> {
  const notification: PortalNotification = {
    ...data,
    id: crypto.randomUUID(),
    isRead: false,
    createdAt: new Date().toISOString(),
  }
  notifications.unshift(notification)
  // TODO: INSERT INTO portal_notifications VALUES (...)
  console.log("[Notification] Created:", notification.title, "for company", data.companyId)
  return notification
}

export async function getNotifications(companyId: string): Promise<PortalNotification[]> {
  // TODO: SELECT * FROM portal_notifications WHERE company_id = companyId ORDER BY created_at DESC
  return notifications.filter((n) => n.companyId === companyId)
}

export async function getUnreadCount(companyId: string): Promise<number> {
  // TODO: SELECT COUNT(*) FROM portal_notifications WHERE company_id = companyId AND is_read = false
  return notifications.filter((n) => n.companyId === companyId && !n.isRead).length
}

export async function markAsRead(notificationId: string): Promise<boolean> {
  // TODO: UPDATE portal_notifications SET is_read = true WHERE id = notificationId
  const notification = notifications.find((n) => n.id === notificationId)
  if (notification) {
    notification.isRead = true
    return true
  }
  return false
}

export async function markAllRead(companyId: string): Promise<number> {
  // TODO: UPDATE portal_notifications SET is_read = true WHERE company_id = companyId AND is_read = false
  let count = 0
  for (const n of notifications) {
    if (n.companyId === companyId && !n.isRead) {
      n.isRead = true
      count++
    }
  }
  return count
}
