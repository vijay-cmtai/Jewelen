"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Ruler,
  Award,
  Camera,
  FileText,
  MapPin,
} from "lucide-react";

// Initial state for the manual entry form
const initialManualState = {
  stockId: "",
  carat: "",
  price: "",
  type: "LAB GROWN",
  availability: "Available",
  shape: "",
  color: "",
  clarity: "",
  cut: "",
  // ... baaki fields ko aap yahan add kar sakte hain
};

export default function AddInventoryPage() {
  const router = useRouter();

  // Local state for the form
  const [manualForm, setManualForm] = useState(initialManualState);
  const [isLoading, setIsLoading] = useState(false);

  const handleManualChange = (e: ChangeEvent<HTMLInputElement>) =>
    setManualForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleManualSelectChange = (name: string, value: string) =>
    setManualForm((prev) => ({ ...prev, [name]: value }));

  const handleManualSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!manualForm.stockId || !manualForm.carat) {
      alert("Validation Error: Stock ID and Carat are required.");
      return;
    }

    setIsLoading(true);
    console.log("Form Submitted:", manualForm);

    // Simulate an API call
    setTimeout(() => {
      alert("Success! Diamond has been added to the inventory.");
      setManualForm(initialManualState); // Form ko reset karein
      setIsLoading(false);
      // Optional: Redirect back to inventory page
      // router.push('/admin/inventory');
    }, 1500);
  };

  const renderInputField = (
    name: keyof typeof initialManualState,
    label: string,
    type = "text",
    required = false
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
        value={manualForm[name]}
        onChange={handleManualChange}
        required={required}
        disabled={isLoading}
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
        value={manualForm[name]}
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

  // Simple placeholder for other tabs
  const PlaceholderTab = ({ title }: { title: string }) => (
    <div className="text-center py-20 text-gray-500 border-2 border-dashed rounded-lg mt-6">
      <h3 className="text-lg font-semibold">{title} Uploader</h3>
      <p className="text-sm mt-2">
        This feature is for demonstration purposes.
      </p>
    </div>
  );

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-3 mb-3">
          <Gem className="h-10 w-10 text-orange-500" />
          <h1 className="text-4xl font-bold">Add Inventory</h1>
        </div>
        <p className="text-gray-600">
          Add a new diamond to your inventory using one of the methods below.
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
              <TabsTrigger value="api_sync">
                <RefreshCw className="mr-2 h-4 w-4" /> API
              </TabsTrigger>
              <TabsTrigger value="ftp">
                <Server className="mr-2 h-4 w-4" /> FTP
              </TabsTrigger>
            </TabsList>

            {/* --- Manual Entry Tab --- */}
            <TabsContent value="manual" className="mt-6">
              <form onSubmit={handleManualSubmit}>
                <ScrollArea className="h-[60vh] pr-4">
                  <div className="space-y-8 p-1">
                    {/* Essential Information */}
                    <div className="p-6 rounded-lg border bg-gray-50">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Gem className="h-5 w-5 text-orange-500" /> Essentials
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {renderInputField("stockId", "Stock ID", "text", true)}
                        {renderInputField(
                          "carat",
                          "Carat Weight",
                          "number",
                          true
                        )}
                        {renderInputField(
                          "price",
                          "Total Price (INR)",
                          "number"
                        )}
                        {renderSelectField(
                          "type",
                          "Diamond Type",
                          ["Lab Grown", "Natural"],
                          true
                        )}
                        {renderSelectField(
                          "availability",
                          "Availability",
                          ["Available", "On Hold", "Sold"],
                          true
                        )}
                      </div>
                    </div>

                    {/* Characteristics */}
                    <div className="p-6 rounded-lg border bg-gray-50">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-orange-500" />{" "}
                        Characteristics
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {renderSelectField("shape", "Shape", [
                          "Round",
                          "Princess",
                          "Cushion",
                          "Emerald",
                          "Oval",
                          "Pear",
                        ])}
                        {renderInputField("color", "Color Grade")}
                        {renderInputField("clarity", "Clarity Grade")}
                        {renderInputField("cut", "Cut Grade")}
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                <div className="pt-6 border-t mt-6">
                  <Button
                    type="submit"
                    className="w-full h-12 text-base"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Add Diamond to Inventory"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            {/* --- Placeholder Tabs --- */}
            <TabsContent value="csv">
              <PlaceholderTab title="CSV" />
            </TabsContent>
            <TabsContent value="api_sync">
              <PlaceholderTab title="API Sync" />
            </TabsContent>
            <TabsContent value="ftp">
              <PlaceholderTab title="FTP" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
