"use client";
import Link from "next/link";
import { Sparkles, Heart, ArrowRight } from "lucide-react";
const grid = [
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=300&h=300&fit=crop",
];
export default function EditorsPicks() {
  const searchQuery = "kids baby"; // Yahan aap search term daal sakte hain
  const searchUrl = `/search?q=${encodeURIComponent(searchQuery)}`;

  return (
    <section
      id="picks"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 mb-20"
    >
      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-1 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 bg-purple-50 px-4 py-2 rounded-full w-fit mb-4">
            <Sparkles className="h-4 w-4" />
            Editors' Picks
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Kids & Baby Favourites
          </h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            Your one-stop shop for gifts and tiny treasures they'll love.
          </p>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500 fill-red-500" />
              <span className="text-sm font-medium text-gray-700">
                Curated with love
              </span>
            </div>
            <div className="h-4 w-px bg-gray-300" />
            <span className="text-sm font-medium text-gray-700">
              Safe & gentle materials
            </span>
          </div>
          <Link
            href={searchUrl}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-all shadow-lg w-fit group"
          >
            Shop these unique finds
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {grid.map((src, idx) => (
            <Link key={idx} href={searchUrl} className="group relative">
              <div className="relative h-[180px] sm:h-[200px] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300">
                <img
                  src={src}
                  alt={`Pick ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100" />
                <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-sm font-bold text-gray-900 shadow-lg">
                  {idx + 1}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500 italic">
          "Every piece tells a story, every moment becomes a memory"
        </p>
      </div>
    </section>
  );
}
