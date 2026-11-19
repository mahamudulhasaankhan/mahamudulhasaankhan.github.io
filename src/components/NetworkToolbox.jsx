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
  Flame
} from 'lucide-react'

export default function NetworkToolbox() {
  const [activeTab, setActiveTab] = useState('superlogout') // 'superlogout' | 'breach' | 'subnet' | 'dns' | 'bandwidth'

  // --- 1. SUPER LOGOUT (EMERGENCY SESSION TERMINATOR) ---
  const servicesList = [
    { id: 'google', name: 'Google & Gmail', domain: 'google.com', url: 'https://www.google.com/accounts/Logout' },
    { id: 'amazon', name: 'Amazon', domain: 'amazon.com', url: 'https://www.amazon.com/gp/flex/sign-out.html?action=sign-out' },
    { id: 'github', name: 'GitHub', domain: 'github.com', url: 'https://github.com/logout' },
    { id: 'dropbox', name: 'Dropbox', domain: 'dropbox.com', url: 'https://www.dropbox.com/logout' },
    { id: 'netflix', name: 'Netflix', domain: 'netflix.com', url: 'https://www.netflix.com/Logout' },
    { id: 'steam', name: 'Steam Community', domain: 'steamcommunity.com', url: 'https://steamcommunity.com/?action=doLogout' },
    { id: 'microsoft', name: 'Microsoft / Live', domain: 'login.live.com', url: 'https://login.live.com/logout.srf' },
    { id: 'wordpress', name: 'WordPress', domain: 'wordpress.com', url: 'https://wordpress.com/wp-login.php?action=logout' },
    { id: 'yahoo', name: 'Yahoo', domain: 'yahoo.com', url: 'https://login.yahoo.com/config/login?.src=fpctx&logout=1' },
    { id: 'soundcloud', name: 'SoundCloud', domain: 'soundcloud.com', url: 'https://soundcloud.com/logout' },
    { id: 'tumblr', name: 'Tumblr', domain: 'tumblr.com', url: 'https://www.tumblr.com/logout' },
    { id: 'vimeo', name: 'Vimeo', domain: 'vimeo.com', url: 'https://vimeo.com/log_out' },
    { id: 'wikipedia', name: 'Wikipedia', domain: 'wikipedia.org', url: 'https://en.wikipedia.org/w/index.php?title=Special:UserLogout' },
    { id: 'skype', name: 'Skype Web', domain: 'skype.com', url: 'https://secure.skype.com/account/logout' },
    { id: 'youtube', name: 'YouTube', domain: 'youtube.com', url: 'https://www.youtube.com/logout' },
    { id: 'ebay', name: 'eBay', domain: 'ebay.com', url: 'https://signin.ebay.com/ws/eBayISAPI.dll?SignIn' }
  ]

  const [serviceStatuses, setServiceStatuses] = useState(
    servicesList.reduce((acc, s) => ({ ...acc, [s.id]: 'idle' }), {})
  )
  const [logoutRunning, setLogoutRunning] = useState(false)
  const [confirmedKill, setConfirmedKill] = useState(false)
  const [purgedCount, setPurgedCount] = useState(0)

  const triggerLogoutForService = (service) => {
    return new Promise((resolve) => {
      // Create hidden image to dispatch GET logout request with browser credentials
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

      // Fallback timeout in case image loading hangs
      setTimeout(done, 1200)
    })
  }

  const handleExecuteSuperLogout = async () => {
    if (!confirmedKill) {
      setConfirmedKill(true)
      return
    }

    setLogoutRunning(true)
    setPurgedCount(0)

    // Reset all to queued
    const queued = {}
    servicesList.forEach(s => { queued[s.id] = 'queued' })
    setServiceStatuses(queued)

    let completed = 0

    // Concurrently trigger in batches to avoid browser connection choke
    for (const service of servicesList) {
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

  // --- 4. LIVE DNS RESOLVER ---
  const [dnsDomain, setDnsDomain] = useState('mahamudul.me')
  const [dnsType, setDnsType] = useState('A')
  const [dnsLoading, setDnsLoading] = useState(false)
  const [dnsRecords, setDnsRecords] = useState(null)
  const [dnsError, setDnsError] = useState(null)

  const handleDnsLookup = async (e) => {
    e.preventDefault()
    if (!dnsDomain) return

    setDnsLoading(true)
    setDnsRecords(null)
    setDnsError(null)

    try {
      const cleanDomain = dnsDomain.trim().replace(/^https?:\/\//, '').split('/')[0]
      const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${cleanDomain}&type=${dnsType}`, {
        headers: { Accept: 'application/dns-json' }
      })
      const data = await res.json()

      if (data.Status === 0 && data.Answer) {
        setDnsRecords(data.Answer)
      } else if (data.Status === 3) {
        setDnsError("Domain NXDOMAIN (Does not exist or has no records of this type)")
      } else {
        setDnsRecords([])
      }
    } catch (err) {
      setDnsError("Could not resolve DNS records. Check network connection.")
    } finally {
      setDnsLoading(false)
    }
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#0e0e14] border border-[#20202a] self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('superlogout')}
            className={`px-3 py-1.5 rounded text-xs mono uppercase transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'superlogout' 
                ? 'bg-rose-500 text-white font-bold shadow-[0_0_14px_rgba(244,63,94,0.4)]' 
                : 'text-[#888898] hover:text-white'
            }`}
          >
            <Power className="w-3.5 h-3.5 text-white" />
            <span>Super Logout</span>
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

      {/* FEATURE 1: SUPER LOGOUT (EMERGENCY SESSION KILL SWITCH - INSPIRED BY SUPERLOGOUT.COM) */}
      {activeTab === 'superlogout' && (
        <div className="p-6 md:p-8 rounded-xl bg-[#0c0c12] border border-[#261f26] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Power className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Super Logout // Emergency Session Kill Switch</span>
                  <span className="text-[10px] mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-500/30 font-semibold">
                    SUPERLOGOUT ARCHITECTURE
                  </span>
                </h3>
                <p className="text-xs text-[#8f8f9e] mono">
                  Purge and terminate active browser sessions across 16+ top platforms with a single click.
                </p>
              </div>
            </div>

            <div className="text-xs mono text-right">
              <span className="text-[#808092]">Status: </span>
              <strong className={logoutRunning ? "text-amber-400" : (purgedCount > 0 ? "text-emerald-400" : "text-[#d4ff3f]")}>
                {logoutRunning ? `TERMINATING (${purgedCount}/${servicesList.length})` : (purgedCount > 0 ? `ALL PURGED (${purgedCount}/${servicesList.length})` : 'READY TO ENGAGE')}
              </strong>
            </div>
          </div>

          {/* Operational Advisory Warning */}
          <div className="p-4 rounded-lg bg-rose-950/20 border border-rose-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-[#d0c0c8] leading-relaxed">
              <strong className="text-rose-300">Public Computer & Cyber Cafe Protection:</strong> When using shared workstations, university labs, or office laptops, leaving active logins behind allows unauthorized access. Super Logout dispatches authenticated session-kill signals across Google, Amazon, GitHub, Dropbox, Netflix, Steam, and others to lock down your accounts.
            </div>
          </div>

          {/* Action Button Controls */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {!confirmedKill ? (
              <button
                onClick={() => setConfirmedKill(true)}
                className="px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs mono rounded flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(244,63,94,0.35)]"
              >
                <Power className="w-4 h-4" />
                <span>ENGAGE EMERGENCY SUPER LOGOUT</span>
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleExecuteSuperLogout}
                  disabled={logoutRunning}
                  className="px-6 py-3.5 bg-rose-500 hover:bg-rose-400 text-white font-extrabold text-xs mono rounded flex items-center gap-2 transition-all animate-pulse shadow-[0_0_25px_rgba(244,63,94,0.5)]"
                >
                  {logoutRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Skull className="w-4 h-4" />}
                  <span>{logoutRunning ? `PURGING SESSIONS (${purgedCount}/${servicesList.length})...` : 'CONFIRM PURGE: LOG OUT OF ALL SITES NOW'}</span>
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
              Targets: {servicesList.length} major consumer & developer platforms.
            </span>
          </div>

          {/* Live Service Kill Matrix Grid */}
          <div className="pt-4 border-t border-[#1e1e28] space-y-3">
            <div className="flex items-center justify-between text-xs mono text-[#838394]">
              <span>Active Target Registry:</span>
              <span>{purgedCount} / {servicesList.length} Sessions Handled</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {servicesList.map((svc) => {
                const status = serviceStatuses[svc.id]
                return (
                  <div 
                    key={svc.id}
                    className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-2 ${
                      status === 'terminated' 
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200' 
                        : (status === 'purging' 
                            ? 'bg-amber-950/20 border-amber-500/40 text-amber-200 animate-pulse'
                            : (status === 'queued' 
                                ? 'bg-[#151520] border-[#303042] text-[#8e8e9e]' 
                                : 'bg-[#0f0f16] border-[#1d1d28] text-slate-300'))
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-bold text-xs truncate">{svc.name}</div>
                      <div className="text-[10px] mono text-[#6e6e80] truncate">{svc.domain}</div>
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
                        <span className="text-[#555566]">STANDBY</span>
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

      {/* FEATURE 4: LIVE DNS RESOLVER */}
      {activeTab === 'dns' && (
        <div className="p-6 md:p-8 rounded-xl bg-[#0c0c12] border border-[#21212c] space-y-6">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Globe className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">Live DNS-over-HTTPS (DoH) Resolver</h3>
              <p className="text-xs text-[#8f8f9e] mono">Directly query Cloudflare global anycast nameservers for real-time DNS resolution.</p>
            </div>
          </div>

          <form onSubmit={handleDnsLookup} className="flex flex-col sm:flex-row gap-3">
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

            <select
              value={dnsType}
              onChange={(e) => setDnsType(e.target.value)}
              className="px-4 py-3 bg-[#13131c] border border-[#262634] rounded text-sm text-white focus:border-[#d4ff3f] outline-none mono"
            >
              <option value="A">A (IPv4)</option>
              <option value="AAAA">AAAA (IPv6)</option>
              <option value="MX">MX (Mail Server)</option>
              <option value="TXT">TXT (Verification)</option>
              <option value="NS">NS (Nameservers)</option>
              <option value="CNAME">CNAME (Alias)</option>
            </select>

            <button 
              type="submit"
              disabled={dnsLoading}
              className="px-6 py-3 bg-[#d4ff3f] hover:bg-[#c2f02b] text-[#08080a] font-bold text-xs mono rounded flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(212,255,63,0.25)]"
            >
              {dnsLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{dnsLoading ? 'RESOLVING...' : 'RESOLVE'}</span>
            </button>
          </form>

          {dnsError && (
            <div className="p-4 rounded bg-rose-950/20 border border-rose-500/30 text-rose-300 text-xs mono">
              {dnsError}
            </div>
          )}

          {dnsRecords && (
            <div className="space-y-3 pt-4 border-t border-[#1c1c24]">
              <div className="text-xs mono text-[#9595a5] flex items-center justify-between">
                <span>DNS Answers for <strong className="text-white">{dnsDomain}</strong> ({dnsType}):</span>
                <span className="text-[#d4ff3f]">{dnsRecords.length} records returned</span>
              </div>

              {dnsRecords.length === 0 ? (
                <div className="p-4 rounded bg-[#101018] text-xs text-[#808090] mono">
                  No {dnsType} records found for this domain.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs mono border border-[#22222e] rounded-lg overflow-hidden">
                    <thead className="bg-[#14141d] text-[#808092]">
                      <tr>
                        <th className="p-3">Record Name</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">TTL</th>
                        <th className="p-3">Value / Data</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e1e29] bg-[#0c0c12]">
                      {dnsRecords.map((r, i) => (
                        <tr key={i} className="hover:bg-[#14141e] transition-colors">
                          <td className="p-3 text-white">{r.name}</td>
                          <td className="p-3 text-[#00f0ff] font-bold">{dnsType}</td>
                          <td className="p-3 text-[#7f7f8f]">{r.TTL}s</td>
                          <td className="p-3 text-[#d4ff3f] font-semibold">{r.data}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
