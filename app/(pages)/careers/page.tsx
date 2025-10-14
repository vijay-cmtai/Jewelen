export default function CareersPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Careers</h1>
      <p className="text-muted-foreground mt-2">Help us empower independent jewelry artisans worldwide.</p>
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {["Frontend Engineer", "Designer", "Product Manager", "Support Specialist"].map((role) => (
          <div key={role} className="rounded-xl border p-4">
            <div className="font-medium">{role}</div>
            <div className="text-sm text-muted-foreground mt-1">Remote • Full‑time</div>
            <button className="mt-3 rounded-full border px-4 py-1.5 text-sm">View role</button>
          </div>
        ))}
      </div>
    </main>
  )
}
