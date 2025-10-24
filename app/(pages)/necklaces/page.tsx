"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchJewelry } from "@/lib/features/jewelry/jewelrySlice";
import { useAppContext } from "@/app/context/AppContext";
import { generateSlug, isValidObjectId } from "@/lib/utils"; // Zaroori imports
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Heart, ShoppingCart, Loader2 } from "lucide-react";

const pageTitle = "Necklaces Collection";
const pageDescription =
  "Personalised pendants, elegant chokers & stunning statement pieces.";

export default function NecklacesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { addToCart, addToWishlist, isItemInWishlist } = useAppContext();

  const {
    items: necklaces,
    listStatus,
    error,
  } = useSelector((state: RootState) => state.jewelry);

  useEffect(() => {
    dispatch(fetchJewelry({ category: "Necklaces" }));
  }, [dispatch]);

  // DEBUG: Saare product IDs ko data load hone par log karein
  useEffect(() => {
    if (necklaces.length > 0) {
      console.log("🔍 DEBUG: All Products in Necklaces Collection:");
      necklaces.forEach((product, index) => {
        const slug = generateSlug(product.name, product._id);
        console.log(`Product ${index + 1}:`, {
          name: product.name,
          id: product._id,
          idLength: product._id.length,
          isValidObjectId: isValidObjectId(product._id),
          generatedSlug: slug,
        });
      });
    }
  }, [necklaces]);

  if (listStatus === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">
          Loading our finest necklaces...
        </p>
      </div>
    );
  }

  if (listStatus === "failed") {
    return <div className="text-center text-red-500 my-20">Error: {error}</div>;
  }

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">
            {pageTitle}
          </h1>
          <p className="mt-4 text-lg text-gray-600">{pageDescription}</p>
        </div>

        {necklaces.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold">No Necklaces Found</h2>
            <p className="mt-2 text-muted-foreground">
              Please check back later or explore our other collections.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {necklaces.map((product) => {
              const slug = generateSlug(product.name, product._id);
              const isValid = isValidObjectId(product._id);

              // DEBUG: Agar ID invalid hai toh warning dikhayein
              if (!isValid) {
                console.warn("⚠️ INVALID PRODUCT ID IN NECKLACES:", {
                  name: product.name,
                  id: product._id,
                });
              }

              return (
                <div key={product._id} className="group relative">
                  {/* DEBUG: Invalid ID ke liye warning badge */}
                  {!isValid && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded z-30">
                      Invalid ID
                    </div>
                  )}

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
                      <Link
                        href={`/product/${slug}`}
                        onClick={(e) => {
                          // DEBUG: Click event ko log karein
                          console.log("🖱️ Clicked product:", {
                            name: product.name,
                            id: product._id,
                            slug: slug,
                            isValidId: isValid,
                          });
                        }}
                      >
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </Link>
                    </h3>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      ₹{product.price.toLocaleString()}
                    </p>
                    {/* DEBUG: ID ki info dikhayein */}
                    <p className="text-xs text-gray-400 mt-1 font-mono">
                      ID: {product._id.substring(0, 12)}... (
                      {product._id.length} chars)
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
