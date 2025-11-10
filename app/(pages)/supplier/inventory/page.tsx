"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { toast } from "react-toastify";
import {
  fetchMyInventory,
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
import { Plus, Eye, Edit, Trash2, MoreHorizontal, Loader2 } from "lucide-react";

const placeholderImage = "/placeholder-jewelry.jpg";

export default function MyInventoryPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const {
    myInventory,
    listStatus,
    error: listError,
  } = useSelector((state: RootState) => state.jewelry);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<JewelryItem | null>(null);

  useEffect(() => {
    dispatch(fetchMyInventory());
  }, [dispatch]);

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <Badge variant="default" className="bg-green-500 text-white">
            Approved
          </Badge>
        );
      case "Pending":
        return (
          <Badge variant="secondary" className="bg-yellow-500 text-white">
            Pending
          </Badge>
        );
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Inventory</h1>
          <p className="text-gray-500">Total {myInventory.length} items</p>
        </div>
        <Button
          onClick={() => router.push("/supplier/inventory/add")}
          className="gap-2"
        >
          <Plus className="h-4 w-4" /> Add Jewelry
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Products</CardTitle>
        </CardHeader>
        <CardContent>
          {myInventory.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <h3 className="text-lg font-semibold">No Jewelry Found</h3>
              <p className="text-sm mt-1">
                Click Add Jewelry to list your first product.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myInventory.map((item) => (
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
                      <div className="font-bold">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                        }).format(item.price)}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/products/${item._id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/supplier/inventory/edit/${item._id}`
                              )
                            }
                          >
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
