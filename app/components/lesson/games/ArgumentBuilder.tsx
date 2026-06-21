'use client'
import { useState } from 'react'
import type { MiniGame } from '@/lib/content/lessonSchema'

export function ArgumentBuilder({ game }: { game: MiniGame }) {
  const [selectedClaim, setSelectedClaim] = useState<number | null>(null)
  const [selectedReason, setSelectedReason] = useState<number | null>(null)

  return (
    <div
      className="rounded-2xl p-5 mb-5"
      style={{ background: 'linear-gradient(135deg, rgba(232,163,61,0.08), rgba(27,110,107,0.08))', border: '2px dashed #E8A33D' }}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">🧩</span>
        <span className="font-mono text-xs uppercase tracking-wide text-gray-600">Build the Argument</span>
      </div>
      <p className="text-sm mb-4 font-medium" style={{ color: '#233137' }}>Step 1: Pick your position</p>
      <div className="flex flex-col gap-2 mb-5">
        {game.claims?.map((claim, i) => (
          <button
            key={i}
            onClick={() => { setSelectedClaim(i); setSelectedReason(null) }}
            className="text-left p-3 rounded-xl text-sm font-medium transition-all"
            style={{
              border: selectedClaim === i ? '2px solid #1B6E6B' : '2px solid #E3DCC8',
              background: selectedClaim === i ? 'rgba(27,110,107,0.08)' : '#fff',
              color: selectedClaim === i ? '#1B6E6B' : '#233137',
            }}
          >
            {claim}
          </button>
        ))}
      </div>
      {selectedClaim !== null && (
        <>
          <p className="text-sm mb-4 font-medium" style={{ color: '#233137' }}>Step 2: Choose the reason that actually proves it</p>
          <div className="flex flex-col gap-2">
            {game.reasons?.map((reason, i) => (
              <button
                key={i}
                onClick={() => setSelectedReason(i)}
                className="text-left p-3 rounded-xl text-sm transition-all"
                style={{
                  border: selectedReason === i ? '2px solid #E8A33D' : '2px solid #E3DCC8',
                  background: selectedReason === i ? 'rgba(232,163,61,0.1)' : '#fff',
                  color: '#233137',
                }}
              >
                {reason}
              </button>
            ))}
          </div>
          {selectedReason !== null && (
            <div className="mt-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(27,110,107,0.08)', color: '#1B6E6B' }}>
              <strong>Your argument:</strong> {game.claims![selectedClaim]} — {game.reasons![selectedReason]}
            </div>
          )}
        </>
      )}
    </div>
  )
}
