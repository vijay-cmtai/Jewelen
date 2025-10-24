"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchDashboardStats } from "@/lib/features/dashboard/dashboardSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  Sparkles,
  Activity,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Ab yeh line bilkul sahi se kaam karegi
  const { stats, status, error } = useSelector(
    (state: RootState) => state.dashboard
  );

  useEffect(() => {
    // Page load hone par stats fetch karein
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  // Currency aur numbers ko format karne ke liye helper functions
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatNumber = (num: number) =>
    new Intl.NumberFormat("en-IN").format(num);

  // Redux se aane waale data ke aadhar par dynamic cards
  const statsCards = [
    {
      title: "Total Revenue",
      value: stats ? formatCurrency(stats.totalRevenue) : "₹0",
      icon: DollarSign,
      color: "from-blue-500 to-blue-700",
    },
    {
      title: "Total Orders",
      value: stats ? formatNumber(stats.totalOrders) : "0",
      icon: ShoppingCart,
      color: "from-green-500 to-emerald-700",
    },
    {
      title: "Active Buyers",
      value: stats ? formatNumber(stats.activeBuyers) : "0",
      icon: Users,
      color: "from-purple-500 to-violet-700",
    },
    {
      title: "Active Suppliers",
      value: stats ? formatNumber(stats.activeSuppliers) : "0",
      icon: Package,
      color: "from-orange-500 to-red-600",
    },
  ];

  // Loading State
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  // Error State
  if (status === "failed") {
    return (
      <div className="text-center text-red-500 mt-20 text-lg">
        Error loading dashboard: {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-red-500 p-8 shadow-lg">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-white/90 text-lg flex items-center gap-2 font-medium">
            <Activity className="h-5 w-5" />
            Welcome! Here's a quick overview of your store.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card) => (
          <Card
            key={card.title}
            className={`border-0 shadow-lg hover:shadow-xl transition-shadow text-white bg-gradient-to-br ${card.color}`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-white/90 uppercase tracking-wide">
                {card.title}
              </CardTitle>
              <card.icon className="h-6 w-6 text-white/80" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black mb-2">{card.value}</div>
              <p className="text-xs text-white/70">Live data overview</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Recent Activity Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="lg:col-span-1 shadow-sm border">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              onClick={() => router.push("/admin/inventory/add")}
              className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
            >
              Add New Product
            </button>
            <button
              onClick={() => router.push("/admin/orders")}
              className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
            >
              Manage Orders
            </button>
            <button
              onClick={() => router.push("/admin/users")}
              className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
            >
              View All Users
            </button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2 shadow-sm border">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              <ul className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <li key={order._id} className="flex items-center gap-4">
                    <div className="p-2 bg-green-100 rounded-full">
                      <ShoppingCart className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-sm">
                      New order by{" "}
                      <span className="font-bold">{order.userId.name}</span> for
                      a total of{" "}
                      <span className="font-bold">
                        {formatCurrency(order.totalAmount)}
                      </span>
                      .
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-center text-gray-500 py-4">
                No recent orders found.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
