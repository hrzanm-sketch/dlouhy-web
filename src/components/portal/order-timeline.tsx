import { cn, formatDate } from "@/lib/utils"

export interface TimelineStep {
  date: string
  status: string
  description: string
}

export function OrderTimeline({
  steps,
  currentIndex,
}: {
  steps: TimelineStep[]
  currentIndex?: number
}) {
  const activeIndex = currentIndex ?? steps.length - 1

  return (
    <div className="relative space-y-0">
      {steps.map((step, idx) => {
        const isCompleted = idx <= activeIndex
        const isLast = idx === steps.length - 1

        return (
          <div key={idx} className="relative flex gap-4 pb-6">
            {/* Vertical line */}
            {!isLast && (
              <div
                className={cn(
                  "absolute left-[11px] top-6 h-full w-0.5",
                  isCompleted ? "bg-dt-blue" : "bg-neutral-200"
                )}
              />
            )}

            {/* Dot */}
            <div
              className={cn(
                "relative z-10 mt-1 h-6 w-6 shrink-0 rounded-full border-2",
                isCompleted
                  ? "border-dt-blue bg-dt-blue"
                  : "border-neutral-300 bg-white"
              )}
            >
              {isCompleted && (
                <svg
                  className="h-full w-full p-0.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>

            {/* Content */}
            <div>
              <p
                className={cn(
                  "font-medium",
                  isCompleted ? "text-neutral-900" : "text-neutral-400"
                )}
              >
                {step.status}
              </p>
              <p className="text-sm text-neutral-500">{step.description}</p>
              <p className="mt-0.5 text-xs text-neutral-400">
                {formatDate(step.date)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
