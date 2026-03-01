export function productJsonLd(product: {
  name: string
  description?: string
  image?: string
  manufacturer: string
  slug: string
  categorySlug: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    manufacturer: { "@type": "Organization", name: product.manufacturer },
    url: `https://dlouhy-technology.cz/produkty/${product.categorySlug}/${product.slug}`,
  }
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Dlouhy Technology s.r.o.",
    url: "https://dlouhy-technology.cz",
    description: "Vyhradni distributor SAMSON pro CR a SK",
    address: {
      "@type": "PostalAddress",
      addressCountry: "CZ",
    },
  }
}
