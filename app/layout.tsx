import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces, IBM_Plex_Mono, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], weight: ["600"] });
const ibmPlexMono = IBM_Plex_Mono({ variable: "--font-ibm-mono", subsets: ["latin"], weight: ["400", "600"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Learn Curiosity",
  description: "A daily mentor for curious kids — built on questions, never on screens that just entertain.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${ibmPlexMono.variable} ${inter.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  );
}
