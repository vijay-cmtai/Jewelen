import Image from "next/image";
import Link from "next/link";
import { HandHeart, Leaf, Package, ArrowRight } from "lucide-react";

// Impact stats ka data
const impactStats = [
  {
    icon: HandHeart,
    value: "50+",
    label: "Artisan Partners Supported",
  },
  {
    icon: Leaf,
    value: "90%",
    label: "Recycled Gold & Silver Used",
  },
  {
    icon: Package,
    value: "100%",
    label: "Eco-Friendly Packaging",
  },
];

export default function ImpactPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center h-[50vh] min-h-[400px] text-center text-white">
        <div className="absolute inset-0 bg-black">
          <Image
            src="https://www.dishisjewels.com/blog/wp-content/uploads/2023/08/166-1024x512.jpg"
            alt="Hands holding a small plant with a ring on"
            fill
            className="object-cover opacity-50"
          />
        </div>
        <div className="relative z-10 px-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Beauty with Purpose
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-200">
            Creating a positive impact on people and the planet, one beautiful
            piece at a time.
          </p>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="bg-gray-50/70">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 text-center md:grid-cols-3">
            {impactStats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <stat.icon className="h-10 w-10 text-orange-600 mb-3" />
                <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Commitments Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-20">
        {/* Commitment to People */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              For People: Empowering Our Artisans
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Our marketplace is built on a foundation of respect and fairness.
              We partner with independent artisans, providing them with a global
              platform to share their craft and build sustainable livelihoods.
            </p>
            <ul className="mt-6 space-y-3 list-disc list-inside text-gray-600">
              <li>Ensuring fair wages and ethical working conditions.</li>
              <li>
                Preserving traditional craftsmanship and heritage techniques.
              </li>
              <li>
                Providing tools and resources for our partners to grow their
                businesses.
              </li>
            </ul>
          </div>
          <div className="aspect-w-3 aspect-h-2">
            <Image
              src="https://aweinspired.com/cdn/shop/files/awe-inspired-box-set-14k-yellow-gold-vermeil-fire-advent-calendar-1200734698.webp?v=1761938749"
              alt="An artisan carefully crafting a piece of jewelry"
              width={800}
              height={600}
              className="rounded-2xl object-cover shadow-xl"
            />
          </div>
        </div>

        {/* Commitment to Planet */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="lg:order-last">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              For the Planet: A Gentle Footprint
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We believe that luxury and sustainability can coexist. From our
              materials to our packaging, we make conscious choices to minimize
              our environmental impact and protect our planet.
            </p>
            <ul className="mt-6 space-y-3 list-disc list-inside text-gray-600">
              <li>Using recycled precious metals like gold and silver.</li>
              <li>Sourcing conflict-free and ethically obtained gemstones.</li>
              <li>Utilizing 100% recyclable and FSC-certified packaging.</li>
            </ul>
          </div>
          <div className="aspect-w-3 aspect-h-2 lg:order-first">
            <Image
              src="https://ecocult.com/wp-content/uploads/2019/08/artisan-jewelry-akamae-2-e1566325097538.jpg"
              alt="Eco-friendly packaging and materials"
              width={800}
              height={600}
              className="rounded-2xl object-cover shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gray-50/70">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Wear Your Values
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Explore our collections crafted with care for people and the planet.
            When you choose Jewelen, you choose jewelry that not only looks good
            but does good too.
          </p>
          <div className="mt-8">
            <Link
              href="/collections/conscious-edit"
              className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-8 py-3 text-base font-medium text-white hover:bg-gray-800 transition-transform hover:scale-105 shadow-lg"
            >
              Shop The Conscious Edit <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
