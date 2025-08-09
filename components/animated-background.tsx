'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
}

export function AnimatedTechBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number | null>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = []
      for (let i = 0; i < 80; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.6 + 0.2
        })
      }
    }

    initParticles()

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update particles
      particlesRef.current.forEach(particle => {
        // Mouse interaction
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 200) {
          const force = (200 - distance) / 200 * 0.03
          particle.vx += (dx / distance) * force
          particle.vy += (dy / distance) * force
        }

        particle.x += particle.vx
        particle.y += particle.vy

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Apply friction
        particle.vx *= 0.995
        particle.vy *= 0.995

        // Draw particle with glow effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        )
        gradient.addColorStop(0, `rgba(16, 185, 129, ${particle.opacity})`)
        gradient.addColorStop(1, `rgba(16, 185, 129, 0)`)
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
        ctx.fill()

        // Draw core particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(20, 184, 166, ${particle.opacity})`
        ctx.fill()
      })

      // Draw connections
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i]
          const p2 = particlesRef.current[j]
          const dx = p2.x - p1.x
          const dy = p2.y - p1.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            const opacity = (150 - distance) / 150 * 0.2
            const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y)
            gradient.addColorStop(0, `rgba(16, 185, 129, ${opacity})`)
            gradient.addColorStop(1, `rgba(20, 184, 166, ${opacity})`)
            
            ctx.strokeStyle = gradient
            ctx.lineWidth = 1.5
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }

      // Draw animated grid lines
      const time = Date.now() * 0.0005
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.05)'
      ctx.lineWidth = 1

      // Dynamic vertical lines
      for (let x = 0; x < canvas.width; x += 120) {
        const offset = Math.sin(time + x * 0.01) * 15
        const opacity = (Math.sin(time * 2 + x * 0.01) + 1) * 0.05
        ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`
        ctx.beginPath()
        ctx.moveTo(x + offset, 0)
        ctx.lineTo(x + offset, canvas.height)
        ctx.stroke()
      }

      // Dynamic horizontal lines
      for (let y = 0; y < canvas.height; y += 120) {
        const offset = Math.cos(time + y * 0.01) * 15
        const opacity = (Math.cos(time * 2 + y * 0.01) + 1) * 0.05
        ctx.strokeStyle = `rgba(20, 184, 166, ${opacity})`
        ctx.beginPath()
        ctx.moveTo(0, y + offset)
        ctx.lineTo(canvas.width, y + offset)
        ctx.stroke()
      }

      // Draw flowing data streams
      ctx.lineWidth = 3
      for (let i = 0; i < 6; i++) {
        const progress = (time * 0.3 + i * 0.3) % 1
        const startX = -200
        const endX = canvas.width + 200
        const x = startX + (endX - startX) * progress
        const y = 80 + i * 120 + Math.sin(time * 2 + i) * 40

        // Create flowing gradient
        const gradient = ctx.createLinearGradient(x - 100, y, x + 100, y)
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0)')
        gradient.addColorStop(0.5, 'rgba(20, 184, 166, 0.8)')
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0)')
        
        ctx.strokeStyle = gradient
        ctx.beginPath()
        ctx.moveTo(x - 100, y)
        ctx.lineTo(x + 100, y)
        ctx.stroke()

        // Add pulsing data nodes
        ctx.fillStyle = `rgba(20, 184, 166, ${0.6 + Math.sin(time * 4 + i) * 0.4})`
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()

        // Add trailing effect
        for (let j = 1; j <= 5; j++) {
          const trailX = x - j * 20
          const trailOpacity = (6 - j) / 6 * 0.3
          ctx.fillStyle = `rgba(20, 184, 166, ${trailOpacity})`
          ctx.beginPath()
          ctx.arc(trailX, y, 2, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Draw pulse waves from mouse
      const pulseRadius = (Date.now() * 0.002) % 200
      ctx.strokeStyle = `rgba(16, 185, 129, ${(200 - pulseRadius) / 200 * 0.3})`
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(mouseRef.current.x, mouseRef.current.y, pulseRadius, 0, Math.PI * 2)
      ctx.stroke()

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Mouse event handlers
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none opacity-80"
      style={{ background: 'transparent' }}
    />
  )
}
