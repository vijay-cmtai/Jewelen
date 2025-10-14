import Link from "next/link"

export default function AnkletsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Anklets</h1>
      <p className="text-muted-foreground mt-2">Dainty chains and charms for every step.</p>
      <div className="grid md:grid-cols-4 gap-4 mt-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Link href={`/product/bracelet-${i % 8 || 8}`} key={i} className="border rounded-xl overflow-hidden">
            <div
              className="aspect-[1/1]"
              style={{ backgroundImage: `url(/images/bracelet-${(i % 8) + 1}.jpg)`, backgroundSize: "cover" }}
            />
            <div className="p-3">
              <div className="font-medium">Anklet design #{i}</div>
              <div className="text-sm text-muted-foreground">Minimal, elegant and adjustable.</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
