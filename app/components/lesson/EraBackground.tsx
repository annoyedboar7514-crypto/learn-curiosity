'use client'
import { useEffect, useRef } from 'react'
import { ERA_CONFIG } from '@/lib/content/eraConfig'
import type { Era } from '@/lib/content/lessonSchema'

interface Props {
  era: Era
  scene?: string
}

export function EraBackground({ era }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const config = ERA_CONFIG[era]

  useEffect(() => {
    if (!config.starField) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    const stars = Array.from({ length: 60 }, (_, i) => ({
      x: ((i * 137.5) % canvas.width),
      y: ((i * 97.3) % canvas.height),
      r: (i % 3) * 0.5 + 0.5,
      opacity: (i % 7) * 0.1 + 0.3,
      speed: (i % 5) * 0.005 + 0.005,
      phase: i,
    }))
    let frame: number
    let tick = 0
    const animate = () => {
      tick++
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => {
        const op = s.opacity + Math.sin((tick + s.phase * 20) * s.speed) * 0.15
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(232, 163, 61, ${Math.max(0.1, Math.min(1, op))})`
        ctx.fill()
      })
      frame = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(frame)
  }, [era, config.starField])

  return (
    <div className="absolute inset-0" style={{ background: config.gradient }}>
      {config.starField && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      )}
    </div>
  )
}
