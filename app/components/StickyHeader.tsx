"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function StickyHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.85);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#FBF6EC] border-b border-[#f0e8d8]"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo + wordmark */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="relative w-8 h-6">
            <Image
              src="/brand/Logo.png"
              alt=""
              fill
              sizes="32px"
              className="object-contain"
            />
          </div>
          <span className="font-serif font-semibold text-navy text-lg leading-none">
            LearnCuriosity
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#how-it-works" className="text-sm font-body text-navy/70 hover:text-navy transition-colors">
            How It Works
          </Link>
          <Link href="/#safety" className="text-sm font-body text-navy/70 hover:text-navy transition-colors">
            Safety
          </Link>
          <Link href="/#pricing" className="text-sm font-body text-navy/70 hover:text-navy transition-colors">
            Pricing
          </Link>
          <Link href="/dashboard" className="text-sm font-body text-navy/70 hover:text-navy transition-colors">
            Dashboard
          </Link>
          <Link href="/login" className="text-sm font-body text-navy/70 hover:text-navy transition-colors">
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2 rounded-full bg-teal text-cream text-sm font-semibold hover:bg-teal/90 transition-colors"
          >
            Start Free Trial
          </Link>
        </nav>

        {/* Mobile CTA */}
        <Link
          href="/signup"
          className="md:hidden px-4 py-2 rounded-full bg-teal text-cream text-sm font-semibold"
        >
          Start Free Trial
        </Link>
      </div>
    </header>
  );
}
