"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react"; // signOut client-side hi rehta hai
import { type Session } from "next-auth"; // Session ka type import karein
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Users,
  ListOrdered,
  LogOut,
  ShieldCheck,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

// Admin navigation links
const adminNavLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/inventory", label: "Inventory", icon: Package },
  { href: "/admin/addInventory", label: "Add Inventory", icon: Package},
  { href: "/admin/orders", label: "Orders", icon: ListOrdered },
  {href:"/admin/seller",label:"Seller",icon:ListOrdered},
];

// Props mein session ka type define karein
export default function AdminClientLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Reusable Sidebar Content
  const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b">
        <div className="p-2 rounded-lg bg-orange-500/10">
          <ShieldCheck className="h-6 w-6 text-orange-500" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Admin Panel</h2>
          {/* Ab 'status' ki jagah seedha 'session' check karein */}
          {session ? (
            <p className="text-xs text-gray-500 truncate">
              {session.user?.email || "Admin"}
            </p>
          ) : (
            <Skeleton className="h-4 w-32 mt-1" />
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 -mx-3">
        <nav className="flex flex-col space-y-1 px-3">
          {adminNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === "/admin"
                ? pathname === link.href
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onLinkClick}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all hover:bg-gray-100",
                  isActive
                    ? "bg-orange-500 text-white font-semibold shadow-sm"
                    : "text-gray-600"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="mt-auto pt-6 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
          onClick={() => {
            signOut({ callbackUrl: "/" });
            onLinkClick?.();
          }}
          disabled={!session} // Jab tak session load na ho, disable rakhein
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="sticky top-0 z-40 md:hidden bg-white/80 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-orange-500" />
            <span className="font-bold text-lg">Admin</span>
          </div>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-6">
              <SidebarContent onLinkClick={() => setIsMobileMenuOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="md:grid md:grid-cols-[280px_1fr] lg:grid-cols-[300px_1fr]">
        <aside className="hidden md:block p-8">
          <div className="sticky top-8 bg-white rounded-lg shadow-sm p-6 border h-[calc(100vh-4rem)]">
            <SidebarContent />
          </div>
        </aside>

        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
