export default function ImpactPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Impact</h1>
      <p className="text-muted-foreground mt-2">Sustainable packaging, ethical sourcing, and artisan support.</p>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {["Sustainable Materials", "Fair Pay", "Local Craft"].map((title, i) => (
          <div key={title} className="rounded-xl border p-4">
            <div className="font-medium">{title}</div>
            <div className="text-sm text-muted-foreground mt-1">
              We’re committed to a better future for jewelry making.
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
