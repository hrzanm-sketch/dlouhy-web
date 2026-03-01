#!/usr/bin/env python3
"""
Scrape ~20 products from dlouhytechnology.com for demo seed data.
Outputs JSON ready for Drizzle seed or Payload CMS import.

Usage: python3 scripts/scrape-products.py
"""

import json
import re
import os
import time
import urllib.request
from html.parser import HTMLParser
from urllib.parse import urljoin

BASE_URL = "https://dlouhytechnology.com"
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "scripts")
IMG_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "images", "products")

os.makedirs(IMG_DIR, exist_ok=True)


class ProductListParser(HTMLParser):
    """Parse product listing page to extract product links and names."""

    def __init__(self):
        super().__init__()
        self.products = []
        self._in_product_link = False
        self._current = {}
        self._capture_text = False
        self._text_target = None

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        # Product cards are links with product images
        if tag == "a" and "href" in attrs_dict:
            href = attrs_dict["href"]
            if "/produkty-samson-cz/" in href and href != "/cz/produkty-samson-cz":
                self._current = {"url": urljoin(BASE_URL, href), "slug": href.split("/")[-1]}
                self._in_product_link = True
        if tag == "img" and self._in_product_link and "src" in attrs_dict:
            self._current["image_url"] = urljoin(BASE_URL, attrs_dict["src"])
        # Product type number and name in spans/strong
        if tag in ("span", "strong", "div", "h3", "h4") and self._in_product_link:
            self._capture_text = True
            self._text_target = tag

    def handle_data(self, data):
        if self._capture_text and self._in_product_link:
            text = data.strip()
            if text:
                if re.match(r"^\d{3,4}", text) and "type_number" not in self._current:
                    self._current["type_number"] = text
                elif "name" not in self._current and len(text) > 3:
                    self._current["name"] = text

    def handle_endtag(self, tag):
        if tag == "a" and self._in_product_link:
            if "type_number" in self._current or "name" in self._current:
                self.products.append(self._current)
            self._in_product_link = False
            self._current = {}
        self._capture_text = False


class ProductDetailParser(HTMLParser):
    """Parse product detail page for description and specs."""

    def __init__(self):
        super().__init__()
        self.description_parts = []
        self.specs = {}
        self._in_article = False
        self._capture = False
        self._current_tag = None
        self._depth = 0

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        cls = attrs_dict.get("class", "")
        if tag == "article" or "product-detail" in cls:
            self._in_article = True
        if self._in_article and tag == "p":
            self._capture = True
            self._current_tag = "p"

    def handle_data(self, data):
        if self._capture:
            text = data.strip()
            if text and len(text) > 10:
                self.description_parts.append(text)

    def handle_endtag(self, tag):
        if tag == "p":
            self._capture = False
        if tag == "article":
            self._in_article = False


def fetch_page(url):
    """Fetch page with retry."""
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            resp = urllib.request.urlopen(req, timeout=15)
            return resp.read().decode("utf-8", errors="replace")
        except Exception as e:
            print(f"  Retry {attempt + 1}: {e}")
            time.sleep(2)
    return None


def download_image(url, filename):
    """Download product image."""
    filepath = os.path.join(IMG_DIR, filename)
    if os.path.exists(filepath):
        return filename
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        data = urllib.request.urlopen(req, timeout=15).read()
        if len(data) > 500:  # skip error pages
            with open(filepath, "wb") as f:
                f.write(data)
            return filename
    except Exception as e:
        print(f"  Image download failed: {e}")
    return None


