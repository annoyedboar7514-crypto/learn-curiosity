'use client'
// Crossroads story player — docs/crossroads-spec-v1.1.md, Stage 2 skin.
// Voice-first: narration is spoken (cached per node), choice cards present
// with weight (slow entrance, stakes spoken as each highlights), the why-gate
// is its own mic beat, consequence echoes draw a gold thread from the past
// choice, and the Path Map is the post-story centerpiece — animated gold
// route draw-in, tempting grey silhouettes, teal True Path reveal.

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { GradeBand } from '@/lib/content/lessonSchema'
import type { CrossroadsStory, StoryNode, StoryChoice } from '@/lib/content/crossroads/schema'
import { CONCEPT_FRAMING } from '@/lib/content/crossroads/schema'
import { getMentorCharacter } from '@/lib/mentor/mentor-characters'
import {
  EraAtmosphere,
  MentorAvatar,
  MicButton,
  type MicState,
  TranscriptBubble,
  TranscriptColumn,
  ChildButton,
  mentorAudio,
  useVoiceInput,
} from '@/app/components/child-kit'

interface Why { nodeId: string; choiceId: string; choiceLabel: string; why: string }
interface Msg { role: 'user' | 'assistant'; content: string }

const serif = { fontFamily: 'var(--font-serif, Fraunces, Georgia, serif)' } as const

