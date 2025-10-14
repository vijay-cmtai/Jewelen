export default function RegionsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Regions</h1>
      <p className="text-muted-foreground mt-2">Shop handcrafted jewelry from around the world.</p>
      <div className="grid md:grid-cols-4 gap-4 mt-6">
        {["India", "Europe", "Americas", "East Asia", "Middle East", "Africa", "Oceania", "UK"].map((r, i) => (
          <div key={r} className="rounded-xl border p-4">
            <div className="font-medium">{r}</div>
            <div className="text-sm text-muted-foreground">Discover makers in {r}.</div>
          </div>
        ))}
      </div>
    </main>
  )
}
