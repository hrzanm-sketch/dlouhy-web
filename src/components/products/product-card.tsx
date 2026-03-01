import Image from "next/image"
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

const manufacturerColors: Record<string, { bg: string; text: string; accent: string; border: string }> = {
  SAMSON: { bg: "bg-samson-blue", text: "text-white", accent: "from-samson-blue/20", border: "border-t-samson-blue" },
  SCHROEDAHL: { bg: "bg-schroedahl-green", text: "text-white", accent: "from-schroedahl-green/20", border: "border-t-schroedahl-green" },
  CIRCOR: { bg: "bg-schroedahl-green", text: "text-white", accent: "from-schroedahl-green/20", border: "border-t-schroedahl-green" },
  ELCO: { bg: "bg-elco-red", text: "text-white", accent: "from-elco-red/20", border: "border-t-elco-red" },
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const colors = manufacturerColors[product.manufacturer] ?? {
    bg: "bg-neutral-600",
    text: "text-white",
    accent: "from-neutral-600/20",
    border: "border-t-neutral-600",
  }

  return (
    <Link
      href={`/produkty/${product.categorySlug}/${product.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border border-neutral-200 border-t-[3px] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        colors.border
      )}
    >
      {/* Image */}
      <div
        className={cn(
          "relative aspect-[4/3] bg-gradient-to-br to-neutral-100",
          colors.accent
        )}
      >
        {product.mainImage && (
          <Image
            src={product.mainImage}
            alt={product.name}
            fill
            className="object-contain p-4"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
        {/* Gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white/60 to-transparent" />
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
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-dt-blue">
          Vice informaci
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </span>
      </div>
    </Link>
  )
}
