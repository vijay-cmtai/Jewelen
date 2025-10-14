"use client";

import type React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Gift, Search, Menu, ShoppingCart } from "lucide-react";
// Corrected Import Path
import { useAppContext } from "@/app/context/AppContext";

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
  const [q, setQ] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const { cartItems, wishlistItems } = useAppContext();
  const totalCartItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  function handleSignIn() {
    router.push("/signin");
  }

  function handleRegister() {
    router.push("/signup");
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200">
      <div className="mx-auto max-w-[96rem] px-6">
        <div className="flex items-center gap-4 py-3">
          <Link
            href="/"
            className="text-3xl text-orange-500 hover:text-orange-600 transition-colors"
            aria-label="Jewelen Home"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
          >
            Jewelen
          </Link>

          <form
            onSubmit={onSearch}
            className="ml-4 flex flex-1 items-center rounded-full border border-gray-300 bg-white overflow-hidden hover:border-black focus-within:border-black focus-within:ring-2 focus-within:ring-orange-300 transition-colors"
            role="search"
          >
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for anything"
              className="h-12 border-0 focus-visible:ring-0 px-4 flex-1 bg-transparent text-base"
              aria-label="Search"
            />
            <Button
              type="submit"
              size="icon"
              className="rounded-full h-10 w-10 bg-orange-500 hover:bg-orange-600 m-1"
              aria-label="Search button"
            >
              <Search className="h-5 w-5 text-white" />
            </Button>
          </form>

          <nav className="ml-auto flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-100 h-10 w-10 relative"
              asChild
            >
              <Link href="/favorites" aria-label="Favorites">
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
              className="rounded-full hover:bg-gray-100 h-10 w-10 relative"
              asChild
            >
              <Link href="/cart" aria-label="Shopping cart">
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
              className="hidden sm:inline-flex text-gray-700 border-gray-300 hover:bg-gray-50"
              onClick={handleSignIn}
            >
              Sign In
            </Button>

            <Button
              className="hidden sm:inline-flex bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleRegister}
            >
              Register
            </Button>
          </nav>
        </div>

        <div className="hidden md:flex items-center justify-center gap-7 pb-3 pt-2">
          {quickLinks.map((l) => {
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "text-gray-700 hover:text-black transition-colors font-medium flex items-center gap-1.5 text-sm",
                  pathname === l.href &&
                    "text-black underline decoration-2 underline-offset-8"
                )}
              >
                {Icon && <Icon className="h-5 w-5" />}
                <span>{l.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
