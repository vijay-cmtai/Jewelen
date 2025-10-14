import Image from "next/image"
import Link from "next/link"

const BLOGS: Record<
  string,
  {
    title: string
    tag: string
    hero: string
    intro: string
    body: string[]
    related: Array<{ slug: string; img: string; title: string }>
  }
> = {
  "15-birthday-jewelry-ideas": {
    title: "15 birthday jewelry ideas for one‑of‑a‑kind people",
    tag: "Gift ideas",
    hero: "/images/blog-1.jpg",
    intro:
      "Make their big day brighter with personalised necklaces, rings, and bracelets—handcrafted by independent makers.",
    body: [
      "From minimal name necklaces to delicate birthstone rings, these picks feel thoughtful without being fussy.",
      "Match metals to their everyday style—gold for warmth, silver for cool tones, and rose gold for a romantic touch.",
      "Pair your gift with a handwritten note and a simple jewelry pouch for that boutique unboxing moment.",
    ],
    related: [
      { slug: "12-back-to-school-jewelry-picks", img: "/images/blog-2.jpg", title: "12 back‑to‑school picks" },
      {
        slug: "how-to-choose-birthstone-jewelry",
        img: "/images/deal-birthstone.jpg",
        title: "Choose birthstone jewelry",
      },
    ],
  },
  "12-back-to-school-jewelry-picks": {
    title: "12 back‑to‑school picks for a memorable first day",
    tag: "Shopping Guide",
    hero: "/images/blog-2.jpg",
    intro: "Charm bracelets, custom name pendants, and lucky talismans to mark a fresh start.",
    body: [
      "Layer simple necklaces for a confident everyday look.",
      "Choose hypoallergenic metals and sturdy clasps for long wear.",
      "Personalised engraving adds a keepsake touch that lasts beyond the season.",
    ],
    related: [
      { slug: "15-birthday-jewelry-ideas", img: "/images/blog-1.jpg", title: "Birthday jewelry ideas" },
      {
        slug: "11-crafts-that-make-shopping-special",
        img: "/images/blog-3.jpg",
        title: "Crafts that make shopping special",
      },
    ],
  },
  "11-crafts-that-make-shopping-special": {
    title: "11 crafts that make shopping on Jewelia special",
    tag: "Inspiration",
    hero: "/images/blog-3.jpg",
    intro: "Discover the artistry behind handcrafted pieces and learn how they’re made.",
    body: [
      "From metal-smithing to bead weaving, every technique tells a story.",
      "Buying handmade supports small studios, ethical production, and timeless design.",
      "Care & storage matter—soft cloths, individual pouches, and dry, cool places.",
    ],
    related: [
      { slug: "15-birthday-jewelry-ideas", img: "/images/blog-1.jpg", title: "Birthday jewelry ideas" },
      {
        slug: "how-to-choose-birthstone-jewelry",
        img: "/images/deal-birthstone.jpg",
        title: "Choose birthstone jewelry",
      },
    ],
  },
  "how-to-choose-birthstone-jewelry": {
    title: "How to choose the perfect birthstone jewelry",
    tag: "Guide",
    hero: "/images/deal-birthstone.jpg",
    intro: "A quick guide to colors, months, and styles that suit every personality.",
    body: [
      "Start with their birth month gemstone, then pick a setting that suits their daily style.",
      "Prong settings show brilliance; bezels feel modern and secure.",
      "Consider a matching bracelet or earrings to complete the set.",
    ],
    related: [
      { slug: "12-back-to-school-jewelry-picks", img: "/images/blog-2.jpg", title: "Back‑to‑school picks" },
      {
        slug: "11-crafts-that-make-shopping-special",
        img: "/images/blog-3.jpg",
        title: "Crafts that make shopping special",
      },
    ],
  },
}

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = BLOGS[params.slug]
  if (!post) {
    // Simple fallback: link back to blog index
    return (
      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-2xl font-semibold">Post not found</h1>
        <p className="mt-2">
          Go back to{" "}
          <Link href="/blog" className="underline">
            the blog
          </Link>
          .
        </p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="relative h-[300px] rounded-xl overflow-hidden border">
        <Image src={post.hero || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
      </div>
      <div className="mt-6">
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{post.tag}</div>
        <h1 className="text-3xl font-semibold mt-1 text-pretty">{post.title}</h1>
        <p className="text-muted-foreground mt-3">{post.intro}</p>
      </div>

      <article className="prose prose-sm md:prose-base dark:prose-invert mt-6">
        {post.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </article>

      <hr className="my-8" />
      <h2 className="text-lg font-semibold">Keep reading</h2>
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        {post.related.map((r) => (
          <Link key={r.slug} href={`/blog/${r.slug}`} className="rounded-xl overflow-hidden border hover:shadow-sm">
            <div className="relative h-[160px]">
              <Image src={r.img || "/placeholder.svg"} alt={r.title} fill className="object-cover" />
            </div>
            <div className="p-3 font-medium">{r.title}</div>
          </Link>
        ))}
      </div>
    </main>
  )
}
