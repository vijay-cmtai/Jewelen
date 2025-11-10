"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { toast } from "react-toastify";
import {
  fetchJewelry,
  deleteJewelry,
  approveJewelry,
  rejectJewelry,
  JewelryItem,
} from "@/lib/features/jewelry/jewelrySlice";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DropdownMenuSeparator,
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
  CheckCircle,
  XCircle,
} from "lucide-react";

const placeholderImage = "/placeholder-jewelry.jpg";

export default function AdminInventoryPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const {
    items,
    listStatus,
    error: listError,
  } = useSelector((state: RootState) => state.jewelry);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<JewelryItem | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    dispatch(fetchJewelry({ status: activeTab }));
  }, [dispatch, activeTab]);

  const handleApprove = (item: JewelryItem) => {
    dispatch(approveJewelry(item._id))
      .unwrap()
      .then(() => toast.success(`Item ${item.sku} has been approved.`))
      .catch((error) => toast.error(`Failed to approve: ${error}`));
  };

  const handleReject = (item: JewelryItem) => {
    dispatch(rejectJewelry(item._id))
      .unwrap()
      .then(() => toast.success(`Item ${item.sku} has been rejected.`))
      .catch((error) => toast.error(`Failed to reject: ${error}`));
  };

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

  const filteredItems = items.filter((item) => {
    return searchTerm
      ? item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
  });

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-gray-500">
            Total {filteredItems.length} items found
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="Pending">Pending</TabsTrigger>
              <TabsTrigger value="Approved">Approved</TabsTrigger>
              <TabsTrigger value="Rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>

          {listStatus === "loading" && (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
          {listStatus === "failed" && (
            <div className="text-center text-red-500 py-10">
              Error: {listError}
            </div>
          )}

          {listStatus === "succeeded" &&
            (filteredItems.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <h3 className="text-lg font-semibold">No Jewelry Found</h3>
                <p className="text-sm mt-1">
                  Try adjusting your filters or add new items.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
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
                      <TableCell>
                        <div className="font-medium">
                          {item.seller?.name || "—"}
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
                            {item.status === "Pending" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleApprove(item)}
                                  className="text-green-600"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />{" "}
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleReject(item)}
                                  className="text-orange-600"
                                >
                                  <XCircle className="h-4 w-4 mr-2" /> Reject
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/admin/inventory/${item._id}`)
                              }
                            >
                              <Eye className="h-4 w-4 mr-2" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/admin/inventory/edit/${item._id}`)
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
            ))}
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
