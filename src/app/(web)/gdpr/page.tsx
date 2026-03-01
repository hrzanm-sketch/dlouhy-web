import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Zásady ochrany osobních údajů",
  description:
    "Informace o zpracování osobních údajů společností Dlouhý Technology s.r.o. dle nařízení GDPR.",
}

export default function GdprPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
        Zásady ochrany osobních údajů
      </h1>

      <div className="mt-10 space-y-10 text-neutral-600 leading-relaxed">
        {/* Správce */}
        <section>
          <h2 className="text-xl font-semibold text-neutral-900">
            1. Správce osobních údajů
          </h2>
          <div className="mt-3 space-y-3">
            <p>
              Správcem osobních údajů je společnost Dlouhý Technology s.r.o.,
              se sídlem Kaštanová 489/34, 620 00 Brno, IČO: 29364311,
              DIČ: CZ29364311, zapsaná v obchodním rejstříku vedeném Krajským
              soudem v Brně (dále jen &bdquo;správce&ldquo;).
            </p>
          </div>
        </section>

        {/* Účel zpracování */}
        <section>
          <h2 className="text-xl font-semibold text-neutral-900">
            2. Účel zpracování osobních údajů
          </h2>
          <div className="mt-3 space-y-3">
            <p>Osobní údaje zpracováváme za těmito účely:</p>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                Zpracování poptávek a obchodních nabídek
              </li>
              <li>
                Plnění smluvních závazků (dodávky zboží a služeb)
              </li>
              <li>
                Vyřizování servisních požadavků a reklamací
              </li>
              <li>
                Správa zákaznického portálu
              </li>
              <li>
                Zasílání obchodních sdělení (pouze se souhlasem)
              </li>
              <li>
                Plnění zákonných povinností (účetnictví, daňové předpisy)
              </li>
            </ul>
          </div>
        </section>

        {/* Právní základ */}
        <section>
          <h2 className="text-xl font-semibold text-neutral-900">
            3. Právní základ zpracování
          </h2>
          <div className="mt-3 space-y-3">
            <p>Osobní údaje zpracováváme na základě:</p>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                Plnění smlouvy nebo provedení opatření před uzavřením smlouvy
                (čl. 6 odst. 1 písm. b) GDPR)
              </li>
              <li>
                Plnění právních povinností správce (čl. 6 odst. 1 písm. c)
                GDPR)
              </li>
              <li>
                Oprávněného zájmu správce (čl. 6 odst. 1 písm. f) GDPR)
              </li>
              <li>
                Souhlasu subjektu údajů pro zasílání obchodních sdělení (čl. 6
                odst. 1 písm. a) GDPR)
              </li>
            </ul>
          </div>
        </section>

        {/* Doba uchování */}
        <section>
          <h2 className="text-xl font-semibold text-neutral-900">
            4. Doba uchování osobních údajů
          </h2>
          <div className="mt-3 space-y-3">
            <p>
              Osobní údaje uchováváme po dobu nezbytnou k naplnění účelů
              zpracování:
            </p>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                Smluvní údaje: po dobu trvání smlouvy a 10 let po jejím
                ukončení
              </li>
              <li>
                Účetní doklady: 10 let dle zákona o účetnictví
              </li>
              <li>
                Poptávky bez uzavřené smlouvy: 2 roky od posledního kontaktu
              </li>
              <li>
                Marketingové souhlasy: do odvolání souhlasu
              </li>
            </ul>
          </div>
        </section>

        {/* Práva subjektů */}
        <section>
          <h2 className="text-xl font-semibold text-neutral-900">
            5. Práva subjektů údajů
          </h2>
          <div className="mt-3 space-y-3">
            <p>V souvislosti se zpracováním osobních údajů máte právo na:</p>
            <ul className="ml-6 list-disc space-y-1">
              <li>Přístup k osobním údajům</li>
              <li>Opravu nepřesných údajů</li>
              <li>Výmaz údajů (&bdquo;právo být zapomenut&ldquo;)</li>
              <li>Omezení zpracování</li>
              <li>Přenositelnost údajů</li>
              <li>Námitku proti zpracování</li>
              <li>Odvolání souhlasu se zpracováním</li>
            </ul>
            <p>
              Svá práva můžete uplatnit kontaktováním správce na emailové adrese
              uvedené níže. Na vaši žádost odpovíme bez zbytečného odkladu,
              nejpozději do 30 dnů.
            </p>
          </div>
        </section>

        {/* Kontakt DPO */}
        <section>
          <h2 className="text-xl font-semibold text-neutral-900">
            6. Kontakt
          </h2>
          <div className="mt-3 space-y-3">
            <p>
              V případě dotazů ohledně zpracování osobních údajů nás
              kontaktujte:
            </p>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                Email:{" "}
                <a
                  href="mailto:gdpr@dlouhy-technology.cz"
                  className="text-dt-blue hover:underline"
                >
                  gdpr@dlouhy-technology.cz
                </a>
              </li>
              <li>
                Poštou: Dlouhý Technology s.r.o., Kaštanová 489/34, 620 00 Brno
              </li>
            </ul>
            <p>
              Máte rovněž právo podat stížnost u Úřadu pro ochranu osobních
              údajů (
              <a
                href="https://www.uoou.cz"
                className="text-dt-blue hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.uoou.cz
              </a>
              ).
            </p>
          </div>
        </section>
      </div>
    </article>
  )
}
