"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";
import { useAppContext } from "@/app/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CheckoutPage() {
  const { cartItems, clearCart } = useAppContext();
  const router = useRouter();

  // Form state
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Agar cart khaali hai to user ko wapas cart page par bhej dein
  useEffect(() => {
    // Thoda delay dein taaki cartItems Redux se load ho sakein
    const timer = setTimeout(() => {
      if (cartItems.length === 0) {
        router.push("/cart");
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [cartItems, router]);

  // cartItems mein ab poori product details hain, alag se map karne ki zaroorat nahi
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
    0
  );
  const total = subtotal; // Assuming free shipping

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !address || !city || !pincode || !phone) {
      alert("Please fill all shipping details.");
      return;
    }

    setIsPlacingOrder(true);

    // Yahan aap backend API call karke order create karenge
    // Abhi ke liye hum 2 second ka delay simulate kar rahe hain
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Order Placed:", {
      email,
      name,
      address,
      city,
      pincode,
      phone,
      paymentMethod,
      items: cartItems,
      total,
    });

    setIsPlacingOrder(false);
    alert("Order placed successfully! Thank you for shopping with us.");

    clearCart(); // Redux action to clear cart
    router.push("/");
  };

  // Jab tak cartItems load ho rahe hain, loader dikhayein
  if (cartItems.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          {/* Left Side: Forms */}
          <div className="bg-white p-8 rounded-lg shadow-md border">
            <form onSubmit={handlePlaceOrder}>
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Contact information
                </h2>
                <div className="mt-4">
                  <label
                    htmlFor="email-address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <Input
                    type="email"
                    id="email-address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="mt-10 border-t border-gray-200 pt-10">
                <h2 className="text-lg font-medium text-gray-900">
                  Shipping information
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full name
                    </label>
                    <Input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone
                    </label>
                    <Input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Address
                    </label>
                    <Input
                      type="text"
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      City
                    </label>
                    <Input
                      type="text"
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="postal-code"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Postal code
                    </label>
                    <Input
                      type="text"
                      id="postal-code"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10 border-t border-gray-200 pt-10">
                <h2 className="text-lg font-medium text-gray-900">Payment</h2>
                <fieldset className="mt-4">
                  <legend className="sr-only">Payment type</legend>
                  <div className="space-y-4">
                    <div
                      className={`relative flex items-start border rounded-md p-4 transition-all ${paymentMethod === "card" ? "border-orange-500 ring-2 ring-orange-200" : "border-gray-300"}`}
                    >
                      <input
                        id="card"
                        type="radio"
                        name="payment-type"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                        className="h-4 w-4 mt-1 text-orange-600 border-gray-300 focus:ring-orange-500"
                      />
                      <label
                        htmlFor="card"
                        className="ml-3 block text-sm font-medium text-gray-700"
                      >
                        Credit card
                      </label>
                    </div>
                    {paymentMethod === "card" && (
                      <div className="space-y-4 p-4 bg-gray-50 rounded-md">
                        <Input placeholder="Card number" />
                        <div className="grid grid-cols-2 gap-4">
                          <Input placeholder="MM / YY" />
                          <Input placeholder="CVC" />
                        </div>
                      </div>
                    )}
                    <div
                      className={`relative flex items-start border rounded-md p-4 transition-all ${paymentMethod === "upi" ? "border-orange-500 ring-2 ring-orange-200" : "border-gray-300"}`}
                    >
                      <input
                        id="upi"
                        type="radio"
                        name="payment-type"
                        value="upi"
                        checked={paymentMethod === "upi"}
                        onChange={() => setPaymentMethod("upi")}
                        className="h-4 w-4 mt-1 text-orange-600 border-gray-300 focus:ring-orange-500"
                      />
                      <label
                        htmlFor="upi"
                        className="ml-3 block text-sm font-medium text-gray-700"
                      >
                        UPI / Wallets
                      </label>
                    </div>
                  </div>
                </fieldset>
              </div>

              <div className="mt-10 pt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  disabled={isPlacingOrder}
                  className="w-full bg-orange-500 hover:bg-orange-600 rounded-full py-6 text-base font-semibold flex items-center justify-center gap-2"
                >
                  {isPlacingOrder ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <Lock className="h-5 w-5" />
                      Place Order
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Right Side: Order Summary */}
          <div className="mt-10 lg:mt-0">
            <div className="bg-white p-8 rounded-lg shadow-md border lg:sticky lg:top-24">
              <h2 className="text-lg font-medium text-gray-900">
                Order summary
              </h2>
              <div className="mt-4 flow-root">
                <ul className="-my-6 divide-y divide-gray-200">
                  {cartItems.map((product) => (
                    <li key={product._id} className="flex py-6">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={100}
                          height={100}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>
                              <Link href={`/product/${product.slug}`}>
                                {product.name}
                              </Link>
                            </h3>
                            <p className="ml-4">
                              ₹
                              {(
                                product.price * product.quantity
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          Qty {product.quantity}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 border-t border-gray-200 pt-6 space-y-2">
                <div className="flex items-center justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>₹{subtotal.toLocaleString()}</p>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-4 text-lg font-bold text-gray-900">
                  <p>Order total</p>
                  <p>₹{total.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
