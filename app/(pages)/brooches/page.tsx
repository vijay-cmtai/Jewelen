export default function BroochesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Brooches</h1>
      <p className="text-muted-foreground mt-2">Timeless pins and modern motifs.</p>
      <div className="grid md:grid-cols-4 gap-4 mt-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="border rounded-xl overflow-hidden">
            <div
              className="aspect-[1/1]"
              style={{ backgroundImage: `url(/images/ring-${(i % 8) + 1}.jpg)`, backgroundSize: "cover" }}
            />
            <div className="p-3">
              <div className="font-medium">Brooch #{i}</div>
              <div className="text-sm text-muted-foreground">Artful accents for any outfit.</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
