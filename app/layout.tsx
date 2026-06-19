import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Learn Curiosity",
  description: "A daily mentorship platform for curious kids in grades K–6.",
};

// ClerkProvider is only rendered when a real publishable key is configured.
// This lets the app run locally without Clerk keys set up.
const CLERK_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const CLERK_ENABLED = /^pk_(test|live)_/.test(CLERK_KEY) && CLERK_KEY.length > 40;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const inner = (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );

  return CLERK_ENABLED ? <ClerkProvider>{inner}</ClerkProvider> : inner;
}
