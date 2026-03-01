const store = new Map<string, { count: number; expiresAt: number }>()

let lastCleanup = Date.now()

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < 60_000) return
  lastCleanup = now
  for (const [key, entry] of store) {
    if (entry.expiresAt < now) store.delete(key)
  }
}

export function rateLimit(
  ip: string,
  limit = 5,
  windowMs = 60_000
): { success: boolean; remaining: number } {
  cleanup()

  const now = Date.now()
  const entry = store.get(ip)

  if (!entry || entry.expiresAt < now) {
    store.set(ip, { count: 1, expiresAt: now + windowMs })
    return { success: true, remaining: limit - 1 }
  }

  entry.count++

  if (entry.count > limit) {
    return { success: false, remaining: 0 }
  }

  return { success: true, remaining: limit - entry.count }
}
