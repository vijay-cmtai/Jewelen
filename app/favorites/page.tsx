"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, X } from "lucide-react";
import { useAppContext } from "@/app/context/AppContext";
import { products } from "@/lib/products";
import { Button } from "@/components/ui/button";

export default function FavoritesPage() {
  const { wishlistItems, addToCart, removeFromWishlist } = useAppContext();

  // Wishlist ke items ki poori details products list se lein
  const wishlistProducts = products.filter((p) => wishlistItems.includes(p.id));

  // SCENARIO 1: Agar wishlist khaali hai
  if (wishlistItems.length === 0) {
    return (
      <main className="bg-gray-50 min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 text-center">
          <Heart className="mx-auto h-24 w-24 text-gray-400" />
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Your wishlist is empty
          </h1>
          <p className="mt-4 text-base text-gray-500">
            Explore our collections and save your favorite items by clicking the
            heart icon. They will appear here.
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center rounded-full bg-orange-500 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-orange-600"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // SCENARIO 2: Agar wishlist mein items hain
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-12">
          Your Wishlist
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <div
              key={product.id}
              className="group relative border rounded-lg p-4 bg-white shadow-sm hover:shadow-lg transition-shadow"
            >
              <Link href={`/product/${product.slug}`} className="block">
                <div className="aspect-square w-full overflow-hidden rounded-md mb-4">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    width={300}
                    height={300}
                    className="h-full w-full object-cover object-center group-hover:opacity-80 transition-opacity"
                  />
                </div>
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                  {product.title}
                </h3>
                <p className="mt-2 text-lg font-bold text-gray-900">
                  ₹{product.price.toLocaleString()}
                </p>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 rounded-full h-8 w-8 bg-white/80 text-gray-400 hover:text-red-500 hover:bg-red-50 shadow-sm"
                onClick={() => removeFromWishlist(product.id)}
                aria-label="Remove from wishlist"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                className="w-full mt-4 bg-orange-500 hover:bg-orange-600 rounded-full font-semibold"
                onClick={() => {
                  addToCart(product.id);
                  removeFromWishlist(product.id); // Optional: wishlist se hata dein jab cart mein add ho jaye
                }}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Move to Cart
              </Button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
