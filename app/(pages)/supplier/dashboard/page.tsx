"use client";
import Link from "next/link";
import Image from "next/image";
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
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
const dummyDashboardData = {
  stats: {
    totalRevenue: { value: "₹4,25,999", change: "+15.2%" },
    newOrders: { value: "182", change: "+35" },
    productsInStock: { value: "540", change: "+12" },
    newCustomers: { value: "45", change: "+8" },
  },
  salesOverview: [
    { month: "Jan", revenue: 40000 },
    { month: "Feb", revenue: 30000 },
    { month: "Mar", revenue: 50000 },
    { month: "Apr", revenue: 45000 },
    { month: "May", revenue: 60000 },
    { month: "Jun", revenue: 75000 },
  ],
  bestSellers: [
    {
      name: "Classic Gold Bangle",
      sales: 120,
      image:
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=48&h=48&fit=crop",
    },
    {
      name: "Silver Charm Bracelet",
      sales: 95,
      image:
        "https://images.unsplash.com/photo-1631931413024-38ed4a4c372b?w=48&h=48&fit=crop",
    },
    {
      name: "Diamond Tennis Bracelet",
      sales: 60,
      image:
        "https://images.unsplash.com/photo-1620921282050-a54056c38090?w=48&h=48&fit=crop",
    },
  ],
  recentOrders: [
    {
      id: "#ORD-001",
      customer: "Elena Gilbert",
      status: "completed",
      amount: 45999,
    },
    {
      id: "#ORD-002",
      customer: "Caroline Forbes",
      status: "pending",
      amount: 3498,
    },
    {
      id: "#ORD-003",
      customer: "Bonnie Bennett",
      status: "completed",
      amount: 999,
    },
  ],
};
// --- END OF DUMMY DATA ---
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
  change: string;
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
      <div className="flex items-center gap-1 text-xs mt-1 text-green-300">
        <ArrowUpRight className="h-3 w-3" />
        <span>{change}</span>
      </div>
    </CardContent>
  </Card>
);
export default function SupplierDashboardPage() {
  const { stats, salesOverview, bestSellers, recentOrders } =
    dummyDashboardData;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, Damon!</h1>
        <p className="text-gray-500">
          Here's a snapshot of your store's performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={stats.totalRevenue.value}
          icon={DollarSign}
          change={stats.totalRevenue.change}
          colorClass="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <StatCard
          title="New Orders"
          value={stats.newOrders.value}
          icon={ShoppingCart}
          change={stats.newOrders.change}
          colorClass="bg-gradient-to-r from-violet-500 to-purple-600"
        />
        <StatCard
          title="Products in Stock"
          value={stats.productsInStock.value}
          icon={Package}
          change={stats.productsInStock.change}
          colorClass="bg-gradient-to-r from-emerald-500 to-green-600"
        />
        <StatCard
          title="New Customers"
          value={stats.newCustomers.value}
          icon={Users}
          change={stats.newCustomers.change}
          colorClass="bg-gradient-to-r from-amber-500 to-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>
              Your revenue performance over the last 6 months.
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
                />
                <Bar dataKey="revenue" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardHeader>
            <CardTitle>Best Sellers</CardTitle>
            <CardDescription>
              Your top-performing products this month.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {bestSellers.map((product) => (
              <div key={product.name} className="flex items-center gap-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="rounded-md border bg-gray-50 object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.sales} sales</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>A list of your most recent orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(order.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button asChild variant="outline">
            <Link href="/supplier/orders">View All Orders</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
