"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "@/lib/store";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  FileText,
  XCircle,
  Package,
  Loader2,
  Truck,
} from "lucide-react";
import {
  updateOrderItemStatus,
  fetchSellerOrders,
} from "@/lib/features/orders/orderSlice";

export default function SupplierOrdersPage() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    data: sellerOrders,
    status,
    error,
  } = useSelector((state: RootState) => state.orders.sellerOrders);
  const { userInfo } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchSellerOrders());
  }, [dispatch]);

  const sellerItemsInOrders = sellerOrders
    .flatMap((order) =>
      (order.items as any[])
        .filter((item) => item.jewelry?.seller === userInfo?._id)
        .map((item) => ({
          ...item,
          orderId: order._id,
          buyer: order.userId,
          orderDate: order.createdAt,
        }))
    )
    .sort(
      (a, b) =>
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );

  const handleUpdateStatus = (
    orderId: string,
    itemId: string,
    status: string
  ) => {
    dispatch(updateOrderItemStatus({ orderId, itemId, status }))
      .unwrap()
      .then(() => toast.success(`Item marked as ${status}.`))
      .catch((err) => toast.error(err as string));
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
      case "Processing":
        return "secondary";
      case "Shipped":
        return "default";
      case "Delivered":
        return "outline";
      case "Cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (status === "failed") {
    return <div className="text-center text-red-500 mt-10">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Sales</h1>
        <p className="text-sm text-gray-500">
          {sellerItemsInOrders.length} sales found
        </p>
      </div>

      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Sold</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Item Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sellerItemsInOrders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-48 text-center text-gray-500"
                >
                  <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold">No Sales Found</h3>
                  <p className="mt-1">
                    When a customer buys your product, the order will appear
                    here.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              sellerItemsInOrders.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          item.jewelry?.images?.[0] ||
                          "/placeholder-jewelry.jpg"
                        }
                        alt={item.jewelry?.name || "Jewelry"}
                        width={40}
                        height={40}
                        className="rounded-md border object-cover aspect-square"
                      />
                      <div>
                        <div className="font-medium">{item.jewelry?.name}</div>
                        <div className="text-gray-500 text-xs">
                          {item.jewelry?.sku}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{item.buyer.name}</div>
                    <div className="text-xs text-gray-500">
                      {item.buyer.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(item.orderDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPrice(item.priceAtOrder * item.quantity)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {item.status === "Processing" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleUpdateStatus(
                                item.orderId,
                                item._id,
                                "Shipped"
                              )
                            }
                          >
                            <Truck className="mr-2 h-4 w-4" /> Mark as Shipped
                          </DropdownMenuItem>
                        )}
                        {item.status !== "Cancelled" && (
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() =>
                              handleUpdateStatus(
                                item.orderId,
                                item._id,
                                "Cancelled"
                              )
                            }
                          >
                            <XCircle className="mr-2 h-4 w-4" /> Cancel Sale
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem disabled>
                          <FileText className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
