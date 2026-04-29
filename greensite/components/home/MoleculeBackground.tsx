'use client'

import { useEffect, useRef } from 'react'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  homeX: number
  homeY: number
}

function makeCluster(cx: number, cy: number, count: number, spread: number): Node[] {
  return Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2
    const dist = Math.random() * spread
    const x = cx + Math.cos(angle) * dist
    const y = cy + Math.sin(angle) * dist
    return {
      x,
      y,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2.5 + 1.2,
      opacity: Math.random() * 0.12 + 0.07,
      homeX: cx,
      homeY: cy,
    }
  })
}

export default function MoleculeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let nodes: Node[] = []

    const buildNodes = () => {
      const W = canvas.width
      const H = canvas.height
      // Margin zone: left 0–340px, right (W-340)–W
      const LX = 340
      const RX = W - 340

      const rand = (min: number, max: number) => Math.random() * (max - min) + min

      // Random anchor points scattered across both margin zones
      const leftAnchors = Array.from({ length: 7 }, () => ({
        x: rand(30, LX),
        y: rand(40, H - 40),
      }))
      const rightAnchors = Array.from({ length: 7 }, () => ({
        x: rand(RX, W - 30),
        y: rand(40, H - 40),
      }))

      nodes = [...leftAnchors, ...rightAnchors].flatMap(a =>
        makeCluster(a.x, a.y, rand(5, 10), rand(70, 130))
      )
    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      buildNodes()
    }
    resize()
    window.addEventListener('resize', resize)

    let animId: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const n of nodes) {
        // Very gentle pull toward home — loose enough to feel chaotic
        n.vx += (n.homeX - n.x) * 0.00015
        n.vy += (n.homeY - n.y) * 0.00015

        // Small random jitter for organic feel
        n.vx += (Math.random() - 0.5) * 0.02
        n.vy += (Math.random() - 0.5) * 0.02

        // Speed cap
        const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy)
        if (speed > 0.6) { n.vx *= 0.6 / speed; n.vy *= 0.6 / speed }

        n.x += n.vx
        n.y += n.vy

        ctx.beginPath()
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${n.opacity})`
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
