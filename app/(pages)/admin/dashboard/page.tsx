"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  ArrowUpRight,
  Sparkles,
  Activity,
} from "lucide-react";

// Simple Stats Data (Static)
const statsCards = [
  {
    title: "Total Revenue",
    value: "₹1,24,52,310",
    change: "+20.1%",
    icon: DollarSign,
    color: "from-blue-500 to-blue-700",
  },
  {
    title: "Total Orders",
    value: "5,421",
    change: "+18.1%",
    icon: ShoppingCart,
    color: "from-green-500 to-emerald-700",
  },
  {
    title: "Active Buyers",
    value: "1,254",
    change: "+32",
    icon: Users,
    color: "from-purple-500 to-violet-700",
  },
  {
    title: "Active Suppliers",
    value: "82",
    change: "+5",
    icon: Package,
    color: "from-orange-500 to-red-600",
  },
];

export default function AdminDashboardPage() {
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
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20">
                  <ArrowUpRight className="h-3 w-3 text-white" />
                  <span className="text-xs font-bold text-white">
                    {card.change}
                  </span>
                </div>
                <span className="text-xs text-white/70">from last month</span>
              </div>
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
            <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
              Add New Product
            </button>
            <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
              Manage Orders
            </button>
            <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
              View All Users
            </button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2 shadow-sm border">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-full">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-sm">
                  New order <span className="font-bold">#ORD-12345</span> was
                  placed by a customer.
                </p>
                <span className="ml-auto text-xs text-gray-500">2 min ago</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-sm">
                  A new user <span className="font-bold">'John Doe'</span>{" "}
                  registered.
                </p>
                <span className="ml-auto text-xs text-gray-500">
                  1 hour ago
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Package className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-sm">
                  Supplier <span className="font-bold">'Gemstones Inc.'</span>{" "}
                  updated their inventory.
                </p>
                <span className="ml-auto text-xs text-gray-500">
                  3 hours ago
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
