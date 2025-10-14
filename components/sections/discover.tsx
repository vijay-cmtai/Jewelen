"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const discover = [
  {
    title: "New Arrivals",
    img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
    to: "/new",
  },
  {
    title: "Autumn Favourites",
    img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=300&fit=crop",
    to: "#deals",
  },
  {
    title: "Family Traditions",
    img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop",
    to: "/collections/family",
  },
  {
    title: "Showgirl Sparkle",
    img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop",
    to: "/collections/sparkle",
  },
  {
    title: "A Baker's Dream",
    img: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&h=300&fit=crop",
    to: "/collections/gifts",
  },
];

const seasonal = [
  {
    title: "Festive Serveware",
    img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=400&fit=crop",
    href: "/collections/serveware",
  },
  {
    title: "Holiday Beads & Craft",
    img: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&h=400&fit=crop",
    href: "/collections/craft",
  },
  {
    title: "Stocking Stuffers",
    img: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=400&fit=crop",
    href: "/collections/stockings",
  },
];

const chips = [
  "Hosting Decor Gifts",
  "Personalised Gifts",
  "Crafting Gifts",
  "Book Lover Gifts",
  "Anniversary Gifts",
];

export default function Discover() {
  const scroller = useRef<HTMLDivElement>(null);

  function scrollBy(dx: number) {
    scroller.current?.scrollBy({ left: dx, behavior: "smooth" });
  }

  return (
    <section
      id="discover"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 mb-20"
    >
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Discover our best of autumn 2025
        </h2>
        <p className="text-gray-600 text-lg">
          Curated collections to inspire your season
        </p>
      </div>

      {/* Horizontal rail */}
      <div className="relative mb-12">
        <div
          ref={scroller}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-px-4 pb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {discover.map((d) => (
            <a
              key={d.title}
              href={d.to}
              className="min-w-[240px] sm:min-w-[280px] snap-start group"
            >
              <div className="relative h-[240px] w-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <img
                  src={d.img}
                  alt={d.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-xl font-bold text-white drop-shadow-lg">
                    {d.title}
                  </h3>
                </div>

                {/* Shine effect */}
                <div
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"
                  style={{ transition: "opacity 0.5s, transform 0.7s" }}
                />
              </div>
            </a>
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="hidden md:flex items-center gap-2 absolute -right-2 -top-16">
          <button
            aria-label="Scroll left"
            onClick={() => scrollBy(-300)}
            className="p-3 rounded-full bg-white border-2 border-gray-200 shadow-md hover:shadow-lg hover:border-gray-300 transition-all active:scale-95"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <button
            aria-label="Scroll right"
            onClick={() => scrollBy(300)}
            className="p-3 rounded-full bg-white border-2 border-gray-200 shadow-md hover:shadow-lg hover:border-gray-300 transition-all active:scale-95"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Seasonal trio */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {seasonal.map((s) => (
          <a key={s.title} href={s.href} className="group">
            <div className="relative h-[280px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
              <img
                src={s.img}
                alt={s.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white drop-shadow-lg mb-2">
                  {s.title}
                </h3>
                <div className="flex items-center text-white/90 text-sm font-medium">
                  <span>Explore collection</span>
                  <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </a>
        ))}
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-3 mb-8">
        {chips.map((c) => (
          <a
            key={c}
            href="/gifts"
            className="rounded-full bg-white border-2 border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all hover:shadow-md active:scale-95"
          >
            {c}
          </a>
        ))}
      </div>

      {/* CTA Button */}
      <div className="mt-8">
        <a
          href="/collections"
          className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-8 py-4 text-white font-semibold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
        >
          <Sparkles className="h-5 w-5" />
          Get inspired
          <ChevronRight className="h-5 w-5" />
        </a>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
