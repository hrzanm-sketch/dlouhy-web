import { ProductCard, type ProductCardData } from "@/components/products/product-card"

export function RelatedProducts({ products }: { products: ProductCardData[] }) {
  if (products.length === 0) return null

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-neutral-900">
        Souvisejici produkty
      </h2>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {products.map((product) => (
          <div key={product.id} className="w-72 shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}
