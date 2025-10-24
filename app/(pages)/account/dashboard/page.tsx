"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchUserDashboardStats } from "@/lib/features/dashboard/userDashboardSlice";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight,
  ShoppingBag,
  Heart,
  DollarSign,
  Package,
  CheckCircle2,
  Loader,
} from "lucide-react";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const StatCard = ({
  icon: Icon,
  title,
  value,
  link,
  linkText,
}: {
  icon: React.ElementType;
  title: string;
  value: string | number;
  link: string;
  linkText: string;
}) => (
  <Card className="transition-all hover:shadow-md hover:-translate-y-0.5">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className="h-5 w-5 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <Link
        href={link}
        className="text-xs text-primary font-medium hover:underline flex items-center gap-1 mt-1"
      >
        {linkText} <ArrowRight size={12} />
      </Link>
    </CardContent>
  </Card>
);

const OrderStatusStep = ({
  status,
  isCompleted,
  isActive,
}: {
  status: string;
  isCompleted: boolean;
  isActive: boolean;
}) => (
  <div className="flex items-center gap-4">
    <div
      className={`flex h-9 w-9 items-center justify-center rounded-full border-2 ${isActive ? "border-primary bg-primary/10" : isCompleted ? "border-green-500 bg-green-50" : "border-border"}`}
    >
      {isActive ? (
        <Loader size={20} className="animate-spin text-primary" />
      ) : isCompleted ? (
        <CheckCircle2 size={20} className="text-green-500" />
      ) : (
        <Package size={20} className="text-muted-foreground" />
      )}
    </div>
    <span
      className={`font-medium ${isActive ? "text-primary" : "text-foreground"}`}
    >
      {status}
    </span>
  </div>
);

export default function UserDashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const {
    stats,
    status: dashboardStatus,
    error,
  } = useSelector((state: RootState) => state.userDashboard);

  useEffect(() => {
    dispatch(fetchUserDashboardStats());
  }, [dispatch]);

  if (dashboardStatus === "loading" || !stats) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-36 w-full" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const recentOrder = stats.recentOrder;
  const orderStatusSteps = ["Processing", "Shipped", "Delivered", "Completed"];
  const currentStatusIndex = recentOrder
    ? orderStatusSteps.indexOf(recentOrder.orderStatus)
    : -1;

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary via-primary/80 to-secondary p-6 md:p-8 shadow-lg">
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full opacity-50 blur-2xl" />
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground tracking-tight">
            Welcome back, {userInfo?.name?.split(" ")[0] || "User"}!
          </h1>
          <p className="mt-2 text-primary-foreground/80 max-w-2xl">
            Here's a quick summary of your account activity.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={DollarSign}
          title="Total Spent"
          value={formatCurrency(stats.totalSpent)}
          link="/account/orders"
          linkText="View transactions"
        />
        <StatCard
          icon={ShoppingBag}
          title="Orders Placed"
          value={stats.ordersPlaced}
          link="/account/orders"
          linkText="See your orders"
        />
        <StatCard
          icon={Heart}
          title="Wishlist Items"
          value={stats.wishlistItems}
          link="/account/wishlist"
          linkText="Manage your wishlist"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Latest Order Status</CardTitle>
            {recentOrder && (
              <CardDescription>
                Tracking for order{" "}
                <span className="font-medium text-primary">
                  #{recentOrder._id.slice(-6).toUpperCase()}
                </span>
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {recentOrder ? (
              <>
                <div className="flex flex-col md:flex-row gap-6 p-4 rounded-lg bg-muted/50 border">
                  <Image
                    src={
                      (recentOrder.items[0] as any).jewelry?.images?.[0] ||
                      "/placeholder-jewelry.jpg"
                    }
                    alt={(recentOrder.items[0] as any).jewelry?.name || "Item"}
                    width={100}
                    height={100}
                    className="rounded-md object-cover border"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">
                      {(recentOrder.items[0] as any).jewelry?.name ||
                        "Item from your order"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Order Status:{" "}
                      <span className="font-medium text-foreground">
                        {recentOrder.orderStatus}
                      </span>
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" asChild>
                        <Link href={`/account/orders/${recentOrder._id}`}>
                          Track Order
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href="/account/orders">View All Orders</Link>
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="relative mt-8 ml-4">
                  <div className="absolute left-[17px] top-0 h-full w-0.5 bg-border -z-10" />
                  <div className="space-y-8">
                    {orderStatusSteps.map((status, index) => (
                      <OrderStatusStep
                        key={status}
                        status={status}
                        isCompleted={index < currentStatusIndex}
                        isActive={index === currentStatusIndex}
                      />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>You haven't placed any orders yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Wishlist and Profile cards can remain static or be populated similarly */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full" asChild>
                <Link href="/account/profile">Go to Profile Settings</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
