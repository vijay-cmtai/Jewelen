import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section id="hero" className="mx-auto max-w-7xl px-4 mt-6">
      <div className="rounded-xl overflow-hidden border">
        <div className="grid md:grid-cols-[360px_1fr]">
          <div className="bg-[oklch(0.35_0.05_150)] text-background md:p-10 p-6">
            <h1 className="text-3xl md:text-4xl font-semibold text-pretty">Festive season made easy</h1>
            <p className="mt-2 text-sm opacity-90">All the jewelry inspiration you need is right here.</p>
            <Button asChild className="mt-5 rounded-full">
              <Link href="#discover">See our must‑haves</Link>
            </Button>
          </div>
          <div className="relative aspect-[16/9] md:aspect-auto min-h-[240px]">
            <Image
              src="/images/hero.jpg"
              alt="Festive gift wrapping with jewelry box"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
