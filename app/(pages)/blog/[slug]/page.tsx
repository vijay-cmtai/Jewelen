"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchAllBlogs } from "@/lib/features/blog/blogSlice";
import { Clock, Loader2 } from "lucide-react";

export default function BlogPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, listStatus, error } = useSelector(
    (state: RootState) => state.blogs
  );

  useEffect(() => {
    dispatch(fetchAllBlogs());
  }, [dispatch]);

  if (listStatus === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (listStatus === "failed") {
    return <div className="text-center my-20 text-red-500">Error: {error}</div>;
  }

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <main className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
            The Jewelen Blog
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Guides, gift ideas, and stories from our vibrant maker community.
          </p>
        </div>

        {featuredPost && (
          <section className="mb-16">
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src={featuredPost.featuredImage}
                  alt={featuredPost.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </div>
              <div>
                {featuredPost.tags && featuredPost.tags.length > 0 && (
                  <span className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                    {featuredPost.tags[0]}
                  </span>
                )}
                <h2 className="mt-2 text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 group-hover:text-orange-700 transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="mt-4 text-gray-600 line-clamp-3">
                  {featuredPost.excerpt}
                </p>
                <div className="mt-6 flex items-center justify-between text-sm font-medium text-gray-500">
                  <span>By {featuredPost.author?.name || "Jewelen"}</span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} /> {featuredPost.readTime}
                  </span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {otherPosts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 border-b pb-4 mb-8">
              All Posts
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherPosts.map((post) => (
                <Link
                  href={`/blog/${post.slug}`}
                  key={post.slug}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    {post.tags && post.tags.length > 0 && (
                      <span className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                        {post.tags[0]}
                      </span>
                    )}
                    <h3 className="mt-2 text-lg font-semibold leading-snug text-gray-800 group-hover:text-gray-900 transition-colors flex-grow">
                      {post.title}
                    </h3>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} /> {post.readTime}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
