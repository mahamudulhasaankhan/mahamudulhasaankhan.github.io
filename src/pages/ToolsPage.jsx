import React, { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  ExternalLink, 
  ShieldCheck, 
  Activity, 
  Share2, 
  Check, 
  Layers,
  Sparkles
} from 'lucide-react'
import NetworkToolbox from '../components/NetworkToolbox'

export default function ToolsPage({ onBack, initialTab }) {
  const [copiedLink, setCopiedLink] = useState(false)

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[#08080a] text-[#f4f4f2] selection:bg-[#d4ff3f] selection:text-[#08080a] flex flex-col font-sans">
      {/* Top Standalone Header */}
      <header className="sticky top-0 z-50 bg-[#08080a]/95 backdrop-blur-md border-b border-[#1c1c24] px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Back button */}
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#121218] border border-[#262632] text-xs mono text-slate-300 hover:text-[#d4ff3f] hover:border-[#d4ff3f] transition-all group shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[#d4ff3f]" />
            <span className="font-semibold uppercase tracking-wider">Back to Portfolio</span>
          </button>

          {/* NOC Telemetry Branding */}
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4ff3f] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#d4ff3f]"></span>
            </span>
            <div className="hidden sm:block">
              <span className="text-xs mono font-bold tracking-widest uppercase text-white">MAHAMUDUL // NOC TOOLBOX</span>
              <span className="text-[10px] mono text-[#888898] ml-2 font-medium">9 ENGINES ONLINE · 100% CLIENT-SIDE</span>
            </div>
          </div>

          {/* Share / Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121218] border border-[#262632] text-xs mono text-slate-300 hover:text-white hover:border-[#404052] transition-all"
              title="Copy link to this tool"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-[#d4ff3f]" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{copiedLink ? 'Link Copied' : 'Share Tool'}</span>
            </button>
            <a
              href="https://github.com/mahamudulhasaankhan"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#121218] border border-[#262632] text-xs mono text-slate-300 hover:text-[#d4ff3f] hover:border-[#d4ff3f] transition-all hidden sm:flex items-center gap-1.5"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Tools Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <NetworkToolbox isStandalone={true} onBack={onBack} initialTab={initialTab} />
      </main>

      {/* Dedicated Standalone Footer */}
      <footer className="border-t border-[#1c1c24] bg-[#0c0c10] px-4 sm:px-6 lg:px-8 py-8 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs mono text-[#888894]">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="text-[#d4ff3f] hover:underline flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Main Portfolio</span>
            </button>
            <span>•</span>
            <span>Zero-Data-Leak Architecture · RFC 1918 & ITU-T G.652</span>
          </div>
          <div>
            MD MAHAMUDUL HASSAN (SHIHAB) · CORE-ACCESS @ AMBER IT LTD
          </div>
        </div>
      </footer>
    </div>
  )
}
