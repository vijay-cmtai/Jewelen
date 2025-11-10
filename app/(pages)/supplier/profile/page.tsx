"use client";

import React, { useState, useRef, useEffect } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store";
import {
  updateUserProfile,
  resetActionStatus,
} from "@/lib/features/users/userSlice";

const getInitials = (name: string = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "S";

export default function SupplierProfilePage() {
  const dispatch: AppDispatch = useDispatch();
  const { userInfo, actionStatus, actionError } = useSelector(
    (state: RootState) => state.user
  );

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    companyWebsite: "",
    companyAddress: "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userInfo) {
      setFormData({
        companyName: userInfo.companyName || "",
        name: userInfo.name || "",
        companyWebsite: userInfo.companyWebsite || "",
        companyAddress: userInfo.companyAddress || "",
      });
    }
    return () => {
      dispatch(resetActionStatus());
    };
  }, [userInfo, dispatch]);

  useEffect(() => {
    if (actionStatus === "succeeded") {
      alert("Profile updated successfully!");
      setIsEditing(false);
      setAvatarPreview(null);
      setAvatarFile(null);
      dispatch(resetActionStatus());
    }
    if (actionStatus === "failed") {
      alert(`Error: ${actionError}`);
      dispatch(resetActionStatus());
    }
  }, [actionStatus, actionError, dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (userInfo) {
      setFormData({
        companyName: userInfo.companyName || "",
        name: userInfo.name || "",
        companyWebsite: userInfo.companyWebsite || "",
        companyAddress: userInfo.companyAddress || "",
      });
    }
    setAvatarPreview(null);
    setAvatarFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit = new FormData();
    dataToSubmit.append("name", formData.name);
    dataToSubmit.append("companyName", formData.companyName);
    dataToSubmit.append("companyWebsite", formData.companyWebsite);
    dataToSubmit.append("companyAddress", formData.companyAddress);

    if (avatarFile) {
      dataToSubmit.append("profilePicture", avatarFile);
    }
    dispatch(updateUserProfile(dataToSubmit));
  };

  const isLoading = actionStatus === "loading";

  if (!userInfo) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
              onClick={() => setIsEditing(true)}
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
                  src={avatarPreview || userInfo.profilePicture?.url}
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
                value={formData.companyName}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Contact Email (Cannot be changed)</Label>
              <Input id="email" type="email" value={userInfo.email} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Contact Person</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyWebsite">Website</Label>
              <Input
                id="companyWebsite"
                name="companyWebsite"
                value={formData.companyWebsite}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyAddress">Address</Label>
              <Input
                id="companyAddress"
                name="companyAddress"
                value={formData.companyAddress}
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
