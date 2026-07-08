"use client";

import { useState } from "react";
import { faqItems } from "@/lib/content/homepage";

// Height-animated accordion, one item open at a time, gold +/− indicators.
// Native <button> per question keeps it fully keyboard-operable.
export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto">
      {faqItems.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.question} className="border-b border-cream-border">
            <h3 className="m-0">
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`faq-answer-${i}`}
                id={`faq-question-${i}`}
                onClick={() => setOpenIndex(open ? null : i)}
                className="w-full flex items-center justify-between gap-4 py-5 text-left bg-transparent border-none cursor-pointer group"
              >
                <span className="font-body font-medium text-charcoal text-base leading-snug group-hover:text-teal transition-colors">
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className="shrink-0 font-serif text-gold text-2xl leading-none w-6 text-center select-none"
                >
                  {open ? "−" : "+"}
                </span>
              </button>
            </h3>
            <div
              id={`faq-answer-${i}`}
              role="region"
              aria-labelledby={`faq-question-${i}`}
              className={[
                "grid transition-[grid-template-rows] duration-300 ease-out",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              ].join(" ")}
            >
              <div className="overflow-hidden">
                <p className="font-body text-sm text-charcoal/75 leading-relaxed pb-5 max-w-[640px]">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
