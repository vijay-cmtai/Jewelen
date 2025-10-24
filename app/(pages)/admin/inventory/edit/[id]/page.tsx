"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  Save,
  Loader2,
  X,
  Gem,
  Tag,
  Settings,
  Image as ImageIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
  fetchJewelryById,
  updateJewelry,
  resetActionStatus,
  clearSelectedItem,
} from "@/lib/features/jewelry/jewelrySlice";
import type { JewelryItem } from "@/lib/features/jewelry/jewelrySlice";
import { toast } from "sonner";

const categories = [
  "Rings",
  "New Arrivals",
  "Necklaces",
  "Earrings",
  "Bracelets",
  "Gifts",
];
const metalTypes = ["Gold", "Silver", "Platinum"];
const purities = ["14K", "18K", "22K", "24K", "925 Sterling"];

export default function EditJewelryPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedItem, singleStatus, actionStatus, error } = useSelector(
    (state: RootState) => state.jewelry
  );

  const itemId = params.id as string;
  const isLoading = singleStatus === "loading";
  const isSaving = actionStatus === "loading";

  const [formData, setFormData] = useState<Partial<JewelryItem>>({});
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (itemId) {
      dispatch(fetchJewelryById(itemId));
    }
    return () => {
      dispatch(clearSelectedItem());
    };
  }, [dispatch, itemId]);

  useEffect(() => {
    if (selectedItem) {
      setFormData({
        ...selectedItem,
        metal: selectedItem.metal || {
          type: "Gold",
          purity: "",
          weightInGrams: 0,
        },
      });
      setImagePreviews(selectedItem.images || []);
    }
  }, [selectedItem]);

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Jewelry item updated successfully!");
      dispatch(resetActionStatus());
      router.push(`/products/${itemId}`);
    }
    if (actionStatus === "failed" && error) {
      toast.error(error);
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch, router, itemId]);

  const handleInputChange = (
    field: keyof JewelryItem | `metal.${keyof JewelryItem["metal"]}`,
    value: any
  ) => {
    if (field.startsWith("metal.")) {
      const metalField = field.split(".")[1] as keyof JewelryItem["metal"];
      setFormData((prev) => ({
        ...prev,
        metal: { ...prev.metal!, [metalField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field as keyof JewelryItem]: value }));
    }
  };

  const handleNumberInputChange = (
    field: keyof JewelryItem | `metal.${keyof JewelryItem["metal"]}`,
    value: string
  ) => {
    const numericValue = value === "" ? 0 : parseFloat(value);
    handleInputChange(field, numericValue);
  };

  const handleImageChange = (index: number, url: string) => {
    const newImages = [...imagePreviews];
    newImages[index] = url;
    setImagePreviews(newImages);
    handleInputChange("images", newImages);
  };

  const addImageField = () => {
    setImagePreviews([...imagePreviews, ""]);
  };

  const removeImageField = (index: number) => {
    const newImages = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newImages);
    handleInputChange("images", newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.sku ||
      !formData.price ||
      !formData.stockQuantity
    ) {
      toast.error("Name, SKU, Price, and Stock are required.");
      return;
    }
    const finalData = {
      ...formData,
      images: imagePreviews.filter((url) => url.trim() !== ""),
    };
    dispatch(updateJewelry({ id: itemId, updates: finalData }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading Jewelry Data...</p>
      </div>
    );
  }

  if (singleStatus === "failed" || !selectedItem) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-semibold mb-2">Jewelry Not Found</h2>
        <Button onClick={() => router.push("/admin/inventory")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Inventory
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="container mx-auto py-6 px-4 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Jewelry</h1>
            <p className="text-muted-foreground">
              SKU: {formData.sku || "..."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-24">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" /> Images
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {imagePreviews.map((url, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      id={`image-${index}`}
                      value={url}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeImageField(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addImageField}
                >
                  Add Image URL
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" /> Status & Category
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <Label htmlFor="isFeatured" className="font-medium">
                    Is Featured?
                  </Label>
                  <Switch
                    id="isFeatured"
                    checked={!!formData.isFeatured}
                    onCheckedChange={(c) => handleInputChange("isFeatured", c)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category ?? ""}
                    onValueChange={(v) => handleInputChange("category", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gem className="h-5 w-5" /> Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name || ""}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="sku">SKU *</Label>
                    <Input
                      id="sku"
                      value={formData.sku || ""}
                      onChange={(e) => handleInputChange("sku", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="price">Price (INR) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price ?? ""}
                      onChange={(e) =>
                        handleNumberInputChange("price", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                    <Input
                      id="stockQuantity"
                      type="number"
                      value={formData.stockQuantity ?? ""}
                      onChange={(e) =>
                        handleNumberInputChange("stockQuantity", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" /> Metal & Gemstones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="metalType">Metal Type</Label>
                    <Select
                      value={formData.metal?.type ?? ""}
                      onValueChange={(v) => handleInputChange("metal.type", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {metalTypes.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="metalPurity">Purity</Label>
                    <Select
                      value={formData.metal?.purity ?? ""}
                      onValueChange={(v) =>
                        handleInputChange("metal.purity", v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {purities.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="metalWeight">Weight (grams)</Label>
                    <Input
                      id="metalWeight"
                      type="number"
                      step="0.01"
                      value={formData.metal?.weightInGrams ?? ""}
                      onChange={(e) =>
                        handleNumberInputChange(
                          "metal.weightInGrams",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
                {/* Note: For simplicity, editing gemstones is not included. You can add this feature later. */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur z-50">
        <div className="container max-w-6xl mx-auto flex items-center justify-end h-20 px-4 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
