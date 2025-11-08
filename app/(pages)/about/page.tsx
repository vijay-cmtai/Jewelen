import Image from "next/image";
import Link from "next/link";
import { Gem, Leaf, HandHeart, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-center text-white">
        <div className="absolute inset-0 bg-black">
          <Image
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop"
            alt="Elegant jewelry on a dark background"
            fill
            className="object-cover opacity-50"
          />
        </div>
        <div className="relative z-10 px-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Our Story, Your Sparkle
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-200">
            Discover the passion, craftsmanship, and dedication behind every
            piece at Jewelen.
          </p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              A Celebration of Craft
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Jewelen was born from a simple idea: to create a home for
              exquisite, handcrafted jewelry from the world's most talented
              independent artists. We believe that jewelry is more than an
              accessory; it's a form of self-expression, a piece of art, and a
              timeless treasure.
            </p>
            <p className="mt-4 text-gray-600">
              Our mission is to bridge the gap between discerning jewelry lovers
              and the artisans who pour their heart and soul into every
              creation. We curate unique pieces that tell a story, ensuring that
              you find something that truly resonates with your personal style.
            </p>
          </div>
          <div className="aspect-w-3 aspect-h-2">
            <Image
              src="https://www.shutterstock.com/image-photo/making-earrings-closeup-hands-jeweler-600nw-2202718613.jpg"
              alt="Close-up of a craftsman making jewelry"
              width={800}
              height={600}
              className="rounded-2xl object-cover shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="bg-gray-50/70">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              What We Stand For
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              Our guiding principles in everything we do.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-10 text-center md:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-4">
                <Gem className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Unmatched Quality
              </h3>
              <p className="mt-2 text-gray-500">
                We handpick every piece, ensuring it meets our high standards of
                material quality and durability.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-4">
                <HandHeart className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Artisan Empowerment
              </h3>
              <p className="mt-2 text-gray-500">
                We provide a global platform for independent makers to showcase
                their talent and grow their business.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-4">
                <Leaf className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Ethical Sourcing
              </h3>
              <p className="mt-2 text-gray-500">
                We are committed to using responsibly sourced materials,
                promoting sustainability in the jewelry industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Find Your Next Treasure
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
          Each piece in our collection has a story. Explore our curated
          selections and discover the one that speaks to you.
        </p>
        <div className="mt-8">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-8 py-3 text-base font-medium text-white hover:bg-gray-800 transition-transform hover:scale-105 shadow-lg"
          >
            Shop The Collection <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
