"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/lib/store";
import {
  addJewelry,
  uploadCsv,
  previewCsvHeaders,
  resetActionStatus,
  clearCsvHeaders,
} from "@/lib/features/jewelry/jewelrySlice";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ClipboardEdit,
  Upload,
  RefreshCw,
  Server,
  Gem,
  Sparkles,
  X,
} from "lucide-react";

// Initial state for manual form with TAX
const initialManualState = {
  name: "",
  sku: "",
  description: "",
  price: "",
  originalPrice: "",
  tax: "", // <-- ADDED TAX
  stockQuantity: "",
  category: "Rings",
  metalType: "Gold",
  metalPurity: "",
  metalColor: "",
  metalWeightInGrams: "",
  images: [] as string[],
  tags: "",
};

export default function AddInventoryPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { actionStatus, error, csvHeaders } = useSelector(
    (state: RootState) => state.jewelry
  );

  const [manualForm, setManualForm] = useState(initialManualState);
  const [imageInput, setImageInput] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvMapping, setCsvMapping] = useState<Record<string, string>>({});

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Inventory operation successful!");
      dispatch(resetActionStatus());
      setManualForm(initialManualState);
      setCsvFile(null);
      setCsvMapping({});
      dispatch(clearCsvHeaders());
    }
    if (actionStatus === "failed" && error) {
      toast.error(error);
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch, router]);

  const handleManualChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setManualForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleManualSelectChange = (name: string, value: string) => {
    setManualForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setManualForm((prev) => ({
        ...prev,
        images: [...prev.images, imageInput.trim()],
      }));
      setImageInput("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setManualForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleManualSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!manualForm.name || !manualForm.sku || !manualForm.price) {
      return toast.error("Name, SKU, and Price are required!");
    }
    if (manualForm.images.length === 0) {
      return toast.error("At least one image URL is required!");
    }

    // Jewelry data with TAX
    const jewelryData = {
      name: manualForm.name,
      sku: manualForm.sku,
      description: manualForm.description,
      price: parseFloat(manualForm.price),
      originalPrice: manualForm.originalPrice
        ? parseFloat(manualForm.originalPrice)
        : undefined,
      tax: manualForm.tax ? parseFloat(manualForm.tax) : 0, // <-- ADDED TAX
      stockQuantity: parseInt(manualForm.stockQuantity) || 1,
      category: manualForm.category as any,
      images: manualForm.images,
      metal: {
        type: manualForm.metalType as any,
        purity: manualForm.metalPurity,
        color: manualForm.metalColor,
        weightInGrams: parseFloat(manualForm.metalWeightInGrams) || 0,
      },
      tags: manualForm.tags
        ? manualForm.tags.split(",").map((t) => t.trim())
        : [],
    };
    dispatch(addJewelry(jewelryData));
  };

  const handleCsvFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCsvFile(file);
      setCsvMapping({});
      dispatch(previewCsvHeaders(file));
    }
  };

  const handleMappingChange = (csvField: string, modelField: string) => {
    setCsvMapping((prev) => ({ ...prev, [csvField]: modelField }));
  };

  const handleCsvSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!csvFile) {
      return toast.error("Please select a CSV file!");
    }
    if (Object.keys(csvMapping).length === 0) {
      return toast.error("Please map at least one field!");
    }
    const mappedValues = Object.values(csvMapping);
    if (!mappedValues.includes("sku") && !mappedValues.includes("name")) {
      return toast.error("You must map either 'SKU' or 'Name' field.");
    }
    dispatch(uploadCsv({ file: csvFile, mapping: csvMapping }));
  };

  const isLoading = actionStatus === "loading";

  const renderInputField = (
    name: keyof typeof initialManualState,
    label: string,
    type = "text",
    required = false,
    placeholder?: string
  ) => (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        name={name}
        id={name}
        type={type}
        value={manualForm[name] as string}
        onChange={handleManualChange}
        required={required}
        disabled={isLoading}
        placeholder={placeholder}
      />
    </div>
  );

  const renderSelectField = (
    name: keyof typeof initialManualState,
    label: string,
    options: string[],
    required = false
  ) => (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select
        name={name}
        value={manualForm[name] as string}
        onValueChange={(value) => handleManualSelectChange(name, value)}
        required={required}
        disabled={isLoading}
      >
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  // Model fields with TAX
  const modelFields = [
    { value: "name", label: "Name" },
    { value: "sku", label: "SKU" },
    { value: "description", label: "Description" },
    { value: "price", label: "Price (Discounted)" },
    { value: "originalPrice", label: "Original Price" },
    { value: "tax", label: "Tax (%)" }, // <-- ADDED TAX
    { value: "stockQuantity", label: "Stock Quantity" },
    { value: "category", label: "Category" },
    { value: "metal.type", label: "Metal Type" },
    { value: "metal.purity", label: "Metal Purity" },
    { value: "metal.weightInGrams", label: "Metal Weight" },
    { value: "images", label: "Images (comma-separated URLs)" },
    { value: "tags", label: "Tags (comma-separated)" },
  ];

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-3 mb-3">
          <Gem className="h-10 w-10 text-orange-500" />
          <h1 className="text-4xl font-bold">Add Inventory</h1>
        </div>
        <p className="text-gray-600">
          Add new jewelry to your inventory using one of the methods below.
        </p>
      </div>

      <Card className="shadow-lg border-0 bg-white">
        <CardContent className="p-6">
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-gray-100 p-1 h-auto">
              <TabsTrigger value="manual">
                <ClipboardEdit className="mr-2 h-4 w-4" /> Manual
              </TabsTrigger>
              <TabsTrigger value="csv">
                <Upload className="mr-2 h-4 w-4" /> CSV
              </TabsTrigger>
              <TabsTrigger value="api_sync" disabled>
                <RefreshCw className="mr-2 h-4 w-4" /> API
              </TabsTrigger>
              <TabsTrigger value="ftp" disabled>
                <Server className="mr-2 h-4 w-4" /> FTP
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="mt-6">
              <form onSubmit={handleManualSubmit}>
                <ScrollArea className="h-[60vh] pr-4">
                  <div className="space-y-8 p-1">
                    <div className="p-6 rounded-lg border bg-gray-50">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Gem className="h-5 w-5 text-orange-500" /> Essential
                        Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {renderInputField("name", "Jewelry Name", "text", true)}
                        {renderInputField("sku", "SKU", "text", true)}
                        {renderInputField(
                          "price",
                          "Price (INR)",
                          "number",
                          true,
                          "e.g., 45000"
                        )}
                        {renderInputField(
                          "originalPrice",
                          "Original Price (Optional)",
                          "number",
                          false,
                          "e.g., 50000"
                        )}

                        {/* --- ADDED TAX INPUT FIELD --- */}
                        {renderInputField(
                          "tax",
                          "Tax (%) (Optional)",
                          "number",
                          false,
                          "e.g., 3 for 3%"
                        )}

                        {renderInputField(
                          "stockQuantity",
                          "Stock Quantity",
                          "number"
                        )}
                        {renderSelectField(
                          "category",
                          "Category",
                          [
                            "Rings",
                            "New Arrivals",
                            "Necklaces",
                            "Earrings",
                            "Bracelets",
                            "Gifts",
                          ],
                          true
                        )}
                      </div>
                      <div className="mt-4">
                        <Label htmlFor="description">
                          Description <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          name="description"
                          id="description"
                          value={manualForm.description}
                          onChange={handleManualChange}
                          required
                          disabled={isLoading}
                          rows={3}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="p-6 rounded-lg border bg-gray-50">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-orange-500" /> Metal
                        Details
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {renderSelectField(
                          "metalType",
                          "Metal Type",
                          ["Gold", "Silver", "Platinum"],
                          true
                        )}
                        {renderInputField(
                          "metalPurity",
                          "Purity (e.g., 18K)",
                          "text",
                          true
                        )}
                        {renderInputField("metalColor", "Color")}
                        {renderInputField(
                          "metalWeightInGrams",
                          "Weight (grams)",
                          "number",
                          true
                        )}
                      </div>
                    </div>

                    <div className="p-6 rounded-lg border bg-gray-50">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Product Images <span className="text-red-500">*</span>
                      </h3>
                      <div className="flex gap-2 mb-4">
                        <Input
                          type="url"
                          placeholder="Enter image URL"
                          value={imageInput}
                          onChange={(e) => setImageInput(e.target.value)}
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          onClick={handleAddImage}
                          disabled={isLoading}
                        >
                          Add
                        </Button>
                      </div>
                      {manualForm.images.length > 0 && (
                        <div className="space-y-2">
                          {manualForm.images.map((img, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 p-2 bg-white rounded border"
                            >
                              <span className="flex-1 text-sm truncate">
                                {img}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveImage(index)}
                                disabled={isLoading}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="p-6 rounded-lg border bg-gray-50">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        name="tags"
                        id="tags"
                        value={manualForm.tags}
                        onChange={handleManualChange}
                        placeholder="e.g., wedding, bridal, luxury"
                        disabled={isLoading}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </ScrollArea>
                <div className="pt-6 border-t mt-6">
                  <Button
                    type="submit"
                    className="w-full h-12 text-base bg-orange-500 hover:bg-orange-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "Adding..." : "Add Jewelry to Inventory"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="csv" className="mt-6">
              <form onSubmit={handleCsvSubmit}>
                <div className="space-y-6">
                  <div className="p-6 rounded-lg border bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4">
                      1. Upload CSV File
                    </h3>
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={handleCsvFileChange}
                      disabled={isLoading}
                    />
                    {csvFile && (
                      <p className="text-sm text-gray-600 mt-2">
                        Selected: {csvFile.name}
                      </p>
                    )}
                  </div>
                  {csvHeaders.length > 0 && (
                    <div className="p-6 rounded-lg border bg-gray-50">
                      <h3 className="text-lg font-semibold mb-4">
                        2. Map CSV Fields to Database
                      </h3>
                      <ScrollArea className="h-96">
                        <div className="space-y-4">
                          {csvHeaders.map((csvField) => (
                            <div
                              key={csvField}
                              className="grid grid-cols-2 gap-4 items-center"
                            >
                              <div className="font-medium text-sm">
                                {csvField}
                              </div>
                              <Select
                                value={csvMapping[csvField] || ""}
                                onValueChange={(value) =>
                                  handleMappingChange(csvField, value)
                                }
                                disabled={isLoading}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select field" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="">
                                    -- Skip Column --
                                  </SelectItem>
                                  {modelFields.map((field) => (
                                    <SelectItem
                                      key={field.value}
                                      value={field.value}
                                    >
                                      {field.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                  {csvHeaders.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        3. Upload Data
                      </h3>
                      <Button
                        type="submit"
                        className="w-full h-12 bg-orange-500 hover:bg-orange-600"
                        disabled={isLoading || !csvFile}
                      >
                        {isLoading ? "Uploading..." : "Upload and Process CSV"}
                      </Button>
                    </div>
                  )}
                </div>
              </form>
            </TabsContent>

            <TabsContent value="api_sync">
              <div className="text-center py-20 text-gray-500 border-2 border-dashed rounded-lg mt-6">
                <h3 className="text-lg font-semibold">API Sync</h3>
                <p className="text-sm mt-2">Coming soon...</p>
              </div>
            </TabsContent>
            <TabsContent value="ftp">
              <div className="text-center py-20 text-gray-500 border-2 border-dashed rounded-lg mt-6">
                <h3 className="text-lg font-semibold">FTP Upload</h3>
                <p className="text-sm mt-2">Coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
