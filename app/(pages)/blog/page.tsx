// Pehle "use client" likhna zaroori hai kyunki hum hooks (useEffect, useSelector) use kar rahe hain
"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchAllBlogs } from "@/lib/features/blog/blogSlice";

// Icons
import { BookOpen, ArrowRight, Clock, Loader2 } from "lucide-react";

//==================================================================
// BANNER COMPONENT
//==================================================================
function Banner() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
      <div className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1599330293282-140a3b2b005f?q=80&w=2127&auto=format&fit=crop"
            alt="Jewelry background"
            fill
            className="object-cover opacity-30"
          />
        </div>
        <div className="relative text-center px-8 py-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Our Jewelry Journal
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
            Discover inspiration, styling tips, and the fascinating stories
            behind our collections.
          </p>
          <div className="mt-8">
            <Link
              href="#blog"
              className="inline-block rounded-md bg-orange-600 py-3 px-8 text-base font-medium text-white hover:bg-orange-700 transition-transform hover:scale-105"
            >
              Explore Articles
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

//==================================================================
// BLOG SECTION COMPONENT (Aapke code se)
//==================================================================
function BlogSection() {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, listStatus } = useSelector((state: RootState) => state.blogs);

  useEffect(() => {
    if (listStatus === "idle") {
      dispatch(fetchAllBlogs());
    }
  }, [listStatus, dispatch]);

  if (listStatus === "loading") {
    return (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-20 flex justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
      </section>
    );
  }

  if (listStatus === "failed" || posts.length === 0) {
    return null; // Agar error ho ya post na ho toh kuch na dikhayein
  }

  // Sirf 3 latest posts dikhayein
  const latestPosts = posts.slice(0, 3);

  return (
    <section
      id="blog"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 mb-20"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Fresh From The Blog
        </h2>
        <p className="mt-3 text-gray-600 text-lg max-w-2xl mx-auto">
          Stories, guides, and inspiration for jewelry lovers.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        {latestPosts.map((post) => (
          <Link
            key={post._id}
            href={`/blog/${post.slug}`}
            className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="relative h-[280px] overflow-hidden bg-gray-100">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {post.tags && post.tags.length > 0 && (
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                    {post.tags[0]}
                  </span>
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime}</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                  <span>Read more</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-900 font-semibold hover:text-orange-600 transition-all text-lg"
        >
          View All Posts
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}

//==================================================================
// MAIN PAGE COMPONENT
//==================================================================

export default function BlogPage() {
  return (
    <div className="bg-gray-50">
      <main>
        <Banner />
        <BlogSection />
      </main>
    </div>
  );
}
