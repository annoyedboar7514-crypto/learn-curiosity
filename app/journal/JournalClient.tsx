"use client";
// The Curiosity Journal — an illustrated notebook of the child's OWN thinking.
// Each page is one best-reasoning card: their quote in large Fraunces, the
// mentor's handwritten-style note beneath. Completed Crossroads appear as
// fold-out map pages. Flip-through with a page-turn sound.

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getCrossroadsStory } from "@/lib/content/crossroads";
import { PathMap } from "@/app/crossroads/[id]/CrossroadsPlayer";
import { ChildButton, playPageTurn } from "@/app/components/child-kit";
import "@/app/components/child-kit/child-kit.css";

export type JournalPage =
  | { kind: "reasoning"; title: string; quote: string; note: string; date: string }
  | { kind: "crossroads"; storyId: string; title: string; path: string[]; whys: { choiceLabel: string; why: string }[]; date: string };

const serif = { fontFamily: "var(--font-serif, Fraunces, Georgia, serif)" } as const;

export default function JournalClient({ pages, nickname, mentorName, mentorEmoji }: {
  pages: JournalPage[];
  nickname: string;
  mentorName: string;
  mentorEmoji: string;
}) {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const [unfolded, setUnfolded] = useState(false);
  const page = pages[idx];

  function flip(dir: -1 | 1) {
    const next = idx + dir;
    if (next < 0 || next >= pages.length) return;
    playPageTurn();
    setUnfolded(false);
    setIdx(next);
  }

  return (
    <div style={{ minHeight: "100dvh", background: "var(--color-cream, #FBF6EC)", color: "var(--color-charcoal, #233137)", display: "flex", flexDirection: "column" }}>
      {/* header */}
      <header style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px" }}>
        <button
          onClick={() => router.push("/home")}
          className="ck-lift"
          style={{ border: "2px solid var(--color-cream-border)", background: "#fff", borderRadius: 999, padding: "8px 16px", fontSize: 14, cursor: "pointer", color: "inherit" }}
        >
          ← Map
        </button>
        <div style={{ ...serif, fontWeight: 600, fontSize: 19 }}>
          📓 {nickname}&apos;s Curiosity Journal
        </div>
      </header>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 16px 32px", gap: 18 }}>
        {pages.length === 0 ? (
          <div className="ck-journal-page ck-enter" style={{ maxWidth: 560, width: "100%", textAlign: "center" }}>
            <p style={{ fontSize: 44, margin: "8px 0" }} aria-hidden>{mentorEmoji}</p>
            <p className="ck-journal-quote">This journal is waiting for its first page.</p>
            <p className="ck-journal-note">
              Every time you tell me <em>why</em> you think something, the best of it lands in here. Come find a story with me. — {mentorName}
            </p>
            <div style={{ marginTop: 18 }}>
              <ChildButton onClick={() => router.push("/home")}>Back to the path</ChildButton>
            </div>
          </div>
        ) : (
          <>
            <div key={idx} className="ck-journal-page ck-panel-enter" style={{ maxWidth: 560, width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, opacity: 0.6, marginBottom: 14 }}>
                <span>{page.title}</span>
                <span>{page.date}</span>
              </div>

              {page.kind === "reasoning" ? (
                <>
                  <p className="ck-journal-quote">“{page.quote}”</p>
                  <p style={{ fontSize: 13, opacity: 0.55, margin: "10px 0 2px" }}>— you wrote this</p>
                  <p className="ck-journal-note">{page.note} — {mentorName} {mentorEmoji}</p>
                </>
              ) : (
                <CrossroadsFoldout page={page} unfolded={unfolded} onUnfold={() => { playPageTurn(); setUnfolded(true); }} />
              )}
            </div>

            {/* flip-through */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <ChildButton variant="secondary" onClick={() => flip(-1)} disabled={idx === 0} aria-label="Previous page">
                ‹
              </ChildButton>
              <span style={{ fontSize: 14, opacity: 0.6, minWidth: 70, textAlign: "center" }}>
                page {idx + 1} of {pages.length}
              </span>
              <ChildButton variant="secondary" onClick={() => flip(1)} disabled={idx === pages.length - 1} aria-label="Next page">
                ›
              </ChildButton>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// A completed Crossroads as a fold-out page: closed, it's a teaser flap;
// unfolded, the full path map + the child's spoken reasons.
function CrossroadsFoldout({ page, unfolded, onUnfold }: {
  page: Extract<JournalPage, { kind: "crossroads" }>;
  unfolded: boolean;
  onUnfold: () => void;
}) {
  const router = useRouter();
  const story = useMemo(() => getCrossroadsStory(page.storyId), [page.storyId]);
  const byId = useMemo(() => new Map((story?.nodes ?? []).map((n) => [n.id, n])), [story]);
  if (!story) return null;

  if (!unfolded) {
    return (
      <button
        onClick={onUnfold}
        className="ck-card-tap ck-lift"
        style={{ width: "100%", background: "rgba(232,163,61,0.08)", border: "2px dashed var(--color-gold, #E8A33D)", borderRadius: 14, padding: "26px 16px", textAlign: "center", cursor: "pointer" }}
      >
        <div style={{ fontSize: 34 }} aria-hidden>🗺️</div>
        <div style={{ ...serif, fontWeight: 600, fontSize: 18, marginTop: 6 }}>A crossroads you walked</div>
        <div style={{ fontSize: 14, opacity: 0.65, marginTop: 4 }}>unfold the map ›</div>
      </button>
    );
  }

  return (
    <div className="ck-enter">
      <PathMap
        story={story}
        path={page.path}
        byId={byId}
        trueRevealed
        onRewind={() => router.push(`/crossroads/${page.storyId}`)}
      />
      {page.whys.length > 0 && (
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          {page.whys.map((w, i) => (
            <div key={i} className="ck-echo">
              <div style={{ fontSize: 13.5, opacity: 0.65 }}>You chose “{w.choiceLabel}” because…</div>
              <p className="ck-journal-quote" style={{ fontSize: 19, margin: "2px 0 0" }}>“{w.why}”</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
