"use server"

import { getPortalSession } from "@/lib/portal/get-session"
import { db } from "@/lib/db"
import { portalUsers } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { hash, compare } from "bcryptjs"

type ActionResult = {
  success: boolean
  error?: string
}

export async function updateProfile(formData: FormData): Promise<ActionResult> {
  const session = await getPortalSession()

  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const phone = formData.get("phone") as string
  const jobTitle = formData.get("jobTitle") as string

  if (!firstName?.trim() || !lastName?.trim()) {
    return { success: false, error: "Jmeno a prijmeni jsou povinne." }
  }

  try {
    await db
      .update(portalUsers)
      .set({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone?.trim() || null,
        jobTitle: jobTitle?.trim() || null,
        updatedAt: new Date(),
      })
      .where(eq(portalUsers.id, session.userId))

    return { success: true }
  } catch {
    return { success: false, error: "Nepodarilo se aktualizovat profil." }
  }
}

export async function changePassword(
  formData: FormData,
): Promise<ActionResult> {
  const session = await getPortalSession()

  const currentPassword = formData.get("currentPassword") as string
  const newPassword = formData.get("newPassword") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, error: "Vsechna pole jsou povinna." }
  }

  if (newPassword.length < 8) {
    return {
      success: false,
      error: "Nove heslo musi mit alespon 8 znaku.",
    }
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: "Hesla se neshoduji." }
  }

  try {
    const [user] = await db
      .select({ passwordHash: portalUsers.passwordHash })
      .from(portalUsers)
      .where(eq(portalUsers.id, session.userId))
      .limit(1)

    if (!user?.passwordHash) {
      return { success: false, error: "Uzivatel nenalezen." }
    }

    const valid = await compare(currentPassword, user.passwordHash)
    if (!valid) {
      return { success: false, error: "Soucasne heslo neni spravne." }
    }

    const newHash = await hash(newPassword, 12)
    await db
      .update(portalUsers)
      .set({
        passwordHash: newHash,
        updatedAt: new Date(),
      })
      .where(eq(portalUsers.id, session.userId))

    return { success: true }
  } catch {
    return { success: false, error: "Nepodarilo se zmenit heslo." }
  }
}
