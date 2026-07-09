'use client'
import type { ReactNode } from 'react'

// Shared look + helpers for all four in-lesson mini-games.
// Self-styled (brand colors inline) so the games look right anywhere.

export const gc = {
  teal: '#1B6E6B',
  gold: '#E8A33D',
  cream: '#FBF6EC',
  navy: '#233137',
  border: '#E3DCC8',
  good: '#4F8B6E',
  think: '#D9714F',
  muted: '#B99A5A',
  bubble: '#E1F5EE',
}

export function GameShell({
  emoji,
  title,
  instruction,
  children,
}: {
  emoji: string
  title: string
  instruction: string
  children: ReactNode
}) {
  return (
    <div
      className="lc-game"
      style={{
        background: '#fff',
        border: `1px solid ${gc.border}`,
        borderRadius: 18,
        padding: 18,
        boxShadow: '0 1px 3px rgba(35,49,55,0.06)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4 }}>
        <span style={{ fontSize: 22 }} aria-hidden>
          {emoji}
        </span>
        <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 600, fontSize: 17, color: gc.navy }}>
          {title}
        </span>
        <span
          style={{
            marginLeft: 'auto',
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 9,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            color: gc.teal,
            background: gc.bubble,
            padding: '3px 8px',
            borderRadius: 999,
          }}
        >
          Quick game
        </span>
      </div>
      <p style={{ fontSize: 13, color: gc.navy, opacity: 0.72, marginBottom: 14, lineHeight: 1.5 }}>{instruction}</p>
      {children}
    </div>
  )
}

export type FeedbackTone = 'good' | 'think' | 'note'

export function Feedback({ tone = 'note', children }: { tone?: FeedbackTone; children: ReactNode }) {
  const map: Record<FeedbackTone, [string, string, string]> = {
    good: [gc.bubble, gc.good, '✨'],
    think: ['#FBEDE7', gc.think, '🤔'],
    note: [gc.cream, gc.muted, '💡'],
  }
  const [bg, fg, icon] = map[tone]
  return (
    <div
      role="status"
      style={{
        background: bg,
        border: `1px solid ${fg}66`,
        color: gc.navy,
        borderRadius: 12,
        padding: '10px 14px',
        fontSize: 13,
        lineHeight: 1.5,
        marginTop: 12,
        display: 'flex',
        gap: 9,
        alignItems: 'flex-start',
      }}
    >
      <span aria-hidden>{icon}</span>
      <span>{children}</span>
    </div>
  )
}

export function GameButton({
  children,
  onClick,
  disabled,
  variant = 'gold',
}: {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
  variant?: 'gold' | 'teal'
}) {
  const bg = variant === 'gold' ? gc.gold : gc.teal
  const fg = variant === 'gold' ? '#412402' : gc.cream
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        marginTop: 14,
        width: '100%',
        border: 'none',
        borderRadius: 999,
        padding: '12px 18px',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 600,
        fontSize: 15,
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: disabled ? '#E3DCC8' : bg,
        color: disabled ? '#9b9483' : fg,
        transition: 'background .15s, transform .1s',
      }}
    >
      {children}
    </button>
  )
}
