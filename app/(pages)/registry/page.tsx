import Link from "next/link"

export default function RegistryPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <div className="rounded-xl border p-8 bg-muted/40">
        <h1 className="text-2xl font-semibold">Gift Registry</h1>
        <p className="text-muted-foreground mt-2">
          Create and share a jewelry wishlist for weddings, birthdays and celebrations.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/signin" className="rounded-full bg-foreground text-background px-5 py-2 text-sm">
            Create your registry
          </Link>
          <Link href="/search?q=gift" className="rounded-full border px-5 py-2 text-sm">
            Browse gift ideas
          </Link>
        </div>
      </div>
    </main>
  )
}
