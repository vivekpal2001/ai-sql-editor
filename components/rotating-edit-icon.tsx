'use client'

import { useEffect, useRef, useState } from 'react'

export function RotatingEditIcon() {
  const iconRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!iconRef.current) return
      
      const rect = iconRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY
      
      // Calculate rotation based on mouse position
      const rotateY = (deltaX / window.innerWidth) * 60 // Max 60 degrees
      const rotateX = -(deltaY / window.innerHeight) * 60 // Max 60 degrees
      
      setRotation({ x: rotateX, y: rotateY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="flex items-center justify-center h-96">
      <div
        ref={iconRef}
        className="transition-transform duration-100 ease-out"
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          className="drop-shadow-2xl"
          style={{
            filter: 'drop-shadow(0 20px 40px rgba(16, 185, 129, 0.3))'
          }}
        >
          {/* Background circle with gradient */}
          <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
            <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f0fdf4" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Main background circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="url(#bgGradient)"
            filter="url(#glow)"
          />
          
          {/* Inner shadow circle */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
          />
          
          {/* Edit/Pencil Icon */}
          <g transform="translate(100, 100)">
            {/* Pencil body */}
            <rect
              x="-3"
              y="-35"
              width="6"
              height="50"
              fill="url(#iconGradient)"
              rx="3"
              transform="rotate(45)"
            />
            
            {/* Pencil tip */}
            <polygon
              points="0,-45 -5,-35 5,-35"
              fill="#fbbf24"
              transform="rotate(45)"
            />
            
            {/* Pencil eraser */}
            <rect
              x="-4"
              y="12"
              width="8"
              height="8"
              fill="#ef4444"
              rx="4"
              transform="rotate(45)"
            />
            
            {/* Pencil metal band */}
            <rect
              x="-3"
              y="8"
              width="6"
              height="4"
              fill="#9ca3af"
              transform="rotate(45)"
            />
            
            {/* Edit lines/strokes */}
            <g transform="rotate(-45)">
              <line x1="-25" y1="-10" x2="-15" y2="-10" stroke="url(#iconGradient)" strokeWidth="2" strokeLinecap="round"/>
              <line x1="-25" y1="-5" x2="-10" y2="-5" stroke="url(#iconGradient)" strokeWidth="2" strokeLinecap="round"/>
              <line x1="-25" y1="0" x2="-12" y2="0" stroke="url(#iconGradient)" strokeWidth="2" strokeLinecap="round"/>
              <line x1="-25" y1="5" x2="-18" y2="5" stroke="url(#iconGradient)" strokeWidth="2" strokeLinecap="round"/>
            </g>
            
            {/* Sparkle effects */}
            <g fill="url(#iconGradient)" opacity="0.8">
              <circle cx="25" cy="-25" r="2"/>
              <circle cx="-30" cy="20" r="1.5"/>
              <circle cx="30" cy="25" r="1"/>
              <circle cx="-25" cy="-30" r="1"/>
            </g>
            
            {/* Plus signs for editing effect */}
            <g stroke="url(#iconGradient)" strokeWidth="2" strokeLinecap="round" opacity="0.6">
              <line x1="35" y1="-15" x2="35" y2="-5"/>
              <line x1="30" y1="-10" x2="40" y2="-10"/>
              <line x1="-35" y1="15" x2="-35" y2="25"/>
              <line x1="-40" y1="20" x2="-30" y2="20"/>
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}
