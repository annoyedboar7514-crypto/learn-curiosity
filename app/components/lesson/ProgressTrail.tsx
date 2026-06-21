'use client'

interface Props {
  phase: number
  labels: string[]
  onSelect?: (phase: number) => void
}

export function ProgressTrail({ phase, labels, onSelect }: Props) {
  return (
    <div className="flex items-center justify-center gap-0 px-4 py-3 bg-white border-b border-gray-100">
      {labels.map((label, i) => (
        <div key={i} className="flex items-center">
          <button
            onClick={() => i < phase && onSelect?.(i)}
            className="flex flex-col items-center gap-1 px-2"
            style={{ cursor: i < phase ? 'pointer' : 'default' }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
              style={{
                background: i === phase ? '#1B6E6B' : i < phase ? '#E8A33D' : '#E3DCC8',
                color: i <= phase ? '#fff' : '#9ca3af',
                boxShadow: i === phase ? '0 0 0 3px rgba(27,110,107,0.2)' : 'none',
              }}
            >
              {i < phase ? '✓' : i + 1}
            </div>
            <span
              className="text-xs font-medium hidden sm:block"
              style={{ color: i === phase ? '#1B6E6B' : i < phase ? '#E8A33D' : '#9ca3af' }}
            >
              {label}
            </span>
          </button>
          {i < labels.length - 1 && (
            <div
              className="w-8 h-0.5 mx-1"
              style={{ background: i < phase ? '#E8A33D' : '#E3DCC8' }}
            />
          )}
        </div>
      ))}
    </div>
  )
}
