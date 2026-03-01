import type { Metadata } from "next"
import { SuccessMessage } from "@/components/shared/success-message"

export const metadata: Metadata = {
  title: "Děkujeme za poptávku",
}

export default function DekujemePoptavkaPage() {
  return (
    <SuccessMessage
      title="Děkujeme za poptávku"
      description="Vaši poptávku jsme přijali. Náš obchodní tým se Vám ozve do 24 hodin v pracovní dny."
      details={[
        "Zkontrolujte prosím svůj email pro potvrzení.",
        "V případě naléhavých záležitostí nás kontaktujte telefonicky.",
      ]}
      backLink={{ href: "/", label: "Zpět na hlavní stránku" }}
    />
  )
}
