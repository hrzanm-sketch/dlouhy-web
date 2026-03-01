import { db } from "@/lib/db"
import {
  portalNotifications,
} from "@/lib/db/schema/portal-notifications"
import { portalUsers } from "@/lib/db/schema/portal-users"
import { eq, and, desc, count, isNull } from "drizzle-orm"

export type CreateNotificationData = {
  companyId: string
  type: string
  title: string
  message: string
  relatedId: string
  relatedUrl: string
}

export async function createNotification(data: CreateNotificationData) {
  // Look up all active portal users for this company
  const users = await db
    .select({ id: portalUsers.id })
    .from(portalUsers)
    .where(
      and(
        eq(portalUsers.companyId, data.companyId),
        eq(portalUsers.isActive, true),
        isNull(portalUsers.deletedAt),
      ),
    )

  if (users.length === 0) {
    console.log(
      `[Notification] No active portal users for company ${data.companyId}`,
    )
    return []
  }

  const rows = await db
    .insert(portalNotifications)
    .values(
      users.map((u) => ({
        userId: u.id,
        type: data.type,
        title: data.title,
        body: data.message,
        linkUrl: data.relatedUrl,
      })),
    )
    .returning()

  console.log(
    `[Notification] Created ${rows.length} notification(s): "${data.title}" for company ${data.companyId}`,
  )
  return rows
}

export async function getNotifications(companyId: string) {
  const users = await db
    .select({ id: portalUsers.id })
    .from(portalUsers)
    .where(
      and(
        eq(portalUsers.companyId, companyId),
        eq(portalUsers.isActive, true),
        isNull(portalUsers.deletedAt),
      ),
    )

  if (users.length === 0) return []

  // For portal, typically one user per session — use first match
  const userId = users[0].id

  return db
    .select()
    .from(portalNotifications)
    .where(eq(portalNotifications.userId, userId))
    .orderBy(desc(portalNotifications.createdAt))
}

export async function getUnreadCount(companyId: string): Promise<number> {
  const users = await db
    .select({ id: portalUsers.id })
    .from(portalUsers)
    .where(
      and(
        eq(portalUsers.companyId, companyId),
        eq(portalUsers.isActive, true),
        isNull(portalUsers.deletedAt),
      ),
    )

  if (users.length === 0) return 0

  const userId = users[0].id

  const result = await db
    .select({ count: count() })
    .from(portalNotifications)
    .where(
      and(
        eq(portalNotifications.userId, userId),
        eq(portalNotifications.isRead, false),
      ),
    )

  return result[0]?.count ?? 0
}

export async function markAsRead(notificationId: string): Promise<boolean> {
  const result = await db
    .update(portalNotifications)
    .set({ isRead: true })
    .where(eq(portalNotifications.id, notificationId))
    .returning({ id: portalNotifications.id })

  return result.length > 0
}

export async function markAllRead(companyId: string): Promise<number> {
  const users = await db
    .select({ id: portalUsers.id })
    .from(portalUsers)
    .where(
      and(
        eq(portalUsers.companyId, companyId),
        eq(portalUsers.isActive, true),
        isNull(portalUsers.deletedAt),
      ),
    )

  if (users.length === 0) return 0

  const userId = users[0].id

  const result = await db
    .update(portalNotifications)
    .set({ isRead: true })
    .where(
      and(
        eq(portalNotifications.userId, userId),
        eq(portalNotifications.isRead, false),
      ),
    )
    .returning({ id: portalNotifications.id })

  return result.length
}
