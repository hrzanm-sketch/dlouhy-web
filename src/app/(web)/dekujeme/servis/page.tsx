import type { Metadata } from "next"
import { SuccessMessage } from "@/components/shared/success-message"

export const metadata: Metadata = {
  title: "Děkujeme za servisní požadavek",
}

export default function DekujemeServisPage() {
  return (
    <SuccessMessage
      title="Děkujeme za servisní požadavek"
      description="Náš servisní tým se s Vámi spojí ohledně termínu. U naléhavých požadavků do 4 hodin."
      backLink={{ href: "/", label: "Zpět na hlavní stránku" }}
    />
  )
}
