"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { products } from "@/lib/products";
import { useAppContext } from "@/app/context/AppContext";

// Page-specific configuration
const categoryProducts = products.slice(0, 8); // Showing first 8 products as New Arrivals
const pageTitle = "New Arrivals";
const pageDescription =
  "Fresh finds and exquisite designs, curated just for you.";

export default function NewArrivalsPage() {
  const { addToCart, addToWishlist, isItemInWishlist } = useAppContext();

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">
            {pageTitle}
          </h1>
          <p className="mt-4 text-lg text-gray-600">{pageDescription}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {categoryProducts.map((product) => (
            <div key={product.id} className="group relative">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                <Link href={`/product/${product.slug}`}>
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover object-center group-hover:opacity-80 transition-opacity"
                  />
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToWishlist(product.id);
                  }}
                  className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-gray-100 transition"
                >
                  <Heart
                    size={18}
                    className={`transition-all ${isItemInWishlist(product.id) ? "fill-red-500 text-red-500" : "text-gray-500"}`}
                  />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(product.id);
                  }}
                  className="absolute bottom-2 right-2 bg-orange-500 text-white p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 hover:bg-orange-600"
                >
                  <ShoppingCart size={18} />
                </button>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-800">
                  <Link href={`/product/${product.slug}`}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.title}
                  </Link>
                </h3>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  ₹{product.price.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
