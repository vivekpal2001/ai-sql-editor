'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface TechIcon {
  id: string
  name: string
  icon: string
  color: string
  x: number
  y: number
  vx: number
  vy: number
  size: number
}

export function AnimatedTechStack() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const animationRef = useRef<number | null>(null)
  const techIconsRef = useRef<TechIcon[]>([])

  const techStack = [
    { name: 'PostgreSQL', icon: '🐘', color: '#336791' },
    { name: 'MySQL', icon: '🐬', color: '#00758F' },
    { name: 'Database', icon: '🗄️', color: '#2D3748' },
    { name: 'SQL', icon: '📊', color: '#F29111' },
  ]

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      const container = containerRef.current
      if (!container) return
      
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize tech icons
    techIconsRef.current = techStack.map((tech, index) => ({
      id: tech.name,
      name: tech.name,
      icon: tech.icon,
      color: tech.color,
      x: (canvas.width / (techStack.length + 1)) * (index + 1),
      y: canvas.height / 2 + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: 40 + Math.random() * 10,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw tech icons
      techIconsRef.current.forEach((icon, index) => {
        // Mouse interaction - stronger attraction
        if (isHovered) {
          const dx = mousePos.x - icon.x
          const dy = mousePos.y - icon.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 150) {
            const force = (150 - distance) / 150
            icon.vx += (dx / distance) * force * 0.03
            icon.vy += (dy / distance) * force * 0.03
          }
        }

        // Update position
        icon.x += icon.vx
        icon.y += icon.vy

        // Bounce off walls with more energy
        if (icon.x < icon.size/2 || icon.x > canvas.width - icon.size/2) {
          icon.vx *= -0.9
          icon.x = Math.max(icon.size/2, Math.min(canvas.width - icon.size/2, icon.x))
        }
        if (icon.y < icon.size/2 || icon.y > canvas.height - icon.size/2) {
          icon.vy *= -0.9
          icon.y = Math.max(icon.size/2, Math.min(canvas.height - icon.size/2, icon.y))
        }

        // Apply less friction for more movement
        icon.vx *= 0.98
        icon.vy *= 0.98

        // Draw connections to nearby icons
        techIconsRef.current.forEach((otherIcon, otherIndex) => {
          if (index >= otherIndex) return
          
          const dx = otherIcon.x - icon.x
          const dy = otherIcon.y - icon.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 180) {
            const opacity = (180 - distance) / 180 * 0.4
            ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(icon.x, icon.y)
            ctx.lineTo(otherIcon.x, otherIcon.y)
            ctx.stroke()
          }
        })

        // Draw icon emoji/symbol only (no background)
        ctx.font = `${icon.size * 0.7}px serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = icon.color
        ctx.fillText(icon.icon, icon.x, icon.y)

        // Draw label with better visibility
        ctx.font = 'bold 14px system-ui, sans-serif'
        ctx.fillStyle = icon.color
        ctx.fillText(icon.name, icon.x, icon.y + icon.size/2 + 20)
      })

      // Draw cursor effect - more prominent
      if (isHovered) {
        const gradient = ctx.createRadialGradient(mousePos.x, mousePos.y, 0, mousePos.x, mousePos.y, 80)
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.5)')
        gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.2)')
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0)')
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(mousePos.x, mousePos.y, 80, 0, Math.PI * 2)
        ctx.fill()

        // Draw cursor ring
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(mousePos.x, mousePos.y, 25, 0, Math.PI * 2)
        ctx.stroke()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mousePos, isHovered])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[400px] rounded-2xl border bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur overflow-hidden cursor-none"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 left-4 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          Database Technologies
        </div>
        <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
          Hover to interact with icons
        </div>
      </div>
    </div>
  )
}
