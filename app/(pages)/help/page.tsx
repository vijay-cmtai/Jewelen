export default function HelpPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Help Centre</h1>
      <div className="mt-4 grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-medium">Shipping</h2>
          <p className="text-sm text-muted-foreground">Timelines, tracking and delivery questions.</p>
        </div>
        <div>
          <h2 className="font-medium">Orders & Returns</h2>
          <p className="text-sm text-muted-foreground">Manage orders and request returns.</p>
        </div>
        <div>
          <h2 className="font-medium">Payments</h2>
          <p className="text-sm text-muted-foreground">Accepted methods and refunds.</p>
        </div>
        <div>
          <h2 className="font-medium">Account</h2>
          <p className="text-sm text-muted-foreground">Privacy, security and notifications.</p>
        </div>
      </div>
    </main>
  )
}
