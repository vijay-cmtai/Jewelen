"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchSupplierDashboard } from "@/lib/features/supplier/supplierSlice"; // <-- Naya thunk import karein
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  Package,
  ShoppingCart,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// StatCard Component (UI Helper - No Change)
const StatCard = ({
  title,
  value,
  icon: Icon,
  change,
  colorClass,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  change?: string;
  colorClass: string;
}) => (
  <Card
    className={`text-white overflow-hidden relative group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${colorClass}`}
  >
    <div className="absolute inset-0 bg-black/15 group-hover:bg-black/20 transition-colors" />
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
      <CardTitle className="text-sm font-medium uppercase tracking-wider text-white/90">
        {title}
      </CardTitle>
      <Icon className="h-6 w-6 text-white/80" />
    </CardHeader>
    <CardContent className="relative z-10">
      <div className="text-3xl font-bold">{value}</div>
      {change && (
        <div className="flex items-center gap-1 text-xs mt-1 text-green-300">
          <ArrowUpRight className="h-3 w-3" />
          <span>{change}</span>
        </div>
      )}
    </CardContent>
  </Card>
);

// Main Dashboard Component
export default function SupplierDashboardPage() {
  const dispatch = useDispatch<AppDispatch>();

  // Redux store se data select karein
  const { dashboard, status, error } = useSelector(
    (state: RootState) => state.supplier
  );
  const { userInfo } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Component mount hone par data fetch karne ke liye thunk dispatch karein
    dispatch(fetchSupplierDashboard());
  }, [dispatch]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);

  // Loading state handle karein
  if (status === "loading") {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Error state handle karein
  if (status === "failed" || !dashboard) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold">Could Not Load Dashboard</h2>
        <p className="text-muted-foreground">
          {error || "Please try again later."}
        </p>
      </div>
    );
  }

  const {
    totalRevenue,
    newOrdersCount,
    productsInStock,
    salesOverview,
    bestSellers,
    recentOrders,
  } = dashboard;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome, {userInfo?.name}!
        </h1>
        <p className="text-gray-500">
          Here's a snapshot of your store's performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          colorClass="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <StatCard
          title="New Orders (This Month)"
          value={newOrdersCount.toString()}
          icon={ShoppingCart}
          colorClass="bg-gradient-to-r from-violet-500 to-purple-600"
        />
        <StatCard
          title="Products in Stock"
          value={productsInStock.toString()}
          icon={Package}
          colorClass="bg-gradient-to-r from-emerald-500 to-green-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>
              Your revenue performance over the last months.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesOverview}>
                <XAxis
                  dataKey="month"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <Tooltip
                  cursor={{ fill: "#fafafa" }}
                  contentStyle={{
                    borderRadius: "0.5rem",
                    borderColor: "#e2e8f0",
                  }}
                  formatter={(value) => formatCurrency(value as number)}
                />
                <Bar dataKey="revenue" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardHeader>
            <CardTitle>Best Sellers</CardTitle>
            <CardDescription>Your top-performing products.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {bestSellers.length > 0 ? (
              bestSellers.map((product: any) => (
                <div key={product.name} className="flex items-center gap-4">
                  <Image
                    src={product.image || "/placeholder-jewelry.jpg"}
                    alt={product.name}
                    width={48}
                    height={48}
                    className="rounded-md border bg-gray-50 object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-gray-500">
                      {product.sales} sales
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center pt-8">
                No sales data available to determine best sellers.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>
            A list of your most recent sales from orders.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Your Cut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order: any) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">
                      #{order._id.slice(-6).toUpperCase()}
                    </TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(order.amount)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center h-24 text-muted-foreground"
                  >
                    No recent orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button asChild variant="outline">
            <Link href="/supplier/orders">View All Sales</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
