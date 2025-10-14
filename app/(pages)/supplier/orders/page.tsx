"use client";

import Link from "next/link";
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
  CheckCircle,
  XCircle,
  Package,
} from "lucide-react";

// --- DUMMY DATA ---
// Yeh data ab backend se nahi, yahin se aa raha hai
const dummySellerOrders = [
  {
    _id: "ORD-001-XYZ",
    uniqueKey: "ORD-001-XYZ-item1",
    userId: { name: "Elena Gilbert", email: "elena@example.com" },
    item: {
      _id: "item1",
      stockId: "JWL-001",
      shape: "Round",
      imageLink:
        "https://images.unsplash.com/photo-1610481615363-f220d343c5b5?w=40&h=40&fit=crop",
    },
    orderStatus: "Shipped",
    totalAmount: 12000 * 80, // Price in INR
    createdAt: "2023-11-01T10:00:00.000Z",
  },
  {
    _id: "ORD-002-PQR",
    uniqueKey: "ORD-002-PQR-item2",
    userId: { name: "Caroline Forbes", email: "caroline@example.com" },
    item: {
      _id: "item2",
      stockId: "JWL-002",
      shape: "Princess",
      imageLink:
        "https://images.unsplash.com/photo-1599208008819-2d88a1013a7a?w=40&h=40&fit=crop",
    },
    orderStatus: "Processing",
    totalAmount: 6500 * 80,
    createdAt: "2023-11-03T14:20:00.000Z",
  },
  {
    _id: "ORD-003-LMN",
    uniqueKey: "ORD-003-LMN-item3",
    userId: { name: "Bonnie Bennett", email: "bonnie@example.com" },
    item: {
      _id: "item3",
      stockId: "JWL-003",
      shape: "Cushion",
      imageLink:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=40&h=40&fit=crop",
    },
    orderStatus: "Completed",
    totalAmount: 25000 * 80,
    createdAt: "2023-10-25T09:00:00.000Z",
  },
];
// --- END OF DUMMY DATA ---

export default function OrdersPage() {
  // Helper to format price in INR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const getStatusVariant = (
    orderStatus: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (orderStatus) {
      case "Processing":
        return "secondary";
      case "Shipped":
        return "default";
      case "Completed":
        return "outline";
      case "Cancelled":
      case "Failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Sales</h1>
        <p className="text-sm text-gray-500">
          {dummySellerOrders.length} sales found
        </p>
      </div>

      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Product Sold</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummySellerOrders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
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
              dummySellerOrders.map((order) => {
                const product = order.item;
                return (
                  <TableRow key={order.uniqueKey}>
                    <TableCell className="font-mono text-sm">
                      #{order._id.substring(4, 7)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageLink || "/placeholder-diamond.jpg"}
                          alt={product.shape || "Diamond"}
                          width={40}
                          height={40}
                          className="rounded-md border object-cover aspect-square"
                        />
                        <div>
                          <div className="font-medium">
                            {product.shape || "Diamond"}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {product.stockId}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{order.userId.name}</div>
                      <div className="text-xs text-gray-500">
                        {order.userId.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.orderStatus)}>
                        {order.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatPrice(order.totalAmount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              alert(`Marking order ${order._id} as Shipped`)
                            }
                          >
                            <CheckCircle className="mr-2 h-4 w-4" /> Mark as
                            Shipped
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 focus:text-red-600">
                            <XCircle className="mr-2 h-4 w-4" /> Cancel Sale
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              alert(`Viewing details for ${order._id}`)
                            }
                          >
                            <FileText className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
