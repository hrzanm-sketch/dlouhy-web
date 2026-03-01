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
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
          {description}
        </p>
        <Link
          href={buttonHref}
          className="mt-8 inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-medium text-dt-blue transition-colors hover:bg-neutral-100"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  )
}
