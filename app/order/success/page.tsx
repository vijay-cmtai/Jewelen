// app/order/success/page.tsx

"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import axios from "axios"; // <-- 1. IMPORT AXIOS
import { toast } from "react-toastify"; // <-- (Optional) For error messages
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  Clock,
  ArrowRight,
  Download,
  Loader2,
  Home,
  Briefcase,
} from "lucide-react";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchOrderById } from "@/lib/features/orders/orderSlice";
import { Button } from "@/components/ui/button";

// Interfaces... (no changes here)
interface ShippingAddress {
  _id: string;
  fullName?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  addressType?: "Home" | "Work";
}
interface OrderItemJewelry {
  _id: string;
  name: string;
  sku?: string;
  images: string[];
}
interface OrderItem {
  _id: string;
  jewelry?: OrderItemJewelry;
  name?: string;
  quantity: number;
  priceAtOrder: number;
}

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const orderId = searchParams.get("orderId");
  const { selectedOrder, singleStatus, singleError } = useSelector(
    (state: RootState) => state.orders
  );
  const { userInfo } = useSelector((state: RootState) => state.user);

  const [showConfetti, setShowConfetti] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false); // <-- 2. ADD DOWNLOAD STATE

  // ... (useEffect hooks and formatDate function are unchanged)
  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
    }
  }, [orderId, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!orderId) {
      const timer = setTimeout(() => router.push("/"), 2000);
      return () => clearTimeout(timer);
    }
  }, [orderId, router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================================
  // ========= THIS IS THE NEW DOWNLOAD LOGIC =================
  // ==========================================================
  const handleDownloadInvoice = async () => {
    if (!selectedOrder?._id || !userInfo?.token) {
      toast.error(
        "Could not download invoice. Order details or user token missing."
      );
      return;
    }

    setIsDownloading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
        responseType: "blob", // Important: we expect a file blob in response
      };

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${selectedOrder._id}/invoice`,
        config
      );

      // Create a link element, use it to download the file, and then remove it
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${selectedOrder._id}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Clean up and remove the link
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Invoice download failed:", error);
      toast.error("Failed to download invoice. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };
  // ==========================================================
  // ==========================================================

  const shippingAddress = selectedOrder?.shippingAddress as
    | ShippingAddress
    | undefined;

  // ... (Loading and Error states are unchanged)
  if (singleStatus === "loading") {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500 mb-4" />
        <p className="text-gray-600">Loading order details...</p>
      </div>
    );
  }
  if (singleStatus === "failed" || !selectedOrder) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 px-4">
        <div className="text-center">
          <div className="mb-4 text-red-500">
            <Package className="h-16 w-16 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {singleError || "Could not load order details"}
          </p>
          <Button
            onClick={() => router.push("/")}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  // The rest of your JSX, with the Button updated
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {" "}
          <div className="confetti-container">
            {" "}
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  backgroundColor: [
                    "#ea580c",
                    "#fb923c",
                    "#fbbf24",
                    "#34d399",
                    "#60a5fa",
                  ][Math.floor(Math.random() * 5)],
                }}
              />
            ))}{" "}
          </div>{" "}
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-bounce-once">
            {" "}
            <CheckCircle className="h-12 w-12 text-green-600" />{" "}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase, {userInfo?.name || "valued customer"}!
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Order ID:{" "}
            <span className="font-mono font-semibold text-orange-600">
              {selectedOrder._id}
            </span>
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-slide-up">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" /> Order Status
          </h2>
          <div className="flex items-center justify-between">
            <div className="flex-1 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-xs font-semibold text-green-600">Confirmed</p>
            </div>
            <div className="flex-1 border-t-2 border-gray-300"></div>
            <div className="flex-1 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
              <p className="text-xs font-semibold text-orange-600">
                {selectedOrder.orderStatus}
              </p>
            </div>
            <div className="flex-1 border-t-2 border-gray-300"></div>
            <div className="flex-1 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Truck className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-xs font-semibold text-gray-400">Shipping</p>
            </div>
            <div className="flex-1 border-t-2 border-gray-300"></div>
            <div className="flex-1 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-xs font-semibold text-gray-400">Delivered</p>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-4">
            Ordered on {formatDate(selectedOrder.createdAt)}
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 animate-slide-up">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-500" /> Order Items
            </h2>
            <div className="space-y-4">
              {selectedOrder.items.map((item: any, index: number) => {
                const jewelry = item.jewelry || {};
                const itemName = jewelry.name || item.name || "Product";
                const itemImages = jewelry.images || [];
                const itemSku = jewelry.sku || "";
                const quantity = item.quantity || 1;
                const price = item.priceAtOrder || 0;
                return (
                  <div
                    key={item._id || index}
                    className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors"
                  >
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                      {itemImages.length > 0 ? (
                        <Image
                          src={itemImages[0]}
                          alt={itemName}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{itemName}</h3>
                      <p className="text-sm text-gray-500">Qty: {quantity}</p>
                      {itemSku && (
                        <p className="text-xs text-gray-400">SKU: {itemSku}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ₹{(price * quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                <span>Total Amount</span>
                <span className="text-orange-600">
                  ₹{selectedOrder.totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                Payment Status:{" "}
                {selectedOrder.paymentInfo?.payment_status || "Paid"}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 animate-slide-up">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-orange-500" /> Shipping Address
            </h2>
            {shippingAddress ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {shippingAddress.addressType === "Home" ? (
                    <Home className="h-4 w-4 text-orange-500" />
                  ) : (
                    <Briefcase className="h-4 w-4 text-orange-500" />
                  )}
                  <p className="font-medium text-gray-900">
                    {shippingAddress.fullName ||
                      selectedOrder.userId?.name ||
                      "Customer"}
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  {shippingAddress.addressLine1}
                </p>
                {shippingAddress.addressLine2 && (
                  <p className="text-sm text-gray-600">
                    {shippingAddress.addressLine2}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  {shippingAddress.city}, {shippingAddress.state} -{" "}
                  {shippingAddress.postalCode}
                </p>
                <p className="text-sm text-gray-600">
                  {shippingAddress.country}
                </p>
                {shippingAddress.phone && (
                  <p className="text-sm text-gray-600 mt-2">
                    Phone: {shippingAddress.phone}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Address details not available</p>
            )}
            <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-orange-900">
                    Expected Delivery
                  </p>
                  <p className="text-sm text-orange-700 mt-1">
                    Your order will be delivered within 5-7 business days
                  </p>
                </div>
              </div>
            </div>

            {/* ✅ DOWNLOAD INVOICE BUTTON (UPDATED) */}
            <Button
              variant="outline"
              className="w-full mt-4 flex items-center justify-center gap-2 hover:bg-orange-50 hover:border-orange-300"
              onClick={handleDownloadInvoice}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download Invoice
                </>
              )}
            </Button>
          </div>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
          <Button
            onClick={() => router.push("/account/orders")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold flex items-center justify-center gap-2"
          >
            View All Orders <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="px-8 py-3 rounded-full font-semibold border-2 border-orange-500 text-orange-600 hover:bg-orange-50"
          >
            Continue Shopping
          </Button>
        </div>
        <div className="mt-8 text-center bg-white rounded-xl shadow-lg p-6 animate-slide-up">
          <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-4">
            If you have any questions about your order, feel free to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="text-orange-600 hover:text-orange-700 font-medium underline"
            >
              Contact Support
            </Link>
            <span className="hidden sm:inline text-gray-400">|</span>
            <Link
              href="/faq"
              className="text-orange-600 hover:text-orange-700 font-medium underline"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </div>
      <style jsx>{`
        .confetti-container {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          top: -10px;
          animation: fall 3s linear forwards;
        }
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce-once {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        .animate-bounce-once {
          animation: bounce-once 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500 mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
