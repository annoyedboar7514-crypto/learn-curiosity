// Sample Socratic dialogue that demonstrates the mentor's questioning-only approach.
// Copy is final per the homepage spec.

export default function DialogueCard() {
  return (
    <div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-parchment p-5 space-y-4">
      {/* Mentor question */}
      <div className="flex gap-3 items-start">
        <div className="shrink-0 w-8 h-8 rounded-full bg-teal flex items-center justify-center text-cream text-sm font-bold">
          L
        </div>
        <div className="bg-parchment rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-navy leading-relaxed max-w-[280px]">
          If you found out your best friend had been lying to you — to protect your feelings — would that make it better or worse?
        </div>
      </div>

      {/* Child answer */}
      <div className="flex gap-3 items-start flex-row-reverse">
        <div className="shrink-0 w-8 h-8 rounded-full bg-navy flex items-center justify-center text-cream text-sm font-bold">
          A
        </div>
        <div className="bg-navy/10 rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-navy leading-relaxed max-w-[260px]">
          Worse, I think. Because now I don&apos;t know what else might not be true.
        </div>
      </div>

      {/* Mentor follow-up */}
      <div className="flex gap-3 items-start">
        <div className="shrink-0 w-8 h-8 rounded-full bg-teal flex items-center justify-center text-cream text-sm font-bold">
          L
        </div>
        <div className="bg-parchment rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-navy leading-relaxed max-w-[280px]">
          What would it take for you to be able to trust them again?
        </div>
      </div>
    </div>
  );
}
