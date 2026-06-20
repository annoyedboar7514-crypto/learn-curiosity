import { clerkMiddleware } from "@clerk/nextjs/server";

// Clerk handles session hydration for all routes.
// Individual pages/API routes guard access via getChildProfile() / auth().
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
