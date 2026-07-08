import Image from "next/image";
import Link from "next/link";

const columns = [
  {
    heading: "Product",
    links: [
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Mentors", href: "/#mentors" },
      { label: "Pillars", href: "/#pillars" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
  {
    heading: "Trust",
    links: [
      { label: "Safety", href: "/safety" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "COPPA Statement", href: "/privacy#coppa" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "mailto:hello@learncuriosity.com" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="bg-charcoal text-cream">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10">
        {/* Brand + mission */}
        <div>
          <Link href="/" className="flex items-center gap-3 mb-4">
            <div className="relative w-8 h-6">
              <Image src="/brand/Logo.png" alt="LearnCuriosity logo" fill sizes="32px" className="object-contain" />
            </div>
            <span className="font-serif font-semibold text-cream text-lg leading-none">
              LearnCuriosity
            </span>
          </Link>
          <p className="font-body text-sm text-cream/60 leading-relaxed max-w-[280px]">
            A daily voice mentor that teaches children how to think — never what to think.
          </p>
        </div>

        {columns.map((col) => (
          <nav key={col.heading} aria-label={col.heading}>
            <p className="font-mono-brand text-xs uppercase tracking-[0.05em] text-gold mb-4">
              {col.heading}
            </p>
            <ul className="flex flex-col gap-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-cream/70 hover:text-cream transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-cream/10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <p className="font-body text-xs text-cream/40">
            © {new Date().getFullYear()} LearnCuriosity. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
