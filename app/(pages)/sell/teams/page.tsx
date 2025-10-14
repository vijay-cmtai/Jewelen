export default function SellTeamsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Teams</h1>
      <p className="text-muted-foreground mt-2">Join seller communities to learn, collaborate, and grow.</p>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-xl border p-4">
            <div className="font-medium">Jewelry Makers Group #{i}</div>
            <div className="text-sm text-muted-foreground mt-1">Weekly tips, feedback and collabs.</div>
            <button className="mt-3 rounded-full border px-4 py-1.5 text-sm">Request to join</button>
          </div>
        ))}
      </div>
    </main>
  )
}
