// YAHI FIX HAI BHAI
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  Heart,
  ShoppingCart,
  ChevronRight,
  Minus,
  Plus,
} from "lucide-react";

const product = {
  name: "Elegant Gold Chain Bracelet",
  category: "Bracelets",
  price: 249.99,
  originalPrice: 279.99,
  rating: 4.8,
  reviewCount: 215,
  sku: "JWL-BR-015",
  availability: "In Stock",
  images: [
    "https://images.unsplash.com/photo-1611652022417-a546735a3979?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1593562369439-53556551b9e6?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1617038260897-41a4f2240183?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1620950346239-8c91d3f57782?q=80&w=1964&auto=format&fit=crop",
  ],
  description:
    "Crafted from premium 18k gold plating, this elegant chain bracelet is a timeless addition to any collection. Its versatile design seamlessly transitions from day to night, making it the perfect accessory for any occasion.",
  details: [
    { name: "Material", value: "18k Gold Plated on Stainless Steel" },
    { name: "Length", value: "7.5 inches with 1-inch extender" },
    { name: "Clasp Type", value: "Lobster Claw" },
    { name: "Hypoallergenic", value: "Yes" },
  ],
};

const relatedProducts = [
  {
    id: 1,
    name: "Silver Star Bracelet",
    price: 189.0,
    image:
      "https://images.unsplash.com/photo-1617127238289-42b7261b2787?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Rose Gold Butterfly Necklace",
    price: 210.0,
    image:
      "https://images.unsplash.com/photo-1610494133989-b3b3a650f688?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Silver Drop Earrings",
    price: 155.0,
    image:
      "https://images.unsplash.com/photo-1613520790109-c1e194138b25?q=80&w=1976&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Aurelia Solitaire Ring",
    price: 749.0,
    image:
      "https://images.unsplash.com/photo-1611389944111-46b359f48ddc?q=80&w=2127&auto=format&fit=crop",
  },
];

export default function ProductDetailPage() {
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="bg-white">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex mb-8 text-sm" aria-label="Breadcrumb">
          <ol role="list" className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Jewelen
              </Link>
            </li>
            <li>
              <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-400" />
            </li>
            <li>
              <Link
                href="/collections/bracelets"
                className="text-gray-500 hover:text-gray-700"
              >
                Bracelets
              </Link>
            </li>
            <li>
              <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-400" />
            </li>
            <li>
              <span className="font-medium text-gray-800">{product.name}</span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="aspect-square w-full overflow-hidden rounded-lg">
              <Image
                src={activeImage}
                alt={product.name}
                width={800}
                height={800}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(image)}
                  className={`aspect-square rounded-md overflow-hidden border-2 ${activeImage === image ? "border-orange-500" : "border-transparent"} hover:border-orange-400 focus:outline-none`}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:mt-0">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
              {product.name}
            </h1>

            <div className="mt-4 flex items-center gap-4">
              <p className="text-3xl tracking-tight text-gray-900">
                ${product.price}
              </p>
              <p className="text-xl tracking-tight text-gray-400 line-through">
                ${product.originalPrice}
              </p>
              <span className="inline-block bg-red-100 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                10% OFF
              </span>
            </div>

            <div className="mt-4 flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${product.rating > i ? "text-yellow-400" : "text-gray-300"}`}
                    fill="currentColor"
                  />
                ))}
              </div>
              <a
                href="#reviews"
                className="ml-3 text-sm font-medium text-orange-600 hover:text-orange-500"
              >
                {product.reviewCount} reviews
              </a>
            </div>

            <p className="mt-6 text-gray-600 leading-relaxed">
              {product.description}
            </p>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center rounded border border-gray-300">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-gray-500 hover:bg-gray-100"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 text-center font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 text-gray-500 hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-orange-600"
              >
                <Heart className="h-5 w-5" /> Add to Wishlist
              </button>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-orange-600 py-3 px-8 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                <ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart
              </button>
            </div>

            <div className="mt-10 border-t border-gray-200 pt-8">
              <h3 className="text-lg font-medium text-gray-900">Details</h3>
              <div className="mt-4 prose prose-sm text-gray-600">
                <ul>
                  {product.details.map((detail) => (
                    <li key={detail.name}>
                      <strong>{detail.name}:</strong> {detail.value}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-16 border-t border-gray-200">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 text-center">
            You Might Also Like
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {relatedProducts.map((item) => (
              <div key={item.id} className="group relative">
                <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={500}
                    height={500}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-sm font-medium text-gray-900">
                    <Link href="#">
                      <span
                        aria-hidden="true"
                        className="absolute inset-0"
                      ></span>
                      {item.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
