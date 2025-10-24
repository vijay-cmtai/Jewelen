"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchUserById } from "@/lib/features/users/userSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
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

  const { selectedUser, singleStatus, singleError } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
    }
  }, [dispatch, userId]);

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
                <Badge
                  variant={
                    selectedUser.role === "Admin" ? "default" : "secondary"
                  }
                >
                  {selectedUser.role}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="text-center text-sm">
              <p>
                Status:{" "}
                <span className="font-semibold">{selectedUser.status}</span>
              </p>
              <p className="text-muted-foreground">
                Joined on {formatDate(selectedUser.createdAt)}
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Additional User Information</CardTitle>
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