def extract_description(html):
    """Extract product description from detail page."""
    # Find text paragraphs in the main content area
    paragraphs = re.findall(
        r'<p[^>]*class="[^"]*product[^"]*"[^>]*>(.*?)</p>', html, re.DOTALL
    )
    if not paragraphs:
        # Fallback: find all paragraphs after the product title
        parts = html.split("Chcete vědět více?")
        if len(parts) > 1:
            content = parts[1]
        else:
            content = html

        paragraphs = re.findall(r"<p[^>]*>(.*?)</p>", content, re.DOTALL)

    # Clean HTML tags from text
    texts = []
    for p in paragraphs:
        clean = re.sub(r"<[^>]+>", "", p).strip()
        clean = re.sub(r"\s+", " ", clean)
        if len(clean) > 20 and not clean.startswith("Výrobce") and "document.getElementById" not in clean:
            texts.append(clean)

    return " ".join(texts[:5])  # Max 5 paragraphs


def extract_specs(html):
    """Extract technical specifications."""
    specs = {}

    # DN range
    dn = re.search(r"DN\s*(\d+)\s*(?:až|to|–|-)\s*DN\s*(\d+)", html)
    if dn:
        specs["dn_min"] = int(dn.group(1))
        specs["dn_max"] = int(dn.group(2))

    # PN range
    pn = re.search(r"PN\s*(\d+)\s*(?:až|to|–|-)\s*PN\s*(\d+)", html)
    if pn:
        specs["pn_min"] = int(pn.group(1))
        specs["pn_max"] = int(pn.group(2))

    # Temperature range
    temp = re.search(r"(-?\d+)\s*°C\s*(?:až|to|–|-)\s*(\d+)\s*°C", html)
    if temp:
        specs["temp_min"] = int(temp.group(1))
        specs["temp_max"] = int(temp.group(2))

    # Manufacturer
    mfr = re.search(r"Výrobce:\s*(\w+)", html)
    if mfr:
        specs["manufacturer"] = mfr.group(1)

    return specs


def get_category_from_page(html):
    """Extract product category from breadcrumb or heading."""
    cat = re.search(
        r'<span class="category[^"]*"[^>]*>(.*?)</span>', html, re.DOTALL
    )
    if cat:
        return re.sub(r"<[^>]+>", "", cat.group(1)).strip()

    # Try heading
    h = re.search(r"<h\d[^>]*>(.*?)</h\d>", html)
    if h:
        text = re.sub(r"<[^>]+>", "", h.group(1)).strip()
        if "ventil" in text.lower() or "řada" in text.lower():
            return text
    return None


