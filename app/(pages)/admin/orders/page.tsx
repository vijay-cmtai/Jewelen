"use client";

import { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-react";

// --- DUMMY DATA ---
const dummyOrders = [
  {
    _id: "ORD-123-ABC-789",
    userId: { _id: "user1", name: "Elena Gilbert", email: "elena@example.com" },
    items: [
      { _id: "item1", name: "Classic Solitaire Diamond Ring", price: 45999, image: { url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=64&h=64&fit=crop" } },
    ],
    totalAmount: 45999,
    status: "Completed",
    createdAt: "2023-10-28T10:00:00.000Z",
  },
  {
    _id: "ORD-456-DEF-123",
    userId: { _id: "user2", name: "Damon Salvatore", email: "damon@example.com" },
    items: [
      { _id: "item2", name: "Gold Pearl Pendant Necklace", price: 2499, image: { url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=64&h=64&fit=crop" } },
      { _id: "item3", name: "Silver Hoop Earrings", price: 999, image: { url: "https://images.unsplash.com/photo-1612179045781-8a5d9a5b3a8a?w=64&h=64&fit=crop" } },
    ],
    totalAmount: 3498,
    status: "Pending",
    createdAt: "2023-11-01T11:30:00.000Z",
  },
  {
    _id: "ORD-789-GHI-456",
    userId: { _id: "user3", name: "Caroline Forbes", email: "caroline@example.com" },
    items: [
       { _id: "item4", name: "Vintage Rose Gold Band", price: 8999, image: { url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=64&h=64&fit=crop" } },
    ],
    totalAmount: 8999,
    status: "Cancelled",
    createdAt: "2023-10-25T14:00:00.000Z",
  },
];
// --- END OF DUMMY DATA ---

// TypeScript type for our dummy order data
type OrderType = typeof dummyOrders[0];

export default function AdminOrdersPage() {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);

  // Helper function to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const handleViewDetails = (order: OrderType) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "Completed":
        return "default";
      case "Pending":
        return "secondary";
      case "Cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

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
            {dummyOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-gray-500">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              dummyOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-mono text-sm text-gray-600">
                    #{order._id.split('-')[1]}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{order.userId?.name || "N/A"}</div>
                    <div className="text-gray-500 text-xs">{order.userId?.email || ""}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{order.items.length} item(s)</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">{formatPrice(order.totalAmount)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(order)}>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Update Status</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Order Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order ID: <span className="font-mono">{selectedOrder?._id}</span>
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 py-2">
              <div>
                <h3 className="font-semibold mb-2 text-gray-800">Customer Information</h3>
                <div className="text-sm text-gray-600">
                  <p><strong>Name:</strong> {selectedOrder.userId.name}</p>
                  <p><strong>Email:</strong> {selectedOrder.userId.email}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-gray-800">Order Summary</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <strong>Status:</strong>{" "}
                    <Badge variant={getStatusVariant(selectedOrder.status)}>{selectedOrder.status}</Badge>
                  </p>
                  <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  <p className="font-bold text-lg text-gray-900 mt-2">
                    <strong>Total:</strong> {formatPrice(selectedOrder.totalAmount)}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-gray-800">Items ({selectedOrder.items.length})</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item._id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image?.url || "https://via.placeholder.com/64"}
                          alt={item.name}
                          className="h-16 w-16 object-cover rounded-md border"
                        />
                        <div>
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-500">{formatPrice(item.price)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}