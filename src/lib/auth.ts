import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { db } from "@/lib/db"
import { portalUsers } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Heslo", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const [user] = await db
          .select()
          .from(portalUsers)
          .where(eq(portalUsers.email, credentials.email as string))
          .limit(1)

        if (!user || !user.isActive || !user.passwordHash) return null

        const valid = await compare(
          credentials.password as string,
          user.passwordHash,
        )
        if (!valid) return null

        return {
          id: user.id,
          email: user.email,
          companyId: user.companyId,
          role: user.role || "portal_user",
          firstName: user.firstName,
          lastName: user.lastName,
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/portal/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!
        token.companyId = user.companyId
        token.role = user.role
        token.firstName = user.firstName
        token.lastName = user.lastName
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      session.user.companyId = token.companyId
      session.user.role = token.role
      session.user.firstName = token.firstName
      session.user.lastName = token.lastName
      return session
    },
  },
})
