import Image from "next/image"
import { cn } from "@/lib/utils"

const manufacturerGradients: Record<string, string> = {
  SAMSON: "from-samson-blue/20 to-samson-blue/5",
  SCHROEDAHL: "from-schroedahl-green/20 to-schroedahl-green/5",
  CIRCOR: "from-schroedahl-green/20 to-schroedahl-green/5",
  ELCO: "from-elco-red/20 to-elco-red/5",
}

export function ImageGallery({
  mainImage,
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
        "relative flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br",
        gradient
      )}
    >
      {mainImage ? (
        <Image
          src={mainImage}
          alt={productName}
          fill
          className="object-contain p-8"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      ) : (
        <span className="text-sm text-neutral-400">
          {productName}
        </span>
      )}
    </div>
  )
}
