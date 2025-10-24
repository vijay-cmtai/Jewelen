import { notFound } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { ChevronRight } from "lucide-react";
import ProductDisplay from "./ProductDisplay";
import { JewelryItem } from "@/lib/features/jewelry/jewelrySlice";
import { extractIdFromSlug, isValidObjectId } from "@/lib/utils";

async function getProductById(id: string): Promise<JewelryItem | null> {
  try {
    const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/inventory/${id}`;
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch product:", error.message);
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const productId = extractIdFromSlug(params.slug);

  if (!productId || !isValidObjectId(productId)) {
    return notFound();
  }

  const product = await getProductById(productId);

  if (!product) {
    return notFound();
  }

  const categoryPath = `/${product.category.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex items-center text-sm mb-6 flex-wrap">
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
            {product.name}
          </span>
        </div>

        <ProductDisplay product={product} />
      </div>
    </main>
  );
}
