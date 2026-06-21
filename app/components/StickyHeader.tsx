"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Show, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";

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
            <Image src="/brand/Logo.png" alt="" fill sizes="32px" className="object-contain" />
          </div>
          <span className="font-serif font-semibold text-navy text-lg leading-none">
            LearnCuriosity
          </span>
        </Link>

        {/* Desktop nav */}
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
          <Show when="signed-in">
            <Link href="/dashboard" className="text-sm font-body text-navy/70 hover:text-navy transition-colors">
              Dashboard
            </Link>
            <UserButton />
          </Show>
          <Show when="signed-out">
            <SignInButton mode="redirect">
              <button className="text-sm font-body text-navy/70 hover:text-navy transition-colors bg-transparent border-none cursor-pointer">
                Log In
              </button>
            </SignInButton>
            <SignUpButton mode="redirect">
              <button className="px-5 py-2 rounded-full bg-teal text-cream text-sm font-semibold hover:bg-teal/90 transition-colors border-none cursor-pointer">
                Start Free Trial
              </button>
            </SignUpButton>
          </Show>
        </nav>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-3">
          <Show when="signed-in">
            <UserButton />
          </Show>
          <Show when="signed-out">
            <SignInButton mode="redirect">
              <button className="text-sm font-body text-navy/70 hover:text-navy transition-colors bg-transparent border-none cursor-pointer">
                Log In
              </button>
            </SignInButton>
            <SignUpButton mode="redirect">
              <button className="px-4 py-2 rounded-full bg-teal text-cream text-sm font-semibold border-none cursor-pointer">
                Sign Up
              </button>
            </SignUpButton>
          </Show>
        </div>
      </div>
    </header>
  );
}