export function CrossroadsPlayer({ story, gradeBand, childName, mentorId, mentorName }: {
  story: CrossroadsStory
  gradeBand: GradeBand
  childName: string
  mentorId: string
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
  // one-time run identity/timing — intentional impure ref initializers
  // eslint-disable-next-line react-hooks/purity
  const startedAt = useRef(Math.floor(Date.now() / 1000))
  // eslint-disable-next-line react-hooks/purity
  const runStartMs = useRef(Date.now())

  // why-gate state
  const [picked, setPicked] = useState<StoryChoice | null>(null)
  const [whyText, setWhyText] = useState('')
  const [whyTyping, setWhyTyping] = useState(false)

  // ending / debrief state
  const [phase, setPhase] = useState<'story' | 'ending' | 'debrief'>('story')
  const [debrief, setDebrief] = useState<Msg[]>([])
  const [debriefInput, setDebriefInput] = useState('')
  const [debriefTyping, setDebriefTyping] = useState(false)
  const [sending, setSending] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  // eslint-disable-next-line react-hooks/purity
  const sessionId = useRef(`cr-${story.id}-${Date.now()}`).current

  const node = byId.get(nodeId)!
  const narration = node.narrationByBand[gradeBand]
  const chosenIds = useMemo(() => new Set(whys.map(w => w.choiceId)), [whys])
  const echoes = (node.consequenceEchoes ?? []).filter(e => chosenIds.has(e.triggeredByChoiceId))

  useEffect(() => mentorAudio.subscribe(setSpeaking), [])
  useEffect(() => () => mentorAudio.stop(), [])

  // Spoken narration — cached per node so replays don't re-bill TTS (spec §8).
  useEffect(() => {
    mentorAudio.stop()
    const echoText = echoes.map(e => e.narrationInsert).join(' ')
    void mentorAudio.speak(`${echoText} ${narration}`.trim(), mentorId, {
      cacheKey: `cr-${story.id}-${nodeId}-${gradeBand}-${echoes.map(e => e.triggeredByChoiceId).join('.') || 'none'}`,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeId])

  // prior runs → True Path reveal state
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
    setWhyTyping(false)
    const next = byId.get(nextId)
    if (next?.type === 'ending') finishRun(nextId)
  }

  // A choice highlights with weight: the mentor speaks its stakes aloud.
  function highlight(c: StoryChoice) {
    setPicked(c)
    setWhyText('')
    mentorAudio.stop()
    void mentorAudio.speak(c.stakesLine, mentorId, { cacheKey: `cr-${story.id}-stakes-${c.id}` })
  }

  function lockWhy(said?: string) {
    const why = (said ?? whyText).trim()
    if (!picked || why.length < 2) return
    setWhys(w => [...w, { nodeId: node.id, choiceId: picked.id, choiceLabel: picked.label, why }])
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
    // event-handler timing reset — not render output
    // eslint-disable-next-line react-hooks/purity
    runStartMs.current = Date.now()
    setPhase('story')
    setDebrief([])
  }

  // Debrief on the existing mentor engine (safety-screened, logged for parents)
  function startDebrief() {
    setPhase('debrief')
    const opener = story.noWin && priorRunCount === 0
      ? `You couldn't win that one. Nobody could. So what were you actually choosing between?`
      : priorRunCount > 0
      ? `You've walked this crossroads before and chose differently this time. What changed your mind?`
      : `Quite a journey. Before we talk about how it ended — which of your choices was the hardest to make, and why?`
    setDebrief([{ role: 'assistant', content: opener }])
    void mentorAudio.speak(opener, mentorId)
  }

  async function sendDebrief(raw?: string) {
    const text = (raw ?? debriefInput).trim()
    if (!text || sending) return
    const history: Msg[] = [...debrief, { role: 'user', content: text }]
    setDebrief(history); setDebriefInput(''); setSending(true)
    let reply = 'Hmm, say that again?'
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
      if (data.response) reply = data.response
    } catch { /* keep fallback */ }
    setDebrief(h => [...h, { role: 'assistant', content: reply }])
    setSending(false)
    void mentorAudio.speak(reply, mentorId)
  }

  const whyVoice = useVoiceInput((said) => lockWhy(said))
  const debriefVoice = useVoiceInput((said) => { void sendDebrief(said) })
  const mentor = getMentorCharacter(mentorId)

  const micStateFor = (v: { listening: boolean }): MicState =>
    speaking ? 'speaking' : sending ? 'thinking' : v.listening ? 'listening' : 'idle'

  const visitedDecisions = path.filter(id => byId.get(id)?.type === 'decision')
  const beat = phase === 'debrief' ? 'conversation' : phase === 'ending' ? 'consequence' : picked ? 'decision' : 'story'
  const atWhyGate = phase === 'story' && node.type === 'decision' && picked !== null

  // ───────────────────────── render ─────────────────────────
  return (
    <EraAtmosphere era={(Math.min(Math.max(story.era, 1), 5)) as 1 | 2 | 3 | 4 | 5}>
      <div className={`ck-beat ck-beat--${beat}`} style={{ minHeight: '100dvh', paddingBottom: 60, color: 'var(--color-charcoal)' }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px' }}>
          <button
            onClick={() => { mentorAudio.stop(); router.push('/home') }}
            className="ck-lift"
            style={{ border: '2px solid var(--color-cream-border)', background: '#fff', borderRadius: 999, padding: '8px 16px', fontSize: 14, cursor: 'pointer', color: 'var(--color-charcoal)' }}
          >
            ← Map
          </button>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--color-teal)', fontWeight: 600 }}>
              Crossroads{runNumber > 1 ? ` · walk ${runNumber}` : ''}
            </div>
            <div style={{ ...serif, fontWeight: 600, fontSize: 18 }}>{story.title}</div>
          </div>
        </div>

        <div style={{ maxWidth: 640, margin: '0 auto', padding: '18px 18px 0' }}>

          {/* ── STORY ── */}
          {phase === 'story' && !atWhyGate && (
            <div key={nodeId} className="ck-panel-enter">
              <div className="ck-card">
                <div style={{ fontSize: 52, textAlign: 'center', marginBottom: 10 }}>{node.panelEmoji ?? '📜'}</div>
                {echoes.map((e, i) => (
                  <p key={i} className="ck-echo" style={{ fontSize: 15, fontStyle: 'italic', lineHeight: 1.55, opacity: 0.85 }}>
                    {e.narrationInsert}
                  </p>
                ))}
                <p style={{ fontSize: 17, lineHeight: 1.65, margin: 0 }}>{narration}</p>
              </div>

              {node.type === 'scene' && (
                <div style={{ marginTop: 16 }}>
                  <ChildButton onClick={() => advanceTo(node.nextNodeId!)} style={{ width: '100%' }}>
                    Continue →
                  </ChildButton>
                </div>
              )}

              {node.type === 'decision' && (
                <div style={{ marginTop: 20 }}>
                  <p style={{ ...serif, fontSize: 22, fontWeight: 600, textAlign: 'center', marginBottom: 14 }}>
                    What would you do?
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {(node.choices ?? []).map((c, i) => (
                      <button
                        key={c.id}
                        className="ck-card ck-card-tap ck-lift ck-enter-slow"
                        style={{ animationDelay: `${i * 450}ms`, border: '2px solid var(--color-cream-border)' }}
                        onClick={() => highlight(c)}
                      >
                        <div style={{ ...serif, fontWeight: 600, fontSize: 18 }}>{c.label}</div>
                        <div style={{ fontSize: 14.5, opacity: .75, marginTop: 6, lineHeight: 1.45 }}>⚖️ {c.stakesLine}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {visitedDecisions.length > 0 && node.type !== 'ending' && (
                <div style={{ marginTop: 22, fontSize: 13, opacity: .65 }}>
                  ⏪ Rewind to: {visitedDecisions.map(id => (
                    <button key={id} onClick={() => rewindTo(id)} style={{ border: '1px solid var(--color-cream-border)', background: '#fff', borderRadius: 999, padding: '4px 12px', margin: '0 4px', fontSize: 13, cursor: 'pointer', color: 'var(--color-teal)' }}>
                      {byId.get(id)?.panelEmoji} choice
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── WHY-GATE — its own beat. The story waits for a reason. ── */}
          {atWhyGate && picked && (
            <div className="ck-panel-enter" style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', paddingTop: 12 }}>
              <div className="ck-card" style={{ width: '100%', textAlign: 'center', borderColor: 'var(--color-gold)' }}>
                <div style={{ fontSize: 15, opacity: .7, marginBottom: 4 }}>You chose</div>
                <div style={{ ...serif, fontWeight: 600, fontSize: 20 }}>{picked.label}</div>
              </div>

              <h2 className="ck-whygate-title">Tell me why.</h2>

              {whyVoice.supported && !whyTyping && (
                <>
                  <MicButton
                    state={micStateFor(whyVoice)}
                    onPress={() => (whyVoice.listening ? whyVoice.stop() : whyVoice.start())}
                  />
                  {whyVoice.interim && (
                    <p style={{ fontSize: 16, fontStyle: 'italic', opacity: .8, margin: 0 }}>{whyVoice.interim}…</p>
                  )}
                </>
              )}

              {(whyTyping || !whyVoice.supported) ? (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <textarea
                    value={whyText}
                    onChange={e => setWhyText(e.target.value)}
                    placeholder="Because…"
                    autoFocus
                    style={{ width: '100%', minHeight: 72, border: '2px solid var(--color-cream-border)', borderRadius: 16, padding: '12px 14px', fontFamily: 'inherit', fontSize: 16, resize: 'vertical', boxSizing: 'border-box' }}
                  />
                  <ChildButton onClick={() => lockWhy()} disabled={whyText.trim().length < 2} style={{ width: '100%' }}>
                    That&apos;s my reason — continue →
                  </ChildButton>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setWhyTyping(true)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--color-charcoal)', opacity: .55, padding: 8 }}
                >
                  ⌨️ type instead
                </button>
              )}

              <button
                type="button"
                onClick={() => { setPicked(null); setWhyText(''); setWhyTyping(false) }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, opacity: .5, padding: 6 }}
              >
                ← let me look at the choices again
              </button>
            </div>
          )}

          {/* ── ENDING ── */}
          {(phase === 'ending' || phase === 'debrief') && (
            <div className="ck-panel-enter">
              <div className="ck-card" style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 52, textAlign: 'center', marginBottom: 10 }}>{node.panelEmoji}</div>
                <p style={{ fontSize: 17, lineHeight: 1.65, marginTop: 0 }}>{narration}</p>
                {node.endingSummary && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div style={{ background: '#FBEDE7', borderRadius: 14, padding: '12px 14px', fontSize: 14, lineHeight: 1.5 }}><b>What was lost</b><br />{node.endingSummary.whatWasLost}</div>
                    <div style={{ background: 'var(--color-teal-tint, #E1F5EE)', borderRadius: 14, padding: '12px 14px', fontSize: 14, lineHeight: 1.5 }}><b>What was gained</b><br />{node.endingSummary.whatWasGained}</div>
                  </div>
                )}
              </div>

              {/* The Path Map — the post-story centerpiece */}
              <PathMap story={story} path={path} byId={byId} trueRevealed={trueRevealed} onRewind={rewindTo} />

              {trueRevealed && (
                <div className="ck-card ck-enter-slow" style={{ borderColor: 'var(--color-teal)', margin: '16px 0' }}>
                  <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--color-teal)', fontWeight: 600, marginBottom: 6 }}>What really happened</div>
                  <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0 }}>{story.whatReallyHappened}</p>
                </div>
              )}

              {phase === 'ending' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
                  <ChildButton onClick={startDebrief} style={{ width: '100%' }}>
                    Talk it over with {mentorName} →
                  </ChildButton>
                  {visitedDecisions.map(id => (
                    <ChildButton key={id} variant="secondary" onClick={() => rewindTo(id)} style={{ width: '100%' }}>
                      ⏪ Rewind to the {byId.get(id)?.panelEmoji} choice
                    </ChildButton>
                  ))}
                </div>
              )}

              {phase === 'debrief' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <MentorAvatar emoji={mentor.emoji} name={mentorName} state={speaking ? 'speaking' : sending ? 'thinking' : 'idle'} size="sm" />
                  </div>
                  <TranscriptColumn>
                    {debrief.map((m, i) => (
                      <TranscriptBubble
                        key={i}
                        role={m.role === 'assistant' ? 'mentor' : 'child'}
                        who={m.role === 'assistant' ? mentorName : childName}
                        entering={i === debrief.length - 1}
                      >
                        {m.content}
                      </TranscriptBubble>
                    ))}
                    {debriefVoice.listening && debriefVoice.interim && (
                      <TranscriptBubble role="child" who={childName}>{debriefVoice.interim}…</TranscriptBubble>
                    )}
                    {sending && (
                      <TranscriptBubble role="mentor" who={mentorName}>
                        <span className="ck-dots" aria-hidden><span className="ck-dot" /><span className="ck-dot" /><span className="ck-dot" /></span>
                      </TranscriptBubble>
                    )}
                  </TranscriptColumn>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    {debriefVoice.supported && (
                      <MicButton
                        state={micStateFor(debriefVoice)}
                        onPress={() => (debriefVoice.listening ? debriefVoice.stop() : debriefVoice.start())}
                      />
                    )}
                    {(debriefTyping || !debriefVoice.supported) ? (
                      <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                        <input
                          value={debriefInput}
                          onChange={e => setDebriefInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && void sendDebrief()}
                          placeholder="Say what you think…"
                          autoFocus
                          style={{ flex: 1, border: '2px solid var(--color-cream-border)', borderRadius: 999, padding: '12px 16px', fontSize: 16, fontFamily: 'inherit' }}
                        />
                        <ChildButton onClick={() => void sendDebrief()} disabled={sending || !debriefInput.trim()}>Send</ChildButton>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDebriefTyping(true)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, opacity: .55, padding: 8 }}
                      >
                        ⌨️ type instead
                      </button>
                    )}
                  </div>

                  {debrief.filter(m => m.role === 'user').length >= 2 && (
                    <ChildButton onClick={() => { mentorAudio.stop(); router.push('/home') }} style={{ width: '100%' }}>
                      Finish — back to my path →
                    </ChildButton>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </EraAtmosphere>
  )
}

// ── Path Map: the child's route draws in gold; unexplored silhouettes shimmer
//    ("want to see?"); the True Path threads through in teal once revealed.
//    Also rendered by the Curiosity Journal as a fold-out page. ──
export function PathMap({ story, path, byId, trueRevealed, onRewind }: {
  story: CrossroadsStory
  path: string[]
  byId: Map<string, StoryNode>
  trueRevealed: boolean
  onRewind: (decisionNodeId: string) => void
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

  // The child's route as one polyline, so it can draw in end-to-end.
  const runPoints = path
    .map(id => pos.get(id))
    .filter((p): p is { x: number; y: number } => !!p)
    .map(p => `${p.x},${p.y}`)
    .join(' ')

  const hasUnexplored = [...pos.keys()].some(id => !onPath.has(id) && !(trueRevealed && trueSet.has(id)))

  return (
    <div className="ck-card ck-enter">
      <div style={{ fontFamily: 'var(--font-serif, Fraunces, Georgia, serif)', fontWeight: 600, fontSize: 20, marginBottom: 4 }}>
        Your path
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
        {/* silhouette web first, so the gold route draws over it */}
        {edges.map((e, i) => {
          const A = pos.get(e.a)!, B = pos.get(e.b)!
          if (e.onRun) return null
          const isTrue = trueRevealed && e.onTrue
          return (
            <line
              key={i}
              className={isTrue ? undefined : 'ck-pathmap-tempt'}
              x1={A.x} y1={A.y} x2={B.x} y2={B.y}
              stroke={isTrue ? 'var(--color-teal, #1B6E6B)' : '#B9B2A0'}
              strokeWidth={isTrue ? 3 : 2.5}
              strokeDasharray={isTrue ? '4 5' : undefined}
            />
          )
        })}
        {/* the child's route — gold, animated draw-in */}
        {runPoints && (
          <polyline
            className="ck-pathmap-run"
            points={runPoints}
            fill="none"
            stroke="var(--color-gold, #E8A33D)"
            strokeWidth={4.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {[...pos.entries()].map(([id, p]) => {
          const n = byId.get(id)!
          const visited = onPath.has(id)
          const isTrue = trueRevealed && trueSet.has(id)
          const fill = visited ? 'var(--color-gold, #E8A33D)' : isTrue ? 'var(--color-teal, #1B6E6B)' : '#fff'
          const g = (
            <g key={id} className={!visited && !isTrue ? 'ck-pathmap-tempt' : undefined}>
              <circle cx={p.x} cy={p.y} r={n.type === 'decision' ? 15 : 11} fill={fill} stroke="var(--color-charcoal, #233137)" strokeWidth={1.5} opacity={visited || isTrue ? 1 : 0.5} />
              <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={11}>{n.panelEmoji ?? ''}</text>
            </g>
          )
          // visited decisions on the map are tappable — rewind from here
          if (visited && n.type === 'decision') {
            return (
              <g key={id} onClick={() => onRewind(id)} style={{ cursor: 'pointer' }} role="button" aria-label="Rewind to this choice">
                {g}
              </g>
            )
          }
          return g
        })}
      </svg>
      <div style={{ display: 'flex', gap: 16, fontSize: 12.5, opacity: .75, marginTop: 6, flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--color-gold, #B57A17)' }}>— the way you went</span>
        {trueRevealed && <span style={{ color: 'var(--color-teal, #1B6E6B)' }}>┅ what really happened</span>}
        {hasUnexplored && <span>○ paths you haven&apos;t walked… want to see?</span>}
      </div>
    </div>
  )
}
