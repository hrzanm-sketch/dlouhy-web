# DT Web — Design Brief

> Vizuální směr pro nový web Dlouhy Technology s.r.o.
> Verze: 2026-03-02

## Analýza aktuálního webu dlouhytechnology.com

### Co funguje
- Jasná hierarchie informací — produkty, servis, kontakt
- Vícejazyčnost (CZ, SK, EN, GE)
- Relevantní průmyslové kategorie (12 odvětví)
- Kontakty pro 3 země

### Co nefunguje
- **Hero sekce bez vizuálního impaktu** — žádný velký obrázek, video, ani silný statement. Jen text "35 let spolehlivých služeb"
- **Zastaralý layout** — JavaScript karusely, přeplněné sekce, málo white space
- **Korporátní sterilita** — modrá + šedá, žádný charakter, žádný příběh
- **Text-heavy** — příliš mnoho textu, málo vizuálů
- **Žádné reálné fotky** — chybí technici v terénu, montáže, sklad, lidé
- **Navigace přeplněná** — příliš mnoho položek ve vnořených menu
- **Žádné micro-interactions** — statická stránka, nic se nehýbe

---

## Koncept: "Precision Engineering"

DT není startup, není korporát. Je to rodinná firma s 35 lety zkušeností, která dělá hi-tech regulační techniku. Web musí říkat: "jsme přesní, spolehliví a rozumíme tomu co děláme."

---

## 1. Barevná paleta

**Problém**: generická modrá + šedá = vypadá jako každá druhá průmyslová firma.

**Návrh**: Dark mode s teplým akcentem

| Role | Barva | Kód | Proč |
|------|-------|-----|------|
| Pozadí | Tmavě šedá/antracit | `#0f172a` | Technologický, prémiový feel |
| Pozadí sekce (alt) | Mírně světlejší | `#1e293b` | Vizuální oddělení sekcí |
| Text primární | Bílá | `#f8fafc` | Kontrast, čitelnost |
| Text sekundární | Světle šedá | `#94a3b8` | Subtitles, popisy |
| Primární accent | Amber/oranžová | `#f59e0b` | Průmysl, teplo, energie |
| Sekundární accent | SAMSON blue | `#003d7c` | Zachovat brand partnera |
| Border/divider | Jemná šedá | `#334155` | Oddělení prvků |

Tmavý theme funguje pro technické B2B firmy — dává produktům a fotkám prostor vyniknout.

---

## 2. Typografie

- **Nadpisy**: Velké, bold, geometrické sans-serif (Inter nebo Geist)
- **Body text**: 16-18px, dostatek line-height (1.6-1.7)
- **Kontrast velikostí**: Hero heading 64-80px, subheading 20-24px
- **Technické specs**: Monospace font (Fragment Mono, JetBrains Mono)
- **Číslice v proof points**: Extra-bold, 48-64px

---

## 3. Hero sekce

Místo "35 let spolehlivých služeb" → silný vizuální statement:

```
[Fullscreen foto/video: technik nastavuje SAMSON ventil v průmyslovém prostředí]
[Tmavý overlay gradient]

PŘESNÁ REGULACE.
SPOLEHLIVÝ SERVIS.

Výhradní distributor SAMSON pro ČR a SK.
35 let v průmyslové regulační technice.

[CTA: Potřebuji řešení] [CTA: Naše produkty →]
```

Jedna velká fotka/video místo karuselu. Méně slov, větší dopad.

---

## 4. Layout principy

| Princip | Aktuální web | Nový přístup |
|---------|-------------|--------------|
| White space | Minimum, vše natlačené | Hodně, sekce dýchají |
| Grid | Nepravidelný | Čistý 12-col grid |
| Sekce | Mnoho malých | Méně, ale výraznějších (fullwidth) |
| Obsah | Text-heavy | Visual-first, text jako doplněk |
| Scroll | Krátká stránka | Delší, storytelling scroll |

---

## 5. Produktová prezentace

3 velké bloky (SAMSON / SCHROEDAHL / ELCO), každý s:
- Velká produktová fotka na tmavém pozadí
- 2-3 řádky co to dělá
- Čísla (instalací, let, parametry)
- CTA "Prozkoumat →"

---

## 6. Proof points — čísla

```
35+            2 000+          24/7           3
let zkušeností  instalací       servis         země
```

Tmavé pozadí, velké číslice, monospace font, subtle count-up animace.

---

## 7. Fotografie

Žádné stocky. Reálné fotky:
- Technici při montáži
- Detail ventilů (macro)
- Průmyslová prostředí (teplárny, energetika)
- Tým DT (rodinná firma = lidé)

Zpracování: high-contrast, mírně desaturované, konzistentní barevný grading.

---

## 8. Micro-interactions

- Parallax efekt na hero obrázku
- Fade-in sekce při scrollu
- Hover efekty na kartách (subtle scale + shadow)
- Smooth scroll navigace
- Animated counters pro čísla

Pravidlo: Každá animace musí mít účel. B2B zákazník chce najít info rychle.

---

## 9. Navigace

- Max 6 položek: Produkty, Servis, Reference, O nás, Ke stažení, Kontakt
- Mega menu pro Produkty (3 sloupce: SAMSON | SCHROEDAHL/CIRCOR | ELCO)
- Sticky header, zmenší se při scrollu
- Mobile: hamburger s fullscreen overlay

---

## 10. Reference a důvěra

- Case studies s reálnými čísly
- Loga partnerů (SAMSON, ELCO, SCHROEDAHL) — velká, na tmavém pozadí
- Průmyslová odvětví jako grid s ikonami
- Certifikace a autorizace

---

## Srovnání s konkurencí

| Web | Styl | Poučení pro DT |
|-----|------|----------------|
| **SAMSON Group** | Konzervativní, korporát, přeplněná nav | DT může být modernější než mateřská značka |
| **Emerson** | Čistý, hierarchický, produkty jako řešení | Inspirace pro product presentation |
| **Path Robotics** | Dark theme, bold typo, video | Benchmark pro "technologický" feel |
| **Robin Radar** | Dark, high-contrast, jasný value prop | Inspirace pro hero a messaging |

---

## Shrnutí — klíčové změny

1. **Dark theme** místo generic bílá+modrá
2. **Velká hero fotka/video** místo textového karuselu
3. **Hodně white space** — nechat obsah dýchat
4. **Reálné fotky** — žádné stocky, autentická firma
5. **Velká bold typografie** s kontrastem velikostí
6. **Čísla a data** jako proof points
7. **Zjednodušená navigace** — 6 položek max
8. **Subtle animace** — fade-in, parallax, hover efekty
9. **Teplý accent** (amber/oranžová) k technické modré

Výsledek: web který říká "jsme precizní rodinná firma s technologickým know-how", ne "jsme další průmyslová korporace".
