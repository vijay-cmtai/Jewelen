// app/layout.tsx

import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Suspense } from "react";
import { AppProvider } from "./context/AppContext";
import StoreProvider from "@/lib/StoreProvider";

export const metadata: Metadata = {
  title: "Jewelen",
  description: "Jwelen website",
  generator: "CMT AI",
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
        <StoreProvider>
          <AppProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <SiteHeader />
              {children}
              <SiteFooter />
            </Suspense>
          </AppProvider>
        </StoreProvider>
        <Analytics />
      </body>
    </html>
  );
}
