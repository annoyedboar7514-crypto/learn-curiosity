'use client'
// The conversation beat. MicButton is the hero — the child talks to the
// mentor and hears the mentor talk back. The keyboard is always visible but
// secondary (typed fallback is first-class where speech isn't supported).

import { useState, useRef, useEffect } from 'react'
import type { Lesson, GradeBand } from '@/lib/content/lessonSchema'
import { getMentorCharacter } from '@/lib/mentor/mentor-characters'
import { GameMoment } from './games/GameMoment'
import { FairnessLine } from './games/FairnessLine'
import { KnowOrGuess } from './games/KnowOrGuess'
import { fairnessHostLine, knowGuessHostLine, type GameMomentResult } from '@/lib/content/game-moments'
import {
  MentorAvatar,
  MicButton,
  type MicState,
  TranscriptBubble,
  TranscriptColumn,
  mentorAudio,
  useVoiceInput,
} from '@/app/components/child-kit'

interface Message { role: 'mentor' | 'child'; text: string }

interface Props {
  lesson: Partial<Lesson>
  gradeBand: GradeBand
  childName: string
  mentorId: string
  mentorName: string
  choiceLabel: string
  sessionId: string
  onComplete: (data: { messages: Message[]; questionCount: number }) => void
}

export function Phase4Mentor({ lesson, gradeBand, childName, mentorId, mentorName, choiceLabel, sessionId, onComplete }: Props) {
  const mentor = getMentorCharacter(mentorId)
  const qBank = lesson.questionBanks?.[gradeBand]
  const openingText = qBank
    ? `You chose to ${choiceLabel.toLowerCase()}. ${qBank.entry}`
    : `You chose to ${choiceLabel.toLowerCase()}. What made you decide that?`

  const [messages, setMessages] = useState<Message[]>([{ role: 'mentor', text: openingText }])
  const [input, setInput] = useState('')
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [questionCount, setQuestionCount] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  // GameMoment — one mentor-hosted game beat per session, sliding up after
  // the first real exchange. Which game alternates by lesson (no per-lesson
  // data needed; both derive from the child's own choice).
  const [gamePhase, setGamePhase] = useState<'pending' | 'open' | 'done'>('pending')
  const [gameResult, setGameResult] = useState<GameMomentResult | null>(null)
  const whichGame: 'fairness-line' | 'know-or-guess' =
    (lesson.id ?? 0) % 2 === 0 ? 'fairness-line' : 'know-or-guess'

  useEffect(() => mentorAudio.subscribe(setSpeaking), [])

  // The mentor speaks the opening question aloud on arrival.
  const spokeOpening = useRef(false)
  useEffect(() => {
    if (spokeOpening.current) return
    spokeOpening.current = true
    void mentorAudio.speak(openingText, mentorId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const sendMessage = async (raw?: string) => {
    const childMsg = (raw ?? input).trim()
    if (!childMsg || isThinking) return
    setInput('')
    setMessages(prev => [...prev, { role: 'child', text: childMsg }])
    setIsThinking(true)

    const history = messages.map(m => ({
      role: m.role === 'mentor' ? 'assistant' : 'user' as const,
      content: m.text,
    }))
    history.push({ role: 'user', content: childMsg })

    // A finished GameMoment is injected into the mentor's context so the
    // conversation can build on what the child just showed about their thinking.
    const gameNote = gameResult
      ? `${gameResult.summary} If natural, react to this in ONE warm sentence — no scoring, no "right answer" talk.`
      : null
    const bank = gameNote
      ? { entry: qBank?.entry ?? '', core: [gameNote, ...(qBank?.core ?? [])], deep: qBank?.deep ?? [], disengagement: qBank?.disengagement ?? 'Tell me more about that.' }
      : qBank

    let reply = qBank?.disengagement ?? 'Tell me more — what made you think of that?'
    try {
      const res = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          lessonId: lesson.id, lessonTitle: lesson.title,
          pillar: lesson.pillar, gradeBand, childName, mentorName,
          choiceLabel, questionBank: bank, history, questionCount,
        }),
      })
      const data = await res.json()
      if (data.response) reply = data.response
      setQuestionCount(q => q + 1)
    } catch { /* fall back to the question bank line */ }
    setMessages(prev => [...prev, { role: 'mentor', text: reply }])
    setIsThinking(false)
    void mentorAudio.speak(reply, mentorId)
    // After the first full exchange, the mentor hosts the game beat.
    setGamePhase(g => (g === 'pending' ? 'open' : g))
  }

  const voice = useVoiceInput((said) => { void sendMessage(said) })

  const micState: MicState =
    speaking ? 'speaking'
    : isThinking ? 'thinking'
    : voice.listening ? 'listening'
    : 'idle'

  const isComplete = questionCount >= 3

  return (
    <div className="ck-enter" style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 640, margin: '0 auto' }}>
      {/* Mentor presence */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <MentorAvatar
          emoji={mentor.emoji}
          name={mentorName}
          state={speaking ? 'speaking' : isThinking ? 'thinking' : 'idle'}
          size="md"
        />
      </div>

      {/* Live transcript */}
      <TranscriptColumn>
        {messages.map((m, i) => (
          <TranscriptBubble
            key={i}
            role={m.role}
            who={m.role === 'mentor' ? mentorName : childName}
            entering={i === messages.length - 1}
          >
            {m.text}
          </TranscriptBubble>
        ))}
        {voice.listening && voice.interim && (
          <TranscriptBubble role="child" who={childName} className="ck-enter" >
            {voice.interim}…
          </TranscriptBubble>
        )}
        {isThinking && (
          <TranscriptBubble role="mentor" who={mentorName}>
            <span className="ck-dots" aria-hidden>
              <span className="ck-dot" /><span className="ck-dot" /><span className="ck-dot" />
            </span>
          </TranscriptBubble>
        )}
        <div ref={bottomRef} />
      </TranscriptColumn>

      {/* Complete */}
      {isComplete && (
        <div className="ck-card ck-enter" style={{ textAlign: 'center' }}>
          {lesson.mentorClosing && (
            <p style={{ fontFamily: 'var(--font-serif, Fraunces, serif)', fontSize: 18, lineHeight: 1.5, marginTop: 0 }}>
              {lesson.mentorClosing}
            </p>
          )}
          <button
            type="button"
            className="ck-btn ck-btn--primary"
            onClick={() => { mentorAudio.stop(); onComplete({ messages, questionCount }) }}
          >
            Back to the map ✦
          </button>
        </div>
      )}

      {/* GameMoment — slides up over the lower half; the mentor stays visible */}
      {gamePhase === 'open' && (
        <GameMoment
          mentorId={mentorId}
          hostLine={whichGame === 'fairness-line' ? fairnessHostLine() : knowGuessHostLine()}
        >
          {whichGame === 'fairness-line' ? (
            <FairnessLine
              choiceLabel={choiceLabel}
              mentorId={mentorId}
              onDone={(r) => { setGameResult(r); setGamePhase('done') }}
            />
          ) : (
            <KnowOrGuess
              choiceLabel={choiceLabel}
              mentorId={mentorId}
              onDone={(r) => { setGameResult(r); setGamePhase('done') }}
            />
          )}
        </GameMoment>
      )}

      {/* Voice-first input: mic hero, keyboard always visible but secondary */}
      {!isComplete && gamePhase !== 'open' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, paddingBottom: 12 }}>
          {voice.supported && (
            <MicButton
              state={micState}
              onPress={() => (voice.listening ? voice.stop() : voice.start())}
            />
          )}
          {(showKeyboard || !voice.supported) ? (
            <div style={{ display: 'flex', gap: 8, width: '100%', maxWidth: 520 }}>
              <textarea
                autoFocus={voice.supported}
                style={{
                  flex: 1, resize: 'none', fontSize: 17, lineHeight: 1.4, padding: '12px 14px',
                  borderRadius: 16, border: '2px solid var(--color-cream-border)', fontFamily: 'inherit',
                }}
                placeholder={gradeBand === 'k2' ? 'What do you think?' : 'Type your thoughts…'}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void sendMessage() } }}
                rows={1}
              />
              <button
                type="button"
                className="ck-btn ck-btn--primary"
                style={{ minWidth: 56 }}
                disabled={!input.trim() || isThinking}
                onClick={() => void sendMessage()}
                aria-label="Send"
              >
                ↑
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowKeyboard(true)}
              aria-label="Type instead"
              style={{
                background: 'none', border: 'none', cursor: 'pointer', fontSize: 14,
                color: 'var(--color-charcoal)', opacity: 0.55, padding: 8,
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              ⌨️ type instead
            </button>
          )}
        </div>
      )}
    </div>
  )
}
