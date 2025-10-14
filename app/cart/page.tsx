"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowRight, X } from "lucide-react";
import { useAppContext } from "@/app/context/AppContext";
import { products } from "@/lib/products";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { cartItems, removeFromCart } = useAppContext();

  // Cart ke items ki poori details products list se lein
  const cartProductDetails = cartItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      // Agar product nahi milta hai to null return karein
      if (!product) return null;
      // Quantity ko product details ke saath jod dein
      return { ...product, quantity: item.quantity };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null); // Null items ko filter out karein

  const subtotal = cartProductDetails.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingCost = 0; // Aap yahan free shipping ka logic daal sakte hain
  const total = subtotal + shippingCost;

  // SCENARIO 1: Agar cart khaali hai
  if (cartItems.length === 0) {
    return (
      <main className="bg-gray-50 min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 text-center">
          <ShoppingBag className="mx-auto h-24 w-24 text-gray-400" />
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Your cart is empty
          </h1>
          <p className="mt-4 text-base text-gray-500">
            Looks like you haven't added anything to your cart yet. Start
            exploring our collections!
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-base font-semibold text-white shadow-sm transition-transform hover:scale-105 hover:bg-orange-600 focus-visible:outline-amber-600"
            >
              Continue Shopping
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // SCENARIO 2: Agar cart mein items hain
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-12">
          Shopping Cart
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items List */}
          <section className="lg:col-span-2 space-y-6">
            {cartProductDetails.map((item) => (
              <div
                key={item.id}
                className="flex bg-white p-4 rounded-lg shadow-sm border items-start gap-6 relative"
              >
                <Link href={`/product/${item.slug}`} className="flex-shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={120}
                    height={120}
                    className="rounded-md object-cover aspect-square"
                  />
                </Link>
                <div className="flex-1">
                  <Link href={`/product/${item.slug}`}>
                    <h3 className="font-semibold text-gray-800 text-lg hover:text-orange-600">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-xl font-bold text-gray-900 mt-4">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50"
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Remove item"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </section>

          {/* Order Summary */}
          <section className="bg-white p-6 rounded-lg shadow-sm border h-fit lg:sticky lg:top-24">
            <h2 className="text-xl font-semibold border-b pb-4 mb-4">
              Order Summary
            </h2>
            <div className="space-y-4 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">
                  ₹{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            {/* --- YEH BADLAV KIYA GAYA HAI --- */}
            <Link href="/checkout" passHref>
              <Button className="w-full mt-6 bg-orange-500 hover:bg-orange-600 rounded-full py-6 text-base font-semibold">
                Proceed to Checkout
              </Button>
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
