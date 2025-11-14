import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
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

  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isSupplierRoute = pathname.startsWith("/supplier");
  const isUserProtectedRoute = ["/profile", "/my-orders", "/checkout"].some(
    (path) => pathname.startsWith(path)
  );

  const isProtectedRoute =
    isAdminRoute || isSupplierRoute || isUserProtectedRoute;

  if (!userRole) {
    if (isProtectedRoute) {
      const signInUrl = new URL("/signin", request.url);
      signInUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signInUrl);
    }
  } else {
    if (pathname.startsWith("/signin") || pathname.startsWith("/signup")) {
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
  matcher: [
    "/admin/:path*",
    "/supplier/:path*",
    "/profile/:path*",
    "/my-orders/:path*",
    "/checkout/:path*",
    "/signin",
    "/signup",
    "/accoount/:path*"
  ],
};
