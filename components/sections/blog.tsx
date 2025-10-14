"use client";

import { BookOpen, ArrowRight, Clock } from "lucide-react";

const posts = [
  {
    img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=400&fit=crop",
    tag: "Gift ideas",
    title: "15 birthday jewelry ideas for one‑of‑a‑kind people",
    excerpt:
      "Make their big day brighter with personalised necklaces, rings, and bracelets.",
    slug: "15-birthday-jewelry-ideas",
    readTime: "5 min read",
  },
  {
    img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=400&fit=crop",
    tag: "Shopping Guide",
    title: "12 back‑to‑school picks for a memorable first day",
    excerpt:
      "From charm bracelets to custom name pendants—great gifts to start the year.",
    slug: "12-back-to-school-jewelry-picks",
    readTime: "4 min read",
  },
  {
    img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop",
    tag: "Inspiration",
    title: "11 crafts that make shopping on Jewelia special",
    excerpt:
      "Discover the artistry behind handcrafted pieces and learn how they're made.",
    slug: "11-crafts-that-make-shopping-special",
    readTime: "6 min read",
  },
];

export default function BlogSection() {
  return (
    <section
      id="blog"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 mb-20"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Fresh from the blog
            </h2>
          </div>
          <p className="text-gray-600 text-lg">
            Stories, guides, and inspiration for jewelry lovers
          </p>
        </div>

        <a
          href="/blog"
          className="hidden md:inline-flex items-center gap-2 text-gray-900 font-semibold hover:gap-3 transition-all"
        >
          View all posts
          <ArrowRight className="h-5 w-5" />
        </a>
      </div>

      {/* Blog Grid */}
      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        {posts.map((p, i) => (
          <a
            key={i}
            href={`/blog/${p.slug}`}
            className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
          >
            {/* Image */}
            <div className="relative h-[280px] overflow-hidden bg-gray-100">
              <img
                src={p.img}
                alt={p.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Tag badge */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                  {p.tag}
                </span>
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                {p.title}
              </h3>

              {/* Excerpt */}
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                {p.excerpt}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{p.readTime}</span>
                </div>

                <div className="flex items-center gap-1 text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  <span>Read more</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Mobile "View all" button */}
      <div className="mt-8 text-center md:hidden">
        <a
          href="/blog"
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-all shadow-lg active:scale-95"
        >
          View all posts
          <ArrowRight className="h-5 w-5" />
        </a>
      </div>
    </section>
  );
}
