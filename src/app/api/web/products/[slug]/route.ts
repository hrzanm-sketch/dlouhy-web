import { db } from "@/lib/db"
import {
  products,
  categories,
  productParameters,
  productDocuments,
} from "@/lib/db/schema"
import { and, eq, isNull } from "drizzle-orm"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  const [product] = await db
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
      isFeatured: products.isFeatured,
      seoTitle: products.seoTitle,
      seoDescription: products.seoDescription,
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
        isNull(products.deletedAt),
      ),
    )
    .limit(1)

  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 })
  }

  const [params_, docs] = await Promise.all([
    db
      .select({
        id: productParameters.id,
        name: productParameters.name,
        value: productParameters.value,
        unit: productParameters.unit,
        sortOrder: productParameters.sortOrder,
      })
      .from(productParameters)
      .where(eq(productParameters.productId, product.id))
      .orderBy(productParameters.sortOrder),
    db
      .select({
        id: productDocuments.id,
        name: productDocuments.name,
        type: productDocuments.type,
        language: productDocuments.language,
        fileUrl: productDocuments.fileUrl,
        fileSize: productDocuments.fileSize,
      })
      .from(productDocuments)
      .where(eq(productDocuments.productId, product.id)),
  ])

  return Response.json({
    ...product,
    parameters: params_,
    documents: docs,
  })
}
