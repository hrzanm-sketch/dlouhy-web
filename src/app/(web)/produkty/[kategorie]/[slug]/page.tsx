import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import {
  products,
  categories,
  productParameters,
  productDocuments,
  productRelations as productRelationsTable,
} from "@/lib/db/schema"
import { and, eq, isNull, asc } from "drizzle-orm"
import { ImageGallery } from "@/components/products/image-gallery"
import { SpecsTable } from "@/components/products/specs-table"
import { DocumentsTable } from "@/components/products/documents-table"
import { RelatedProducts } from "@/components/products/related-products"
import type { ProductCardData } from "@/components/products/product-card"
import type { Metadata } from "next"
import Link from "next/link"
import { cn } from "@/lib/utils"

export const revalidate = 3600

const manufacturerBadgeColors: Record<string, string> = {
  SAMSON: "bg-samson-blue text-white",
  SCHROEDAHL: "bg-schroedahl-green text-white",
  CIRCOR: "bg-schroedahl-green text-white",
  ELCO: "bg-elco-red text-white",
}

export async function generateStaticParams() {
  try {
    const rows = await db
      .select({
        slug: products.slug,
        kategorie: categories.slug,
      })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.isActive, true), isNull(products.deletedAt)))

    return rows.map((r) => ({ kategorie: r.kategorie, slug: r.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kategorie: string; slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await db
    .select({
      name: products.name,
      shortDescription: products.shortDescription,
      seoTitle: products.seoTitle,
      seoDescription: products.seoDescription,
    })
    .from(products)
    .where(
      and(
        eq(products.slug, slug),
        eq(products.isActive, true),
        isNull(products.deletedAt)
      )
    )
    .limit(1)

  if (!product[0]) return { title: "Produkt | Dlouhy Technology" }

  return {
    title: product[0].seoTitle || `${product[0].name} | Dlouhy Technology`,
    description:
      product[0].seoDescription || product[0].shortDescription || undefined,
  }
}

async function getProduct(slug: string) {
  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      typeCode: products.typeCode,
      manufacturer: products.manufacturer,
      shortDescription: products.shortDescription,
      longDescription: products.longDescription,
      mainImage: products.mainImage,
      galleryImages: products.galleryImages,
      categoryId: products.categoryId,
      categorySlug: categories.slug,
      categoryName: categories.name,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(products.slug, slug),
        eq(products.isActive, true),
        isNull(products.deletedAt)
      )
    )
    .limit(1)

  return rows[0] ?? null
}

async function getParameters(productId: string) {
  return db
    .select({
      name: productParameters.name,
      value: productParameters.value,
      unit: productParameters.unit,
    })
    .from(productParameters)
    .where(eq(productParameters.productId, productId))
    .orderBy(asc(productParameters.sortOrder))
}

async function getDocuments(productId: string) {
  return db
    .select({
      name: productDocuments.name,
      type: productDocuments.type,
      language: productDocuments.language,
      fileUrl: productDocuments.fileUrl,
      fileSize: productDocuments.fileSize,
    })
    .from(productDocuments)
    .where(eq(productDocuments.productId, productId))
}

async function getRelatedProducts(productId: string): Promise<ProductCardData[]> {
  const relations = await db
    .select({
      relatedProductId: productRelationsTable.relatedProductId,
    })
    .from(productRelationsTable)
    .where(eq(productRelationsTable.productId, productId))

  if (relations.length === 0) return []

  const relatedIds = relations.map((r) => r.relatedProductId)

  const rows: ProductCardData[] = []
  for (const relId of relatedIds) {
    const related = await db
      .select({
        id: products.id,
        slug: products.slug,
        name: products.name,
        typeCode: products.typeCode,
        manufacturer: products.manufacturer,
        shortDescription: products.shortDescription,
        mainImage: products.mainImage,
        categorySlug: categories.slug,
      })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(
        and(
          eq(products.id, relId),
          eq(products.isActive, true),
          isNull(products.deletedAt)
        )
      )
      .limit(1)

    if (related[0]) rows.push(related[0])
  }

  return rows
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ kategorie: string; slug: string }>
}) {
  const { slug } = await params

  const product = await getProduct(slug)
  if (!product) notFound()

  const [params_, documents, related] = await Promise.all([
    getParameters(product.id),
    getDocuments(product.id),
    getRelatedProducts(product.id),
  ])

  const badgeColor =
    manufacturerBadgeColors[product.manufacturer] ?? "bg-neutral-600 text-white"

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="hover:text-dt-blue">
          Hlavni stranka
        </Link>
        <span className="mx-2">/</span>
        <Link href="/produkty" className="hover:text-dt-blue">
          Produkty
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/produkty/${product.categorySlug}`}
          className="hover:text-dt-blue"
        >
          {product.categoryName}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-900">{product.name}</span>
      </nav>

      {/* Product hero */}
      <div className="mb-10 grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <ImageGallery
          mainImage={product.mainImage}
          galleryImages={product.galleryImages}
          manufacturer={product.manufacturer}
          productName={product.name}
        />

        {/* Info */}
        <div>
          <div className="flex items-start gap-3">
            <h1 className="text-3xl font-bold text-neutral-900">
              {product.name}
            </h1>
            <span
              className={cn(
                "mt-1 shrink-0 rounded px-2.5 py-1 text-xs font-semibold",
                badgeColor
              )}
            >
              {product.manufacturer}
            </span>
          </div>
          {product.typeCode && (
            <p className="mt-1 text-lg text-neutral-500">{product.typeCode}</p>
          )}
          {product.shortDescription && (
            <p className="mt-4 text-neutral-700">{product.shortDescription}</p>
          )}

          {/* CTA */}
          <div className="mt-8">
            <Link
              href={`/poptavka?produkt=${product.slug}`}
              className="inline-block rounded-md bg-dt-blue px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-dt-blue-light"
            >
              Mam zajem o tento produkt
            </Link>
          </div>
        </div>
      </div>

      {/* Long description */}
      {product.longDescription && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-neutral-900">Popis</h2>
          <div
            className="prose max-w-none text-neutral-700"
            dangerouslySetInnerHTML={{ __html: product.longDescription }}
          />
        </section>
      )}

      {/* Specs */}
      <div className="mb-10">
        <SpecsTable parameters={params_} />
      </div>

      {/* Documents */}
      <div className="mb-10">
        <DocumentsTable documents={documents} />
      </div>

      {/* Related products */}
      <div className="mb-10">
        <RelatedProducts products={related} />
      </div>
    </div>
  )
}
