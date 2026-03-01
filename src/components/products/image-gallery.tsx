import { cn } from "@/lib/utils"

const manufacturerGradients: Record<string, string> = {
  SAMSON: "from-samson-blue/20 to-samson-blue/5",
  SCHROEDAHL: "from-schroedahl-green/20 to-schroedahl-green/5",
  CIRCOR: "from-schroedahl-green/20 to-schroedahl-green/5",
  ELCO: "from-elco-red/20 to-elco-red/5",
}

export function ImageGallery({
  mainImage: _mainImage,
  galleryImages: _galleryImages,
  manufacturer,
  productName,
}: {
  mainImage: string | null
  galleryImages: string[] | null
  manufacturer: string
  productName: string
}) {
  const gradient = manufacturerGradients[manufacturer] ?? "from-neutral-200 to-neutral-100"

  return (
    <div
      className={cn(
        "flex aspect-square items-center justify-center rounded-lg bg-gradient-to-br",
        gradient
      )}
    >
      <span className="text-sm text-neutral-400">
        {productName}
      </span>
    </div>
  )
}
