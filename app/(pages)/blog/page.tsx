"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
  fetchBlogBySlug,
  clearSelectedPost,
} from "@/lib/features/blog/blogSlice";
import { Loader2 } from "lucide-react";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const dispatch = useDispatch<AppDispatch>();
  const {
    selectedPost: post,
    singleStatus,
    error,
  } = useSelector((state: RootState) => state.blogs);

  useEffect(() => {
    if (slug) {
      dispatch(fetchBlogBySlug(slug));
    }
    return () => {
      dispatch(clearSelectedPost());
    };
  }, [slug, dispatch]);

  if (singleStatus === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (singleStatus === "failed" || !post) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 text-center">
        <h1 className="text-2xl font-semibold">Post not found</h1>
        <p className="mt-2 text-red-500">{error}</p>
        <p className="mt-4">
          Go back to{" "}
          <Link href="/blog" className="underline text-blue-600">
            the blog
          </Link>
          .
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="relative h-[300px] rounded-xl overflow-hidden border">
        <Image
          src={post.featuredImage || "/placeholder.svg"}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="mt-6">
        {post.tags && post.tags.length > 0 && (
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
            {post.tags.join(", ")}
          </div>
        )}
        <h1 className="text-3xl font-semibold mt-1 text-pretty">
          {post.title}
        </h1>
        <p className="text-muted-foreground mt-3">{post.excerpt}</p>
      </div>

      <article
        className="prose prose-sm md:prose-base dark:prose-invert mt-6"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></article>
    </main>
  );
}
