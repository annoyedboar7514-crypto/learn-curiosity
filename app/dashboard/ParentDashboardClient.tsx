"use client";

import { useState } from "react";
import Link from "next/link";
import { fmtDuration, fmtRelative } from "@/lib/grading";
import type { ParentReport } from "@/lib/db/parent-report";

type Tab = "overview" | "activity" | "safety" | "data";

export default function ParentDashboardClient({ report }: { report: ParentReport }) {
  const [tab, setTab] = useState<Tab>("overview");
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const child = report.child;
  const name = child?.nickname ?? "your child";
  const u = report.usage;

  const totalEscalations = report.sessions.reduce((n, s) => n + s.escalationCount, 0);
  const allRedirects = report.sessions.flatMap((s) =>
    s.redirectFlags.map((f) => ({ ...f, title: s.lessonTitle, when: s.startedAt }))
  );

  const tiles: [string, string, string][] = [
    [fmtDuration(u.totalMs), "Total time on app", "watching, answering & talking"],
    [report.quiz ? fmtDuration(u.quizMs) : "—", "Time in the quiz", report.quiz ? `avg ${Math.round(report.quiz.avgPerQuestionMs / 1000)}s per question` : "not taken yet"],
    [String(u.lessonsCompleted), "Lessons completed", "full mentor sessions"],
    [String(u.questionsAnswered), "Questions answered", `${report.quiz?.answers.length ?? 0} quiz · ${u.mentorQuestions} with mentor`],
    [fmtDuration(u.lessonMs), "Time in lessons", "videos + conversations"],
    [String(u.sessionsCount), "Sessions", "mentor conversations"],
    [u.lastActive ? fmtRelative(u.lastActive) : "—", "Last active", "most recent session"],
    [child?.archetype ? cap(child.archetype.replace("-", " ")) : "—", "Archetype", "chosen at signup"],
  ];

  function exportData() {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${name}-learncuriosity-data.json`;
    a.click();
  }
  async function deleteData() {
    if (!confirm(`Permanently delete all of ${name}'s learning data? This cannot be undone.`)) return;
    try {
      await fetch("/api/parent/delete", { method: "POST" });
      alert("Data deleted.");
      location.reload();
    } catch {
      alert("Could not delete right now. Please try again.");
    }
  }

  const NAV: [Tab, string][] = [
    ["overview", "Overview"],
    ["activity", "Activity & Transcripts"],
    ["safety", "Safety"],
    ["data", "Data & Privacy"],
  ];

  return (
    <main className="max-w-5xl mx-auto px-5 sm:px-8 py-8 pb-24">
      {/* Heading */}
      <p className="font-mono-brand text-[11px] tracking-widest uppercase text-teal mb-2">Parent dashboard · private</p>
      <h1 className="font-serif text-3xl font-semibold text-navy mb-1">{cap(name)}&apos;s journey</h1>
      <p className="text-navy/60 text-sm mb-6">
        {child ? `${gbLabel(child.gradeBand)}${child.archetype ? " · " + cap(child.archetype.replace("-", " ")) : ""}` : "Set up your child's profile to begin."}
        {!report.hasQuiz && (
          <>
            {"  ·  "}
            <Link href="/quiz" className="text-teal underline">Take the quiz</Link> to unlock the baseline report.
          </>
        )}
      </p>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap mb-7">
        {NAV.map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            aria-selected={tab === k}
            className={`text-sm font-medium px-5 py-2.5 rounded-full border transition-colors cursor-pointer whitespace-nowrap ${
              tab === k
                ? "bg-teal text-cream border-teal shadow-sm"
                : "bg-white text-navy border-[#E3DCC8] hover:border-teal hover:text-teal"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ---------------- OVERVIEW ---------------- */}
      {tab === "overview" && (
        <div className="space-y-5">
          {/* tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {tiles.map(([n, l, s], i) => (
              <div key={i} className="bg-white border border-[#E3DCC8] rounded-2xl p-5 flex flex-col gap-1">
                <div className="font-serif text-[28px] font-semibold text-teal leading-none">{n}</div>
                <div className="text-[13px] font-medium text-navy/80 mt-1">{l}</div>
                <div className="text-[12px] text-navy/50">{s}</div>
              </div>
            ))}
          </div>

          {/* pillar report */}
          <Card title={`Where ${cap(name)} started — and where they are now`}
                sub="A baseline from the quiz, plus everything gained since. Your child never sees these scores.">
            {!report.pillarsMeasured && (
              <p className="text-[13px] text-navy/55 mb-4 bg-cream border border-[#E3DCC8] rounded-lg px-3 py-2">
                No baseline yet. Bars fill in once {cap(name)} finishes the quiz; lessons then grow them over time.
              </p>
            )}
            <PillarReport report={report} />
          </Card>

          {/* time chart */}
          <Card title="Time on the app — last 7 days" sub="Minutes spent watching, answering, and talking with the mentor.">
            <div className="flex items-end gap-2.5 h-32 pt-2">
              {report.timeByDay.map((d, i) => {
                const max = Math.max(1, ...report.timeByDay.map((x) => x.minutes));
                const pct = d.minutes ? Math.max(4, Math.round((d.minutes / max) * 100)) : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div className="text-[10px] text-navy/45">{d.minutes || ""}</div>
                    <div className="w-3/5 rounded-t-md" style={{ height: `${pct}%`, minHeight: d.minutes ? 3 : 0, background: "#E8A33D" }} />
                    <div className="text-[11px] text-navy/55">{d.label}</div>
                  </div>
                );
              })}
            </div>
          </Card>

          <SafetyCard mini totalEscalations={totalEscalations} redirects={allRedirects} name={cap(name)} />
        </div>
      )}

      {/* ---------------- ACTIVITY ---------------- */}
      {tab === "activity" && (
        <Card title="Full activity transcript"
              sub="Every lesson and the complete word-for-word mentor conversations. Nothing is hidden.">
          {report.sessions.length === 0 && !report.quiz && (
            <p className="text-[13px] text-navy/55">No activity yet. Once {cap(name)} takes the quiz and starts a lesson, it all appears here.</p>
          )}

          <div className="space-y-3">
            {/* Quiz entry */}
            {report.quiz && (
              <div className="border border-[#E3DCC8] rounded-xl overflow-hidden bg-white">
                <button onClick={() => setOpen((o) => ({ ...o, quiz: !o.quiz }))}
                        className="w-full flex items-center gap-3.5 p-4 text-left cursor-pointer">
                  <span className="w-10 h-10 rounded-xl bg-cream grid place-items-center text-lg shrink-0">🧭</span>
                  <span className="flex-1">
                    <span className="block font-medium text-[15px] text-navy">Baseline quiz completed</span>
                    <span className="block text-[12.5px] text-navy/55 mt-0.5">
                      {report.quiz.answers.length} questions · {fmtDuration(report.quiz.durationMs)} · {fmtRelative(report.quiz.completedAt)}
                    </span>
                  </span>
                  <span className={`text-navy/40 text-xs transition-transform ${open.quiz ? "rotate-90" : ""}`}>▶</span>
                </button>
                {open.quiz && (
                  <div className="px-4 pb-4 border-t border-[#E3DCC8] pt-3">
                    <p className="font-mono-brand text-[10px] tracking-wider uppercase text-teal mb-2">Answers (private — never shown to your child)</p>
                    <div className="divide-y divide-dashed divide-[#E3DCC8]">
                      {report.quiz.answers.map((a, i) => (
                        <div key={i} className="flex justify-between gap-3 py-2 text-[13px]">
                          <span className="text-navy/80">{a.q ?? `Question ${i + 1}`}</span>
                          <span className="text-teal font-medium text-right">
                            {a.choice ?? ""}
                            {a.text ? <em className="block font-normal text-navy/50">“{a.text}”</em> : null}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Lesson sessions */}
            {report.sessions.map((s) => (
              <div key={s.sessionId} className="border border-[#E3DCC8] rounded-xl overflow-hidden bg-white">
                <button onClick={() => setOpen((o) => ({ ...o, [s.sessionId]: !o[s.sessionId] }))}
                        className="w-full flex items-center gap-3.5 p-4 text-left cursor-pointer">
                  <span className="w-10 h-10 rounded-xl bg-cream grid place-items-center text-lg shrink-0">📖</span>
                  <span className="flex-1">
                    <span className="block font-medium text-[15px] text-navy">{s.lessonTitle}</span>
                    <span className="flex flex-wrap gap-x-2.5 gap-y-1 text-[12.5px] text-navy/55 mt-1 items-center">
                      {s.pillarName && <PillarBadge name={s.pillarName} pillar={s.pillar!} />}
                      <span>⏱ {fmtDuration(s.durationMs)}</span>
                      <span>{s.childTurns} replies</span>
                      <span>{fmtRelative(s.startedAt)}</span>
                      {s.redirectCount > 0 && <span className="text-[11px] font-semibold text-[#D9714F] bg-[#D9714F]/10 border border-[#D9714F]/40 rounded-full px-2 py-0.5">{s.redirectCount} redirect</span>}
                      {s.escalationCount > 0 && <span className="text-[11px] font-semibold text-white bg-[#C0392B] rounded-full px-2 py-0.5">flagged</span>}
                    </span>
                  </span>
                  <span className={`text-navy/40 text-xs transition-transform ${open[s.sessionId] ? "rotate-90" : ""}`}>▶</span>
                </button>
                {open[s.sessionId] && (
                  <div className="px-4 pb-4 border-t border-[#E3DCC8] pt-3">
                    {s.decisionAnswer && (
                      <div className="bg-cream border-l-[3px] border-[#E8A33D] rounded-r-lg px-3.5 py-3 mb-3 text-[14px] text-navy">
                        <span className="block font-mono-brand text-[10px] tracking-wider uppercase text-teal mb-1">{cap(name)}&apos;s decision</span>
                        “{s.decisionAnswer}”
                      </div>
                    )}
                    <p className="font-mono-brand text-[10px] tracking-wider uppercase text-teal mb-2">Mentor conversation — full transcript</p>
                    <div className="flex flex-col gap-2.5">
                      {s.transcript.map((t, i) => (
                        <div key={i}
                             className={`max-w-[80%] px-3.5 py-2.5 rounded-xl text-[13.5px] leading-relaxed ${
                               t.role === "mentor"
                                 ? "self-start bg-[#E1F5EE] text-navy rounded-bl-sm"
                                 : "self-end bg-teal text-[#E1F5EE] rounded-br-sm"
                             } ${t.escalated ? "ring-2 ring-[#C0392B]" : ""}`}>
                          <span className="block font-mono-brand text-[9px] uppercase tracking-wider opacity-70 mb-0.5">{t.role}</span>
                          {t.text}
                        </div>
                      ))}
                    </div>
                    {s.redirectFlags.map((f, i) => (
                      <div key={i} className="mt-3 text-[12.5px] flex gap-2">
                        <span className="text-[11px] font-semibold text-[#D9714F] bg-[#D9714F]/10 border border-[#D9714F]/40 rounded-full px-2 py-0.5 h-fit">redirect</span>
                        <span className="text-navy/70"><b>{cap(name)} {f.topic}.</b> {f.action}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ---------------- SAFETY ---------------- */}
      {tab === "safety" && (
        <div className="space-y-5">
          <SafetyCard totalEscalations={totalEscalations} redirects={allRedirects} name={cap(name)} />
          <Card title="How the safety system works">
            <p className="text-[13.5px] text-navy/75 leading-relaxed">
              Every message the mentor sends or receives passes through an independent safety layer before it&apos;s shown —
              separate from the AI itself. Any topic touching self-harm, violence, or anything inappropriate triggers a gentle
              redirect and an immediate flag here. The mentor never scolds your child and can never drift outside the lesson.
              You can read every word of every conversation in the Activity tab.
            </p>
          </Card>
        </div>
      )}

      {/* ---------------- DATA ---------------- */}
      {tab === "data" && (
        <Card title="Data & privacy" sub="You control everything we store. COPPA-compliant by design.">
          <Row t="What we store" d="Child nickname, grade band, archetype, quiz baseline, lesson logs & transcripts. No full name, address, photos, or ad profile — ever." />
          <Row t="Export all data" d="Download everything we hold about your child as a file." action={<button onClick={exportData} className="text-[13px] font-medium px-4 py-2 rounded-lg border border-[#E3DCC8] bg-white text-navy hover:border-teal cursor-pointer">Export</button>} />
          <Row t="Delete all data" d="Permanently erase your child's learning data." action={<button onClick={deleteData} className="text-[13px] font-medium px-4 py-2 rounded-lg border-[1.5px] border-[#C0392B] bg-white text-[#C0392B] hover:bg-[#FDF0EF] cursor-pointer">Delete</button>} />
          <Row t="Consent record" d={report.consentAt ? `COPPA consent recorded ${new Date(report.consentAt).toLocaleDateString()} via verified parent signup.` : "COPPA consent on file via parent signup."} />
          <p className="text-[12px] text-navy/55 leading-relaxed mt-4">
            Session logs auto-delete after a set retention window. No behavioral advertising is ever built from this data.
            This page is visible only on parent-authenticated routes.
          </p>
        </Card>
      )}
    </main>
  );
}

/* ---------- small presentational helpers ---------- */
function Card({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-[#E3DCC8] rounded-2xl p-5 sm:p-6">
      <h3 className="font-serif text-lg font-semibold text-navy">{title}</h3>
      {sub && <p className="text-[13px] text-navy/60 mt-0.5 mb-4">{sub}</p>}
      {!sub && <div className="mb-3" />}
      {children}
    </section>
  );
}
function PillarBadge({ name, pillar }: { name: string; pillar: string }) {
  const c = PILLAR_HEX[pillar] ?? "#5B6FA8";
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium rounded-full px-2.5 py-0.5"
          style={{ color: c, border: `1px solid ${c}`, background: "#fff" }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />{name}
    </span>
  );
}
function PillarReport({ report }: { report: ParentReport }) {
  return (
    <div className="space-y-4">
      {report.pillarReport.map((r) => (
        <div key={r.key}>
          <div className="flex justify-between items-baseline mb-1.5">
            <span className="font-medium text-[14px] text-navy">{r.name}</span>
            <span className="text-[12.5px] font-medium" style={{ color: r.color }}>{r.label}</span>
          </div>
          <div className="relative h-4 bg-cream border border-[#E3DCC8] rounded-full">
            <div className="h-full rounded-full transition-all" style={{ width: `${r.fillPct}%`, background: r.color }} />
            {r.baseline > 0 && (
              <div className="absolute -top-[3px] -bottom-[3px] w-0.5 bg-navy/55" style={{ left: `${r.basePct}%` }} title="Quiz baseline" />
            )}
          </div>
          {r.gain > 0 && <div className="text-[11px] font-medium mt-1" style={{ color: r.color }}>▲ grew since the baseline</div>}
        </div>
      ))}
      <div className="flex gap-4 text-[11px] text-navy/60 pt-1">
        <span className="flex items-center gap-1.5"><span className="w-3.5 h-2 rounded" style={{ background: "#1B6E6B" }} /> Current</span>
        <span className="flex items-center gap-1.5"><span className="w-0.5 h-3 bg-navy/60" /> Quiz baseline</span>
      </div>
    </div>
  );
}
function SafetyCard({ mini, totalEscalations, redirects, name }: { mini?: boolean; totalEscalations: number; redirects: { topic: string; action: string; title: string; when: number }[]; name: string }) {
  return (
    <section className="bg-white border border-[#E3DCC8] rounded-2xl p-5 sm:p-6">
      <h3 className="font-serif text-lg font-semibold text-navy mb-1">{mini ? "Safety" : "Safety overview"}</h3>
      <p className="text-[13px] text-navy/60 mb-4">Independent of the AI. Every message is checked.</p>
      <div className="flex items-center gap-3.5 bg-[#E1F5EE] border border-[#bfe3d6] rounded-xl px-5 py-4">
        <span className="w-10 h-10 rounded-full bg-[#4F8B6E] text-white grid place-items-center text-xl shrink-0">{totalEscalations === 0 ? "✓" : "!"}</span>
        <div>
          <b className="text-[15px] text-navy">{totalEscalations} safety {totalEscalations === 1 ? "escalation" : "escalations"}.</b>
          <div className="text-[13px] text-navy/70 mt-0.5">
            {totalEscalations === 0 ? "No conversation has touched an unsafe topic. You'd be emailed the moment one did." : "Review the flagged conversations in the Activity tab."}
          </div>
        </div>
      </div>
      {redirects.length > 0 && (
        <div className="mt-4">
          <p className="font-mono-brand text-[11px] tracking-wider uppercase text-teal">Gentle redirects ({redirects.length})</p>
          <p className="text-[12.5px] text-navy/60 my-1.5">Times the mentor steered a curious tangent back to the lesson. Not a problem — just transparency.</p>
          {redirects.map((f, i) => (
            <div key={i} className="flex gap-3 py-2 border-t border-[#E3DCC8] text-[13px]">
              <span className="text-[11px] font-semibold text-[#D9714F] bg-[#D9714F]/10 border border-[#D9714F]/40 rounded-full px-2.5 py-0.5 h-fit">redirect</span>
              <div><b>{name} {f.topic}</b> · {f.title} · {fmtRelative(f.when)}<br /><span className="text-navy/70">{f.action}</span></div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
function Row({ t, d, action }: { t: string; d: string; action?: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center gap-4 py-3.5 border-b border-[#E3DCC8] last:border-0">
      <div>
        <div className="font-medium text-[14px] text-navy">{t}</div>
        <div className="text-[12.5px] text-navy/65 mt-0.5">{d}</div>
      </div>
      {action}
    </div>
  );
}

const PILLAR_HEX: Record<string, string> = {
  ct: "#5B6FA8", res: "#4F8B6E", cre: "#8B5FA3", com: "#D9714F", learn: "#C98A3E",
};
function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
function gbLabel(g: string) { return g === "K-2" ? "Grade K–2" : g === "5-6" ? "Grade 5–6" : "Grade 3–4"; }
