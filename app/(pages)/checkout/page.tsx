// app/checkout/page.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Lock, Loader2, Home, Briefcase, PlusCircle } from "lucide-react";
import { AppDispatch, RootState } from "@/lib/store";
import { useAppContext } from "@/app/context/AppContext";
import { Button } from "@/components/ui/button";
import { fetchAddresses } from "@/lib/features/address/addressSlice";
import { createOrder, verifyPayment } from "@/lib/features/orders/orderSlice";

declare global {
  interface Window {
    Razorpay: any;
  }
}

// <-- YEH CODE CHECKOUT PAGE KA HAI
export default function CheckoutPage() {
  const { cartItems, clearCart } = useAppContext();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { userInfo } = useSelector((state: RootState) => state.user);
  const { addresses, listStatus } = useSelector(
    (state: RootState) => state.address
  );
  const { actionStatus } = useSelector((state: RootState) => state.orders);

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!userInfo) {
      router.push("/login?redirect=/checkout");
      return;
    }
    dispatch(fetchAddresses());
  }, [dispatch, userInfo, router]);

  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddress = addresses.find((addr) => addr.isDefault);
      setSelectedAddressId(defaultAddress?._id || addresses[0]?._id || null);
    }
  }, [addresses]);

  const mrpTotal = cartItems.reduce(
    (acc, item) =>
      acc + (item?.originalPrice || item?.price || 0) * (item?.quantity || 0),
    0
  );
  const discountedSubtotal = cartItems.reduce(
    (acc, item) => acc + (item?.price || 0) * (item?.quantity || 0),
    0
  );
  const totalDiscount = mrpTotal - discountedSubtotal;
  const totalTax = cartItems.reduce(
    (acc, item) =>
      acc +
      ((item?.price || 0) * (item?.quantity || 0) * (item?.tax || 0)) / 100,
    0
  );
  const grandTotal = discountedSubtotal + totalTax;

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a shipping address.");
      return;
    }
    try {
      const result = await dispatch(
        createOrder({
          addressId: selectedAddressId,
          items: cartItems,
          totalAmount: grandTotal,
        })
      ).unwrap();

      const { razorpayOrder, razorpayKeyId, order: dbOrder } = result;
      const options = {
        key: razorpayKeyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Jewelen",
        description: "Transaction for your Jewelry purchase",
        image: "/logo.png",
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          try {
            const verificationResult = await dispatch(
              verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
            ).unwrap();
            toast.success("Payment Successful! Your order has been placed.");
            clearCart();
            router.push(`/order/success?orderId=${verificationResult.orderId}`);
          } catch (verificationError: any) {
            toast.error(verificationError || "Payment verification failed.");
          }
        },
        prefill: { name: userInfo?.name, email: userInfo?.email },
        notes: { address: `Order ID: ${dbOrder._id}` },
        theme: { color: "#ea580c" },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error: any) {
      toast.error(error || "Could not initiate payment.");
    }
  };

  useEffect(() => {
    if (cartItems.length === 0 && actionStatus !== "loading") {
      const timer = setTimeout(() => {
        router.push("/cart");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [cartItems, router, actionStatus]);

  if (cartItems.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4">Your cart is empty. Redirecting to cart...</p>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          <div className="bg-white p-8 rounded-lg shadow-md border">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Select Shipping Address
            </h2>
            {listStatus === "loading" && <Loader2 className="animate-spin" />}
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address._id}
                  onClick={() => setSelectedAddressId(address._id)}
                  className={`relative flex items-start border rounded-md p-4 transition-all cursor-pointer ${selectedAddressId === address._id ? "border-orange-500 ring-2 ring-orange-200" : "border-gray-300 hover:border-orange-400"}`}
                >
                  <input
                    type="radio"
                    name="address"
                    id={address._id}
                    checked={selectedAddressId === address._id}
                    onChange={() => setSelectedAddressId(address._id)}
                    className="h-4 w-4 mt-1 text-orange-600 border-gray-300 focus:ring-orange-500"
                  />
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor={address._id}
                      className="font-medium text-gray-900 flex items-center gap-2"
                    >
                      {address.addressType === "Home" ? (
                        <Home className="h-4 w-4" />
                      ) : (
                        <Briefcase className="h-4 w-4" />
                      )}{" "}
                      {address.addressType}{" "}
                      {address.isDefault && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </label>
                    <div className="mt-1 text-gray-600">
                      <p>{address.addressLine1}</p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>{`${address.city}, ${address.state} - ${address.postalCode}`}</p>
                      <p>{address.country}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="mt-6 w-full flex items-center gap-2"
              onClick={() => router.push("/profile/addresses")}
            >
              <PlusCircle className="h-5 w-5" /> Add a New Address
            </Button>
            <div className="mt-10 pt-6 border-t border-gray-200">
              <Button
                onClick={handlePlaceOrder}
                disabled={actionStatus === "loading" || !selectedAddressId}
                className="w-full bg-orange-500 hover:bg-orange-600 rounded-full py-6 text-base font-semibold flex items-center justify-center gap-2"
              >
                {actionStatus === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5" /> Proceed to Payment
                  </>
                )}
              </Button>
            </div>
          </div>
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
                        <p className="mt-1 text-sm text-gray-500">
                          Qty {product.quantity}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 border-t border-gray-200 pt-6 space-y-3 text-base">
                <div className="flex items-center justify-between text-gray-600">
                  <p>MRP Total</p>
                  <p>₹{mrpTotal.toLocaleString()}</p>
                </div>
                <div className="flex items-center justify-between text-green-600">
                  <p>Discount on MRP</p>
                  <p>- ₹{totalDiscount.toLocaleString()}</p>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <p>Taxes & Charges</p>
                  <p>₹{totalTax.toLocaleString()}</p>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-4 text-lg font-bold text-gray-900">
                  <p>Grand Total</p>
                  <p>₹{grandTotal.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
