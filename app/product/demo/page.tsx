import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DemoProductPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 grid md:grid-cols-2 gap-8">
      <div className="relative aspect-[1/1] rounded-xl overflow-hidden border">
        <Image src="/images/deal-name-necklace.jpg" alt="Rose Gold Name Necklace" fill className="object-cover" />
      </div>
      <div>
        <h1 className="text-2xl font-semibold">Rose Gold Name Necklace</h1>
        <div className="mt-2 text-xl font-semibold">
          ₹1,534 <span className="text-sm text-muted-foreground line-through">₹2,499</span>
        </div>
        <p className="mt-4 text-muted-foreground">
          Personalized name necklace in rose gold finish. Perfect for gifting and everyday wear.
        </p>
        <div className="mt-6 flex gap-3">
          <Button className="rounded-full px-6">Add to cart</Button>
          <Button variant="secondary" className="rounded-full px-6">
            Add to favourites
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-6">
          Looking for the full page? Try our dynamic detail pages like{" "}
          <Link href="/product/rose-gold-name-necklace" className="underline">
            this one
          </Link>
          .
        </p>
      </div>
    </main>
  )
}
