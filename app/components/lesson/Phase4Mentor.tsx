'use client'
import { useState, useRef, useEffect } from 'react'
import type { Lesson, GradeBand } from '@/lib/content/lessonSchema'

interface Message { role: 'mentor' | 'child'; text: string }

interface Props {
  lesson: Partial<Lesson>
  gradeBand: GradeBand
  childName: string
  mentorName: string
  choiceLabel: string
  onComplete: (data: { messages: Message[]; questionCount: number }) => void
}

const MENTOR_EMOJI: Record<string, string> = {
  k2: '🌟',
  grade34: '🔭',
  grade56: '🦉',
}

export function Phase4Mentor({ lesson, gradeBand, childName, mentorName, choiceLabel, onComplete }: Props) {
  const qBank = lesson.questionBanks?.[gradeBand]
  const openingText = qBank
    ? `You chose to ${choiceLabel.toLowerCase()}. ${qBank.entry}`
    : `You chose to ${choiceLabel.toLowerCase()}. What made you decide that?`

  const [messages, setMessages] = useState<Message[]>([{ role: 'mentor', text: openingText }])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [questionCount, setQuestionCount] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const sendMessage = async () => {
    if (!input.trim() || isThinking) return
    const childMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'child', text: childMsg }])
    setIsThinking(true)

    const history = messages.map(m => ({
      role: m.role === 'mentor' ? 'assistant' : 'user' as const,
      content: m.text,
    }))
    history.push({ role: 'user', content: childMsg })

    try {
      const res = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: lesson.id, lessonTitle: lesson.title,
          pillar: lesson.pillar, gradeBand, childName, mentorName,
          choiceLabel, questionBank: qBank, history, questionCount,
        }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'mentor', text: data.response ?? qBank?.disengagement ?? 'Tell me more about that.' }])
      setQuestionCount(q => q + 1)
    } catch {
      setMessages(prev => [...prev, { role: 'mentor', text: qBank?.disengagement ?? 'Tell me more — what made you think of that?' }])
    }
    setIsThinking(false)
  }

  const isComplete = questionCount >= 3
  const progress = Math.min(questionCount, 3)

  return (
    <div className="lc-phase-in">
      <div className="lc-mentor-card">
        {/* Header */}
        <div className="lc-mentor-header">
          <div className="lc-mentor-avatar">{MENTOR_EMOJI[gradeBand] ?? '🌟'}</div>
          <div>
            <div className="lc-mentor-name">{mentorName}</div>
            <div className="lc-mentor-status">● thinking with you</div>
          </div>
          <div className="lc-mentor-progress">
            <div className="lc-mp-label">{progress}/3 exchanges</div>
            <div className="lc-mp-bar">
              <div className="lc-mp-fill" style={{ width: `${(progress / 3) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="lc-messages">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`lc-msg ${m.role === 'mentor' ? 'lc-msg-mentor' : 'lc-msg-child'}`}
            >
              <div className="lc-bubble">{m.text}</div>
            </div>
          ))}
          {isThinking && (
            <div className="lc-msg lc-thinking">
              <div className="lc-bubble">
                <div className="lc-dots">
                  <span className="lc-dot" />
                  <span className="lc-dot" />
                  <span className="lc-dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="lc-input-row">
          <textarea
            className="lc-input"
            placeholder={gradeBand === 'k2' ? 'What do you think?' : 'Type your thoughts...'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            rows={1}
          />
          <button
            className="lc-send"
            disabled={!input.trim() || isThinking}
            onClick={sendMessage}
            aria-label="Send"
          >
            ↑
          </button>
        </div>

        {/* Complete */}
        {isComplete && (
          <div className="lc-complete-zone">
            {lesson.mentorClosing && (
              <p className="lc-closing-txt">{lesson.mentorClosing}</p>
            )}
            <button
              className="lc-btn lc-btn-gold"
              onClick={() => onComplete({ messages, questionCount })}
            >
              Complete this level ✦
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
