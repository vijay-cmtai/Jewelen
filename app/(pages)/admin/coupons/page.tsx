// File: app/admin/coupons/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "@/lib/store";
import {
  fetchCoupons,
  createCoupon,
  deleteCoupon,
  resetActionStatus,
} from "@/lib/features/coupons/couponSlice";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2, Loader2 } from "lucide-react";

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString();

export default function AdminCouponsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { coupons, listStatus, actionStatus, actionError } = useSelector(
    (state: RootState) => state.coupons
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "Percentage",
    discountValue: "",
    minPurchaseAmount: "",
    usageLimit: "",
    expiryDate: "",
  });

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Operation successful!");
      setIsDialogOpen(false);
      setFormData({
        code: "",
        discountType: "Percentage",
        discountValue: "",
        minPurchaseAmount: "",
        usageLimit: "",
        expiryDate: "",
      });
      dispatch(resetActionStatus());
    }
    if (actionStatus === "failed") {
      toast.error(actionError || "An error occurred.");
      dispatch(resetActionStatus());
    }
  }, [actionStatus, actionError, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, discountType: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const couponData = {
      ...formData,
      code: formData.code.toUpperCase(),
      discountValue: Number(formData.discountValue),
      minPurchaseAmount: Number(formData.minPurchaseAmount) || 0,
      usageLimit: Number(formData.usageLimit),
      isActive: true,
    };
    dispatch(createCoupon(couponData as any));
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      dispatch(deleteCoupon(id));
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Coupon Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Coupon
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="code">Coupon Code</Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  className="uppercase"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Discount Type</Label>
                  <Select
                    name="discountType"
                    value={formData.discountType}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Percentage">Percentage</SelectItem>
                      <SelectItem value="Flat">Flat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="discountValue">
                    Value ({formData.discountType === "Percentage" ? "%" : "₹"})
                  </Label>
                  <Input
                    id="discountValue"
                    name="discountValue"
                    type="number"
                    value={formData.discountValue}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minPurchaseAmount">Min Purchase (₹)</Label>
                  <Input
                    id="minPurchaseAmount"
                    name="minPurchaseAmount"
                    type="number"
                    value={formData.minPurchaseAmount}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="usageLimit">Usage Limit</Label>
                  <Input
                    id="usageLimit"
                    name="usageLimit"
                    type="number"
                    value={formData.usageLimit}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={actionStatus === "loading"}
                className="w-full"
              >
                {actionStatus === "loading" ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Create Coupon"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listStatus === "loading" ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  <Loader2 className="mx-auto animate-spin" />
                </TableCell>
              </TableRow>
            ) : coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  No coupons found.
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon) => (
                <TableRow key={coupon._id}>
                  <TableCell className="font-medium">{coupon.code}</TableCell>
                  <TableCell>{coupon.discountType}</TableCell>
                  <TableCell>
                    {coupon.discountType === "Percentage"
                      ? `${coupon.discountValue}%`
                      : `₹${coupon.discountValue}`}
                  </TableCell>
                  <TableCell>{formatDate(coupon.expiryDate)}</TableCell>
                  <TableCell>
                    {coupon.timesUsed} / {coupon.usageLimit}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        coupon.isActive &&
                        new Date(coupon.expiryDate) > new Date()
                          ? "default"
                          : "destructive"
                      }
                    >
                      {coupon.isActive &&
                      new Date(coupon.expiryDate) > new Date()
                        ? "Active"
                        : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(coupon._id)}
                      disabled={actionStatus === "loading"}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
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
