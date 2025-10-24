"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { toast } from "react-toastify";
import {
  fetchJewelry,
  deleteJewelry,
  JewelryItem,
} from "@/lib/features/jewelry/jewelrySlice";

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
  Loader2,
} from "lucide-react";

const placeholderImage = "/placeholder-jewelry.jpg";

export default function AdminInventoryPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Redux store se data aur status lein
  const {
    items,
    listStatus,
    error: listError,
  } = useSelector((state: RootState) => state.jewelry);

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<JewelryItem | null>(null);

  // Component load hone par data fetch karein
  useEffect(() => {
    dispatch(fetchJewelry({})); // Sabhi jewelry items ko fetch karein
  }, [dispatch]);

  // Search logic
  const filteredItems = items.filter((item) => {
    return searchTerm
      ? item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
  });

  // Action Handlers (Routing yahan theek kiya gaya hai)
  const handleView = (item: JewelryItem) =>
    router.push(`/admin/inventory/${item._id}`);

  const handleEdit = (item: JewelryItem) =>
    router.push(`/admin/inventory/edit/${item._id}`);

  const handleDelete = (item: JewelryItem) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      dispatch(deleteJewelry(selectedItem._id))
        .unwrap()
        .then(() => {
          toast.success(`Item ${selectedItem.sku} has been deleted.`);
        })
        .catch((error) => {
          toast.error(`Failed to delete: ${error}`);
        });
      setDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);

  // Loading State
  if (listStatus === "loading") {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Error State
  if (listStatus === "failed") {
    return (
      <div className="text-center text-red-500 mt-10">Error: {listError}</div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-gray-500">
            Total {filteredItems.length} items in inventory
          </p>
        </div>
        <Button
          onClick={() => router.push("/admin/inventory/add")}
          className="gap-2"
        >
          <Plus className="h-4 w-4" /> Add Jewelry
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Jewelry</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by SKU or Name..."
                className="pl-9 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <h3 className="text-lg font-semibold">No Jewelry Found</h3>
              <p className="text-sm mt-1">
                Try adjusting your search or add new items.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Primary Gemstone</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const primaryGem = item.gemstones?.[0];
                  return (
                    <TableRow key={item._id}>
                      <TableCell>
                        <img
                          src={item.images?.[0] || placeholderImage}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="rounded-md border object-cover aspect-square"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">
                          SKU: {item.sku}
                        </div>
                      </TableCell>
                      <TableCell>
                        {primaryGem ? (
                          <>
                            <div className="font-medium">
                              {primaryGem.shape || primaryGem.type}{" "}
                              {primaryGem.carat?.toFixed(2)}ct
                            </div>
                            <div className="text-sm text-gray-500">
                              {primaryGem.color} {primaryGem.clarity}{" "}
                              {primaryGem.cut}
                            </div>
                          </>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-bold">
                          {formatPrice(item.price)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {item.seller?.name || "—"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.stockQuantity > 0 ? "default" : "secondary"
                          }
                        >
                          {item.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
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
                            <DropdownMenuItem onClick={() => handleView(item)}>
                              <Eye className="h-4 w-4 mr-2" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(item)}>
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(item)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
              This action will permanently delete the item with SKU{" "}
              <strong>{selectedItem?.sku}</strong>. This cannot be undone.
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
