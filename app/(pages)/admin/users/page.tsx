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
import { Eye } from "lucide-react";

// Dummy Data: Yeh data ab backend se nahi, yahin se aa raha hai
const dummyUsers = [
  {
    _id: "1",
    name: "Elena Gilbert",
    email: "elena@example.com",
    role: "Admin",
    companyName: "Jewelen Inc.",
    status: "Approved",
    createdAt: "2023-10-26T10:00:00.000Z",
  },
  {
    _id: "2",
    name: "Damon Salvatore",
    email: "damon@supplier.com",
    role: "Supplier",
    companyName: "Mystic Gems",
    status: "Approved",
    createdAt: "2023-09-15T11:30:00.000Z",
  },
  {
    _id: "3",
    name: "Caroline Forbes",
    email: "caroline@customer.com",
    role: "Customer",
    companyName: null,
    status: "Approved",
    createdAt: "2023-08-02T14:00:00.000Z",
  },
  {
    _id: "4",
    name: "Klaus Mikaelson",
    email: "klaus@newsupplier.com",
    role: "Supplier",
    companyName: "Originals Jewelry",
    status: "Pending",
    createdAt: "2023-11-01T09:00:00.000Z",
  },
  {
    _id: "5",
    name: "Bonnie Bennett",
    email: "bonnie@magic.com",
    role: "Customer",
    companyName: null,
    status: "Rejected",
    createdAt: "2023-11-02T18:00:00.000Z",
  },
];

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
  if (!name) return "U";
  const names = name.split(" ");
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.charAt(0).toUpperCase();
};

export default function AdminUsersPage() {
  const router = useRouter();

  const handleViewDetails = (userId: string) => {
    // Abhi ke liye, hum sirf console log karenge
    console.log(`Viewing details for user ID: ${userId}`);
    // Real application mein aap yahan user detail page par navigate kar sakte hain:
    // router.push(`/admin/users/${userId}`);
  };

  const getStatusVariant = (
    status?: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "Approved":
        return "default"; // Greenish in shadcn
      case "Pending":
        return "secondary"; // Grayish
      case "Rejected":
        return "destructive"; // Reddish
      default:
        return "outline";
    }
  };

  const getRoleVariant = (role?: string): "default" | "secondary" => {
    switch (role) {
      case "Admin":
        return "default";
      case "Supplier":
      case "Customer":
      default:
        return "secondary";
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button>Add New User</Button>
      </div>

      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center h-24 text-gray-500"
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              dummyUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-gray-500 text-xs">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {user.companyName || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(user.status)}>
                      {user.status || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(user._id)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
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
