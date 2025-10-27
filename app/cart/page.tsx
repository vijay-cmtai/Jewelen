"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowRight, X, Plus, Minus } from "lucide-react";
import { useAppContext } from "@/app/context/AppContext";
import { Button } from "@/components/ui/button";
import { generateSlug } from "@/lib/utils";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useAppContext();

  // --- NAYI LOGIC: SABHI TOTALS CALCULATE KAREIN ---
  const mrpTotal =
    cartItems?.reduce(
      (acc, item) =>
        acc + (item?.originalPrice || item?.price || 0) * (item?.quantity || 0),
      0
    ) || 0;

  const discountedSubtotal =
    cartItems?.reduce(
      (acc, item) => acc + (item?.price || 0) * (item?.quantity || 0),
      0
    ) || 0;

  const totalDiscount = mrpTotal - discountedSubtotal;

  const totalTax =
    cartItems?.reduce(
      (acc, item) =>
        acc +
        ((item?.price || 0) * (item?.quantity || 0) * (item?.tax || 0)) / 100,
      0
    ) || 0;

  const grandTotal = discountedSubtotal + totalTax;
  // --------------------------------------------------

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
              if (!item || !item._id) return null;

              const slug = generateSlug(item.name || "product", item._id);
              return (
                <div
                  key={item._id}
                  className="flex bg-white p-4 rounded-lg shadow-sm border items-start sm:items-center gap-6 relative"
                >
                  <Link href={`/product/${slug}`} className="flex-shrink-0">
                    <Image
                      src={item.images?.[0] || ""}
                      alt={item.name || ""}
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
                      <div className="flex items-baseline gap-2 mt-2">
                        <p className="text-xl font-bold text-gray-900">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                        {item.originalPrice && (
                          <p className="text-sm text-gray-500 line-through">
                            ₹
                            {(
                              item.originalPrice * item.quantity
                            ).toLocaleString()}
                          </p>
                        )}
                      </div>
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
                        {item.quantity}
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

          {/* --- YAHAN BADLAV KIYA GAYA HAI: ORDER SUMMARY --- */}
          <section className="bg-white p-6 rounded-lg shadow-sm border h-fit lg:sticky lg:top-24">
            <h2 className="text-xl font-semibold border-b pb-4 mb-4">
              Order Summary
            </h2>
            <div className="space-y-3 text-gray-600">
              <div className="flex justify-between">
                <span>MRP Total</span>
                <span>₹{mrpTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount on MRP</span>
                <span>- ₹{totalDiscount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Charges</span>
                <span>₹{totalTax.toLocaleString()}</span>
              </div>
              <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg text-gray-900">
                <span>Grand Total</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>
            <Link href="/checkout" passHref>
              <Button className="w-full mt-6 bg-orange-500 hover:bg-orange-600 rounded-full py-6 text-base font-semibold">
                Proceed to Checkout
              </Button>
            </Link>
          </section>
          {/* --- END OF CHANGES --- */}
        </div>
      </div>
    </main>
  );
}
