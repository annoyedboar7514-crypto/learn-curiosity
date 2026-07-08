"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  pricingTiers,
  pricingReassurance,
  billingDiscounts,
  billingLabels,
  type BillingPeriod,
} from "@/lib/content/homepage";

const PERIODS: BillingPeriod[] = ["monthly", "quarterly", "annual"];

// Three tier cards with a Monthly / 3-Month (−10%) / Annual (−20%) toggle.
// Prices tick to their new value with a short number-transition animation.
export default function PricingSection() {
  const [period, setPeriod] = useState<BillingPeriod>("monthly");

  return (
    <div>
      {/* Billing period toggle */}
      <div
        role="radiogroup"
        aria-label="Billing period"
        className="flex justify-center mb-12"
      >
        <div className="inline-flex bg-white rounded-full border border-cream-border p-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              role="radio"
              aria-checked={period === p}
              onClick={() => setPeriod(p)}
              className={[
                "px-5 py-2.5 rounded-full font-body text-sm font-medium transition-colors cursor-pointer border-none",
                period === p
                  ? "bg-teal text-cream"
                  : "bg-transparent text-charcoal/70 hover:text-charcoal",
              ].join(" ")}
            >
              {billingLabels[p]}
              {billingDiscounts[p] > 0 && (
                <span className={period === p ? "text-gold ml-1.5" : "text-teal ml-1.5"}>
                  −{billingDiscounts[p] * 100}%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tier cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-5xl mx-auto">
        {pricingTiers.map((tier) => {
          const price = tier.monthly * (1 - billingDiscounts[period]);
          return (
            <div
              key={tier.id}
              className={[
                "relative flex flex-col bg-white rounded-lg p-8",
                tier.highlighted
                  ? "border-2 border-gold shadow-[0_4px_12px_rgba(35,49,55,0.10)]"
                  : "border-[0.5px] border-cream-border",
              ].join(" ")}
            >
              {tier.highlighted && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold text-[#412402] font-body font-semibold text-xs px-4 py-1.5 rounded-full whitespace-nowrap">
                  Most popular
                </span>
              )}

              <h3 className="font-serif text-charcoal text-2xl mb-1">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <AnimatedPrice value={price} />
                <span className="font-body text-sm text-charcoal/60">/month</span>
              </div>
              <p className="font-body text-xs text-charcoal/50 mb-6 min-h-[16px]">
                {period === "monthly"
                  ? "billed monthly"
                  : period === "quarterly"
                  ? `billed $${(price * 3).toFixed(2).replace(/\.00$/, "")} every 3 months`
                  : `billed $${(price * 12).toFixed(2).replace(/\.00$/, "")} once a year`}
              </p>

              <ul className="flex flex-col gap-3 mb-8">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-2.5 font-body text-sm text-charcoal/80 leading-relaxed">
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="#1B6E6B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      className="shrink-0 mt-0.5" aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className={[
                  "mt-auto block text-center py-3.5 rounded-md font-body font-semibold text-sm transition-all",
                  tier.highlighted
                    ? "bg-gold text-[#412402] hover:brightness-95"
                    : "bg-teal text-cream hover:brightness-110",
                ].join(" ")}
              >
                Start free trial
              </Link>
              <p className="font-body text-xs text-charcoal/50 text-center mt-3">
                {pricingReassurance}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Ticks between prices over ~350ms when the billing period changes.
function AnimatedPrice({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const from = prevRef.current;
    prevRef.current = value;
    if (from === value) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    const start = performance.now();
    const DURATION = 350;
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      const eased = 1 - (1 - t) * (1 - t);
      setDisplay(from + (value - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const rounded = Math.round(display * 100) / 100;
  const text = Number.isInteger(rounded) ? `$${rounded}` : `$${rounded.toFixed(2)}`;

  return (
    <span className="font-serif text-charcoal text-5xl tabular-nums" aria-live="polite">
      {text}
    </span>
  );
}
