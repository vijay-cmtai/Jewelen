"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, PackageSearch } from "lucide-react";

// --- DUMMY DATA ---
const initialInventory = [
  {
    _id: "1",
    stockId: "JWL-001",
    shape: "Round",
    carat: 1.02,
    price: 12000,
    availability: "Available",
  },
  {
    _id: "2",
    stockId: "JWL-002",
    shape: "Princess",
    carat: 0.75,
    price: 6500,
    availability: "Available",
  },
  {
    _id: "3",
    stockId: "JWL-003",
    shape: "Cushion",
    carat: 2.15,
    price: 25000,
    availability: "On Hold",
  },
  {
    _id: "4",
    stockId: "JWL-004",
    shape: "Oval",
    carat: 1.5,
    price: 18500,
    availability: "Sold",
  },
];
// --- END OF DUMMY DATA ---

type Diamond = (typeof initialInventory)[0];

export default function SupplierInventoryListPage() {
  const [inventoryList, setInventoryList] =
    useState<Diamond[]>(initialInventory);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Helper to format price
  const formatPrice = (price?: number) =>
    price
      ? new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(price * 80)
      : "N/A";

  const handleStatusChange = (diamondId: string, newAvailability: string) => {
    setUpdatingId(diamondId);
    console.log(`Updating ${diamondId} to ${newAvailability}`);

    // Simulate an API call
    setTimeout(() => {
      setInventoryList((prevList) =>
        prevList.map((diamond) =>
          diamond._id === diamondId
            ? { ...diamond, availability: newAvailability }
            : diamond
        )
      );
      setUpdatingId(null);
      alert("Status updated successfully!");
    }, 1000);
  };

  const getBadgeVariant = (availability: string) => {
    switch (availability) {
      case "Available":
        return "default";
      case "On Hold":
        return "secondary";
      case "Sold":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Inventory</h1>
        <p className="text-gray-500 mt-1">
          View and manage all the diamonds in your inventory.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Diamonds ({inventoryList.length})</CardTitle>
          <CardDescription>
            Change the availability status directly from the table.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stock ID</TableHead>
                <TableHead>Shape</TableHead>
                <TableHead>Carat</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="w-[180px]">Availability</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryList.length > 0 ? (
                inventoryList.map((diamond) => (
                  <TableRow key={diamond._id}>
                    <TableCell className="font-medium">
                      {diamond.stockId}
                    </TableCell>
                    <TableCell>{diamond.shape}</TableCell>
                    <TableCell>{diamond.carat?.toFixed(2)}</TableCell>
                    <TableCell className="font-semibold">
                      {formatPrice(diamond.price)}
                    </TableCell>
                    <TableCell>
                      {updatingId === diamond._id ? (
                        <div className="flex items-center justify-center h-9">
                          <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                      ) : (
                        <Select
                          value={diamond.availability}
                          onValueChange={(newValue) =>
                            handleStatusChange(diamond._id, newValue)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue>
                              <Badge
                                variant={getBadgeVariant(diamond.availability)}
                              >
                                {diamond.availability}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Available">Available</SelectItem>
                            <SelectItem value="On Hold">On Hold</SelectItem>
                            <SelectItem value="Sold">Sold</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-48 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <PackageSearch className="h-12 w-12 text-gray-300" />
                      <p className="font-medium">No diamonds found</p>
                      <p className="text-sm">
                        Your inventory is empty. Start by adding a new diamond.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
