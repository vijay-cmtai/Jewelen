import Image from "next/image"

export default function CollectionPage({ params }: { params: { slug: string } }) {
  const title = params.slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())
  const imgs = [
    "/images/picks-1.jpg",
    "/images/picks-2.jpg",
    "/images/picks-3.jpg",
    "/images/picks-4.jpg",
    "/images/picks-5.jpg",
    "/images/picks-6.jpg",
    "/images/necklace-3.jpg",
    "/images/earring-3.jpg",
    "/images/bracelet-3.jpg",
  ]
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-muted-foreground mt-2">Curated finds inspired by our homepage section.</p>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {imgs.map((src, i) => (
          <div key={i} className="border rounded-xl overflow-hidden">
            <div className="relative aspect-[1/1]">
              <Image src={src || "/placeholder.svg"} alt={`${title} item ${i + 1}`} fill className="object-cover" />
            </div>
            <div className="p-3">
              <div className="font-medium">
                {title} item #{i + 1}
              </div>
              <div className="text-sm text-muted-foreground">Made by independent artisans.</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
