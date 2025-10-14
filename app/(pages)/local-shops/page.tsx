export default function LocalShopsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Local Shops</h1>
      <p className="text-muted-foreground mt-2">Explore jewelry made near you.</p>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-xl border overflow-hidden">
            <div
              className="aspect-[16/9]"
              style={{ backgroundImage: `url(/images/search-${(i % 8) + 1}.jpg)`, backgroundSize: "cover" }}
            />
            <div className="p-4">
              <div className="font-medium">Local Atelier #{i}</div>
              <div className="text-sm text-muted-foreground">Handcrafted pieces, ready to ship.</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
