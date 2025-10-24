"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchAllUsers } from "@/lib/features/users/userSlice";

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
import { Upload, Eye, UserPlus, Loader2 } from "lucide-react";

// Helper functions (same as before)
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
  const dispatch = useDispatch<AppDispatch>();

  // Redux store se data aur status lein
  const { users, listStatus, listError } = useSelector(
    (state: RootState) => state.user
  );

  // Component load hone par sabhi users ko fetch karein
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // Sirf 'Supplier' role waale users ko filter karein
  const sellers = users.filter((user) => user.role === "Supplier");

  const handleAddInventory = (sellerId: string) => {
    router.push(`/admin/inventory/add?sellerId=${sellerId}`);
  };

  const handleViewInventory = (sellerId: string) => {
    router.push(`/admin/inventory?sellerId=${sellerId}`);
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

  // Loading state
  if (listStatus === "loading") {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Error state
  if (listStatus === "failed") {
    return (
      <div className="text-center text-red-500 mt-10">Error: {listError}</div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Seller Management</h1>
        <Button onClick={() => router.push("/admin/users/add")}>
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
            {sellers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center h-24 text-gray-500"
                >
                  No sellers found.
                </TableCell>
              </TableRow>
            ) : (
              sellers.map((seller) => (
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
                      onClick={
                        () => handleViewInventory(seller._id) // ID se filter karna behtar hai
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
