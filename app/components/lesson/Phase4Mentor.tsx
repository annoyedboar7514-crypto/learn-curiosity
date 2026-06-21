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
  }, [messages])

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
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          pillar: lesson.pillar,
          gradeBand,
          childName,
          mentorName,
          choiceLabel,
          questionBank: qBank,
          history,
          questionCount,
        }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'mentor', text: data.response ?? qBank?.disengagement ?? "Tell me more about that." }])
      setQuestionCount(q => q + 1)
    } catch {
      setMessages(prev => [...prev, { role: 'mentor', text: qBank?.disengagement ?? "Tell me more — what made you think of that?" }])
    }
    setIsThinking(false)
  }

  const isComplete = questionCount >= 3

  const inputPlaceholder = gradeBand === 'k2' ? 'What do you think?' : 'Type your thoughts...'

  return (
    <div className="rounded-2xl overflow-hidden mb-5" style={{ border: '1px solid #E3DCC8', background: '#fff' }}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4" style={{ borderBottom: '1px solid #E3DCC8' }}>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #1B6E6B, rgba(27,110,107,0.7))' }}
        >
          🌟
        </div>
        <div>
          <p className="font-semibold text-sm" style={{ color: '#233137' }}>{mentorName}</p>
          <p className="text-xs font-mono" style={{ color: '#1B6E6B' }}>● thinking with you</p>
        </div>
      </div>

      {/* Messages */}
      <div className="p-4 flex flex-col gap-3 overflow-y-auto" style={{ maxHeight: '280px' }}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'child' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="max-w-xs px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
              style={
                m.role === 'mentor'
                  ? { background: 'rgba(27,110,107,0.08)', border: '1px solid rgba(27,110,107,0.15)', borderBottomLeftRadius: '4px', color: '#233137' }
                  : { background: '#1B6E6B', color: '#FBF6EC', borderBottomRightRadius: '4px' }
              }
            >
              {m.text}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div
              className="px-4 py-2.5 rounded-2xl text-sm"
              style={{ background: 'rgba(27,110,107,0.08)', border: '1px solid rgba(27,110,107,0.15)', borderBottomLeftRadius: '4px', color: 'rgba(27,110,107,0.6)' }}
            >
              thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 flex gap-2" style={{ borderTop: '1px solid #E3DCC8' }}>
        <input
          className="flex-1 rounded-lg px-3 py-2 text-sm outline-none transition-all"
          style={{ border: '1px solid #E3DCC8', background: '#FBF6EC', color: '#233137' }}
          placeholder={inputPlaceholder}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          onFocus={e => (e.target.style.borderColor = '#1B6E6B')}
          onBlur={e => (e.target.style.borderColor = '#E3DCC8')}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || isThinking}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-white transition-all flex-shrink-0"
          style={{ background: input.trim() && !isThinking ? '#1B6E6B' : '#E3DCC8' }}
        >
          ↑
        </button>
      </div>

      {/* Complete */}
      {isComplete && (
        <div className="p-4" style={{ borderTop: '1px solid #E3DCC8' }}>
          <p className="text-xs text-center mb-3 italic" style={{ color: '#9CA3AF' }}>
            {lesson.mentorClosing}
          </p>
          <button
            onClick={() => onComplete({ messages, questionCount })}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
            style={{ background: '#1B6E6B', color: '#FBF6EC' }}
          >
            Complete this level ✦
          </button>
        </div>
      )}
    </div>
  )
}
