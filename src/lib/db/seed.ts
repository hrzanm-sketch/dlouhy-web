import { db } from "./index"
import {
  categories,
  products,
  productParameters,
  productDocuments,
} from "./schema"

async function main() {
  console.log("Seeding database...")

  // --- Categories ---
  const [catRegulacni, catRecirkulacni, catHoraky] = await db
    .insert(categories)
    .values([
      {
        slug: "regulacni-ventily",
        name: "Regulační ventily",
        description:
          "Regulační ventily SAMSON pro přesnou regulaci průtoku, tlaku a teploty v průmyslových procesech.",
        manufacturer: "SAMSON",
        sortOrder: 1,
      },
      {
        slug: "recirkulacni-ventily",
        name: "Recirkulační ventily",
        description:
          "Recirkulační ventily SCHROEDAHL pro ochranu čerpadel a optimalizaci provozních podmínek.",
        manufacturer: "SCHROEDAHL",
        sortOrder: 2,
      },
      {
        slug: "horaky",
        name: "Hořáky",
        description:
          "Průmyslové a komerční hořáky ELCO pro vytápění a technologické procesy.",
        manufacturer: "ELCO",
        sortOrder: 3,
      },
    ])
    .returning({ id: categories.id })

  console.log(`Inserted ${3} categories`)

  // --- Products ---
  const insertedProducts = await db
    .insert(products)
    .values([
      {
        categoryId: catRegulacni.id,
        slug: "samson-type-3241",
        name: "SAMSON Type 3241 — Pneumatický regulační ventil",
        typeCode: "Type 3241",
        manufacturer: "SAMSON",
        shortDescription:
          "Pneumatický regulační ventil pro univerzální průmyslové aplikace. Přírubové provedení DN 15–500, PN 16–40.",
        longDescription:
          "Regulační ventil Type 3241 je jednosedlový ventil s pneumatickým membránovým pohonem Type 3271. Ventil je vhodný pro regulaci průtoku kapalin, par a plynů v chemickém, petrochemickém a energetickém průmyslu. Nabízí širokou škálu materiálových provedení a vnitřních vestaveb pro optimální regulační charakteristiku.",
        mainImage: "/images/products/3241.png",
        isFeatured: true,
        sortOrder: 1,
      },
      {
        categoryId: catRegulacni.id,
        slug: "samson-type-3244",
        name: "SAMSON Type 3244 — Regulační ventil s membránovým pohonem",
        typeCode: "Type 3244",
        manufacturer: "SAMSON",
        shortDescription:
          "Dvousedlový regulační ventil pro velké průtoky. Snížená potřeba ovládací síly, DN 25–400.",
        longDescription:
          "Type 3244 je dvousedlový regulační ventil navržený pro aplikace s velkými průtoky, kde je požadována nízká ovládací síla. Díky vyváženému kuželovému uzávěru je pohon menší a lehčí. Ventil je ideální pro regulaci v teplárenství, klimatizaci a procesním průmyslu.",
        mainImage: "/images/products/3244.png",
        isFeatured: true,
        sortOrder: 2,
      },
      {
        categoryId: catRegulacni.id,
        slug: "samson-type-3321",
        name: "SAMSON Type 3321 — Trojcestný regulační ventil",
        typeCode: "Type 3321",
        manufacturer: "SAMSON",
        shortDescription:
          "Trojcestný směšovací a rozdělovací ventil pro tepelné systémy. DN 15–150, PN 16.",
        longDescription:
          "Trojcestný regulační ventil Type 3321 slouží ke směšování nebo rozdělování proudu média. Používá se v systémech vytápění, chlazení a klimatizace. K dispozici v provedení se šroubením nebo přírubovém, s pneumatickým nebo elektrickým pohonem.",
        sortOrder: 3,
      },
      {
        categoryId: catRegulacni.id,
        slug: "samson-type-241",
        name: "SAMSON Type 241 — Regulátor tlaku za sebou",
        typeCode: "Type 241",
        manufacturer: "SAMSON",
        shortDescription:
          "Samočinný regulátor tlaku za sebou pro průmyslové a komunální rozvody. DN 15–250.",
        longDescription:
          "Regulátor tlaku Type 241 je samočinný regulátor udržující konstantní tlak za regulátorem bez nutnosti externího zdroje energie. Používá se v parních, plynových a kapalinových rozvodech. Kompaktní konstrukce s integrovaným pohonem zajišťuje spolehlivou regulaci.",
        sortOrder: 4,
      },
      {
        categoryId: catRegulacni.id,
        slug: "samson-type-2488",
        name: "SAMSON Type 2488 — Samočinný regulátor teploty",
        typeCode: "Type 2488",
        manufacturer: "SAMSON",
        shortDescription:
          "Samočinný regulátor teploty s termostatickým čidlem pro výměníky tepla. DN 15–150.",
        longDescription:
          "Type 2488 je samočinný regulátor teploty, který nevyžaduje pomocnou energii. Termostatické čidlo reaguje na teplotu regulovaného média a přímo ovládá ventil. Ideální pro regulaci teploty ve výměnících tepla, ohřívačích TUV a dalších tepelných aplikacích.",
        sortOrder: 5,
      },
      {
        categoryId: catRegulacni.id,
        slug: "samson-trovis-6400",
        name: "SAMSON TROVIS 6400 — Kompaktní regulátor",
        typeCode: "TROVIS 6400",
        manufacturer: "SAMSON",
        shortDescription:
          "Digitální kompaktní regulátor pro HVAC a průmyslové procesy. Montáž na DIN lištu, RS-485.",
        longDescription:
          "TROVIS 6400 je kompaktní digitální regulátor určený pro regulaci vytápění, ventilace a klimatizace. Nabízí až 4 regulační smyčky, komunikaci přes RS-485/Modbus a intuitivní ovládání přes grafický displej. Montáž na DIN lištu umožňuje snadnou instalaci do rozvaděčů.",
        sortOrder: 6,
      },
      {
        categoryId: catRegulacni.id,
        slug: "samson-type-3510",
        name: "SAMSON Type 3510 — Elektrický pohon",
        typeCode: "Type 3510",
        manufacturer: "SAMSON",
        shortDescription:
          "Elektrický zdvihový pohon pro regulační ventily. Ovládací síla až 10 kN, signál 4–20 mA.",
        longDescription:
          "Elektrický pohon Type 3510 je určen pro ovládání regulačních ventilů SAMSON. Nabízí plynulou regulaci zdvihu s ovládacím signálem 4–20 mA nebo 0–10 V. Integrovaná elektronika zajišťuje přesné polohování a diagnostiku. K dispozici s funkcí fail-safe (pružina).",
        mainImage: "/images/products/3510.png",
        sortOrder: 7,
      },
      {
        categoryId: catRecirkulacni.id,
        slug: "schroedahl-tdl",
        name: "SCHROEDAHL TDL — Recirkulační ventil",
        typeCode: "TDL",
        manufacturer: "SCHROEDAHL",
        shortDescription:
          "Recirkulační ventil s vícetrubkovým difuzérem pro ochranu čerpadel. DN 25–200, PN 40–160.",
        longDescription:
          "Recirkulační ventil SCHROEDAHL TDL chrání odstředivá čerpadla před provozem při nízkém průtoku. Vícetrubkový difuzér účinně redukuje tlak bez kavitace a hluku. Ventil se otevírá automaticky při poklesu průtoku pod minimální hodnotu a zajišťuje tak bezpečný provoz čerpadla.",
        isFeatured: true,
        sortOrder: 1,
      },
      {
        categoryId: catRecirkulacni.id,
        slug: "schroedahl-bna",
        name: "SCHROEDAHL BNA — Automatická recirkulace čerpadel",
        typeCode: "BNA",
        manufacturer: "SCHROEDAHL",
        shortDescription:
          "Kompaktní automatický recirkulační ventil. Mechanické ovládání bez externího zdroje energie.",
        longDescription:
          "SCHROEDAHL BNA je plně mechanický automatický recirkulační ventil, který nevyžaduje žádný externí zdroj energie. Reaguje na průtok hlavním potrubím a při poklesu pod nastavenou hodnotu automaticky otevírá recirkulační potrubí. Kompaktní konstrukce umožňuje montáž přímo na výtlak čerpadla.",
        sortOrder: 2,
      },
      {
        categoryId: catHoraky.id,
        slug: "elco-nextron-8",
        name: "ELCO NEXTRON 8 — Plynový modulační hořák",
        typeCode: "NEXTRON 8",
        manufacturer: "ELCO",
        shortDescription:
          "Plynový modulační hořák s výkonem 120–1 000 kW. Nízké emise NOx, plně automatický provoz.",
        longDescription:
          "ELCO NEXTRON 8 je plynový modulační hořák určený pro komerční a průmyslové kotelny. Modulační rozsah 1:5 zajišťuje vysokou účinnost při proměnlivém zatížení. Nízké emise NOx splňují nejpřísnější emisní limity. Integrovaný řídicí systém zajišťuje plně automatický provoz včetně diagnostiky.",
        mainImage: "/images/products/elco-produktova-rada-nextron.png",
        isFeatured: true,
        sortOrder: 1,
      },
    ])
    .returning({ id: products.id, slug: products.slug })

  console.log(`Inserted ${insertedProducts.length} products`)

  // Build slug -> id map for parameters/documents
  const productMap = new Map(insertedProducts.map((p) => [p.slug, p.id]))

  // --- Product Parameters ---
  await db.insert(productParameters).values([
    // SAMSON Type 3241
    { productId: productMap.get("samson-type-3241")!, name: "Jmenovitá světlost", value: "DN 15–500", unit: "mm", sortOrder: 1 },
    { productId: productMap.get("samson-type-3241")!, name: "Jmenovitý tlak", value: "PN 16–40", unit: "bar", sortOrder: 2 },
    { productId: productMap.get("samson-type-3241")!, name: "Teplota média", value: "-10 až +350", unit: "°C", sortOrder: 3 },
    { productId: productMap.get("samson-type-3241")!, name: "Materiál tělesa", value: "GGG 40.3, GP240GH, 1.4408", sortOrder: 4 },
    { productId: productMap.get("samson-type-3241")!, name: "Kvs", value: "0,4–630", unit: "m³/h", sortOrder: 5 },

    // SAMSON Type 3244
    { productId: productMap.get("samson-type-3244")!, name: "Jmenovitá světlost", value: "DN 25–400", unit: "mm", sortOrder: 1 },
    { productId: productMap.get("samson-type-3244")!, name: "Jmenovitý tlak", value: "PN 16–40", unit: "bar", sortOrder: 2 },
    { productId: productMap.get("samson-type-3244")!, name: "Teplota média", value: "-10 až +300", unit: "°C", sortOrder: 3 },
    { productId: productMap.get("samson-type-3244")!, name: "Kvs", value: "6,3–1 000", unit: "m³/h", sortOrder: 4 },

    // SAMSON Type 3321
    { productId: productMap.get("samson-type-3321")!, name: "Jmenovitá světlost", value: "DN 15–150", unit: "mm", sortOrder: 1 },
    { productId: productMap.get("samson-type-3321")!, name: "Jmenovitý tlak", value: "PN 16", unit: "bar", sortOrder: 2 },
    { productId: productMap.get("samson-type-3321")!, name: "Teplota média", value: "-10 až +200", unit: "°C", sortOrder: 3 },
    { productId: productMap.get("samson-type-3321")!, name: "Provedení", value: "Směšovací / rozdělovací", sortOrder: 4 },

    // SAMSON Type 241
    { productId: productMap.get("samson-type-241")!, name: "Jmenovitá světlost", value: "DN 15–250", unit: "mm", sortOrder: 1 },
    { productId: productMap.get("samson-type-241")!, name: "Rozsah nastavení", value: "0,2–16", unit: "bar", sortOrder: 2 },
    { productId: productMap.get("samson-type-241")!, name: "Teplota média", value: "-10 až +200", unit: "°C", sortOrder: 3 },
    { productId: productMap.get("samson-type-241")!, name: "Materiál tělesa", value: "GGG 40.3, GP240GH", sortOrder: 4 },

    // SAMSON Type 2488
    { productId: productMap.get("samson-type-2488")!, name: "Jmenovitá světlost", value: "DN 15–150", unit: "mm", sortOrder: 1 },
    { productId: productMap.get("samson-type-2488")!, name: "Rozsah regulace", value: "20–160", unit: "°C", sortOrder: 2 },
    { productId: productMap.get("samson-type-2488")!, name: "Jmenovitý tlak", value: "PN 16–25", unit: "bar", sortOrder: 3 },
    { productId: productMap.get("samson-type-2488")!, name: "Typ čidla", value: "Termostatické, kapilární", sortOrder: 4 },

    // SAMSON TROVIS 6400
    { productId: productMap.get("samson-trovis-6400")!, name: "Regulační smyčky", value: "Až 4", sortOrder: 1 },
    { productId: productMap.get("samson-trovis-6400")!, name: "Komunikace", value: "RS-485, Modbus RTU", sortOrder: 2 },
    { productId: productMap.get("samson-trovis-6400")!, name: "Napájení", value: "24 V AC/DC", unit: "V", sortOrder: 3 },
    { productId: productMap.get("samson-trovis-6400")!, name: "Montáž", value: "DIN lišta 35 mm", sortOrder: 4 },

    // SAMSON Type 3510
    { productId: productMap.get("samson-type-3510")!, name: "Ovládací síla", value: "Až 10", unit: "kN", sortOrder: 1 },
    { productId: productMap.get("samson-type-3510")!, name: "Ovládací signál", value: "4–20 mA / 0–10 V", sortOrder: 2 },
    { productId: productMap.get("samson-type-3510")!, name: "Zdvih", value: "7,5–120", unit: "mm", sortOrder: 3 },
    { productId: productMap.get("samson-type-3510")!, name: "Krytí", value: "IP 65", sortOrder: 4 },
    { productId: productMap.get("samson-type-3510")!, name: "Napájení", value: "24 V AC / 230 V AC", unit: "V", sortOrder: 5 },

    // SCHROEDAHL TDL
    { productId: productMap.get("schroedahl-tdl")!, name: "Jmenovitá světlost", value: "DN 25–200", unit: "mm", sortOrder: 1 },
    { productId: productMap.get("schroedahl-tdl")!, name: "Jmenovitý tlak", value: "PN 40–160", unit: "bar", sortOrder: 2 },
    { productId: productMap.get("schroedahl-tdl")!, name: "Teplota média", value: "-29 až +425", unit: "°C", sortOrder: 3 },
    { productId: productMap.get("schroedahl-tdl")!, name: "Materiál tělesa", value: "A216 WCB, A351 CF8M", sortOrder: 4 },

    // SCHROEDAHL BNA
    { productId: productMap.get("schroedahl-bna")!, name: "Jmenovitá světlost", value: "DN 25–150", unit: "mm", sortOrder: 1 },
    { productId: productMap.get("schroedahl-bna")!, name: "Jmenovitý tlak", value: "PN 40–63", unit: "bar", sortOrder: 2 },
    { productId: productMap.get("schroedahl-bna")!, name: "Teplota média", value: "-29 až +200", unit: "°C", sortOrder: 3 },
    { productId: productMap.get("schroedahl-bna")!, name: "Ovládání", value: "Mechanické, bez ext. energie", sortOrder: 4 },

    // ELCO NEXTRON 8
    { productId: productMap.get("elco-nextron-8")!, name: "Výkon", value: "120–1 000", unit: "kW", sortOrder: 1 },
    { productId: productMap.get("elco-nextron-8")!, name: "Palivo", value: "Zemní plyn, LPG", sortOrder: 2 },
    { productId: productMap.get("elco-nextron-8")!, name: "Modulační rozsah", value: "1:5", sortOrder: 3 },
    { productId: productMap.get("elco-nextron-8")!, name: "NOx třída", value: "Třída 3 dle EN 676", sortOrder: 4 },
    { productId: productMap.get("elco-nextron-8")!, name: "Napájení", value: "230 V / 50 Hz", unit: "V", sortOrder: 5 },
  ])

  console.log("Inserted product parameters")

  // --- Product Documents ---
  await db.insert(productDocuments).values([
    {
      productId: productMap.get("samson-type-3241")!,
      name: "Technický list Type 3241",
      type: "datasheet",
      fileUrl: "/documents/samson/type-3241-datasheet.pdf",
      fileSize: 1_250_000,
    },
    {
      productId: productMap.get("samson-type-3241")!,
      name: "Montážní a provozní návod Type 3241",
      type: "manual",
      fileUrl: "/documents/samson/type-3241-manual.pdf",
      fileSize: 3_400_000,
    },
    {
      productId: productMap.get("samson-type-3244")!,
      name: "Technický list Type 3244",
      type: "datasheet",
      fileUrl: "/documents/samson/type-3244-datasheet.pdf",
      fileSize: 980_000,
    },
    {
      productId: productMap.get("samson-type-3321")!,
      name: "Technický list Type 3321",
      type: "datasheet",
      fileUrl: "/documents/samson/type-3321-datasheet.pdf",
      fileSize: 870_000,
    },
    {
      productId: productMap.get("samson-type-241")!,
      name: "Technický list Type 241",
      type: "datasheet",
      fileUrl: "/documents/samson/type-241-datasheet.pdf",
      fileSize: 1_100_000,
    },
    {
      productId: productMap.get("samson-type-2488")!,
      name: "Technický list Type 2488",
      type: "datasheet",
      fileUrl: "/documents/samson/type-2488-datasheet.pdf",
      fileSize: 750_000,
    },
    {
      productId: productMap.get("samson-trovis-6400")!,
      name: "Technický list TROVIS 6400",
      type: "datasheet",
      fileUrl: "/documents/samson/trovis-6400-datasheet.pdf",
      fileSize: 2_100_000,
    },
    {
      productId: productMap.get("samson-trovis-6400")!,
      name: "Konfigurační manuál TROVIS 6400",
      type: "manual",
      fileUrl: "/documents/samson/trovis-6400-manual.pdf",
      fileSize: 5_600_000,
    },
    {
      productId: productMap.get("samson-type-3510")!,
      name: "Technický list Type 3510",
      type: "datasheet",
      fileUrl: "/documents/samson/type-3510-datasheet.pdf",
      fileSize: 920_000,
    },
    {
      productId: productMap.get("schroedahl-tdl")!,
      name: "Technický list TDL",
      type: "datasheet",
      fileUrl: "/documents/schroedahl/tdl-datasheet.pdf",
      fileSize: 1_450_000,
    },
    {
      productId: productMap.get("schroedahl-tdl")!,
      name: "Instalační návod TDL",
      type: "manual",
      fileUrl: "/documents/schroedahl/tdl-manual.pdf",
      fileSize: 2_800_000,
    },
    {
      productId: productMap.get("schroedahl-bna")!,
      name: "Technický list BNA",
      type: "datasheet",
      fileUrl: "/documents/schroedahl/bna-datasheet.pdf",
      fileSize: 1_200_000,
    },
    {
      productId: productMap.get("elco-nextron-8")!,
      name: "Technický list NEXTRON 8",
      type: "datasheet",
      fileUrl: "/documents/elco/nextron-8-datasheet.pdf",
      fileSize: 1_800_000,
    },
    {
      productId: productMap.get("elco-nextron-8")!,
      name: "Projektový podklad NEXTRON 8",
      type: "brochure",
      fileUrl: "/documents/elco/nextron-8-brochure.pdf",
      fileSize: 4_200_000,
    },
  ])

  console.log("Inserted product documents")
  console.log("Seeding complete!")

  process.exit(0)
}

main().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})
