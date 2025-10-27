"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowRight, X, Plus, Minus } from "lucide-react";
import { useAppContext } from "@/app/context/AppContext";
import { Button } from "@/components/ui/button";
import { generateSlug } from "@/lib/utils";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useAppContext();

  // ✅ FIX: Humne .reduce() ko aur bhi safe bana diya hai.
  // Ab yeh check karega ki item valid hai ya nahi, crash hone se pehle.
  const subtotal =
    cartItems?.reduce((acc, item) => {
      // Agar item null, undefined, ya usmein price/quantity nahi hai, to use skip kar do.
      if (!item || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
        return acc; // Current total ko waise hi aage bhej do
      }
      return acc + item.price * item.quantity;
    }, 0) || 0; // Agar cartItems null hai to 0 use karo

  const total = subtotal;

  if (!cartItems || cartItems.length === 0) {
    return (
      <main className="bg-gray-50 min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 text-center">
          <ShoppingBag className="mx-auto h-24 w-24 text-gray-400" />
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Your cart is empty
          </h1>
          <p className="mt-4 text-base text-gray-500">
            Start exploring our collections!
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-base font-semibold text-white shadow-sm transition-transform hover:scale-105 hover:bg-orange-600"
            >
              Continue Shopping
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-12">
          Shopping Cart
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <section className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => {
              // Extra safety check: Agar item null hai to kuch bhi render mat karo
              if (!item || !item._id) return null;

              const slug = generateSlug(item.name || "product", item._id);
              const imageUrl = item.images?.[0] || "/placeholder-image.jpg";
              const itemPrice = item.price || 0;
              const itemQuantity = item.quantity || 0;

              return (
                <div
                  key={item._id}
                  className="flex bg-white p-4 rounded-lg shadow-sm border items-start sm:items-center gap-6 relative"
                >
                  <Link href={`/product/${slug}`} className="flex-shrink-0">
                    <Image
                      src={imageUrl}
                      alt={item.name || "Product"}
                      width={120}
                      height={120}
                      className="rounded-md object-cover aspect-square"
                    />
                  </Link>
                  <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="flex-1">
                      <Link href={`/product/${slug}`}>
                        <h3 className="font-semibold text-gray-800 text-lg hover:text-orange-600">
                          {item.name || "Unnamed Product"}
                        </h3>
                      </Link>
                      <p className="text-xl font-bold text-gray-900 mt-2">
                        ₹{(itemPrice * itemQuantity).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center border border-gray-200 rounded-full w-fit mt-4 sm:mt-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-8 w-8"
                        onClick={() =>
                          updateQuantity(item._id, item.quantity - 1)
                        }
                      >
                        <Minus size={16} />
                      </Button>
                      <span className="w-10 text-center font-semibold">
                        {itemQuantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-8 w-8"
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50"
                    onClick={() => removeFromCart(item._id)}
                    aria-label="Remove item"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              );
            })}
          </section>

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
