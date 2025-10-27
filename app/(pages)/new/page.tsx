"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchJewelry } from "@/lib/features/jewelry/jewelrySlice";
import { useAppContext } from "@/app/context/AppContext";
import { generateSlug } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Heart, ShoppingCart, Loader2 } from "lucide-react";

const pageTitle = "New Arrivals";
const pageDescription =
  "Fresh finds and exquisite designs, curated just for you.";

export default function NewArrivalsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { addToCart, addToWishlist, isItemInWishlist } = useAppContext();

  const {
    items: newArrivals,
    listStatus,
    error,
  } = useSelector((state: RootState) => state.jewelry);

  useEffect(() => {
    dispatch(fetchJewelry({ category: "New Arrivals" }));
  }, [dispatch]);

  if (listStatus === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">
          Discovering the latest trends...
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

        {newArrivals.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold">No New Arrivals Found</h2>
            <p className="mt-2 text-muted-foreground">
              Please check back soon for our latest collection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {newArrivals.map((product) => {
              const slug = generateSlug(product.name, product._id);
              const discount = product.originalPrice
                ? Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100
                  )
                : 0;

              return (
                <div key={product._id} className="group relative">
                  <Carousel
                    opts={{ loop: product.images.length > 1 }}
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
                    {product.images.length > 1 && (
                      <>
                        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </>
                    )}
                  </Carousel>

                  <button
                    onClick={() => addToWishlist(product._id)}
                    className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-gray-100 transition z-20"
                  >
                    <Heart
                      size={18}
                      className={`transition-all ${
                        isItemInWishlist(product._id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-500"
                      }`}
                    />
                  </button>

                  {discount > 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-2.5 py-1.5 rounded-full text-xs font-bold shadow-lg z-20">
                      {discount}% OFF
                    </div>
                  )}

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
                    <div className="flex items-baseline gap-2 mt-1">
                      <p className="text-lg font-bold text-gray-900">
                        ₹{product.price.toLocaleString()}
                      </p>
                      {product.originalPrice && (
                        <p className="text-sm text-gray-500 line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                    {(product.tax ?? 0) > 0 ? (
                      <p className="text-xs text-gray-500 mt-1">
                        (incl. {product.tax}% tax)
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 mt-1">
                        (incl. of all taxes)
                      </p>
                    )}
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
