"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Show, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { navLinks } from "@/lib/content/homepage";

// Sticky marketing nav: transparent over the hero, cream + shadow after scroll.
// Mobile: hamburger → full-screen overlay menu.
export default function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the overlay menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-cream shadow-[0_1px_3px_rgba(35,49,55,0.08)] border-b border-cream-border"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo + wordmark */}
        <Link href="/" className="flex items-center gap-3 shrink-0" onClick={() => setMenuOpen(false)}>
          <div className="relative w-8 h-6">
            <Image src="/brand/Logo.png" alt="LearnCuriosity logo" fill sizes="32px" className="object-contain" />
          </div>
          <span className="font-serif font-semibold text-charcoal text-lg leading-none">
            LearnCuriosity
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main" className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-body text-charcoal/70 hover:text-charcoal transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Show when="signed-in">
            <Link href="/dashboard" className="text-sm font-body text-charcoal/70 hover:text-charcoal transition-colors">
              Dashboard
            </Link>
            <UserButton />
          </Show>
          <Show when="signed-out">
            <SignInButton mode="redirect">
              <button className="text-sm font-body text-charcoal/70 hover:text-charcoal transition-colors bg-transparent border-none cursor-pointer">
                Log In
              </button>
            </SignInButton>
            <SignUpButton mode="redirect">
              <button className="px-5 py-2.5 rounded-md bg-gold text-[#412402] text-sm font-semibold hover:brightness-95 transition-all border-none cursor-pointer">
                Start Free Trial
              </button>
            </SignUpButton>
          </Show>
        </nav>

        {/* Mobile: hamburger */}
        <button
          type="button"
          className="lg:hidden flex flex-col justify-center items-center w-11 h-11 gap-1.5 bg-transparent border-none cursor-pointer"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={`block w-6 h-0.5 bg-charcoal transition-transform duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-charcoal transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-charcoal transition-transform duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile full-screen overlay menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden fixed inset-0 top-16 bg-cream z-40 flex flex-col px-8 pt-10 pb-8 overflow-y-auto"
        >
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-serif text-3xl text-charcoal py-3 border-b border-cream-border"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-10 flex flex-col gap-4">
            <Show when="signed-out">
              <SignUpButton mode="redirect">
                <button className="w-full py-4 rounded-md bg-gold text-[#412402] text-base font-semibold border-none cursor-pointer">
                  Start Free Trial
                </button>
              </SignUpButton>
              <SignInButton mode="redirect">
                <button className="w-full py-4 rounded-md bg-transparent border-[1.5px] border-teal text-teal text-base font-medium cursor-pointer">
                  Log In
                </button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="w-full py-4 rounded-md bg-teal text-cream text-base font-semibold text-center"
              >
                Go to Dashboard
              </Link>
            </Show>
          </div>
        </div>
      )}
    </header>
  );
}
