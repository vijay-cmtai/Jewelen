import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Share2,
  DollarSign,
  PenTool,
} from "lucide-react";

export default function AffiliatesPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1598447040582-7b99b5314aab?q=80&w=2070&auto=format&fit=crop"
            alt="Creator with jewelry"
            fill
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 py-24 sm:py-32 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Partner With Us
          </h1>
          <p className="mt-6 text-xl text-gray-300">
            Join the Jewelen Creator Community. Turn your passion for jewelry
            into a rewarding partnership.
          </p>
          <div className="mt-10">
            <Link
              href="#"
              className="inline-block rounded-md bg-orange-600 px-8 py-3 text-base font-medium text-white hover:bg-orange-700 transition-transform hover:scale-105"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Simple Steps to Success
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            Getting started is quick and easy.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-3">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-4">
              <PenTool className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              1. Apply to Join
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Fill out a simple application form. We welcome creators who share
              our love for quality craftsmanship.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-4">
              <Share2 className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              2. Create & Share
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Use your unique affiliate links to share your favorite Jewelen
              pieces with your audience on social media.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-4">
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              3. Earn Commission
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Earn a competitive commission on every sale generated through your
              links, with monthly payouts.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section with Image */}
      <section className="bg-gray-50/70">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-last lg:order-first">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Why Partner with Jewelen?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We empower our creators with the tools and support they need to
              thrive.
            </p>
            <ul className="mt-8 space-y-4">
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-500 mt-0.5" />
                <span className="ml-3 text-gray-700">
                  <strong>Competitive Commission:</strong> Earn up to 15% on
                  every referred sale.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-500 mt-0.5" />
                <span className="ml-3 text-gray-700">
                  <strong>Exclusive Access:</strong> Get early access to new
                  collections and creator-only promotions.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-500 mt-0.5" />
                <span className="ml-3 text-gray-700">
                  <strong>Creative Resources:</strong> Access our library of
                  high-quality images and marketing materials.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-500 mt-0.5" />
                <span className="ml-3 text-gray-700">
                  <strong>Dedicated Support:</strong> Our affiliate team is here
                  to help you succeed.
                </span>
              </li>
            </ul>
          </div>
          <div className="aspect-w-3 aspect-h-2">
            <Image
              src="https://m.media-amazon.com/images/I/71afH8ui3eL._AC_UY1100_.jpg"
              alt="Jewelry flat lay"
              width={800}
              height={600}
              className="w-full h-full object-cover rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Ready to Share the Sparkle?
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
          Join a community of creators who are passionate about style and
          quality.
        </p>
        <div className="mt-8">
          <Link
            href="#"
            className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-8 py-3 text-base font-medium text-white hover:bg-gray-800 transition-transform hover:scale-105 shadow-lg"
          >
            Become an Affiliate Today <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
