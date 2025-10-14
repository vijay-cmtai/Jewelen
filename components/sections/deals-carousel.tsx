"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Tag,
  ShoppingCart,
  Heart,
} from "lucide-react";
import { products } from "@/lib/products"; // Step 1: Import from the central data file
import { useAppContext } from "@/app/context/AppContext";

// Step 2: Create a dynamic list of deals from the master product list
// We'll filter for products that have an original price (meaning they are on sale)
// and then take the first 6.
const deals = products
  .filter((p) => p.originalPrice && p.originalPrice > p.price)
  .slice(0, 6);

export default function DealsCarousel() {
  const rail = useRef<HTMLDivElement>(null);
  const { addToCart, addToWishlist, isItemInWishlist } = useAppContext();

  function scroll(dx: number) {
    rail.current?.scrollBy({ left: dx, behavior: "smooth" });
  }

  return (
    <section
      id="deals"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 mb-20"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <Tag className="h-7 w-7 text-red-500" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Today's Big Deals
            </h2>
          </div>
          <p className="text-gray-600 mt-2 ml-10">
            Limited time offers on premium jewelry
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="hidden md:flex gap-2">
          <button
            onClick={() => scroll(-320)}
            className="p-3 rounded-full bg-white border-2 border-gray-200 shadow-md hover:shadow-lg hover:border-gray-300 transition-all active:scale-95"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={() => scroll(320)}
            className="p-3 rounded-full bg-white border-2 border-gray-200 shadow-md hover:shadow-lg hover:border-gray-300 transition-all active:scale-95"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={rail}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
      >
        {deals.map((product) => {
          const discount = product.originalPrice
            ? Math.round(
                ((product.originalPrice - product.price) /
                  product.originalPrice) *
                  100
              )
            : 0;

          return (
            <div
              key={product.id}
              className="min-w-[280px] sm:min-w-[300px] snap-start group"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                {/* Image container */}
                <div className="relative h-[280px] overflow-hidden bg-gray-100">
                  <Link href={`/product/${product.slug}`}>
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      fill
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </Link>

                  {/* Discount badge */}
                  {discount > 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg">
                      {discount}% OFF
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={() => addToWishlist(product.id)}
                    className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-gray-100 transition"
                  >
                    <Heart
                      size={18}
                      className={`transition-all ${isItemInWishlist(product.id) ? "fill-red-500 text-red-500" : "text-gray-500"}`}
                    />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5">
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 mb-3 group-hover:text-orange-600">
                      {product.title}
                    </h3>
                  </Link>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-base text-gray-500 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-full">
                      <Star className="h-4 w-4 fill-green-600 text-green-600" />
                      <span className="text-sm font-semibold text-green-700">
                        {product.rating}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ({product.reviews.toLocaleString()}+ reviews)
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(product.id)}
                    className="w-full mt-4 py-3 bg-orange-500 text-white rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
