"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload, Eye, UserPlus } from "lucide-react";

// --- DUMMY DATA ---
const dummySellers = [
  {
    _id: "seller1",
    name: "Damon Salvatore",
    email: "damon@supplier.com",
    role: "Supplier",
    companyName: "Mystic Gems",
    status: "Approved",
    createdAt: "2023-09-15T11:30:00.000Z",
  },
  {
    _id: "seller2",
    name: "Klaus Mikaelson",
    email: "klaus@newsupplier.com",
    role: "Supplier",
    companyName: "Originals Jewelry",
    status: "Pending",
    createdAt: "2023-11-01T09:00:00.000Z",
  },
  {
    _id: "seller3",
    name: "Stefan Salvatore",
    email: "stefan@supplier.com",
    role: "Supplier",
    companyName: "Ripper Diamonds",
    status: "Rejected",
    createdAt: "2023-08-20T15:00:00.000Z",
  },
];
// --- END OF DUMMY DATA ---

// Helper functions
const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getInitials = (name?: string) => {
  if (!name) return "S";
  const names = name.split(" ");
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.charAt(0).toUpperCase();
};

export default function AdminSellersPage() {
  const router = useRouter();

  const handleAddInventory = (sellerId: string) => {
    // Navigate to the add inventory page with sellerId as a query parameter
    router.push(`/admin/inventory/add?sellerId=${sellerId}`);
  };

  const handleViewInventory = (sellerCompanyName: string) => {
    // Navigate to the inventory page and filter by company name
    router.push(
      `/admin/inventory?sellerId=${encodeURIComponent(sellerCompanyName)}`
    );
  };

  const getStatusVariant = (
    status?: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "Approved":
        return "default";
      case "Pending":
        return "secondary";
      case "Rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Seller Management</h1>
        <Button onClick={() => alert("Redirecting to Add New Seller page...")}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add New Seller
        </Button>
      </div>
      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Seller</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummySellers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center h-24 text-gray-500"
                >
                  No sellers found.
                </TableCell>
              </TableRow>
            ) : (
              dummySellers.map((seller) => (
                <TableRow key={seller._id}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {getInitials(seller.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{seller.name}</div>
                        <div className="text-gray-500 text-xs">
                          {seller.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {seller.companyName || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(seller.status)}>
                      {seller.status || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatDate(seller.createdAt)}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleViewInventory(seller.companyName || "")
                      }
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Inventory
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleAddInventory(seller._id)}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Add Inventory
                    </Button>
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
