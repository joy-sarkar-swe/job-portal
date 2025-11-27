import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AUTH_PAGES = ["/login", "/register"];

const ROLE_ROUTES: Record<string, string[]> = {
  admin: ["/admin"],
  jobseeker: ["/jobseeker"],
  employer: ["/employer"],
};

interface JWTPayload {
  sub: string;
  email: string;
  role: "jobseeker" | "employer" | "admin";
  isEmployerApproved?: boolean;
  isBlocked?: boolean;
  iat: number;
  exp: number;
}

// Simple JWT decode (without verification)
function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = Buffer.from(payload, "base64").toString("utf-8");
    return JSON.parse(decoded) as JWTPayload;
  } catch (err) {
    console.error("JWT decode error:", err);
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("accessToken")?.value;

  let user: JWTPayload | null = null;

  if (token) {
    user = decodeJWT(token);

    // Check if token is expired
    if (user?.exp && Date.now() >= user.exp * 1000) {
      user = null;
      // Clear expired cookie
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("accessToken");
      return response;
    }
  }

  const isAuthPage = AUTH_PAGES.includes(pathname);

  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const protectedPrefixes = ["/admin", "/jobseeker", "/employer"];
  const requiresAuth = protectedPrefixes.some((p) => pathname.startsWith(p));

  if (!user && requiresAuth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (user && user.role) {
    const role = user.role;
    const allowedPrefixes = ROLE_ROUTES[role] || [];
    const isAllowed = allowedPrefixes.some((p: string) =>
      pathname.startsWith(p)
    );

    if (!isAllowed && requiresAuth) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api/auth|favicon.ico|.*\\.[^/]+$).*)"],
};
