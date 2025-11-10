// File: app/admin/users/[userId]/page.tsx

"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/lib/store";
import {
  fetchUserById,
  updateUserStatus,
  resetActionStatus,
} from "@/lib/features/users/userSlice";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getInitials = (name?: string) => {
  if (!name) return "U";
  const names = name.split(" ");
  return names.length > 1
    ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    : name.charAt(0).toUpperCase();
};

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="font-medium text-base">{value || "—"}</p>
  </div>
);

export default function UserDetailPage() {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const { selectedUser, singleStatus, singleError, actionStatus, actionError } =
    useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("User status updated successfully!");
      dispatch(resetActionStatus());
    }
    if (actionStatus === "failed") {
      toast.error(actionError || "Failed to update status.");
      dispatch(resetActionStatus());
    }
  }, [actionStatus, actionError, dispatch]);

  const handleApprove = () => {
    if (window.confirm("Are you sure you want to approve this user?")) {
      dispatch(updateUserStatus({ userId, status: "Approved" }));
    }
  };

  const handleReject = () => {
    if (window.confirm("Are you sure you want to reject this user?")) {
      dispatch(updateUserStatus({ userId, status: "Rejected" }));
    }
  };

  if (singleStatus === "loading") {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (singleStatus === "failed") {
    return (
      <div className="text-center text-red-500 mt-10">Error: {singleError}</div>
    );
  }

  if (!selectedUser) return null;

  const getStatusVariant = (
    status?: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "Approved":
        return "default";
      case "Pending":
        return "secondary";
      case "Rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getRoleVariant = (
    role?: string
  ): "default" | "secondary" | "outline" => {
    switch (role) {
      case "Admin":
        return "default";
      case "Supplier":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Users
      </Button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="text-4xl">
                  {getInitials(selectedUser.name)}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{selectedUser.name}</CardTitle>
              <CardDescription>{selectedUser.email}</CardDescription>
              <div className="pt-2">
                <Badge variant={getRoleVariant(selectedUser.role)}>
                  {selectedUser.role}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={getStatusVariant(selectedUser.status)}>
                  {selectedUser.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Joined on {formatDate(selectedUser.createdAt)}
              </p>

              {selectedUser.status === "Pending" && (
                <div className="pt-4 border-t space-y-2">
                  <h4 className="text-sm font-semibold">Actions</h4>
                  <div className="flex justify-center gap-2">
                    <Button
                      onClick={handleApprove}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      disabled={actionStatus === "loading"}
                    >
                      {actionStatus === "loading" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Approve
                    </Button>
                    <Button
                      onClick={handleReject}
                      size="sm"
                      variant="destructive"
                      disabled={actionStatus === "loading"}
                    >
                      {actionStatus === "loading" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      Reject
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Additional User Information</CardTitle>
              <CardDescription>
                Details provided during registration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <DetailItem
                  label="Company Name"
                  value={selectedUser.companyName}
                />
                <DetailItem
                  label="Trading Name"
                  value={selectedUser.tradingName}
                />
                <DetailItem
                  label="Business Type"
                  value={selectedUser.businessType}
                />
                <DetailItem
                  label="Country"
                  value={selectedUser.companyCountry}
                />
                <DetailItem
                  label="Corporate ID No."
                  value={selectedUser.corporateIdentityNumber}
                />
                <DetailItem
                  label="Company Website"
                  value={
                    selectedUser.companyWebsite ? (
                      <a
                        href={selectedUser.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {selectedUser.companyWebsite}
                      </a>
                    ) : (
                      "—"
                    )
                  }
                />
                <div className="md:col-span-2">
                  <DetailItem
                    label="Company Address"
                    value={selectedUser.companyAddress}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
