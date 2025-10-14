"use client"
import { useSearchParams } from "next/navigation"

export default function SearchPage() {
  const params = useSearchParams()
  const q = params.get("q") || ""
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Search results</h1>
      <p className="text-sm text-muted-foreground mt-2">You searched for: “{q}”</p>
      <div className="grid md:grid-cols-4 gap-4 mt-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="border rounded-xl overflow-hidden">
            <div
              className="aspect-[1/1]"
              style={{ backgroundImage: `url(/images/search-${(i % 8) + 1}.jpg)`, backgroundSize: "cover" }}
            />
            <div className="p-3">
              <div className="font-medium">Result item #{i}</div>
              <div className="text-sm text-muted-foreground">Beautiful handcrafted jewelry.</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
