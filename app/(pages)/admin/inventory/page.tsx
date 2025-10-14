"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

// Dummy Data: Yeh data ab yahin se aa raha hai
const dummyDiamonds = [
  {
    _id: "1",
    stockId: "JWL-001",
    lab: "GIA",
    reportNumber: "123456789",
    shape: "Round",
    carat: 1.02,
    color: "D",
    clarity: "VVS1",
    cut: "Excellent",
    price: 12000,
    user: { name: "Mystic Gems", companyName: "Mystic Gems Co." },
    isActive: true,
    imageLink:
      "https://images.unsplash.com/photo-1610481615363-f220d343c5b5?w=100&h=100&fit=crop",
  },
  {
    _id: "2",
    stockId: "JWL-002",
    lab: "IGI",
    reportNumber: "987654321",
    shape: "Princess",
    carat: 0.75,
    color: "E",
    clarity: "VS2",
    cut: "Very Good",
    price: 6500,
    user: { name: "Originals Jewelry", companyName: "Originals Inc." },
    isActive: true,
    imageLink:
      "https://images.unsplash.com/photo-1599208008819-2d88a1013a7a?w=100&h=100&fit=crop",
  },
  {
    _id: "3",
    stockId: "JWL-003",
    lab: "GIA",
    reportNumber: "555555555",
    shape: "Cushion",
    carat: 2.15,
    color: "G",
    clarity: "SI1",
    cut: "Excellent",
    price: 25000,
    user: { name: "Mystic Gems", companyName: "Mystic Gems Co." },
    isActive: false,
    imageLink:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100&h=100&fit=crop",
  },
  {
    _id: "4",
    stockId: "JWL-004",
    lab: "GIA",
    reportNumber: "112233445",
    shape: "Oval",
    carat: 1.5,
    color: "F",
    clarity: "VVS2",
    cut: "Excellent",
    price: 18500,
    user: { name: "Shine Bright LLC", companyName: "Shine Bright" },
    isActive: true,
    imageLink: "",
  },
];

const placeholderImage = "/placeholder-diamond.jpg"; // Public folder mein ek placeholder image rakhein

export default function AdminInventoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sellerId = searchParams.get("sellerId");

  const [diamonds, setDiamonds] = useState(dummyDiamonds);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDiamond, setSelectedDiamond] = useState<
    (typeof dummyDiamonds)[0] | null
  >(null);

  // Filter logic
  const filteredDiamonds = diamonds.filter((diamond) => {
    const matchesSeller = sellerId
      ? diamond.user?.companyName
          ?.toLowerCase()
          .includes(sellerId.toLowerCase())
      : true;
    const matchesSearch = searchTerm
      ? diamond.stockId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        diamond.shape.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesSeller && matchesSearch;
  });

  const handleView = (diamond: (typeof dummyDiamonds)[0]) =>
    console.log("View:", diamond.stockId);
  const handleEdit = (diamond: (typeof dummyDiamonds)[0]) =>
    console.log("Edit:", diamond.stockId);
  const handleDelete = (diamond: (typeof dummyDiamonds)[0]) => {
    setSelectedDiamond(diamond);
    setDeleteDialogOpen(true);
  };
  const confirmDelete = () => {
    if (selectedDiamond) {
      setDiamonds((prev) => prev.filter((d) => d._id !== selectedDiamond._id));
      alert(`Diamond ${selectedDiamond.stockId} has been deleted.`);
      setDeleteDialogOpen(false);
      setSelectedDiamond(null);
    }
  };

  const formatPrice = (price?: number) =>
    price
      ? new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(price * 80)
      : "N/A"; // Convert to INR

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-gray-500">
            {sellerId
              ? `Inventory for seller: ${sellerId}`
              : `Total ${filteredDiamonds.length} diamonds`}
          </p>
        </div>
        <Button
          onClick={() => router.push("/admin/inventory/add")}
          className="gap-2"
        >
          <Plus className="h-4 w-4" /> Add Diamond
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {sellerId ? "Seller's Diamonds" : "All Diamonds"}
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by Stock ID or Shape..."
                className="pl-9 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredDiamonds.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <h3 className="text-lg font-semibold">No Diamonds Found</h3>
              <p className="text-sm mt-1">
                Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Specs</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDiamonds.map((diamond) => (
                  <TableRow key={diamond._id}>
                    <TableCell>
                      <img
                        src={diamond.imageLink || placeholderImage}
                        alt={diamond.shape}
                        width={50}
                        height={50}
                        className="rounded-md border object-cover aspect-square"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{diamond.stockId}</div>
                      <div className="text-sm text-gray-500">
                        {diamond.lab} {diamond.reportNumber}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {diamond.shape} {diamond.carat?.toFixed(2)}ct
                      </div>
                      <div className="text-sm text-gray-500">
                        {diamond.color} {diamond.clarity} {diamond.cut}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold">
                        {formatPrice(diamond.price)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {diamond.user?.name || "—"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={diamond.isActive ? "default" : "secondary"}
                      >
                        {diamond.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(diamond)}>
                            <Eye className="h-4 w-4 mr-2" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(diamond)}>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(diamond)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the diamond with Stock ID{" "}
              <strong>{selectedDiamond?.stockId}</strong>. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
