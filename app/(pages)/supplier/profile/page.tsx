"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Edit, Loader2, Save, X, Building } from "lucide-react";

// Helper to get initials
const getInitials = (name: string = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "S";

// --- DUMMY DATA ---
const dummySupplierInfo = {
  companyName: "Mystic Gems",
  name: "Damon Salvatore",
  email: "damon@supplier.com",
  avatarUrl: "https://i.pravatar.cc/150?u=damon",
  companyWebsite: "www.mysticgems.com",
  companyAddress: "123 Mystic Falls, VA, USA",
};
// --- END OF DUMMY DATA ---

export default function SupplierProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // User info state (changes will be saved here)
  const [userInfo, setUserInfo] = useState(dummySupplierInfo);
  // Form data state (for editing)
  const [formData, setFormData] = useState(dummySupplierInfo);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarPreview(URL.createObjectURL(file));
      // In a real app, you would also set a state for the file object to be uploaded
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(userInfo); // Revert changes to the original state
    setAvatarPreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("Saving data:", formData);
    if (avatarPreview) console.log("New avatar selected.");

    // Simulate an API call
    setTimeout(() => {
      setUserInfo(formData); // "Save" the data by updating the main user info state
      if (avatarPreview) {
        // In a real app, the backend would return a new URL
        // For now, we'll just update it to the preview URL for demonstration
        setUserInfo((prev) => ({ ...prev, avatarUrl: avatarPreview }));
      }

      setIsLoading(false);
      setIsEditing(false);
      setAvatarPreview(null);
      alert("Profile updated successfully!");
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-gray-500 mt-1">
          View and manage your supplier profile details.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building size={20} /> Company Information
            </CardTitle>
            <CardDescription>
              Update your company logo and details here.
            </CardDescription>
          </div>
          {!isEditing && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData(userInfo); // Ensure form starts with current data
                setIsEditing(true);
              }}
            >
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border">
                <AvatarImage
                  src={avatarPreview || userInfo.avatarUrl}
                  alt={userInfo.companyName}
                />
                <AvatarFallback className="text-3xl">
                  {getInitials(userInfo.companyName)}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div className="grid flex-1 gap-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Contact Email (Cannot be changed)</Label>
              <Input
                id="email"
                type="email"
                value={userInfo.email || ""}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Contact Person</Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyWebsite">Website</Label>
              <Input
                id="companyWebsite"
                name="companyWebsite"
                value={formData.companyWebsite || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyAddress">Address</Label>
              <Input
                id="companyAddress"
                name="companyAddress"
                value={formData.companyAddress || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {isEditing && (
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </form>
  );
}
