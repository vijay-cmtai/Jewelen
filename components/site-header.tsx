"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchJewelry } from "@/lib/features/jewelry/jewelrySlice";
import { useDebounce } from "@/hooks/useDebounce"; // Naya hook import karein
import { cn, generateSlug } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Gift, Search, ShoppingCart, Loader2 } from "lucide-react";

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
  const debouncedQuery = useDebounce(q, 300);
  const searchRef = useRef<HTMLDivElement>(null);

  const { items: cartItems } = useSelector((state: RootState) => state.cart);
  const { itemIds: wishlistItems } = useSelector(
    (state: RootState) => state.wishlist
  );
  const { items: searchResults, listStatus } = useSelector(
    (state: RootState) => state.jewelry
  );

  const totalCartItems = cartItems.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  // Live search ke liye API call
  useEffect(() => {
    if (debouncedQuery) {
      dispatch(fetchJewelry({ search: debouncedQuery }));
    }
  }, [debouncedQuery, dispatch]);

  // Search dropdown ko bahar click karne par band karne ka logic
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Iski ab zaroorat nahi hai
  // function onSearch(e: React.FormEvent) { /* ... */ }

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

          {/* --- SEARCH BAR AUR RESULTS DROPDOWN --- */}
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
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-2xl border max-h-[60vh] overflow-y-auto">
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
          {/* ------------------------------------ */}

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
          </nav>
        </div>
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
