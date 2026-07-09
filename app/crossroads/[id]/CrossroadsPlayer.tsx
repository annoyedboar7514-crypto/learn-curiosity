'use client'
// Crossroads story player — docs/crossroads-spec-v1.1.md
// Text-first build of the voice-first spec: node flow, why-gate, consequence
// echoes, rewind-to-any-visited-decision, ending path map with True Path
// reveal, and a mentor debrief on the existing (safety-screened) engine.
// TODO(voice): cached TTS narration + spoken why-gate per spec §8-9.

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { GradeBand } from '@/lib/content/lessonSchema'
import type { CrossroadsStory, StoryNode, StoryChoice } from '@/lib/content/crossroads/schema'
import { CONCEPT_FRAMING } from '@/lib/content/crossroads/schema'

const C = { teal:'#1B6E6B', gold:'#E8A33D', cream:'#FBF6EC', navy:'#233137', border:'#E3DCC8', bubble:'#E1F5EE', brown:'#412402' }

interface Why { nodeId: string; choiceId: string; choiceLabel: string; why: string }
interface Msg { role: 'user' | 'assistant'; content: string }

export function CrossroadsPlayer({ story, gradeBand, childName, mentorName }: {
  story: CrossroadsStory
  gradeBand: GradeBand
  childName: string
  mentorName: string
}) {
  const router = useRouter()
  const byId = useMemo(() => new Map(story.nodes.map(n => [n.id, n])), [story])

  // run state
  const [nodeId, setNodeId] = useState(story.startNodeId)
  const [path, setPath] = useState<string[]>([story.startNodeId])
  const [whys, setWhys] = useState<Why[]>([])
  const [runNumber, setRunNumber] = useState(1)
  const [rewindCount, setRewindCount] = useState(0)
  const [priorRunCount, setPriorRunCount] = useState(0)
  const startedAt = useRef(Math.floor(Date.now() / 1000))
  const runStartMs = useRef(Date.now())

  // why-gate state
  const [picked, setPicked] = useState<StoryChoice | null>(null)
  const [whyText, setWhyText] = useState('')

  // ending / debrief state
  const [phase, setPhase] = useState<'story' | 'ending' | 'debrief'>('story')
  const [debrief, setDebrief] = useState<Msg[]>([])
  const [debriefInput, setDebriefInput] = useState('')
  const [sending, setSending] = useState(false)
  const sessionId = useRef(`cr-${story.id}-${Date.now()}`).current

  const node = byId.get(nodeId)!
  const narration = node.narrationByBand[gradeBand]
  const chosenIds = useMemo(() => new Set(whys.map(w => w.choiceId)), [whys])
  const echoes = (node.consequenceEchoes ?? []).filter(e => chosenIds.has(e.triggeredByChoiceId))

  // prior runs → True Path reveal state + "last time you…" line
  useEffect(() => {
    fetch(`/api/crossroads/run?storyId=${story.id}`)
      .then(r => r.ok ? r.json() : { runs: [] })
      .then(d => {
        const completed = (d.runs ?? []).filter((r: { endingId: string | null }) => r.endingId)
        setPriorRunCount(completed.length)
        if (completed.length) setRunNumber(completed.length + 1)
      })
      .catch(() => {})
  }, [story.id])

  const trueRevealed = priorRunCount > 0 || phase !== 'story'

  function advanceTo(nextId: string) {
    setNodeId(nextId)
    setPath(p => [...p, nextId])
    setPicked(null)
    setWhyText('')
    const next = byId.get(nextId)
    if (next?.type === 'ending') finishRun(nextId)
  }

  function lockWhy() {
    if (!picked || whyText.trim().length < 2) return
    setWhys(w => [...w, { nodeId: node.id, choiceId: picked.id, choiceLabel: picked.label, why: whyText.trim() }])
    advanceTo(picked.nextNodeId)
  }

  function finishRun(endingId: string) {
    setPhase('ending')
    fetch('/api/crossroads/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storyId: story.id, runNumber, path: [...path, endingId], whys,
        endingId, rewindCount, durationMs: Date.now() - runStartMs.current, startedAt: startedAt.current,
      }),
    }).catch(() => {})
  }

  // Rewind: fork a new run from any previously visited decision (spec §7)
  function rewindTo(decisionNodeId: string) {
    const idx = path.indexOf(decisionNodeId)
    if (idx < 0) return
    setPath(path.slice(0, idx + 1))
    setWhys(whys.filter(w => path.slice(0, idx).includes(w.nodeId)))
    setNodeId(decisionNodeId)
    setPicked(null); setWhyText('')
    setRunNumber(n => n + 1)
    setRewindCount(n => n + 1)
    runStartMs.current = Date.now()
    setPhase('story')
    setDebrief([])
  }

  // Debrief on the existing mentor engine (safety-screened, logged for parents)
  async function startDebrief() {
    setPhase('debrief')
    setSending(true)
    const opener = story.noWin && priorRunCount === 0
      ? `You couldn't win that one. Nobody could. So what were you actually choosing between?`
      : priorRunCount > 0
      ? `You've walked this crossroads before and chose differently this time. What changed your mind?`
      : `Quite a journey. Before we talk about how it ended — which of your choices was the hardest to make, and why?`
    setDebrief([{ role: 'assistant', content: opener }])
    setSending(false)
  }

  async function sendDebrief() {
    const text = debriefInput.trim()
    if (!text || sending) return
    const history: Msg[] = [...debrief, { role: 'user', content: text }]
    setDebrief(history); setDebriefInput(''); setSending(true)
    try {
      const whyLines = whys.map(w => `chose "${w.choiceLabel}" because "${w.why}"`).join('; ')
      const res = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          lessonId: `crossroads:${story.id}`,
          lessonTitle: `${story.title} (Crossroads)`,
          pillar: story.pillarTag,
          gradeBand, childName, mentorName,
          choiceLabel: whyLines,
          questionBank: {
            entry: 'Which choice was hardest, and why?',
            core: [
              `In this story, ${childName} ${whyLines || 'made several choices'}. Ask about ONE of those reasons.`,
              'Was the reward worth the risks — and how could anyone have known in advance?',
              'If you rewound and chose differently, what would you be trading away?',
            ],
            deep: [
              `Name the idea exactly once, warmly: "${CONCEPT_FRAMING[story.conceptTag]}" — then ask where else in ${childName}'s life that idea shows up.`,
            ],
            disengagement: 'Try this: if your best friend had to make that same choice, what would you tell them to watch out for?',
          },
          history,
        }),
      })
      const data = await res.json()
      setDebrief(h => [...h, { role: 'assistant', content: data.response ?? 'Tell me more about that.' }])
    } catch {
      setDebrief(h => [...h, { role: 'assistant', content: 'Hmm, say that again?' }])
    } finally { setSending(false) }
  }

  const visitedDecisions = path.filter(id => byId.get(id)?.type === 'decision')

  // ───────────────────────── render ─────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: C.cream, color: C.navy, fontFamily: 'Inter, system-ui, sans-serif', paddingBottom: 60 }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: `1px solid ${C.border}`, background: '#fff' }}>
        <button onClick={() => router.push('/home')} style={{ border: `1px solid ${C.border}`, background: '#fff', borderRadius: 999, padding: '7px 14px', fontSize: 13, cursor: 'pointer', color: C.navy }}>← Home</button>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: C.teal }}>Crossroads · Era {story.era}{runNumber > 1 ? ` · Run ${runNumber}` : ''}</div>
          <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 600, fontSize: 18 }}>{story.title}</div>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '26px 18px' }}>

        {/* ── STORY ── */}
        {phase === 'story' && (
          <>
            <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, padding: 22, boxShadow: '0 1px 3px rgba(35,49,55,.06)' }}>
              <div style={{ fontSize: 44, textAlign: 'center', marginBottom: 10 }}>{node.panelEmoji ?? '📜'}</div>
              {echoes.map((e, i) => (
                <p key={i} style={{ background: C.bubble, borderLeft: `3px solid ${C.teal}`, borderRadius: '0 10px 10px 0', padding: '10px 14px', fontSize: 14, fontStyle: 'italic', marginBottom: 12 }}>{e.narrationInsert}</p>
              ))}
              <p style={{ fontSize: 16.5, lineHeight: 1.65 }}>{narration}</p>
            </div>

            {node.type === 'scene' && (
              <button onClick={() => advanceTo(node.nextNodeId!)} style={btnGold()}>Continue →</button>
            )}

            {node.type === 'decision' && (
              <div style={{ marginTop: 18 }}>
                <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: C.teal, marginBottom: 10 }}>What would you do?</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(node.choices ?? []).map(c => (
                    <button key={c.id} onClick={() => { setPicked(c); setWhyText('') }}
                      style={{ textAlign: 'left', background: picked?.id === c.id ? C.teal : '#fff', color: picked?.id === c.id ? C.cream : C.navy, border: `2px solid ${picked?.id === c.id ? C.teal : C.border}`, borderRadius: 14, padding: '14px 16px', cursor: 'pointer' }}>
                      <div style={{ fontWeight: 600, fontSize: 15.5 }}>{c.label}</div>
                      <div style={{ fontSize: 13, opacity: .8, marginTop: 4, lineHeight: 1.45 }}>⚖️ {c.stakesLine}</div>
                    </button>
                  ))}
                </div>

                {/* WHY-GATE — the story does not advance without a reason */}
                {picked && (
                  <div style={{ marginTop: 14, background: '#fff', border: `2px solid ${C.gold}`, borderRadius: 14, padding: 16 }}>
                    <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{mentorName} leans in: “Why?”</div>
                    <textarea value={whyText} onChange={e => setWhyText(e.target.value)} placeholder="Because…"
                      style={{ width: '100%', minHeight: 64, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 12px', fontFamily: 'Inter', fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }} />
                    <button onClick={lockWhy} disabled={whyText.trim().length < 2}
                      style={{ ...btnGold(), marginTop: 10, opacity: whyText.trim().length < 2 ? .5 : 1 }}>
                      That&apos;s my reason — continue →
                    </button>
                  </div>
                )}
              </div>
            )}

            {visitedDecisions.length > 0 && node.type !== 'ending' && (
              <div style={{ marginTop: 22, fontSize: 12.5, opacity: .65 }}>
                ⏪ Rewind to: {visitedDecisions.map(id => (
                  <button key={id} onClick={() => rewindTo(id)} style={{ border: `1px solid ${C.border}`, background: '#fff', borderRadius: 999, padding: '3px 10px', margin: '0 4px', fontSize: 12, cursor: 'pointer', color: C.teal }}>
                    {byId.get(id)?.panelEmoji} choice
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── ENDING ── */}
        {(phase === 'ending' || phase === 'debrief') && (
          <>
            <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, padding: 22, marginBottom: 16 }}>
              <div style={{ fontSize: 44, textAlign: 'center', marginBottom: 10 }}>{node.panelEmoji}</div>
              <p style={{ fontSize: 16.5, lineHeight: 1.65 }}>{narration}</p>
              {node.endingSummary && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
                  <div style={{ background: '#FBEDE7', borderRadius: 12, padding: '10px 14px', fontSize: 13 }}><b>What was lost:</b><br />{node.endingSummary.whatWasLost}</div>
                  <div style={{ background: C.bubble, borderRadius: 12, padding: '10px 14px', fontSize: 13 }}><b>What was gained:</b><br />{node.endingSummary.whatWasGained}</div>
                </div>
              )}
            </div>

            <PathMap story={story} path={path} byId={byId} trueRevealed={trueRevealed} />

            {trueRevealed && (
              <div style={{ background: '#fff', border: `2px solid ${C.teal}`, borderRadius: 14, padding: 16, margin: '16px 0', fontSize: 14, lineHeight: 1.6 }}>
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: C.teal, marginBottom: 6 }}>What really happened</div>
                {story.whatReallyHappened}
              </div>
            )}

            {phase === 'ending' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button onClick={startDebrief} style={btnGold()}>Talk it over with {mentorName} →</button>
                {visitedDecisions.map(id => (
                  <button key={id} onClick={() => rewindTo(id)} style={{ border: `2px solid ${C.teal}`, background: '#fff', color: C.teal, borderRadius: 999, padding: '11px 18px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                    ⏪ Rewind to the {byId.get(id)?.panelEmoji} choice — repicking is what thinking looks like
                  </button>
                ))}
              </div>
            )}

            {phase === 'debrief' && (
              <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
                  {debrief.map((m, i) => (
                    <div key={i} style={{ maxWidth: '82%', padding: '10px 14px', borderRadius: 14, fontSize: 14, lineHeight: 1.5, alignSelf: m.role === 'assistant' ? 'flex-start' : 'flex-end', background: m.role === 'assistant' ? C.bubble : C.teal, color: m.role === 'assistant' ? C.navy : C.bubble }}>{m.content}</div>
                  ))}
                  {sending && <div style={{ fontSize: 12, opacity: .55 }}>{mentorName} is thinking…</div>}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={debriefInput} onChange={e => setDebriefInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendDebrief()} placeholder="Say what you think…"
                    style={{ flex: 1, border: `1px solid ${C.border}`, borderRadius: 999, padding: '11px 16px', fontSize: 14, fontFamily: 'Inter' }} />
                  <button onClick={sendDebrief} disabled={sending} style={{ background: C.teal, color: C.cream, border: 'none', borderRadius: 999, padding: '11px 20px', fontWeight: 600, cursor: 'pointer' }}>Send</button>
                </div>
                {debrief.filter(m => m.role === 'user').length >= 2 && (
                  <button onClick={() => router.push('/home')} style={{ ...btnGold(), marginTop: 12 }}>Finish — back to my path →</button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function btnGold(): React.CSSProperties {
  return { display: 'block', width: '100%', marginTop: 16, background: '#E8A33D', color: '#412402', border: 'none', borderRadius: 999, padding: '14px 20px', fontWeight: 700, fontSize: 15.5, cursor: 'pointer', boxShadow: '0 5px 0 #c9852a' }
}

// ── Path Map: node columns by depth; child's route gold, True Path teal ──────
function PathMap({ story, path, byId, trueRevealed }: {
  story: CrossroadsStory
  path: string[]
  byId: Map<string, StoryNode>
  trueRevealed: boolean
}) {
  // BFS depth layout
  const depth = new Map<string, number>([[story.startNodeId, 0]])
  const queue = [story.startNodeId]
  while (queue.length) {
    const id = queue.shift()!
    const n = byId.get(id)!
    const d = depth.get(id)!
    const nexts = n.type === 'scene' ? [n.nextNodeId!] : (n.choices ?? []).map(c => c.nextNodeId)
    for (const nx of nexts) if (nx && !depth.has(nx)) { depth.set(nx, d + 1); queue.push(nx) }
  }
  const maxD = Math.max(...depth.values())
  const cols: string[][] = Array.from({ length: maxD + 1 }, () => [])
  for (const [id, d] of depth) cols[d].push(id)
  const W = 620, H = 40 + Math.max(...cols.map(c => c.length)) * 56
  const pos = new Map<string, { x: number; y: number }>()
  cols.forEach((ids, d) => ids.forEach((id, i) => pos.set(id, { x: 40 + d * ((W - 80) / maxD), y: 40 + i * ((H - 80) / Math.max(ids.length - 1, 1) || 1) })))

  const onPath = new Set(path)
  const trueSet = new Set(story.truePathNodeIds)
  const edges: { a: string; b: string; onRun: boolean; onTrue: boolean }[] = []
  for (const n of story.nodes) {
    const nexts = n.type === 'scene' ? [n.nextNodeId!] : (n.choices ?? []).map(c => c.nextNodeId)
    for (const nx of nexts) if (nx) edges.push({
      a: n.id, b: nx,
      onRun: onPath.has(n.id) && onPath.has(nx) && path.indexOf(nx) === path.indexOf(n.id) + 1,
      onTrue: trueSet.has(n.id) && trueSet.has(nx),
    })
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #E3DCC8', borderRadius: 18, padding: 16 }}>
      <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: '#1B6E6B', marginBottom: 8 }}>Your path map</div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
        {edges.map((e, i) => {
          const A = pos.get(e.a)!, B = pos.get(e.b)!
          const stroke = e.onRun ? '#E8A33D' : trueRevealed && e.onTrue ? '#1B6E6B' : '#E3DCC8'
          return <line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={stroke} strokeWidth={e.onRun ? 4 : 2.5} strokeDasharray={trueRevealed && e.onTrue && !e.onRun ? '4 5' : undefined} />
        })}
        {[...pos.entries()].map(([id, p]) => {
          const n = byId.get(id)!
          const fill = onPath.has(id) ? '#E8A33D' : trueRevealed && trueSet.has(id) ? '#1B6E6B' : '#fff'
          return (
            <g key={id}>
              <circle cx={p.x} cy={p.y} r={n.type === 'decision' ? 15 : 11} fill={fill} stroke="#233137" strokeWidth={1.5} opacity={onPath.has(id) || (trueRevealed && trueSet.has(id)) ? 1 : 0.45} />
              <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={11}>{n.panelEmoji ?? ''}</text>
            </g>
          )
        })}
      </svg>
      <div style={{ display: 'flex', gap: 16, fontSize: 11, opacity: .7, marginTop: 6 }}>
        <span>● gold — your route</span>
        {trueRevealed && <span style={{ color: '#1B6E6B' }}>● teal — what really happened</span>}
        <span>○ grey — unexplored</span>
      </div>
    </div>
  )
}
