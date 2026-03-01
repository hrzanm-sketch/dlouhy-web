import { ProductCard, type ProductCardData } from "@/components/products/product-card"

export function ProductGrid({ products }: { products: ProductCardData[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-neutral-200 bg-white px-6 py-16 text-center">
        <p className="text-lg font-medium text-neutral-900">Zadne produkty</p>
        <p className="mt-1 text-sm text-neutral-500">
          Zkuste zmenit filtry nebo vyhledavaci dotaz.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
