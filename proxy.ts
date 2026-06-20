import { NextRequest, NextResponse } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";

// Clerk is only activated when a real publishable key is present.
// With placeholder or missing keys, every request passes through normally.
const CLERK_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const CLERK_ENABLED = /^pk_(test|live)_/.test(CLERK_KEY) && CLERK_KEY.length > 40;
const clerkHandler = CLERK_ENABLED ? clerkMiddleware() : null;

export default function proxy(req: NextRequest) {
  if (clerkHandler) {
    return (clerkHandler as (req: NextRequest) => Response)(req);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