def main():
    print("=== DT Product Scraper (Demo: ~20 products) ===\n")

    # Step 1: Get product listing (first page only = ~20 products)
    print("Fetching SAMSON product listing...")
    listing_html = fetch_page(f"{BASE_URL}/cz/produkty-samson-cz")
    if not listing_html:
        print("ERROR: Could not fetch listing page")
        return

    # Extract product links using regex — matches both relative and absolute URLs
    product_links = re.findall(
        r'href="([^"]*produkty-samson-cz/[^"?]+)"',
        listing_html,
    )
    # Normalize to relative paths and deduplicate
    normalized = []
    for link in product_links:
        path = link.replace(BASE_URL, "")
        if path not in normalized and path != "/cz/produkty-samson-cz":
            normalized.append(path)
    product_links = normalized

    # Extract product type numbers and names from listing
    products_raw = []
    for link in product_links:
        slug = link.rstrip("/").split("/")[-1]
        # Extract type number from slug (e.g., "3241-primy-ventil" -> "3241")
        type_match = re.match(r"(\d+)", slug)
        type_number = type_match.group(1) if type_match else slug
        products_raw.append({
            "url": urljoin(BASE_URL, link),
            "slug": slug,
            "type_number": type_number,
        })

    # Also get image URLs from listing
    product_imgs = re.findall(
        r'<img\s+src="(/images/products/[^"]+)"[^>]*>',
        listing_html,
    )

    print(f"Found {len(products_raw)} product links")

    # Limit to 20 for demo
    products_raw = products_raw[:20]
    print(f"Scraping first {len(products_raw)} products...\n")

    # Step 2: Scrape each product detail
    products = []
    for i, prod in enumerate(products_raw):
        print(f"[{i + 1}/{len(products_raw)}] {prod['type_number']} - {prod['url']}")

        detail_html = fetch_page(prod["url"])
        if not detail_html:
            print("  SKIP: could not fetch")
            continue

        time.sleep(0.5)  # be nice to the server

        # Extract data
        description = extract_description(detail_html)
        specs = extract_specs(detail_html)
        category = get_category_from_page(detail_html)

        # Extract name from page title or h1/h2
        name_match = re.search(r"<h[12][^>]*>\s*(?:\d+\s*-\s*)?(.*?)</h[12]>", detail_html)
        name = ""
        if name_match:
            name = re.sub(r"<[^>]+>", "", name_match.group(1)).strip()

        # Try to find product image on detail page
        img_match = re.search(
            r'<img\s+[^>]*src="(/images/products/[^"]+)"', detail_html
        )
        image_filename = None
        if img_match:
            img_url = urljoin(BASE_URL, img_match.group(1))
            ext = os.path.splitext(img_match.group(1))[1] or ".png"
            image_filename = download_image(img_url, f"{prod['type_number']}{ext}")
            print(f"  Image: {image_filename or 'FAILED'}")

        product = {
            "type_number": prod["type_number"],
            "name": name or f"Type {prod['type_number']}",
            "slug": prod["slug"],
            "description": description[:500] if description else "",
            "category": category or "Regulační ventily",
            "manufacturer": specs.get("manufacturer", "SAMSON"),
            "specs": {
                k: v
                for k, v in specs.items()
                if k != "manufacturer"
            },
            "image": image_filename,
            "source_url": prod["url"],
        }
        products.append(product)
        print(f"  OK: {product['name'][:60]}...")

    # Step 3: Also scrape a few ELCO products
    print("\nFetching ELCO product listing...")
    elco_html = fetch_page(f"{BASE_URL}/cz/produkty-elco-cz")
    if elco_html:
        elco_links = re.findall(
            r'href="([^"]*produkty-elco-cz/[^"?]+)"',
            elco_html,
        )
        elco_normalized = []
        for lnk in elco_links:
            path = lnk.replace(BASE_URL, "")
            if path not in elco_normalized and path != "/cz/produkty-elco-cz":
                elco_normalized.append(path)
        elco_links = elco_normalized[:5]

        for i, link in enumerate(elco_links):
            slug = link.rstrip("/").split("/")[-1]
            url = urljoin(BASE_URL, link)
            print(f"[ELCO {i + 1}/{len(elco_links)}] {slug} - {url}")

            detail_html = fetch_page(url)
            if not detail_html:
                continue

            time.sleep(0.5)

            name_match = re.search(r"<h[12][^>]*>(.*?)</h[12]>", detail_html)
            name = re.sub(r"<[^>]+>", "", name_match.group(1)).strip() if name_match else slug
            description = extract_description(detail_html)

            img_match = re.search(r'<img\s+[^>]*src="(/images/products/[^"]+)"', detail_html)
            image_filename = None
            if img_match:
                img_url = urljoin(BASE_URL, img_match.group(1))
                ext = os.path.splitext(img_match.group(1))[1] or ".png"
                image_filename = download_image(img_url, f"elco-{slug}{ext}")

            products.append({
                "type_number": "",
                "name": name,
                "slug": slug,
                "description": description[:500] if description else "",
                "category": "Hořáky",
                "manufacturer": "ELCO",
                "specs": {},
                "image": image_filename,
                "source_url": url,
            })
            print(f"  OK: {name[:60]}...")

    # Step 4: Save output
    output_path = os.path.join(
        os.path.dirname(os.path.dirname(__file__)), "scripts", "products-demo.json"
    )
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

    print(f"\n=== Done! ===")
    print(f"Products scraped: {len(products)}")
    print(f"Output: {output_path}")
    print(f"Images: {IMG_DIR}/")
    print(f"\nUse this JSON to seed your database or import to Payload CMS.")


if __name__ == "__main__":
    main()
