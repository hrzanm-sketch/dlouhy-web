import Link from "next/link"

interface CTABlockProps {
  title?: string
  description?: string
  buttonText?: string
  buttonHref?: string
}

export function CTABlock({
  title = "Potřebujete poradit s výběrem?",
  description = "Naši specialisté vám pomohou najít optimální řešení",
  buttonText = "Poslat poptávku",
  buttonHref = "/poptavka",
}: CTABlockProps) {
  return (
    <section className="bg-gradient-to-r from-dt-blue-dark to-dt-blue py-16 sm:py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 sm:px-6 lg:flex-row lg:justify-between lg:px-8">
        <div className="text-center lg:text-left">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{title}</h2>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            {description}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Link
            href={buttonHref}
            className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-medium text-dt-blue transition-all duration-200 hover:scale-[1.02] hover:bg-neutral-100"
          >
            {buttonText}
          </Link>
          <a
            href="tel:+420226800800"
            className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-white/30 px-6 py-3 text-base font-medium text-white transition-all duration-200 hover:border-white hover:bg-white/10"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
            </svg>
            +420 226 800 800
          </a>
        </div>
      </div>
    </section>
  )
}
