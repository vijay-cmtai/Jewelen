import Link from "next/link"

const footerCols = {
  Shop: [
    ["Gift cards", "/gifts"],
    ["Registry", "/registry"],
    ["Shipping", "/help/shipping"],
    ["Blog", "/blog"],
  ],
  Sell: [
    ["Sell on Jewelia", "/sell"],
    ["Teams", "/sell/teams"],
    ["Affiliates & Creators", "/affiliates"],
  ],
  About: [
    ["Jewelia, Inc.", "/about"],
    ["Policies", "/policies"],
    ["Careers", "/careers"],
    ["Press", "/press"],
    ["Impact", "/impact"],
  ],
  Help: [
    ["Help Centre", "/help"],
    ["Privacy settings", "/privacy"],
  ],
}

export function SiteFooter() {
  return (
    <footer className="mt-16">
      {/* Top blue panel inspired layout */}
      <div className="bg-primary/10">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="grid gap-8 md:grid-cols-5">
            <div className="md:col-span-1">
              <div className="rounded-xl bg-primary text-primary-foreground p-6 w-max">
                <div className="text-xl font-semibold">Jewelia App</div>
                <div className="text-sm opacity-90 mt-1">Download the Jewelia app</div>
              </div>
            </div>
            {Object.entries(footerCols).map(([title, links]) => (
              <div key={title}>
                <div className="text-sm font-semibold mb-3">{title}</div>
                <ul className="space-y-2">
                  {links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="text-sm text-muted-foreground hover:text-foreground">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom dark bar */}
      <div className="bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs flex items-center justify-between">
          <div>India • English (UK) • ₹ (INR)</div>
          <div className="flex gap-4">
            <Link href="/terms" className="underline">
              Terms of Use
            </Link>
            <Link href="/privacy" className="underline">
              Privacy
            </Link>
            <Link href="/local-shops" className="underline">
              Local Shops
            </Link>
            <Link href="/regions" className="underline">
              Regions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
