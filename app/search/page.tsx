"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchJewelry } from "@/lib/features/jewelry/jewelrySlice";
import { useAppContext } from "@/app/context/AppContext";
import { generateSlug } from "@/lib/utils";
import { Heart, ShoppingCart, Loader2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function SearchResults() {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const { addToCart, addToWishlist, isItemInWishlist } = useAppContext();
  const {
    items: searchResults,
    listStatus,
    error,
  } = useSelector((state: RootState) => state.jewelry);

  useEffect(() => {
    if (query) {
      dispatch(fetchJewelry({ search: query }));
    }
  }, [query, dispatch]);

  if (listStatus === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Searching for "{query}"...</p>
      </div>
    );
  }

  if (listStatus === "failed") {
    return <div className="text-center text-red-500 my-20">Error: {error}</div>;
  }

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          {searchResults.length > 0 ? (
            <>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                Search Results for "{query}"
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Found {searchResults.length} items.
              </p>
            </>
          ) : (
            <div className="text-center py-20">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                No Results for "{query}"
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Try searching for something else, or check out our new arrivals.
              </p>
              <Link
                href="/new"
                className="mt-8 inline-block bg-primary text-white px-6 py-3 rounded-full font-semibold"
              >
                Explore New Arrivals
              </Link>
            </div>
          )}
        </div>

        {searchResults.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {searchResults.map((product) => {
              const slug = generateSlug(product.name, product._id);
              return (
                <div key={product._id} className="group relative">
                  <Carousel
                    opts={{ loop: true }}
                    className="relative w-full overflow-hidden rounded-lg bg-gray-100"
                  >
                    <CarouselContent>
                      {product.images.map((imgUrl, index) => (
                        <CarouselItem key={index}>
                          <Link href={`/product/${slug}`}>
                            <div className="aspect-square relative">
                              <Image
                                src={imgUrl}
                                alt={`${product.name} - image ${index + 1}`}
                                fill
                                className="object-cover object-center group-hover:opacity-80 transition-opacity"
                              />
                            </div>
                          </Link>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Carousel>

                  <button
                    onClick={() => addToWishlist(product._id)}
                    className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-gray-100 transition z-20"
                  >
                    <Heart
                      size={18}
                      className={`transition-all ${isItemInWishlist(product._id) ? "fill-red-500 text-red-500" : "text-gray-500"}`}
                    />
                  </button>
                  <button
                    onClick={() => addToCart(product._id)}
                    className="absolute bottom-3 right-3 bg-primary text-white p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 hover:bg-primary/90 z-20"
                  >
                    <ShoppingCart size={18} />
                  </button>

                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-800">
                      <Link href={`/product/${slug}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </Link>
                    </h3>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      ₹{product.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
