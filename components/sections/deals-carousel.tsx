"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Tag,
  ShoppingCart,
  Heart,
  Loader2,
} from "lucide-react";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchJewelry, JewelryItem } from "@/lib/features/jewelry/jewelrySlice";
import { useAppContext } from "@/app/context/AppContext";
import { generateSlug } from "@/lib/utils";

export default function DealsCarousel() {
  const rail = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { addToCart, addToWishlist, isItemInWishlist } = useAppContext();

  const { items: allProducts, listStatus } = useSelector(
    (state: RootState) => state.jewelry
  );

  const [itemsToShow, setItemsToShow] = useState<JewelryItem[]>([]);

  useEffect(() => {
    dispatch(fetchJewelry({}));
  }, [dispatch]);

  useEffect(() => {
    if (allProducts.length > 0) {
      let filteredItems = allProducts.filter(
        (p) => p.originalPrice && p.originalPrice > p.price
      );

      if (filteredItems.length === 0) {
        console.log(
          "No specific deals found. Showing latest products as fallback."
        );
        filteredItems = allProducts;
      }

      setItemsToShow(filteredItems.slice(0, 8));
    }
  }, [allProducts]);

  function scroll(dx: number) {
    rail.current?.scrollBy({ left: dx, behavior: "smooth" });
  }

  if (listStatus === "loading" && itemsToShow.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (itemsToShow.length === 0) {
    return null;
  }

  return (
    <section
      id="deals"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 mb-20"
    >
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

      <div
        ref={rail}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {itemsToShow.map((product) => {
          const discount = product.originalPrice
            ? Math.round(
                ((product.originalPrice - product.price) /
                  product.originalPrice) *
                  100
              )
            : 0;

          const savings = product.originalPrice
            ? product.originalPrice - product.price
            : 0;

          const slug = generateSlug(product.name, product._id);

          return (
            <div
              key={product._id}
              className="min-w-[280px] sm:min-w-[300px] snap-start group"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <div className="relative h-[280px] overflow-hidden bg-gray-100">
                  <Link href={`/product/${slug}`}>
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </Link>

                  {discount > 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg">
                      {discount}% OFF
                    </div>
                  )}

                  <button
                    onClick={() => addToWishlist(product._id)}
                    className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-gray-100 transition"
                  >
                    <Heart
                      size={18}
                      className={`transition-all ${isItemInWishlist(product._id) ? "fill-red-500 text-red-500" : "text-gray-500"}`}
                    />
                  </button>
                </div>

                <div className="p-5">
                  <Link href={`/product/${slug}`}>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 mb-3 group-hover:text-orange-600">
                      {product.name}
                    </h3>
                  </Link>

                  {/* --- PRICE DISPLAY LOGIC --- */}
                  <div className="flex items-baseline gap-3 mb-3">
                    {/* YEH NAYI (DISCOUNTED) PRICE HAI */}
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{product.price.toLocaleString()}
                    </span>

                    {/* YEH PURANI (ORIGINAL) PRICE HAI, JO KATI HUI DIKHEGI */}
                    {product.originalPrice && (
                      <span className="text-base text-gray-500 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {/* --- END OF PRICE DISPLAY LOGIC --- */}

                  {savings > 0 && (
                    <div className="mt-2 text-sm text-green-600 font-semibold">
                      You save ₹{savings.toLocaleString()}
                    </div>
                  )}

                  <button
                    onClick={() => addToCart(product._id)}
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
