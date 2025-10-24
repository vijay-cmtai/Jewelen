"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
  fetchAllOrders,
  fetchOrderById,
  clearSelectedOrder,
  Order,
} from "@/lib/features/orders/orderSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

export default function AdminOrdersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, listStatus, listError, selectedOrder, singleStatus } =
    useSelector((state: RootState) => state.orders);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleViewDetails = (orderId: string) => {
    dispatch(fetchOrderById(orderId));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    dispatch(clearSelectedOrder());
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "Completed":
      case "Delivered":
        return "default";
      case "Pending":
      case "Processing":
      case "Shipped":
        return "secondary";
      case "Cancelled":
      case "Failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (listStatus === "loading") {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (listStatus === "failed") {
    return (
      <div className="text-center text-red-500 mt-10">Error: {listError}</div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">All Orders</h1>
      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center h-24 text-gray-500"
                >
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-mono text-sm text-gray-600">
                    #{order._id.slice(-6).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {order.userId?.name || "N/A"}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {order.userId?.email || ""}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {order.items.length} item(s)
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.orderStatus)}>
                      {order.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatPrice(order.totalAmount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(order._id)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            {selectedOrder && (
              <DialogDescription>
                Order ID: <span className="font-mono">{selectedOrder._id}</span>
              </DialogDescription>
            )}
          </DialogHeader>

          {singleStatus === "loading" ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : selectedOrder ? (
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 py-2">
              <div>
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <div className="text-sm">
                  <p>
                    <strong>Name:</strong> {selectedOrder.userId.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedOrder.userId.email}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Order Summary</h3>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Status:</strong>{" "}
                    <Badge
                      variant={getStatusVariant(selectedOrder.orderStatus)}
                    >
                      {selectedOrder.orderStatus}
                    </Badge>
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                  <p className="font-bold text-lg mt-2">
                    <strong>Total:</strong>{" "}
                    {formatPrice(selectedOrder.totalAmount)}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  Items ({selectedOrder.items.length})
                </h3>
                <div className="space-y-3">
                  {(selectedOrder.items as any[]).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 border-b pb-3 last:border-b-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium">
                          {item.jewelry?.name ||
                            item.name ||
                            `Item ID: ${item._id}`}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatPrice(item.priceAtOrder)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              Could not load order details.
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
