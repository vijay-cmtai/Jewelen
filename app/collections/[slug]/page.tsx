"use client";

import { useEffect } from "react";
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

export default function CollectionPage({
  params,
}: {
  params: { slug: string };
}) {
  const dispatch = useDispatch<AppDispatch>();
  const query = params.slug.replace(/-/g, " "); // slug ko search query banayein
  const title = query.replace(/\b\w/g, (m) => m.toUpperCase());

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
        <p className="mt-4 text-muted-foreground">
          Loading "{title}" collection...
        </p>
      </div>
    );
  }

  if (listStatus === "failed") {
    return <div className="text-center text-red-500 my-20">Error: {error}</div>;
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        {title}
      </h1>
      <p className="mt-2 text-lg text-gray-600">
        Curated finds from our "{title}" collection.
      </p>

      {searchResults.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold">No Items Found</h2>
          <p className="mt-2 text-muted-foreground">
            Please check back soon for our latest items in this collection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 mt-12">
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
                  <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100" />
                  <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100" />
                </Carousel>
                <button
                  onClick={() => addToWishlist(product._id)}
                  className="absolute top-3 left-3 bg-white/80 rounded-full p-2 shadow-md z-20"
                >
                  <Heart
                    size={18}
                    className={`transition-all ${isItemInWishlist(product._id) ? "fill-red-500 text-red-500" : "text-gray-500"}`}
                  />
                </button>
                <button
                  onClick={() => addToCart(product._id)}
                  className="absolute bottom-3 right-3 bg-primary text-white p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 z-20"
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
    </main>
  );
}
