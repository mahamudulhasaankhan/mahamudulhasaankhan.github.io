import React, { useState, useEffect, useRef } from 'react'
import { Radio, Zap, ShieldCheck } from 'lucide-react'

const TARGET_TITLE = "MD MAHAMUDUL HASSAN"
const TARGET_SUB = "CORE-ACCESS NETWORK ENGINEER · AMBER IT"
const CYBER_CHARS = "01010101XYZ0123456789#@!&%Ø§"

export default function CyberIntroLoader({ onComplete }) {
  const [titleDisplay, setTitleDisplay] = useState(TARGET_TITLE.replace(/[^ ]/g, '0'))
  const [subDisplay, setSubDisplay] = useState(TARGET_SUB.replace(/[^ ]/g, '1'))
  const [progress, setProgress] = useState(0)
  const [isFinishing, setIsFinishing] = useState(false)
  const [isMounted, setIsMounted] = useState(true)

  const canvasRef = useRef(null)

  // 1. Subtle Matrix Cyber Rain Canvas in Background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const chars = '01BGPAS138378DWDMJUNOS100G'
    const fontSize = 14
    const cols = Math.floor(canvas.width / fontSize)
    const drops = Array(cols).fill(1)

    const draw = () => {
      ctx.fillStyle = 'rgba(8, 8, 10, 0.2)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#d4ff3f'
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillStyle = Math.random() > 0.9 ? '#ffffff' : (Math.random() > 0.4 ? '#d4ff3f' : '#00f0ff')
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animId)
  }, [])

  // 2. High-speed Matrix Scramble Decryption Logic
  useEffect(() => {
    let frame = 0
    const totalFrames = 36 // ~1.1 seconds at 30ms interval
    const titleLen = TARGET_TITLE.length
    const subLen = TARGET_SUB.length

    const interval = setInterval(() => {
      frame++
      const ratio = Math.min(1, frame / totalFrames)
      setProgress(Math.floor(ratio * 100))

      // Decrypt Title (Letter by letter reveal with scrambling ahead)
      const decodedTitleCount = Math.floor(ratio * titleLen)
      const scrambledTitle = TARGET_TITLE.split('').map((char, idx) => {
        if (char === ' ') return ' '
        if (idx <= decodedTitleCount) return char
        return CYBER_CHARS[Math.floor(Math.random() * CYBER_CHARS.length)]
      }).join('')
      setTitleDisplay(scrambledTitle)

      // Decrypt Subtitle
      const decodedSubCount = Math.floor(ratio * subLen)
      const scrambledSub = TARGET_SUB.split('').map((char, idx) => {
        if (char === ' ' || char === '·') return char
        if (idx <= decodedSubCount) return char
        return CYBER_CHARS[Math.floor(Math.random() * CYBER_CHARS.length)]
      }).join('')
      setSubDisplay(scrambledSub)

      if (frame >= totalFrames) {
        clearInterval(interval)
        setIsFinishing(true)
        setTimeout(() => {
          setIsMounted(false)
          onComplete?.()
        }, 400) // smooth exit fade
      }
    }, 32)

    return () => clearInterval(interval)
  }, [onComplete])

  // 3. Skip Listener (Click or ESC / Space)
  const handleSkip = () => {
    setIsFinishing(true)
    setTimeout(() => {
      setIsMounted(false)
      onComplete?.()
    }, 150)
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleSkip()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!isMounted) return null

  return (
    <div 
      onClick={handleSkip}
      className={`fixed inset-0 z-[100] bg-[#08080a] flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-500 overflow-hidden ${
        isFinishing ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Matrix Rain */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-20" />

      {/* Radial Vignette & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(8,8,10,0.4),rgba(8,8,10,0.95))] pointer-events-none" />

      {/* Central Cyber Scramble HUD */}
      <div className="relative z-10 max-w-2xl w-full px-6 flex flex-col items-center text-center space-y-6">
        
        {/* Top Protocol Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#101018] border border-[#232332] text-[11px] mono text-[#d4ff3f] shadow-[0_0_15px_rgba(212,255,63,0.15)]">
          <span className="w-2 h-2 rounded-full bg-[#d4ff3f] animate-ping" />
          <span className="tracking-widest uppercase">DECRYPTING CARRIER IDENTITY // AS138378</span>
        </div>

        {/* Main Decrypting Name */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mono tracking-tight text-white drop-shadow-[0_0_20px_rgba(212,255,63,0.3)]">
            {titleDisplay.split('').map((char, i) => {
              const isDecoded = progress === 100 || TARGET_TITLE[i] === char
              return (
                <span 
                  key={i} 
                  className={isDecoded ? 'text-white' : 'text-[#d4ff3f] font-mono'}
                >
                  {char}
                </span>
              )
            })}
          </h1>

          {/* Decrypting Subtitle */}
          <div className="text-xs sm:text-sm mono tracking-widest uppercase text-[#00f0ff] font-semibold">
            {subDisplay}
          </div>
        </div>

        {/* High-Tech Progress Bar */}
        <div className="w-full max-w-md space-y-2 pt-2">
          <div className="h-1.5 w-full bg-[#161622] rounded-full overflow-hidden border border-[#232336] p-[1px]">
            <div 
              className="h-full bg-gradient-to-r from-[#00f0ff] to-[#d4ff3f] rounded-full transition-all duration-75 shadow-[0_0_10px_#d4ff3f]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] mono text-[#7c7c90] px-1">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />
              <span>CLOS FABRIC: {progress}%</span>
            </span>
            <span>RTT: 0.8ms</span>
            <span className="text-[#d4ff3f] font-bold">
              {progress < 100 ? 'CONVERGING...' : 'ESTABLISHED'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Skip Indicator */}
      <div className="absolute bottom-8 flex items-center gap-2 text-[10px] mono text-[#606075] uppercase tracking-widest">
        <span>CLICK ANYWHERE OR PRESS</span>
        <kbd className="px-1.5 py-0.5 rounded bg-[#161620] border border-[#2a2a3a] text-slate-300">ESC</kbd>
        <span>TO SKIP</span>
      </div>
    </div>
  )
}
