import { db } from "@/lib/db"
import { portalUsers } from "@/lib/db/schema/portal-users"
import { eq, and, isNull } from "drizzle-orm"

/**
 * Get active portal users for a company who should receive email notifications.
 * Checks the emailNotifications JSONB field for the given notification type.
 */
export async function getPortalUsersForEmail(
  companyId: string,
  notificationType: string,
): Promise<{ id: string; email: string }[]> {
  const users = await db
    .select({
      id: portalUsers.id,
      email: portalUsers.email,
      emailNotifications: portalUsers.emailNotifications,
    })
    .from(portalUsers)
    .where(
      and(
        eq(portalUsers.companyId, companyId),
        eq(portalUsers.isActive, true),
        isNull(portalUsers.deletedAt),
      ),
    )

  // Filter users who have this notification type enabled (or haven't configured preferences yet)
  return users.filter((u) => {
    const prefs = u.emailNotifications as Record<string, boolean> | null
    if (!prefs || Object.keys(prefs).length === 0) return true // default: all enabled
    return prefs[notificationType] !== false
  })
}
