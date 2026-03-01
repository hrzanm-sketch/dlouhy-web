import Link from "next/link"
import { cn } from "@/lib/utils"

export type Notification = {
  id: string
  type: "order_status" | "new_invoice" | "service_update" | "claim_update"
  title: string
  message: string
  relatedUrl: string
  isRead: boolean
  createdAt: string
}

const TYPE_ICONS: Record<Notification["type"], string> = {
  order_status: "\uD83D\uDCE6",
  new_invoice: "\uD83E\uDDFE",
  service_update: "\uD83D\uDD27",
  claim_update: "\u26A0\uFE0F",
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = Math.floor((now - date) / 1000)
  if (diff < 60) return "prave ted"
  if (diff < 3600) return `pred ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `pred ${Math.floor(diff / 3600)} hod`
  return `pred ${Math.floor(diff / 86400)} dny`
}

export function NotificationList({
  notifications,
  onMarkAsRead,
}: {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
}) {
  if (notifications.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-neutral-500">
        Zadne notifikace.
      </p>
    )
  }

  return (
    <ul>
      {notifications.map((n) => (
        <li key={n.id}>
          <Link
            href={n.relatedUrl}
            onClick={() => !n.isRead && onMarkAsRead(n.id)}
            className={cn(
              "flex gap-3 px-4 py-3 transition-colors hover:bg-neutral-50",
              !n.isRead && "bg-blue-50",
            )}
          >
            <span className="mt-0.5 text-lg">{TYPE_ICONS[n.type]}</span>
            <div className="min-w-0 flex-1">
              <p className={cn("text-sm", !n.isRead ? "font-medium text-neutral-900" : "text-neutral-700")}>
                {n.title}
              </p>
              <p className="truncate text-xs text-neutral-500">{n.message}</p>
              <p className="mt-0.5 text-xs text-neutral-400">{timeAgo(n.createdAt)}</p>
            </div>
            {!n.isRead && (
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-dt-blue" />
            )}
          </Link>
        </li>
      ))}
    </ul>
  )
}
