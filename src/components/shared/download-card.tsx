import { cn } from "@/lib/utils"

const CATEGORY_LABELS: Record<string, string> = {
  katalog: "Katalog",
  certifikat: "Certifikát",
  "technicka-dokumentace": "Technická dokumentace",
  formulare: "Formuláře",
}

const LANGUAGE_FLAGS: Record<string, string> = {
  cs: "CZ",
  sk: "SK",
  en: "EN",
  de: "DE",
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return ""
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

interface DownloadCardProps {
  download: {
    id: string
    name: string
    description: string | null
    category: string
    manufacturer: string
    fileUrl: string
    fileSize: number | null
    language: string | null
  }
}

export function DownloadCard({ download }: DownloadCardProps) {
  return (
    <div className="group flex flex-col rounded-lg border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="font-medium text-neutral-900 leading-tight">
          {download.name}
        </h3>
        {download.language && (
          <span className="shrink-0 rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-medium text-neutral-600">
            {LANGUAGE_FLAGS[download.language] ?? download.language}
          </span>
        )}
      </div>

      {download.description && (
        <p className="mb-3 text-sm text-neutral-500 line-clamp-2">
          {download.description}
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-medium",
            "bg-dt-blue/10 text-dt-blue"
          )}
        >
          {CATEGORY_LABELS[download.category] ?? download.category}
        </span>
        <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700">
          {download.manufacturer}
        </span>
        {download.fileSize && (
          <span className="text-xs text-neutral-400">
            {formatFileSize(download.fileSize)}
          </span>
        )}
      </div>

      <a
        href={download.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        download
        className="mt-4 inline-flex items-center justify-center gap-2 rounded-md bg-dt-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-dt-blue-light"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Stáhnout
      </a>
    </div>
  )
}
