"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { addBlogPost, resetActionStatus } from "@/lib/features/blog/blogSlice";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";

export default function CreateBlogPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { actionStatus, error } = useSelector(
    (state: RootState) => state.blogs
  );

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [tags, setTags] = useState("");
  const [readTime, setReadTime] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  // ✅ Image preview handle
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFeaturedImage(url);

    if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
      setImagePreview(url);
    } else {
      setImagePreview("");
    }
  };

  // ✅ Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return alert("Title is required!");
    if (!excerpt.trim()) return alert("Excerpt is required!");
    if (!content.trim()) return alert("Content is required!");
    if (!featuredImage.trim()) return alert("Featured image URL is required!");
    if (!readTime.trim()) return alert("Read time is required!");

    const blogData = {
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content,
      featuredImage: featuredImage.trim(),
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      readTime: readTime.trim(),
    };

    dispatch(addBlogPost(blogData));
  };

  // ✅ Action status handle
  useEffect(() => {
    if (actionStatus === "succeeded") {
      alert("Blog post created successfully!");
      dispatch(resetActionStatus());
      router.push("/blog");
    }
    if (actionStatus === "failed") {
      alert(`Error: ${error || "Something went wrong"}`);
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch, router]);

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Create New Blog Post
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Fill in the details below to publish a new article.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-8 rounded-lg shadow-sm"
        >
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., 15 Birthday Jewelry Ideas"
              className="text-base"
              required
            />
          </div>

          {/* Excerpt */}
          <div>
            <label
              htmlFor="excerpt"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Excerpt (Short Summary) <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A short, catchy summary of your blog post."
              rows={3}
              className="text-base"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              {excerpt.length} characters
            </p>
          </div>

          {/* Content (ReactQuill replaced with Textarea) */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Content <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog content here..."
              rows={10}
              className="text-base"
              required
            />
          </div>

          {/* Featured Image */}
          <div>
            <label
              htmlFor="featuredImage"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Featured Image URL <span className="text-red-500">*</span>
            </label>
            <Input
              id="featuredImage"
              value={featuredImage}
              onChange={handleImageChange}
              placeholder="https://example.com/image.jpg"
              className="text-base"
              required
            />
            {imagePreview && (
              <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                  onError={() => setImagePreview("")}
                />
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tags (comma-separated)
            </label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., Gift Ideas, Shopping Guide, Inspiration"
              className="text-base"
            />
            {tags && (
              <div className="mt-2 flex flex-wrap gap-2">
                {tags
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean)
                  .map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            )}
          </div>

          {/* Read Time */}
          <div>
            <label
              htmlFor="readTime"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Read Time <span className="text-red-500">*</span>
            </label>
            <Input
              id="readTime"
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
              placeholder="e.g., 5 min read"
              className="text-base"
              required
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={actionStatus === "loading"}
              className="w-full py-6 text-base font-semibold"
            >
              {actionStatus === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  Publish Post
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
