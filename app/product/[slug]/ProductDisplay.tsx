"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star, Heart, Truck, CheckCircle, Minus, Plus } from "lucide-react";
import { Product } from "@/lib/products";
import { useAppContext } from "@/app/context/AppContext";

export default function ProductDisplay({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, addToWishlist, isItemInWishlist } = useAppContext();

  return (
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
      <div className="flex flex-col-reverse md:flex-row gap-4">
        <div className="flex md:flex-col gap-3">
          {product.images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(src)}
              className={`relative aspect-square w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${activeImage === src ? "border-orange-500 scale-110" : "border-transparent hover:border-gray-300"}`}
            >
              <Image
                src={src}
                alt={`${product.title} ${i + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
        <div className="relative aspect-square w-full rounded-xl overflow-hidden border">
          <Image
            src={activeImage}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>
      </div>
      <div>
        <span className="text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
          {product.category}
        </span>
        <h1 className="text-3xl lg:text-4xl font-bold mt-3 text-gray-900">
          {product.title}
        </h1>
        <div className="flex items-center gap-2 mt-4">
          <div className="flex items-center text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                fill="currentColor"
                className={
                  i < Math.floor(product.rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">
            ({product.reviews.toLocaleString()} reviews)
          </span>
        </div>
        <p className="text-gray-600 mt-5 leading-relaxed">
          {product.description}
        </p>
        <div className="mt-6 flex items-baseline gap-3">
          <div className="text-4xl font-bold text-gray-900">
            ₹{product.price.toLocaleString()}
          </div>
          {product.originalPrice && (
            <div className="text-xl text-gray-400 line-through">
              ₹{product.originalPrice.toLocaleString()}
            </div>
          )}
        </div>
        <div className="mt-8 flex items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-full">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <Minus size={16} />
            </Button>
            <span className="w-10 text-center font-semibold">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setQuantity((q) => q + 1)}
            >
              <Plus size={16} />
            </Button>
          </div>
          <Button
            size="lg"
            className="flex-1 rounded-full bg-orange-500 hover:bg-orange-600 text-base font-semibold py-6"
            onClick={() => addToCart(product.id, quantity)}
          >
            Add to cart
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full w-12 h-12"
            onClick={() => addToWishlist(product.id)}
          >
            <Heart
              size={20}
              className={`transition-all ${isItemInWishlist(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
            />
          </Button>
        </div>
        <div className="mt-8 space-y-3 text-sm text-gray-600">
          <div className="flex items-center gap-3">
            <Truck size={20} className="text-orange-500" />
            <p>
              <span className="font-semibold text-gray-800">Free Shipping</span>{" "}
              on orders over ₹1,999
            </p>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle size={20} className="text-orange-500" />
            <p>
              <span className="font-semibold text-gray-800">Made in India</span>{" "}
              with highest quality materials
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
