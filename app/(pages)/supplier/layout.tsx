"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ListOrdered,
  Building,
  LogOut,
  Menu,
  ShieldCheck,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/store";
import { logout } from "@/lib/features/users/userSlice";

const getInitials = (name: string = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "S";

const supplierNavLinks = [
  { href: "/supplier", label: "Dashboard", icon: LayoutDashboard },
  {href: "/supplier/addInventory", label: "AddProducts", icon: Package },
  { href: "/supplier/inventory", label: "Inventory", icon: Package },
  { href: "/supplier/orders", label: "Orders", icon: ListOrdered },
  { href: "/supplier/profile", label: "My Profile", icon: Building },
  { href: "/supplier/notifications", label: "Notifications", icon: Bell },
];

export default function SupplierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { userInfo } = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/signin");
  };

  const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 border-b">
        <div className="p-2 rounded-lg bg-orange-500/10">
          <ShieldCheck className="h-6 w-6 text-orange-500" />
        </div>
        <h2 className="text-lg font-bold">Supplier Portal</h2>
      </div>

      <ScrollArea className="flex-1 mt-4">
        <nav className="flex flex-col space-y-1 px-4">
          {supplierNavLinks.map((link) => {
            const isActive =
              link.href === "/supplier"
                ? pathname === link.href
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onLinkClick}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="mt-auto p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gray-50 md:grid md:grid-cols-[260px_1fr]">
      <aside className="hidden md:block border-r bg-white h-screen sticky top-0">
        <SidebarContent />
      </aside>

      <div className="flex flex-col">
        <header className="flex h-16 items-center justify-between gap-4 border-b bg-white px-6 sticky top-0 z-30 md:justify-end">
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SidebarContent
                  onLinkClick={() => setIsMobileMenuOpen(false)}
                />
              </SheetContent>
            </Sheet>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10 border">
                  <AvatarImage
                    src={userInfo?.profilePicture?.url}
                    alt={userInfo?.name}
                  />
                  <AvatarFallback>{getInitials(userInfo?.name)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {userInfo?.name || "Guest User"}
                  </p>
                  <p className="text-xs leading-none text-gray-500">
                    {userInfo?.email || ""}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/supplier/profile">
                  <Building className="mr-2 h-4 w-4" /> My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:bg-red-50 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
