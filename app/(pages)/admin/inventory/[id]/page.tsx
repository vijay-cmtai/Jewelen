"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
  fetchJewelryById,
  clearSelectedItem,
} from "@/lib/features/jewelry/jewelrySlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, Edit } from "lucide-react";

export default function ViewJewelryPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const itemId = params.id as string;
  const { selectedItem, singleStatus, error } = useSelector(
    (state: RootState) => state.jewelry
  );

  useEffect(() => {
    if (itemId) {
      dispatch(fetchJewelryById(itemId));
    }
    // Cleanup function to clear the selected item when component unmounts
    return () => {
      dispatch(clearSelectedItem());
    };
  }, [dispatch, itemId]);

  const formatPrice = (price: number | undefined) => {
    if (price === undefined) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  if (singleStatus === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (singleStatus === "failed" || !selectedItem) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-semibold mb-2">Jewelry Not Found</h2>
        <p className="text-muted-foreground mb-4">
          {error || "The item could not be loaded."}
        </p>
        <Button onClick={() => router.push("/admin/inventory")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Inventory
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => router.push("/admin/inventory")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {selectedItem.name}
            </h1>
            <p className="text-muted-foreground">SKU: {selectedItem.sku}</p>
          </div>
        </div>
        <Button onClick={() => router.push(`/admin/inventory/edit/${itemId}`)}>
          <Edit className="mr-2 h-4 w-4" /> Edit Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardContent className="p-0">
              <img
                src={selectedItem.images?.[0] || "/placeholder-jewelry.jpg"}
                alt={selectedItem.name}
                className="w-full h-auto object-cover rounded-lg aspect-square"
              />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
              <CardDescription>{selectedItem.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Price</span>
                <span className="font-semibold">
                  {formatPrice(selectedItem.price)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Stock</span>
                <span className="font-semibold">
                  {selectedItem.stockQuantity} units
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Category</span>
                <Badge variant="outline">{selectedItem.category}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                <Badge>{selectedItem.status}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Featured</span>
                <span className="font-semibold">
                  {selectedItem.isFeatured ? "Yes" : "No"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Metal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Type</span>
                <span className="font-semibold">{selectedItem.metal.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Purity</span>
                <span className="font-semibold">
                  {selectedItem.metal.purity}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Weight</span>
                <span className="font-semibold">
                  {selectedItem.metal.weightInGrams} g
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
