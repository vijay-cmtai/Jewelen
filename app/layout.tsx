import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";

import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AppProvider } from "@/app/context/AppContext"; 

export const metadata: Metadata = {
  title: "Jewelen", 
  description: "Exquisite Jewelry for Every Occasion",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} scroll-smooth`}
      >
        <AppProvider>
          {" "}
          {/* <-- Step 2: Wrap your entire application content */}
          <Suspense fallback={<div>Loading...</div>}>
            <SiteHeader />
            <main>{children}</main>{" "}
            {/* It's good practice to wrap children in a <main> tag */}
            <SiteFooter />
          </Suspense>
        </AppProvider>
        <Analytics />
      </body>
    </html>
  );
}
