import Link from "next/link"
import { cn } from "@/lib/utils"
export type ProductCardData = {
  id: string
  slug: string
  name: string
  typeCode: string | null
  manufacturer: string
  shortDescription: string | null
  mainImage: string | null
  categorySlug: string
}

const manufacturerColors: Record<string, { bg: string; text: string; accent: string }> = {
  SAMSON: { bg: "bg-samson-blue", text: "text-white", accent: "from-samson-blue/20" },
  SCHROEDAHL: { bg: "bg-schroedahl-green", text: "text-white", accent: "from-schroedahl-green/20" },
  CIRCOR: { bg: "bg-schroedahl-green", text: "text-white", accent: "from-schroedahl-green/20" },
  ELCO: { bg: "bg-elco-red", text: "text-white", accent: "from-elco-red/20" },
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const colors = manufacturerColors[product.manufacturer] ?? {
    bg: "bg-neutral-600",
    text: "text-white",
    accent: "from-neutral-600/20",
  }

  return (
    <Link
      href={`/produkty/${product.categorySlug}/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white transition-shadow hover:shadow-lg"
    >
      {/* Image placeholder */}
      <div
        className={cn(
          "relative aspect-[4/3] bg-gradient-to-br to-neutral-100",
          colors.accent
        )}
      >
        <span
          className={cn(
            "absolute right-3 top-3 rounded px-2 py-0.5 text-xs font-semibold",
            colors.bg,
            colors.text
          )}
        >
          {product.manufacturer}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-neutral-900 group-hover:text-dt-blue">
          {product.name}
        </h3>
        {product.typeCode && (
          <p className="mt-0.5 text-sm text-neutral-500">{product.typeCode}</p>
        )}
        {product.shortDescription && (
          <p className="mt-2 line-clamp-2 text-sm text-neutral-600">
            {product.shortDescription}
          </p>
        )}
        <span className="mt-auto pt-4 text-sm font-medium text-dt-blue group-hover:underline">
          Vice informaci
        </span>
      </div>
    </Link>
  )
}
