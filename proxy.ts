import { NextRequest, NextResponse } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";

const CLERK_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const CLERK_ACTIVE = /^pk_(test|live)_/.test(CLERK_KEY) && CLERK_KEY.length > 40;
const clerkHandler = CLERK_ACTIVE ? clerkMiddleware() : null;

export default function proxy(req: NextRequest) {
  if (clerkHandler) return (clerkHandler as (req: NextRequest) => Response)(req);
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/__clerk/:path*",
    "/(api|trpc)(.*)",
  ],
};
