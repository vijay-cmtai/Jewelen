// File: middleware.ts (पूरा कोड)

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const publicPages = [
    "/signin",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ];
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get("userInfo");
  const userInfoToken = cookie?.value;

  let userRole: string | undefined;
  if (userInfoToken) {
    try {
      const userInfo = JSON.parse(userInfoToken);
      userRole = userInfo?.role;
    } catch (e) {
      const response = NextResponse.redirect(new URL("/signin", request.url));
      response.cookies.delete("userInfo");
      return response;
    }
  }

  const isPublicPage = publicPages.some((page) => pathname.startsWith(page));
  const isAdminRoute = pathname.startsWith("/admin");
  const isSupplierRoute = pathname.startsWith("/supplier");

  if (!userRole) {
    if (!isPublicPage) {
      const signInUrl = new URL("/signin", request.url);
      signInUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signInUrl);
    }
  } else {
    if (isPublicPage) {
      if (userRole === "Admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      if (userRole === "Supplier") {
        return NextResponse.redirect(
          new URL("/supplier/dashboard", request.url)
        );
      }
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (isAdminRoute && userRole !== "Admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (isSupplierRoute && userRole !== "Supplier") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
