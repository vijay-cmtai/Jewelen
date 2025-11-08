import Image from "next/image";
import Link from "next/link";
import { Newspaper, Download, CheckCircle, Mail } from "lucide-react";

// Mock data for press releases
const pressReleases = [
  {
    id: 1,
    date: "October 15, 2023",
    title:
      "Jewelen Launches New 'Ethereal Dreams' Collection for the Festive Season",
    excerpt:
      "The new collection features handcrafted pieces inspired by celestial beauty, using ethically sourced gemstones and recycled gold.",
    slug: "ethereal-dreams-collection-launch",
  },
  {
    id: 2,
    date: "September 02, 2023",
    title:
      "Jewelen Partners with 'Artisan Futures' to Empower Independent Jewelers",
    excerpt:
      "A new initiative aimed at providing tools, training, and a global platform for emerging jewelry artists.",
    slug: "artisan-futures-partnership",
  },
];

// Mock data for 'As Seen In' logos
const featuredLogos = [
  { name: "Vogue", path: "/logos/vogue-logo.svg" },
  { name: "Forbes", path: "/logos/forbes-logo.svg" },
  { name: "Elle", path: "/logos/elle-logo.svg" },
  { name: "TechCrunch", path: "/logos/techcrunch-logo.svg" },
  { name: "Refinery29", path: "/logos/refinery29-logo.svg" },
];

export default function PressPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <div className="bg-gray-50/70">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24 lg:px-8 text-center">
          <Newspaper className="mx-auto h-12 w-12 text-orange-600" />
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Press & Media
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
            Information, resources, and assets for journalists, bloggers, and
            content creators.
          </p>
        </div>
      </div>

      {/* Featured In Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-lg font-semibold text-gray-600">
          As Featured In
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
          {/* NOTE: You'll need to add your own logo images to the /public/logos folder */}
          <div className="col-span-1 flex justify-center py-2">
            <p className="font-bold text-2xl text-gray-400">VOGUE</p>
          </div>
          <div className="col-span-1 flex justify-center py-2">
            <p className="font-bold text-2xl text-gray-400">Forbes</p>
          </div>
          <div className="col-span-1 flex justify-center py-2">
            <p className="font-bold text-2xl text-gray-400">ELLE</p>
          </div>
          <div className="col-span-1 flex justify-center py-2">
            <p className="font-bold text-2xl text-gray-400">BAZAAR</p>
          </div>
          <div className="col-span-1 flex justify-center py-2">
            <p className="font-bold text-2xl text-gray-400">REFINERY29</p>
          </div>
        </div>
      </section>

      <div className="bg-gray-50/70">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-16">
          {/* Press Releases Section */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Latest News
            </h2>
            <div className="mt-8 space-y-8">
              {pressReleases.map((release) => (
                <Link
                  key={release.id}
                  href={`/press/${release.slug}`}
                  className="group block"
                >
                  <p className="text-sm text-gray-500">{release.date}</p>
                  <p className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {release.title}
                  </p>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {release.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Media Kit and Contact Section */}
          <aside className="space-y-10">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Media Kit</h3>
              <p className="mt-2 text-sm text-gray-600">
                Download our brand assets for your stories.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" /> Logos &
                  Guidelines
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" /> Founder
                  Headshots
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" /> High-Res
                  Product Photos
                </li>
              </ul>
              <Link
                href="#"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 shadow-sm"
              >
                <Download className="h-4 w-4" /> Download Media Kit (.zip)
              </Link>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Media Inquiries
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                For interviews, collaborations, or other press-related
                questions, please get in touch.
              </p>
              <div className="mt-4">
                <Link
                  href="mailto:press@jewelen.example"
                  className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-800"
                >
                  <Mail className="h-4 w-4" /> press@jewelen.example
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
