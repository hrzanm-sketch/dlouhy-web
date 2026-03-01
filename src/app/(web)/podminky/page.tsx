import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Obchodní podmínky",
  description:
    "Obchodní podmínky společnosti Dlouhy Technology s.r.o. pro dodávky regulační techniky a servisních služeb.",
}

export default function PodminkyPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
        Obchodní podmínky
      </h1>
      <p className="mt-2 text-sm text-neutral-500">
        Tyto obchodní podmínky jsou platné od 1. 1. 2026
      </p>

      <div className="mt-10 space-y-10 text-neutral-600 leading-relaxed">
        {/* 1 */}
        <section>
          <h2 className="text-xl font-semibold text-neutral-900">
            1. Obecná ustanovení
          </h2>
          <div className="mt-3 space-y-3">
            <p>
              Tyto všeobecné obchodní podmínky (dále jen &bdquo;VOP&ldquo;)
              upravují smluvní vztahy mezi společností DLOUHY TECHNOLOGY s.r.o.,
              se sídlem Jinonická 759/24, 150 00 Praha 5, IČO: 28498712,
              DIČ: CZ28498712, zapsanou v obchodním rejstříku vedeném Městským
              soudem v Praze, oddíl C, vložka 146026 (dále jen
              &bdquo;dodavatel&ldquo;), a jejími zákazníky (dále jen
              &bdquo;odběratel&ldquo;).
            </p>
            <p>
              VOP se vztahují na veškeré dodávky zboží a poskytování služeb
              dodavatelem, pokud není písemnou smlouvou stanoveno jinak.
            </p>
          </div>
        </section>

        {/* 2 */}
        <section>
          <h2 className="text-xl font-semibold text-neutral-900">
            2. Objednávky
          </h2>
          <div className="mt-3 space-y-3">
            <p>
              Objednávku je možné učinit písemně, elektronicky prostřednictvím
              poptávkového formuláře na webu dodavatele, emailem nebo telefonicky
              s následným písemným potvrzením.
            </p>
            <p>
              Objednávka se stává závaznou okamžikem jejího písemného potvrzení
              dodavatelem. Dodavatel si vyhrazuje právo objednávku odmítnout nebo
              navrhnout změny.
            </p>
          </div>
        </section>

        {/* 3 */}
        <section>
          <h2 className="text-xl font-semibold text-neutral-900">
            3. Ceny a platby
          </h2>
          <div className="mt-3 space-y-3">
            <p>
              Ceny jsou uvedeny bez DPH, pokud není výslovně uvedeno jinak.
              Dodavatel si vyhrazuje právo na úpravu cen v případě změny
              vstupních nákladů, kurzových pohybů nebo změn ze strany výrobce.
            </p>
            <p>
              Splatnost faktur je 30 dnů ode dne vystavení, pokud není smluvně
              dohodnuto jinak. V případě prodlení s úhradou je dodavatel
              oprávněn účtovat zákonný úrok z prodlení.
            </p>
          </div>
        </section>

        {/* 4 */}
        <section>
          <h2 className="text-xl font-semibold text-neutral-900">
            4. Dodací podmínky
          </h2>
          <div className="mt-3 space-y-3">
            <p>
              Dodací lhůta se řídí potvrzením objednávky a závisí na
              dostupnosti zboží. Standardní dodací lhůta pro skladové položky je
              5-10 pracovních dnů. U výrobků na zakázku se dodací lhůta stanoví
              individuálně.
            </p>
            <p>
              Nebezpečí škody na zboží přechází na odběratele okamžikem převzetí
              zboží. Dodavatel zajišťuje dopravu na území České republiky a
              Slovenské republiky.
            </p>
          </div>
        </section>

        {/* 5 */}
        <section>
          <h2 className="text-xl font-semibold text-neutral-900">
            5. Reklamace
          </h2>
          <div className="mt-3 space-y-3">
            <p>
              Odběratel je povinen zkontrolovat zboží při převzetí a případné
              vady reklamovat neprodleně, nejpozději do 3 pracovních dnů od
              převzetí. Skryté vady je nutné reklamovat bez zbytečného odkladu po
              jejich zjištění.
            </p>
            <p>
              Reklamace se uplatňuje písemně s popisem vady a přiložením
              fotodokumentace. Dodavatel reklamaci vyřídí do 30 dnů dle
              platných právních předpisů.
            </p>
          </div>
        </section>

        {/* 6 */}
        <section>
          <h2 className="text-xl font-semibold text-neutral-900">
            6. Závěrečná ustanovení
          </h2>
          <div className="mt-3 space-y-3">
            <p>
              Právní vztahy neupravené těmito VOP se řídí příslušnými
              ustanoveními zákona č. 89/2012 Sb., občanského zákoníku, v
              platném znění.
            </p>
            <p>
              Dodavatel si vyhrazuje právo tyto VOP měnit. Změny budou
              zveřejněny na webových stránkách dodavatele a nabývají účinnosti
              dnem zveřejnění.
            </p>
          </div>
        </section>
      </div>
    </article>
  )
}
