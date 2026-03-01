import type { Metadata } from "next"
import { SuccessMessage } from "@/components/shared/success-message"

export const metadata: Metadata = {
  title: "Děkujeme za nahlášení reklamace",
}

export default function DekujemeReklamacePage() {
  return (
    <SuccessMessage
      title="Děkujeme za nahlášení reklamace"
      description="Vaše reklamace bude vyřízena do 30 dnů dle zákona. O průběhu Vás budeme informovat emailem."
      backLink={{ href: "/", label: "Zpět na hlavní stránku" }}
    />
  )
}
