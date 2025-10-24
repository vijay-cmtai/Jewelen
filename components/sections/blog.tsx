"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchAllBlogs } from "@/lib/features/blog/blogSlice";
import { BookOpen, ArrowRight, Clock, Loader2 } from "lucide-react";

export default function BlogSection() {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, listStatus, error } = useSelector(
    (state: RootState) => state.blogs
  );

  useEffect(() => {
    // Agar posts pehle se fetch nahi hue hain, toh fetch karein
    if (listStatus === "idle") {
      dispatch(fetchAllBlogs());
    }
  }, [listStatus, dispatch]);

  if (listStatus === "loading") {
    return (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-20 flex justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </section>
    );
  }

  // Agar koi error hai ya koi post nahi hai, toh section na dikhayein
  if (listStatus === "failed" || posts.length === 0) {
    return null;
  }

  // Sirf 3 latest posts dikhayein
  const latestPosts = posts.slice(0, 3);

  return (
    <section
      id="blog"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 mb-20"
    >
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
        <Link
          href="/blog"
          className="hidden md:inline-flex items-center gap-2 text-gray-900 font-semibold hover:gap-3 transition-all"
        >
          View all posts
          <ArrowRight className="h-5 w-5" />
        </Link>
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
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
                <div className="flex items-center gap-1 text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  <span>Read more</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center md:hidden">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-all shadow-lg active:scale-95"
        >
          View all posts
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
