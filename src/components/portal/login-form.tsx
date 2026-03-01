"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Neplatny email nebo heslo")
      } else {
        router.push("/portal/dashboard")
      }
    } catch {
      setError("Doslo k chybe. Zkuste to znovu.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium text-neutral-700"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-dt-blue focus:ring-1 focus:ring-dt-blue focus:outline-none"
          placeholder="vas@email.cz"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-sm font-medium text-neutral-700"
        >
          Heslo
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-dt-blue focus:ring-1 focus:ring-dt-blue focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-dt-blue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-dt-blue-light focus:ring-2 focus:ring-dt-blue focus:ring-offset-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Prihlasuji..." : "Prihlasit se"}
      </button>
    </form>
  )
}
