"use client";

// ----------------------------------------------------------------
// SECTION 1: IMPORTS (Zaroori cheezein import karna)
// ----------------------------------------------------------------
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  Trash2,
  Edit,
  Loader2,
  Home,
  Briefcase,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
  fetchAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  resetAddressStatus,
  Address,
} from "@/lib/features/address/addressSlice";
import { toast } from "sonner";

// ----------------------------------------------------------------
// SECTION 2: INITIAL FORM STATE (Form ki shuruaati khali state)
// ----------------------------------------------------------------
const initialFormState: Partial<Address> = {
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  addressType: "Home",
};

// ----------------------------------------------------------------
// SECTION 3: COMPONENT DEFINITION
// ----------------------------------------------------------------
export default function UserAddressesPage() {
  // --- Hooks ---
  const dispatch = useDispatch<AppDispatch>();
  const { addresses, listStatus, actionStatus, error } = useSelector(
    (state: RootState) => state.address
  );

  // --- State Management ---
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState(initialFormState);

  // --- Effects ---
  // Page load hone par addresses fetch karein
  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  // Action (add/edit/delete) ke baad toast message dikhayein
  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success(editingAddress ? "Address updated!" : "Address added!");
      setIsFormOpen(false);
      setFormData(initialFormState);
      setEditingAddress(null);
      dispatch(resetAddressStatus());
    }
    if (actionStatus === "failed" && error) {
      toast.error(error);
      dispatch(resetAddressStatus());
    }
  }, [actionStatus, error, dispatch, editingAddress]);

  // --- Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveAddress = () => {
    if (
      !formData.addressLine1 ||
      !formData.city ||
      !formData.state ||
      !formData.postalCode ||
      !formData.country
    ) {
      toast.error("Please fill all required fields.");
      return;
    }
    if (editingAddress) {
      dispatch(
        updateAddress({ addressId: editingAddress._id, updates: formData })
      );
    } else {
      dispatch(addAddress(formData));
    }
  };

  const handleOpenForm = (address: Address | null) => {
    if (address) {
      setEditingAddress(address);
      setFormData(address);
    } else {
      setEditingAddress(null);
      setFormData(initialFormState);
    }
    setIsFormOpen(true);
  };

  const handleDeleteClick = (addressId: string) => {
    setAddressToDelete(addressId);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (addressToDelete) {
      dispatch(deleteAddress({ addressId: addressToDelete }));
      setAddressToDelete(null);
      setIsAlertOpen(false);
    }
  };

  // ----------------------------------------------------------------
  // SECTION 4: JSX (Component ka UI)
  // ----------------------------------------------------------------
  return (
    <div>
      {/* --- Page Header --- */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold tracking-tight">My Addresses</h2>
        <Button onClick={() => handleOpenForm(null)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Address
        </Button>
      </div>

      {/* --- Add/Edit Form Dialog --- */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? "Edit Address" : "Add a New Address"}
            </DialogTitle>
            <DialogDescription>
              {editingAddress
                ? "Update your address details."
                : "Enter your shipping address details here."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="addressLine1">Street Address</Label>
              <Input
                id="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="state">State / Province</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={handleSaveAddress}
              disabled={actionStatus === "loading"}
            >
              {actionStatus === "loading" && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Address List --- */}
      {listStatus === "loading" ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-medium">No saved addresses.</h3>
          <p className="text-muted-foreground mt-2">
            Add an address for a faster checkout process.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <Card key={address._id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {address.addressType === "Home" ? (
                        <Home className="h-4 w-4" />
                      ) : (
                        <Briefcase className="h-4 w-4" />
                      )}
                      <p className="font-bold">{address.addressType}</p>
                      {address.isDefault && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                    </div>
                    <div className="text-muted-foreground space-y-0.5">
                      <p className="font-semibold text-primary">
                        {address.addressLine1}
                      </p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>
                        {address.city}, {address.state} {address.postalCode}
                      </p>
                      <p>{address.country}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenForm(address)}
                    >
                      <Edit className="h-4 w-4 text-muted-foreground hover:text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(address._id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {/* --- Delete Confirmation Dialog --- */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              address.
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
