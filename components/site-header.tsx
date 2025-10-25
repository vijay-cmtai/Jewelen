"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchJewelry } from "@/lib/features/jewelry/jewelrySlice";
import { logout } from "@/lib/features/users/userSlice";
import { useDebounce } from "@/hooks/useDebounce";
import { cn, generateSlug } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Heart,
  Gift,
  Search,
  ShoppingCart,
  Loader2,
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";

type QuickLink = {
  label: string;
  href: string;
  icon?: React.ElementType;
};

const quickLinks: QuickLink[] = [
  { label: "Gifts", href: "/gifts", icon: Gift },
  { label: "New Arrivals", href: "/new" },
  { label: "Rings", href: "/rings" },
  { label: "Necklaces", href: "/necklaces" },
  { label: "Earrings", href: "/earrings" },
  { label: "Bracelets", href: "/bracelets" },
];

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();

  const [q, setQ] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const debouncedQuery = useDebounce(q, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const { items: cartItems } = useSelector((state: RootState) => state.cart);
  const { itemIds: wishlistItems } = useSelector(
    (state: RootState) => state.wishlist
  );
  const { items: searchResults, listStatus } = useSelector(
    (state: RootState) => state.jewelry
  );
  const { userInfo } = useSelector((state: RootState) => state.user);

  const totalCartItems = cartItems.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  // Live search API call
  useEffect(() => {
    if (debouncedQuery) {
      dispatch(fetchJewelry({ search: debouncedQuery }));
    }
  }, [debouncedQuery, dispatch]);

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsProfileOpen(false);
    router.push("/");
  };

  const getDashboardRoute = () => {
    if (!userInfo) return "/dashboard";

    switch (userInfo.role) {
      case "Admin":
        return "/admin/dashboard";
      default:
        return "/account/dashboard";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="mx-auto max-w-[96rem] px-6">
        <div className="flex items-center gap-4 py-3">
          <Link
            href="/"
            className="text-3xl text-orange-500 hover:text-orange-600"
          >
            Jewelen
          </Link>

          {/* Search Bar */}
          <div ref={searchRef} className="relative ml-4 flex-1">
            <form className="flex items-center rounded-full border border-gray-300 bg-white overflow-hidden focus-within:border-black focus-within:ring-2 focus-within:ring-orange-300">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onFocus={() => setIsFocused(true)}
                placeholder="Search for anything"
                className="h-12 border-0 focus-visible:ring-0 px-4 flex-1"
              />
              <Button
                type="submit"
                size="icon"
                className="rounded-full h-10 w-10 bg-orange-500 m-1"
              >
                <Search className="h-5 w-5 text-white" />
              </Button>
            </form>

            {/* Search Results Dropdown */}
            {isFocused && q && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-2xl border max-h-[60vh] overflow-y-auto z-50">
                {listStatus === "loading" && (
                  <div className="p-4 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                  </div>
                )}
                {listStatus === "succeeded" && searchResults.length === 0 && (
                  <p className="p-4 text-center text-gray-500">
                    No results found for "{q}"
                  </p>
                )}
                {listStatus === "succeeded" && searchResults.length > 0 && (
                  <ul className="divide-y">
                    {searchResults.slice(0, 10).map((product) => (
                      <li key={product._id}>
                        <Link
                          href={`/product/${generateSlug(product.name, product._id)}`}
                          className="flex items-center gap-4 p-3 hover:bg-gray-50"
                          onClick={() => {
                            setIsFocused(false);
                            setQ("");
                          }}
                        >
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="rounded-md object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-sm text-gray-800">
                              {product.name}
                            </p>
                            <p className="text-sm font-bold text-gray-900">
                              ₹{product.price.toLocaleString()}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                    {searchResults.length > 10 && (
                      <li className="p-3 text-center">
                        <Link
                          href={`/search?q=${q}`}
                          className="text-sm font-semibold text-orange-600 hover:underline"
                        >
                          View all {searchResults.length} results
                        </Link>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Navigation Icons */}
          <nav className="ml-auto flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative"
              asChild
            >
              <Link href="/favorites">
                <Heart className="h-6 w-6" />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative"
              asChild
            >
              <Link href="/cart">
                <ShoppingCart className="h-6 w-6" />
                {totalCartItems > 0 && (
                  <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                    {totalCartItems}
                  </span>
                )}
              </Link>
            </Button>

            {/* User Profile or Sign In/Register */}
            {userInfo ? (
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition"
                >
                  <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
                    {userInfo.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">
                    {userInfo.name}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      isProfileOpen && "rotate-180"
                    )}
                  />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-2xl border py-2 z-50">
                    <div className="px-4 py-3 border-b">
                      <p className="font-semibold text-gray-900">
                        {userInfo.name}
                      </p>
                      <p className="text-sm text-gray-500">{userInfo.email}</p>
                      <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-700">
                        {userInfo.role}
                      </span>
                    </div>

                    <Link
                      href={getDashboardRoute()}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <LayoutDashboard className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium">Dashboard</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition text-red-600 border-t"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="hidden sm:inline-flex"
                  onClick={() => router.push("/signin")}
                >
                  Sign In
                </Button>
                <Button
                  className="hidden sm:inline-flex bg-orange-500 text-white"
                  onClick={() => router.push("/signup")}
                >
                  Register
                </Button>
              </>
            )}
          </nav>
        </div>

        {/* Quick Links */}
        <div className="hidden md:flex items-center justify-center gap-7 pb-3 pt-2">
          {quickLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-gray-700 hover:text-black font-medium flex items-center gap-1.5 text-sm",
                pathname === l.href && "text-black underline"
              )}
            >
              {l.icon && <l.icon className="h-5 w-5" />}
              <span>{l.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
