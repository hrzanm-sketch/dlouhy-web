import type { Metadata } from "next"
import { JsonLd } from "@/components/shared/json-ld"
import { organizationJsonLd } from "@/lib/seo"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Dlouhy Technology — Regulační ventily, hořáky, servis",
    template: "%s | Dlouhy Technology",
  },
  description:
    "Výhradní distributor SAMSON pro ČR a SK. Regulační ventily, recirkulační ventily SCHROEDAHL/CIRCOR, hořáky ELCO. Servis, náhradní díly, poradenství.",
  metadataBase: new URL(process.env.AUTH_URL || "https://dlouhy-technology.cz"),
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    siteName: "Dlouhy Technology",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="cs">
      <body className="antialiased">
        <JsonLd data={organizationJsonLd()} />
        {children}
      </body>
    </html>
  )
}
