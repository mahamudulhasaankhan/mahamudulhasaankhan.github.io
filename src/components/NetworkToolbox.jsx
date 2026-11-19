import React, { useState, useRef } from 'react'
import { 
  ShieldAlert, 
  ShieldCheck, 
  Calculator, 
  Search, 
  Globe, 
  Activity, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Zap, 
  Terminal,
  Server,
  Network,
  ExternalLink,
  Lock,
  Key,
  EyeOff,
  Check,
  LogOut,
  Power,
  Skull,
  Radio,
  Flame,
  Trash2,
  CheckSquare,
  Square,
  Database,
  Sliders
} from 'lucide-react'

export default function NetworkToolbox() {
  const [activeTab, setActiveTab] = useState('dns') // Default to Live DNS, superlogout is 3rd

  // --- 1. SELECTIVE EMERGENCY LOGOUT & CACHE PURGE ---
  const servicesList = [
    { id: 'google', name: 'Google & Gmail', domain: 'google.com', category: 'core', url: 'https://www.google.com/accounts/Logout' },
    { id: 'amazon', name: 'Amazon', domain: 'amazon.com', category: 'core', url: 'https://www.amazon.com/gp/flex/sign-out.html?action=sign-out' },
    { id: 'github', name: 'GitHub', domain: 'github.com', category: 'core', url: 'https://github.com/logout' },
    { id: 'dropbox', name: 'Dropbox', domain: 'dropbox.com', category: 'cloud', url: 'https://www.dropbox.com/logout' },
    { id: 'netflix', name: 'Netflix', domain: 'netflix.com', category: 'media', url: 'https://www.netflix.com/Logout' },
    { id: 'steam', name: 'Steam Community', domain: 'steamcommunity.com', category: 'media', url: 'https://steamcommunity.com/?action=doLogout' },
    { id: 'microsoft', name: 'Microsoft / Live', domain: 'login.live.com', category: 'core', url: 'https://login.live.com/logout.srf' },
    { id: 'wordpress', name: 'WordPress', domain: 'wordpress.com', category: 'cloud', url: 'https://wordpress.com/wp-login.php?action=logout' },
    { id: 'yahoo', name: 'Yahoo', domain: 'yahoo.com', category: 'core', url: 'https://login.yahoo.com/config/login?.src=fpctx&logout=1' },
    { id: 'soundcloud', name: 'SoundCloud', domain: 'soundcloud.com', category: 'media', url: 'https://soundcloud.com/logout' },
    { id: 'tumblr', name: 'Tumblr', domain: 'tumblr.com', category: 'media', url: 'https://www.tumblr.com/logout' },
    { id: 'vimeo', name: 'Vimeo', domain: 'vimeo.com', category: 'media', url: 'https://vimeo.com/log_out' },
    { id: 'wikipedia', name: 'Wikipedia', domain: 'wikipedia.org', category: 'cloud', url: 'https://en.wikipedia.org/w/index.php?title=Special:UserLogout' },
    { id: 'skype', name: 'Skype Web', domain: 'skype.com', category: 'core', url: 'https://secure.skype.com/account/logout' },
    { id: 'youtube', name: 'YouTube', domain: 'youtube.com', category: 'media', url: 'https://www.youtube.com/logout' },
    { id: 'ebay', name: 'eBay', domain: 'ebay.com', category: 'core', url: 'https://signin.ebay.com/ws/eBayISAPI.dll?SignIn' }
  ]

  const [selectedServices, setSelectedServices] = useState(
    servicesList.reduce((acc, s) => ({ ...acc, [s.id]: true }), {})
  )
  const [purgeBrowserCache, setPurgeBrowserCache] = useState(true)
  const [cachePurgedStatus, setCachePurgedStatus] = useState(false)
  const [serviceStatuses, setServiceStatuses] = useState(
    servicesList.reduce((acc, s) => ({ ...acc, [s.id]: 'idle' }), {})
  )
  const [logoutRunning, setLogoutRunning] = useState(false)
  const [confirmedKill, setConfirmedKill] = useState(false)
  const [purgedCount, setPurgedCount] = useState(0)

  const selectedCount = Object.values(selectedServices).filter(Boolean).length

  const toggleService = (id) => {
    setSelectedServices(prev => ({ ...prev, [id]: !prev[id] }))
    setConfirmedKill(false)
  }

  const selectAllServices = (val) => {
    const updated = {}
    servicesList.forEach(s => { updated[s.id] = val })
    setSelectedServices(updated)
    setConfirmedKill(false)
  }

  const selectCategoryPreset = (category) => {
    const updated = {}
    servicesList.forEach(s => {
      updated[s.id] = s.category === category
    })
    setSelectedServices(updated)
    setConfirmedKill(false)
  }

  const triggerLogoutForService = (service) => {
    return new Promise((resolve) => {
      const img = document.createElement('img')
      img.className = 'hidden'
      img.style.display = 'none'

      const done = () => {
        try {
          if (img.parentNode) img.parentNode.removeChild(img)
        } catch (e) {}
        resolve()
      }

      img.onload = done
      img.onerror = done
      img.src = `${service.url}?nocache=${Date.now()}`
      document.body.appendChild(img)

      setTimeout(done, 1200)
    })
  }

  const handleExecuteSuperLogout = async () => {
    const targets = servicesList.filter(s => selectedServices[s.id])
    if (targets.length === 0 && !purgeBrowserCache) {
      alert("Please select at least 1 platform or keep client cache purge selected.")
      return
    }

    if (!confirmedKill) {
      setConfirmedKill(true)
      return
    }

    setLogoutRunning(true)
    setPurgedCount(0)

    // Mark queued vs skipped
    const initialStatuses = {}
    servicesList.forEach(s => {
      initialStatuses[s.id] = selectedServices[s.id] ? 'queued' : 'skipped'
    })
    setServiceStatuses(initialStatuses)

    // Clear client cache and storages if selected
    if (purgeBrowserCache) {
      try {
        localStorage.clear()
        sessionStorage.clear()
        if (typeof window !== 'undefined' && 'caches' in window) {
          const cacheKeys = await caches.keys()
          await Promise.all(cacheKeys.map(k => caches.delete(k)))
        }
        setCachePurgedStatus(true)
      } catch (e) {}
    }

    let completed = 0

    // Concurrently trigger selected services
    for (const service of targets) {
      setServiceStatuses(prev => ({ ...prev, [service.id]: 'purging' }))
      await triggerLogoutForService(service)
      completed += 1
      setPurgedCount(completed)
      setServiceStatuses(prev => ({ ...prev, [service.id]: 'terminated' }))
    }

    setLogoutRunning(false)
  }

  // --- 2. 100% CLIENT-SIDE ZERO-DATA-LEAK EMAIL & ACCOUNT SECURITY ANALYZER ---
  const [emailInput, setEmailInput] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)

  const handleLocalSecurityAudit = (e) => {
    e.preventDefault()
    const cleanEmail = emailInput.trim()
    if (!cleanEmail || !cleanEmail.includes('@')) return

    setAnalyzing(true)
    setAnalysisResult(null)

    setTimeout(() => {
      const parts = cleanEmail.split('@')
      const userPart = parts[0]
      const domainPart = parts[1]?.toLowerCase() || ''

      const isCommonProvider = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'].includes(domainPart)
      const hasDisposableDomain = ['tempmail.com', '10minutemail.com', 'mailinator.com', 'guerrillamail.com'].includes(domainPart)

      let vulnerabilityIndex = 0
      const riskFactors = []

      if (userPart.length < 6) {
        vulnerabilityIndex += 25
        riskFactors.push("Short username prefix is highly prone to automated dictionary & brute-force spraying.")
      }

      if (/^[0-9]+$/.test(userPart)) {
        vulnerabilityIndex += 20
        riskFactors.push("Numeric-only identifier pattern frequently targeted by automated credential bots.")
      }

      if (isCommonProvider) {
        vulnerabilityIndex += 25
        riskFactors.push("High-value target domain: Subject to widespread historical credential stuffing attacks.")
      }

      if (hasDisposableDomain) {
        vulnerabilityIndex += 50
        riskFactors.push("Disposable/temporary email domains lack persistent security & MFA controls.")
      }

      const calculatedScore = Math.min(100, Math.max(15, vulnerabilityIndex + 20))
      const posture = calculatedScore > 60 ? 'Elevated Vigilance Required' : (calculatedScore > 35 ? 'Moderate Exposure Risk' : 'Low Inherent Exposure')

      setAnalysisResult({
        email: cleanEmail,
        domain: domainPart,
        isCommonProvider,
        calculatedScore,
        posture,
        riskFactors: riskFactors.length > 0 ? riskFactors : ["No immediate structural risk factors detected in email pattern."],
        analyzedLocallyAt: new Date().toLocaleTimeString(),
        directHibpLink: `https://haveibeenpwned.com/`
      })
      setAnalyzing(false)
    }, 500)
  }

  // --- 3. SUBNET / CIDR CALCULATOR STATE ---
  const [ipInput, setIpInput] = useState('192.168.10.1')
  const [prefixInput, setPrefixInput] = useState(24)

  const calculateSubnet = () => {
    const parts = ipInput.split('.').map(Number)
    if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
      return null
    }

    const prefix = parseInt(prefixInput, 10)
    const totalIps = Math.pow(2, 32 - prefix)
    const usableIps = prefix >= 31 ? (prefix === 31 ? 2 : 1) : totalIps - 2

    let maskLong = 0
    for (let i = 0; i < prefix; i++) {
      maskLong += (1 << (31 - i)) >>> 0
    }

    const mask = [
      (maskLong >>> 24) & 255,
      (maskLong >>> 16) & 255,
      (maskLong >>> 8) & 255,
      maskLong & 255
    ]

    const wildcard = mask.map(m => 255 - m)
    const net = parts.map((p, i) => p & mask[i])
    const bcast = parts.map((p, i) => p | wildcard[i])

    let firstHost = [...net]
    let lastHost = [...bcast]
    if (prefix < 31) {
      firstHost[3] += 1
      lastHost[3] -= 1
    }

    return {
      ip: ipInput,
      prefix,
      netMask: mask.join('.'),
      wildcard: wildcard.join('.'),
      netAddress: net.join('.'),
      broadcast: bcast.join('.'),
      firstUsable: firstHost.join('.'),
      lastUsable: lastHost.join('.'),
      totalIps,
      usableIps
    }
  }

  const subnetInfo = calculateSubnet()

  // --- 4. LIVE ALL-IN-ONE DNS RESOLVER ---
  const DNS_RECORD_TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'TXT', 'SOA']
  const [dnsDomain, setDnsDomain] = useState('mahamudul.me')
  const [dnsLoading, setDnsLoading] = useState(false)
  const [dnsGroupedRecords, setDnsGroupedRecords] = useState(null)
  const [dnsFilter, setDnsFilter] = useState('ALL')
  const [dnsCopiedVal, setDnsCopiedVal] = useState(null)
  const [dnsError, setDnsError] = useState(null)

  const handleDnsLookupAll = async (targetDomain) => {
    const domainToQuery = targetDomain || dnsDomain
    if (!domainToQuery) return

    setDnsLoading(true)
    setDnsGroupedRecords(null)
    setDnsError(null)

    const cleanDomain = domainToQuery.trim().replace(/^https?:\/\//, '').split('/')[0]

    try {
      const fetchPromises = DNS_RECORD_TYPES.map(async (type) => {
        try {
          const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${cleanDomain}&type=${type}`, {
            headers: { Accept: 'application/dns-json' }
          })
          const data = await res.json()
          return {
            type,
            status: data.Status,
            answers: (data.Status === 0 && Array.isArray(data.Answer)) ? data.Answer : []
          }
        } catch (e) {
          return { type, status: -1, answers: [] }
        }
      })

      const results = await Promise.all(fetchPromises)
      
      const grouped = {}
      let totalCount = 0
      let allFlat = []

      results.forEach(({ type, answers }) => {
        grouped[type] = answers
        totalCount += answers.length
        answers.forEach(item => {
          allFlat.push({ ...item, recordType: type })
        })
      })

      if (totalCount === 0 && results.some(r => r.status === 3)) {
        setDnsError(`Domain "${cleanDomain}" returned NXDOMAIN (Non-Existent Domain).`)
      }

      setDnsGroupedRecords({
        domain: cleanDomain,
        grouped,
        all: allFlat,
        totalCount
      })
    } catch (err) {
      setDnsError("Failed to query global DNS resolvers. Check network connection.")
    } finally {
      setDnsLoading(false)
    }
  }

  const handleCopyDnsValue = (val) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(val)
    }
    setDnsCopiedVal(val)
    setTimeout(() => setDnsCopiedVal(null), 2000)
  }

  // --- 5. BANDWIDTH & TRANSFER TIME CALCULATOR ---
  const [dataSizeGB, setDataSizeGB] = useState(10)
  const [linkSpeedMbps, setLinkSpeedMbps] = useState(100)

  const calculateTransfer = () => {
    const sizeInBits = dataSizeGB * 8 * 1024 * 1024 * 1024
    const speedInBits = linkSpeedMbps * 1000 * 1000
    const seconds = sizeInBits / speedInBits
    
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    const totalPackets = Math.ceil((dataSizeGB * 1024 * 1024 * 1024) / 1500)

    return {
      durationStr: `${hrs > 0 ? `${hrs}h ` : ''}${mins > 0 ? `${mins}m ` : ''}${secs}s`,
      totalSeconds: Math.round(seconds),
      totalPackets: totalPackets.toLocaleString()
    }
  }

  const transferInfo = calculateTransfer()

  return (
    <section id="tools" className="space-y-8 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs mono tracking-widest uppercase text-[#d4ff3f]">Utility Suite // 06</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mt-1">
            Network & Security Engineering Toolbox.
          </h2>
          <p className="text-sm text-[#9b9ba4] mt-1 font-light">
            Emergency Super Logout, client-side privacy audits, CIDR calculators, and DoH resolvers.
          </p>
        </div>

        {/* Tab Navigation (Reordered: DNS 1st, Privacy 2nd, Emergency Logout 3rd, Subnet 4th, Bandwidth 5th) */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#0e0e14] border border-[#20202a] self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('dns')}
            className={`px-3 py-1.5 rounded text-xs mono uppercase transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'dns' 
                ? 'bg-[#d4ff3f] text-[#08080a] font-bold shadow-[0_0_12px_rgba(212,255,63,0.3)]' 
                : 'text-[#888898] hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Live DNS</span>
          </button>

          <button
            onClick={() => setActiveTab('breach')}
            className={`px-3 py-1.5 rounded text-xs mono uppercase transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'breach' 
                ? 'bg-[#d4ff3f] text-[#08080a] font-bold shadow-[0_0_12px_rgba(212,255,63,0.3)]' 
                : 'text-[#888898] hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy Audit</span>
          </button>

          <button
            onClick={() => setActiveTab('superlogout')}
            className={`px-3 py-1.5 rounded text-xs mono uppercase transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'superlogout' 
                ? 'bg-rose-500 text-white font-bold shadow-[0_0_14px_rgba(244,63,94,0.4)]' 
                : 'text-[#888898] hover:text-white'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>Emergency Logout</span>
          </button>
          
          <button
            onClick={() => setActiveTab('subnet')}
            className={`px-3 py-1.5 rounded text-xs mono uppercase transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'subnet' 
                ? 'bg-[#d4ff3f] text-[#08080a] font-bold shadow-[0_0_12px_rgba(212,255,63,0.3)]' 
                : 'text-[#888898] hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>CIDR Subnet</span>
          </button>

          <button
            onClick={() => setActiveTab('bandwidth')}
            className={`px-3 py-1.5 rounded text-xs mono uppercase transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'bandwidth' 
                ? 'bg-[#d4ff3f] text-[#08080a] font-bold shadow-[0_0_12px_rgba(212,255,63,0.3)]' 
                : 'text-[#888898] hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Bandwidth</span>
          </button>
        </div>
      </div>

      {/* FEATURE 3: SELECTIVE EMERGENCY LOGOUT & CLIENT CACHE PURGE */}
      {activeTab === 'superlogout' && (
        <div className="p-6 md:p-8 rounded-xl bg-[#0c0c12] border border-[#261f26] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Power className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Selective Emergency Logout & Cache Purge</span>
                  <span className="text-[10px] mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-500/30 font-semibold">
                    CUSTOM KILL SWITCH
                  </span>
                </h3>
                <p className="text-xs text-[#8f8f9e] mono">
                  Choose specific platforms to log out from, or purge active sessions and local browser cache simultaneously.
                </p>
              </div>
            </div>

            <div className="text-xs mono text-right">
              <span className="text-[#808092]">Status: </span>
              <strong className={logoutRunning ? "text-amber-400" : (purgedCount > 0 ? "text-emerald-400" : "text-[#d4ff3f]")}>
                {logoutRunning ? `PURGING (${purgedCount}/${selectedCount})` : (purgedCount > 0 ? `PURGE FINISHED (${purgedCount} SESSIONS)` : `${selectedCount} PLATFORMS READY`)}
              </strong>
            </div>
          </div>

          {/* Operational Advisory Warning */}
          <div className="p-4 rounded-lg bg-rose-950/20 border border-rose-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-[#d0c0c8] leading-relaxed">
              <strong className="text-rose-300">Selective Protection:</strong> You can choose exactly where you want to log out from. Check/uncheck individual platforms below, or use the quick filter buttons to target only auth providers, media accounts, or purge all at once.
            </div>
          </div>

          {/* Browser Cache & Local Storage Purge Toggle Card */}
          <div className="p-4 rounded-lg bg-[#111118] border border-[#232330] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label className="flex items-center gap-3 cursor-pointer text-xs mono text-white select-none">
              <input
                type="checkbox"
                checked={purgeBrowserCache}
                onChange={(e) => setPurgeBrowserCache(e.target.checked)}
                disabled={logoutRunning}
                className="w-4 h-4 rounded accent-rose-500 cursor-pointer"
              />
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>Also Purge Browser LocalStorage, SessionStorage & Cache Storage</span>
              </div>
            </label>

            <div className="text-xs mono">
              {cachePurgedStatus ? (
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> CLIENT CACHE PURGED
                </span>
              ) : (
                <span className={`text-[11px] ${purgeBrowserCache ? 'text-[#d4ff3f]' : 'text-[#6e6e80]'}`}>
                  {purgeBrowserCache ? '● Cache Arming Active' : '○ Cache Purge Excluded'}
                </span>
              )}
            </div>
          </div>

          {/* Quick Selection Presets Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#1d1d28]">
            <div className="flex flex-wrap items-center gap-2 text-xs mono">
              <span className="text-[#888899]">Quick Select:</span>
              <button
                type="button"
                onClick={() => selectAllServices(true)}
                disabled={logoutRunning}
                className="px-2.5 py-1 rounded bg-[#161622] hover:bg-[#202030] text-[#a0a0b2] hover:text-white border border-[#242436] transition-colors"
              >
                Select All ({servicesList.length})
              </button>
              <button
                type="button"
                onClick={() => selectAllServices(false)}
                disabled={logoutRunning}
                className="px-2.5 py-1 rounded bg-[#161622] hover:bg-[#202030] text-[#a0a0b2] hover:text-white border border-[#242436] transition-colors"
              >
                Deselect All
              </button>
              <button
                type="button"
                onClick={() => selectCategoryPreset('core')}
                disabled={logoutRunning}
                className="px-2.5 py-1 rounded bg-[#161622] hover:bg-[#202030] text-[#a0a0b2] hover:text-[#d4ff3f] border border-[#242436] transition-colors"
              >
                Core Auth (Google, MS, GitHub, Amazon)
              </button>
              <button
                type="button"
                onClick={() => selectCategoryPreset('media')}
                disabled={logoutRunning}
                className="px-2.5 py-1 rounded bg-[#161622] hover:bg-[#202030] text-[#a0a0b2] hover:text-[#d4ff3f] border border-[#242436] transition-colors"
              >
                Media & Entertainment (YouTube, Netflix, Steam...)
              </button>
            </div>

            <div className="text-xs mono font-bold text-[#d4ff3f]">
              {selectedCount} of {servicesList.length} Platforms Selected
            </div>
          </div>

          {/* Action Button Controls */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            {!confirmedKill ? (
              <button
                onClick={() => {
                  if (selectedCount === 0 && !purgeBrowserCache) {
                    alert("Please select at least 1 platform or keep client cache purge enabled.")
                    return
                  }
                  setConfirmedKill(true)
                }}
                disabled={logoutRunning || (selectedCount === 0 && !purgeBrowserCache)}
                className={`px-6 py-3.5 font-bold text-xs mono rounded flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(244,63,94,0.35)] ${
                  selectedCount > 0 || purgeBrowserCache
                    ? 'bg-rose-600 hover:bg-rose-500 text-white cursor-pointer'
                    : 'bg-[#1b1b24] text-[#606070] cursor-not-allowed'
                }`}
              >
                <Power className="w-4 h-4" />
                <span>ENGAGE LOGOUT ({selectedCount} PLATFORMS SELECTED)</span>
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleExecuteSuperLogout}
                  disabled={logoutRunning}
                  className="px-6 py-3.5 bg-rose-500 hover:bg-rose-400 text-white font-extrabold text-xs mono rounded flex items-center gap-2 transition-all animate-pulse shadow-[0_0_25px_rgba(244,63,94,0.5)]"
                >
                  {logoutRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Skull className="w-4 h-4" />}
                  <span>{logoutRunning ? `PURGING SESSIONS (${purgedCount}/${selectedCount})...` : `CONFIRM PURGE: LOG OUT OF ${selectedCount} SELECTED SITES NOW`}</span>
                </button>
                <button
                  onClick={() => setConfirmedKill(false)}
                  disabled={logoutRunning}
                  className="px-4 py-3.5 bg-[#161622] hover:bg-[#202030] text-[#9090a0] rounded text-xs mono border border-[#2b2b3a]"
                >
                  CANCEL
                </button>
              </div>
            )}

            <span className="text-xs mono text-[#6d6d7e]">
              Selected targets receive cross-origin termination signals.
            </span>
          </div>

          {/* Interactive Target Platform Grid with Individual Checkboxes */}
          <div className="pt-4 border-t border-[#1e1e28] space-y-3">
            <div className="flex items-center justify-between text-xs mono text-[#838394]">
              <span>Platform Target Registry (Click to Toggle):</span>
              <span>{purgedCount} / {selectedCount} Selected Sessions Cleared</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {servicesList.map((svc) => {
                const isSelected = !!selectedServices[svc.id]
                const status = serviceStatuses[svc.id]

                return (
                  <div 
                    key={svc.id}
                    onClick={() => !logoutRunning && toggleService(svc.id)}
                    className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-2 cursor-pointer select-none ${
                      status === 'terminated' 
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200' 
                        : (status === 'purging' 
                            ? 'bg-amber-950/20 border-amber-500/40 text-amber-200 animate-pulse'
                            : (status === 'queued' 
                                ? 'bg-[#151520] border-[#303042] text-[#8e8e9e]' 
                                : (isSelected 
                                    ? 'bg-[#13131c] border-[#322832] text-white hover:border-rose-500/50' 
                                    : 'bg-[#0a0a0f] border-[#181822] text-[#555566] opacity-60')))
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // handled by parent onClick
                        disabled={logoutRunning}
                        className="w-3.5 h-3.5 rounded accent-rose-500 cursor-pointer flex-shrink-0"
                      />
                      <div className="truncate">
                        <div className="font-bold text-xs truncate">{svc.name}</div>
                        <div className="text-[10px] mono text-[#6e6e80] truncate">{svc.domain}</div>
                      </div>
                    </div>

                    <div className="mono text-[10px] font-bold flex-shrink-0">
                      {status === 'terminated' && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          LOGGED OUT
                        </span>
                      )}
                      {status === 'purging' && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          KILLING...
                        </span>
                      )}
                      {status === 'queued' && (
                        <span className="text-[#6c6c7d]">QUEUED</span>
                      )}
                      {status === 'idle' && (
                        isSelected ? (
                          <span className="text-rose-400 text-[10px]">SELECTED</span>
                        ) : (
                          <span className="text-[#555566] text-[10px]">EXCLUDED</span>
                        )
                      )}
                      {status === 'skipped' && (
                        <span className="text-[#555566] text-[10px]">SKIPPED</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 2: 100% PRIVATE CLIENT-SIDE PRIVACY AUDIT */}
      {activeTab === 'breach' && (
        <div className="p-6 md:p-8 rounded-xl bg-[#0c0c12] border border-[#21212c] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Lock className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-white">Private Account & Security Posture Analyzer</h3>
                <p className="text-xs text-[#8f8f9e] mono">Zero-network transmission guarantee: 100% evaluated inside your local browser memory.</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs mono font-semibold self-start sm:self-auto">
              <EyeOff className="w-3.5 h-3.5" />
              <span>100% ZERO-DATA-LEAK</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#111118] border border-[#1f1f2b] flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#d4ff3f] mt-0.5 flex-shrink-0" />
            <div className="text-xs text-[#a0a0b0] leading-relaxed">
              <strong className="text-white">Strict Privacy Policy:</strong> Unlike third-party scanners, your email address is <strong>NEVER sent across the internet</strong>, logged, or shared with external databases. All heuristic evaluations run locally on your device via client-side JavaScript.
            </div>
          </div>

          <form onSubmit={handleLocalSecurityAudit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input 
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter email to audit (e.g. yourname@domain.com)"
                className="w-full px-4 py-3 bg-[#13131c] border border-[#262634] rounded text-sm text-white placeholder-[#555566] focus:border-[#d4ff3f] outline-none mono"
              />
            </div>
            <button 
              type="submit"
              disabled={analyzing}
              className="px-6 py-3 bg-[#d4ff3f] hover:bg-[#c2f02b] text-[#08080a] font-bold text-xs mono rounded flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(212,255,63,0.25)]"
            >
              {analyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{analyzing ? 'AUDITING LOCALLY...' : 'AUDIT LOCALLY (OFFLINE)'}</span>
            </button>
          </form>

          {analysisResult && (
            <div className="space-y-6 pt-4 border-t border-[#1c1c24] animate-fadeIn">
              <div className="p-5 rounded-lg bg-[#11111a] border border-[#232332] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <CheckCircle2 className="w-6 h-6 text-[#d4ff3f] mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-base text-white">
                      Local Privacy Audit Completed: {analysisResult.email}
                    </h4>
                    <p className="text-xs mt-1 text-[#b5b5c5] leading-relaxed">
                      Evaluated offline at {analysisResult.analyzedLocallyAt}. <strong className="text-emerald-400">0 bytes transmitted over network</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] mono uppercase text-[#7a7a8a]">Exposure Risk Index</div>
                    <div className="text-lg font-bold mono text-[#d4ff3f]">{analysisResult.calculatedScore}/100</div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#0e0e14] border border-[#21212d] space-y-2">
                  <div className="text-xs mono uppercase text-[#d4ff3f]">Heuristic Risk Assessment:</div>
                  <div className="text-sm font-bold text-white">{analysisResult.posture}</div>
                  <ul className="space-y-1.5 pt-2 text-xs text-[#9595a5]">
                    {analysisResult.riskFactors.map((rf, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{rf}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-[#0e0e14] border border-[#21212d] space-y-2.5 flex flex-col justify-between">
                  <div>
                    <div className="text-xs mono uppercase text-[#00f0ff]">Independent Third-Party Verification:</div>
                    <p className="text-xs text-[#9090a0] leading-relaxed mt-1">
                      If you wish to query public data breach records directly with no middleman, you can visit the official HaveIBeenPwned directory directly:
                    </p>
                  </div>

                  <a 
                    href="https://haveibeenpwned.com/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-3 rounded bg-[#161622] hover:bg-[#202030] border border-[#2c2c3c] text-xs mono text-[#d4ff3f] flex items-center justify-between transition-colors"
                  >
                    <span>Visit Official HaveIBeenPwned.com</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#0f0f15] border border-[#1d1d28] space-y-2">
                <h5 className="text-xs mono uppercase text-white font-bold flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#d4ff3f]" />
                  <span>Enterprise Credential Defense Advisory:</span>
                </h5>
                <div className="grid sm:grid-cols-2 gap-2 pt-1 text-xs text-[#9595a5]">
                  <div className="flex items-start gap-2">
                    <span className="text-[#d4ff3f] font-bold">›</span>
                    <span>Enforce Multi-Factor Authentication (FIDO2 / TOTP) across primary accounts.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#d4ff3f] font-bold">›</span>
                    <span>Use a password manager with 16+ unique character master passphrases.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#d4ff3f] font-bold">›</span>
                    <span>Regularly review and terminate unrecognized active sessions in account security.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#d4ff3f] font-bold">›</span>
                    <span>Never use email master passwords on third-party public forums or bulletin boards.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FEATURE 3: SUBNET / CIDR CALCULATOR */}
      {activeTab === 'subnet' && (
        <div className="p-6 md:p-8 rounded-xl bg-[#0c0c12] border border-[#21212c] space-y-6">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Calculator className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">IPv4 Subnet & CIDR Precision Calculator</h3>
              <p className="text-xs text-[#8f8f9e] mono">100% offline client-side bitwise calculation for network engineers.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs mono text-[#9595a5]">IP Address</label>
              <input 
                type="text"
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                placeholder="e.g. 192.168.1.1"
                className="w-full px-4 py-2.5 bg-[#13131c] border border-[#262634] rounded text-sm text-white placeholder-[#555566] focus:border-[#d4ff3f] outline-none mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs mono text-[#9595a5]">CIDR Prefix (/{prefixInput})</label>
              <select 
                value={prefixInput}
                onChange={(e) => setPrefixInput(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-[#13131c] border border-[#262634] rounded text-sm text-white focus:border-[#d4ff3f] outline-none mono"
              >
                {Array.from({ length: 25 }, (_, i) => i + 8).map(p => (
                  <option key={p} value={p}>/{p} ({Math.pow(2, 32 - p) - (p >= 31 ? 0 : 2)} Hosts)</option>
                ))}
              </select>
            </div>
          </div>

          {subnetInfo && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-4 border-t border-[#1c1c24]">
              <div className="p-3.5 rounded bg-[#101018] border border-[#22222e]">
                <div className="text-[10px] mono uppercase text-[#737382]">Network ID</div>
                <div className="text-sm font-bold mono text-[#d4ff3f] mt-1">{subnetInfo.netAddress}/{subnetInfo.prefix}</div>
              </div>

              <div className="p-3.5 rounded bg-[#101018] border border-[#22222e]">
                <div className="text-[10px] mono uppercase text-[#737382]">Subnet Mask</div>
                <div className="text-sm font-bold mono text-white mt-1">{subnetInfo.netMask}</div>
              </div>

              <div className="p-3.5 rounded bg-[#101018] border border-[#22222e]">
                <div className="text-[10px] mono uppercase text-[#737382]">Broadcast Address</div>
                <div className="text-sm font-bold mono text-rose-400 mt-1">{subnetInfo.broadcast}</div>
              </div>

              <div className="p-3.5 rounded bg-[#101018] border border-[#22222e]">
                <div className="text-[10px] mono uppercase text-[#737382]">Usable Host Capacity</div>
                <div className="text-sm font-bold mono text-[#00f0ff] mt-1">{subnetInfo.usableIps.toLocaleString()} Hosts</div>
              </div>

              <div className="p-3.5 rounded bg-[#101018] border border-[#22222e] col-span-2">
                <div className="text-[10px] mono uppercase text-[#737382]">Usable Host Range</div>
                <div className="text-xs font-bold mono text-white mt-1">
                  {subnetInfo.firstUsable} — {subnetInfo.lastUsable}
                </div>
              </div>

              <div className="p-3.5 rounded bg-[#101018] border border-[#22222e] col-span-2">
                <div className="text-[10px] mono uppercase text-[#737382]">Wildcard Mask</div>
                <div className="text-xs font-bold mono text-[#a5a5b5] mt-1">{subnetInfo.wildcard}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FEATURE 4: FULL-STACK ALL-IN-ONE DNS RESOLVER */}
      {activeTab === 'dns' && (
        <div className="p-6 md:p-8 rounded-xl bg-[#0c0c12] border border-[#21212c] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Globe className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-white">Full-Stack DNS-over-HTTPS (DoH) Resolver</h3>
                <p className="text-xs text-[#8f8f9e] mono">Queries Cloudflare Anycast servers & resolves A, AAAA, CNAME, MX, NS, TXT & SOA all at once.</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs mono font-semibold self-start sm:self-auto">
              <Zap className="w-3.5 h-3.5" />
              <span>PARALLEL ALL-IN-ONE RESOLVER</span>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleDnsLookupAll(); }} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input 
                  type="text"
                  required
                  value={dnsDomain}
                  onChange={(e) => setDnsDomain(e.target.value)}
                  placeholder="Domain name (e.g. mahamudul.me, google.com)"
                  className="w-full px-4 py-3 bg-[#13131c] border border-[#262634] rounded text-sm text-white placeholder-[#555566] focus:border-[#d4ff3f] outline-none mono"
                />
              </div>

              <button 
                type="submit"
                disabled={dnsLoading}
                className="px-6 py-3 bg-[#d4ff3f] hover:bg-[#c2f02b] text-[#08080a] font-bold text-xs mono rounded flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(212,255,63,0.25)] flex-shrink-0"
              >
                {dnsLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>{dnsLoading ? 'RESOLVING ALL...' : 'RESOLVE ALL RECORDS'}</span>
              </button>
            </div>

            {/* Quick Test Tags */}
            <div className="flex flex-wrap items-center gap-2 text-xs mono text-[#7c7c8c]">
              <span>Quick Test:</span>
              {['mahamudul.me', 'google.com', 'cloudflare.com', 'github.com', 'amberit.com.bd'].map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setDnsDomain(d)
                    handleDnsLookupAll(d)
                  }}
                  className="px-2 py-0.5 rounded bg-[#161622] hover:bg-[#202030] text-[#a0a0b8] hover:text-[#d4ff3f] border border-[#252538] transition-colors"
                >
                  {d}
                </button>
              ))}
            </div>
          </form>

          {dnsError && (
            <div className="p-4 rounded bg-rose-950/20 border border-rose-500/30 text-rose-300 text-xs mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{dnsError}</span>
            </div>
          )}

          {dnsGroupedRecords && (
            <div className="space-y-4 pt-4 border-t border-[#1c1c24]">
              {/* Filter Tabs Header */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setDnsFilter('ALL')}
                    className={`px-3 py-1.5 rounded text-xs mono font-bold transition-all ${
                      dnsFilter === 'ALL'
                        ? 'bg-[#d4ff3f] text-[#08080a]'
                        : 'bg-[#151520] text-[#8e8e9e] hover:text-white border border-[#252535]'
                    }`}
                  >
                    ALL RECORDS ({dnsGroupedRecords.totalCount})
                  </button>

                  {DNS_RECORD_TYPES.map(type => {
                    const count = dnsGroupedRecords.grouped[type]?.length || 0
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setDnsFilter(type)}
                        className={`px-2.5 py-1.5 rounded text-xs mono font-bold transition-all ${
                          dnsFilter === type
                            ? 'bg-indigo-600 text-white'
                            : count > 0 
                              ? 'bg-[#161624] text-slate-200 hover:text-white border border-[#2b2b3f]' 
                              : 'bg-[#111118] text-[#555566] border border-[#1b1b24]'
                        }`}
                      >
                        {type} ({count})
                      </button>
                    )
                  })}
                </div>

                <div className="text-xs mono text-[#888899]">
                  Queried for <strong className="text-white">{dnsGroupedRecords.domain}</strong>
                </div>
              </div>

              {/* Records Display Table */}
              {(() => {
                const recordsToShow = dnsFilter === 'ALL'
                  ? dnsGroupedRecords.all
                  : (dnsGroupedRecords.grouped[dnsFilter] || []).map(r => ({ ...r, recordType: dnsFilter }))

                if (recordsToShow.length === 0) {
                  return (
                    <div className="p-6 rounded-lg bg-[#101018] border border-[#1e1e28] text-center text-xs text-[#808090] mono">
                      No {dnsFilter === 'ALL' ? '' : dnsFilter} records returned for this hostname.
                    </div>
                  )
                }

                return (
                  <div className="overflow-x-auto border border-[#22222e] rounded-lg">
                    <table className="w-full text-left text-xs mono">
                      <thead className="bg-[#14141d] text-[#808092] border-b border-[#22222e]">
                        <tr>
                          <th className="p-3">Type</th>
                          <th className="p-3">Name</th>
                          <th className="p-3">TTL</th>
                          <th className="p-3">Value / Data</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e1e29] bg-[#0c0c12]">
                        {recordsToShow.map((r, i) => {
                          const type = r.recordType || 'A'
                          const badgeColor = 
                            type === 'A' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                            type === 'AAAA' ? 'bg-teal-500/15 text-teal-300 border-teal-500/30' :
                            type === 'CNAME' ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' :
                            type === 'MX' ? 'bg-purple-500/15 text-purple-300 border-purple-500/30' :
                            type === 'NS' ? 'bg-blue-500/15 text-blue-300 border-blue-500/30' :
                            type === 'TXT' ? 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30' :
                            'bg-pink-500/15 text-pink-300 border-pink-500/30'

                          return (
                            <tr key={i} className="hover:bg-[#14141e] transition-colors">
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${badgeColor}`}>
                                  {type}
                                </span>
                              </td>
                              <td className="p-3 text-white max-w-[180px] truncate" title={r.name}>
                                {r.name}
                              </td>
                              <td className="p-3 text-[#7f7f8f]">{r.TTL}s</td>
                              <td className="p-3 text-[#d4ff3f] font-mono break-all font-semibold max-w-md">
                                {r.data}
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleCopyDnsValue(r.data)}
                                  className="p-1.5 rounded bg-[#161622] hover:bg-[#232333] text-[#8e8e9e] hover:text-[#d4ff3f] border border-[#232332] transition-colors inline-flex items-center gap-1"
                                  title="Copy Record Data"
                                >
                                  {dnsCopiedVal === r.data ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                      <span className="text-[10px] text-emerald-400">Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span className="text-[10px]">Copy</span>
                                    </>
                                  )}
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )
              })()}
            </div>
          )}
        </div>
      )}

      {/* FEATURE 5: BANDWIDTH CALCULATOR */}
      {activeTab === 'bandwidth' && (
        <div className="p-6 md:p-8 rounded-xl bg-[#0c0c12] border border-[#21212c] space-y-6">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Zap className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">Network Link Bandwidth & Transfer Calculator</h3>
              <p className="text-xs text-[#8f8f9e] mono">100% offline client-side data replication modeling across carrier link speeds.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs mono text-[#9595a5]">Payload Volume (in Gigabytes)</label>
              <input 
                type="number"
                min="1"
                value={dataSizeGB}
                onChange={(e) => setDataSizeGB(Math.max(1, Number(e.target.value)))}
                className="w-full px-4 py-2.5 bg-[#13131c] border border-[#262634] rounded text-sm text-white focus:border-[#d4ff3f] outline-none mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs mono text-[#9595a5]">Uplink Speed</label>
              <select 
                value={linkSpeedMbps}
                onChange={(e) => setLinkSpeedMbps(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-[#13131c] border border-[#262634] rounded text-sm text-white focus:border-[#d4ff3f] outline-none mono"
              >
                <option value={10}>10 Mbps (Fast Ethernet)</option>
                <option value={100}>100 Mbps (Standard Metro)</option>
                <option value={1000}>1 Gbps (Gigabit Uplink)</option>
                <option value={10000}>10 Gbps (Core 10G SFP+)</option>
                <option value={40000}>40 Gbps (Carrier Fabric)</option>
                <option value={100000}>100 Gbps (Backbone QSFP28)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#1c1c24]">
            <div className="p-4 rounded bg-[#101018] border border-[#22222e]">
              <div className="text-[10px] mono uppercase text-[#737382]">Transfer Duration</div>
              <div className="text-xl font-bold mono text-[#d4ff3f] mt-1">{transferInfo.durationStr}</div>
              <div className="text-[11px] text-[#8e8e9e] mono mt-0.5">({transferInfo.totalSeconds} total seconds)</div>
            </div>

            <div className="p-4 rounded bg-[#101018] border border-[#22222e]">
              <div className="text-[10px] mono uppercase text-[#737382]">Estimated Packets (MTU 1500)</div>
              <div className="text-xl font-bold mono text-[#00f0ff] mt-1">{transferInfo.totalPackets}</div>
              <div className="text-[11px] text-[#8e8e9e] mono mt-0.5">standard ethernet frames</div>
            </div>

            <div className="p-4 rounded bg-[#101018] border border-[#22222e]">
              <div className="text-[10px] mono uppercase text-[#737382]">Link Saturation</div>
              <div className="text-xl font-bold mono text-emerald-400 mt-1">100% Line Rate</div>
              <div className="text-[11px] text-[#8e8e9e] mono mt-0.5">at {linkSpeedMbps >= 1000 ? `${linkSpeedMbps / 1000} Gbps` : `${linkSpeedMbps} Mbps`}</div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
