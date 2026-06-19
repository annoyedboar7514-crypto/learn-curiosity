// Five Pillars dotted-trail stamp-badge design.
// Labels and icons are final per the business plan proposal.

const PILLARS = [
  { icon: "🧠", label: "Critical Thinking" },
  { icon: "🌱", label: "Resilience & Character" },
  { icon: "💡", label: "Creativity & Vision" },
  { icon: "💬", label: "Communication" },
  { icon: "🔄", label: "Learning How to Learn" },
];

export default function PillarsTrail() {
  return (
    <div className="w-full overflow-x-auto pb-2">
      {/* Desktop: horizontal trail */}
      <div className="hidden sm:flex items-start justify-center gap-0 min-w-max mx-auto">
        {PILLARS.map((p, i) => (
          <div key={p.label} className="flex items-center">
            {/* Stamp badge */}
            <div className="flex flex-col items-center gap-2 w-32">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-teal bg-cream flex items-center justify-center text-2xl shadow-sm">
                {p.icon}
              </div>
              <p className="text-xs font-semibold text-navy text-center leading-tight font-body">
                {p.label}
              </p>
            </div>
            {/* Dotted connector (not after the last) */}
            {i < PILLARS.length - 1 && (
              <div className="w-12 flex items-center justify-center -mt-7">
                <svg width="48" height="4" viewBox="0 0 48 4" fill="none">
                  <line
                    x1="0" y1="2" x2="48" y2="2"
                    stroke="#1B6E6B"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile: vertical trail */}
      <div className="flex sm:hidden flex-col items-start gap-0 pl-8">
        {PILLARS.map((p, i) => (
          <div key={p.label} className="flex items-center gap-4">
            {/* Left connector column */}
            <div className="flex flex-col items-center w-10">
              {i > 0 && (
                <svg width="4" height="20" viewBox="0 0 4 20">
                  <line x1="2" y1="0" x2="2" y2="20" stroke="#1B6E6B" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />
                </svg>
              )}
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-teal bg-cream flex items-center justify-center text-xl shrink-0">
                {p.icon}
              </div>
            </div>
            <p className="text-sm font-semibold text-navy font-body">{p.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
