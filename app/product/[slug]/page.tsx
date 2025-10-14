import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { products } from "@/lib/products";
import ProductDisplay from "./ProductDisplay";

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) {
    return notFound();
  }
  const categoryPath = `/${product.category.toLowerCase()}`;

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex items-center text-sm mb-6">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
          <ChevronRight size={16} className="text-gray-400 mx-1" />
          <Link
            href={categoryPath}
            className="text-gray-500 hover:text-gray-700"
          >
            {product.category}
          </Link>
          <ChevronRight size={16} className="text-gray-400 mx-1" />
          <span className="text-gray-800 font-medium truncate">
            {product.title}
          </span>
        </div>
        <ProductDisplay product={product} />
      </div>
    </main>
  );
}
