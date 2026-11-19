import React, { useState, useEffect, useRef } from 'react'
import { 
  Network, 
  Terminal as TerminalIcon, 
  ShieldCheck, 
  Server, 
  Cpu, 
  Radio, 
  ExternalLink, 
  Linkedin, 
  Github, 
  Mail, 
  MapPin, 
  ArrowUpRight, 
  ChevronRight, 
  CornerDownLeft, 
  Download,
  Menu,
  X,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react'
import NetworkCanvas from './components/NetworkCanvas'
import NetworkToolbox from './components/NetworkToolbox'

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Navigation Items with IDs matching sections
  const navItems = [
    { id: 'about', label: '01//About', mobileLabel: '01// About' },
    { id: 'skills', label: '02//Skills', mobileLabel: '02// Skills' },
    { id: 'experience', label: '03//Exp', mobileLabel: '03// Experience' },
    { id: 'work', label: '04//Labs', mobileLabel: '04// Labs' },
    { id: 'terminal', label: '05//CLI', mobileLabel: '05// Live CLI' },
    { id: 'tools', label: '06//Tools', mobileLabel: '06// Utility Tools' },
    { id: 'contact', label: '07//Contact', mobileLabel: '07// Contact' }
  ]

  // Interactive Juniper Junos CLI Terminal State
  const [terminalInput, setTerminalInput] = useState('')
  const [terminalHistory, setTerminalHistory] = useState([
    { 
      type: 'system', 
      text: `--- JUNOS 22.4R2-S1.4 Kernel 64-bit  JNPR-12.1-20230214.341142_builder_stable_12\nmahamudul@amberit-core01 (ttyd0)\n\nJUNOS Core-Access Routing Engine (RE-S-1800x4)\nConnected to Amber IT Ltd Core Routing Fabric.\nType 'help' or '?' for diagnostics, or run 'show bgp summary', 'show interfaces terse', 'show route', 'whoami'.`
    }
  ])
  const [pastCommands, setPastCommands] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const terminalEndRef = useRef(null)
  const terminalInputRef = useRef(null)

  // Auto-scroll terminal so new prompt stays in front and old commands scroll up
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [terminalHistory])

  // Calculate packet scroll progress & active section scrollspy with dynamic URL updates
  useEffect(() => {
    const sectionIds = ['about', 'skills', 'experience', 'work', 'terminal', 'tools', 'contact']

    const handleScroll = () => {
      // 1. Calculate packet spine progress
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)))
      }

      // 2. Scrollspy calculation for active section
      const scrollPosition = window.scrollY + 200 // header offset
      let currentSection = ''

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i])
        if (el) {
          const top = el.offsetTop
          if (scrollPosition >= top) {
            currentSection = sectionIds[i]
            break
          }
        }
      }

      // If at bottom of page, highlight contact
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 70) {
        currentSection = 'contact'
      } else if (window.scrollY < 260) {
        // At top hero section
        currentSection = ''
      }

      setActiveSection(currentSection)

      // 3. Dynamically update URL hash without jump or spamming history
      if (currentSection) {
        const targetHash = `#${currentSection}`
        if (window.location.hash !== targetHash) {
          window.history.replaceState(null, null, targetHash)
        }
      } else if (window.scrollY < 200 && window.location.hash) {
        window.history.replaceState(null, null, window.location.pathname)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const executeCommand = (cmdRaw) => {
    const cmd = cmdRaw.trim()
    if (!cmd) return

    setPastCommands(prev => [...prev, cmd])
    setHistoryIndex(-1)

    const lower = cmd.toLowerCase()

    if (lower === 'clear') {
      setTerminalHistory([])
      setTerminalInput('')
      return
    }

    let response = ''
    let isError = false

    if (lower === 'help' || lower === '?') {
      response = `Juniper Networks Junos OS Operational Diagnostics:
  show bgp summary        - Inspect BGP peers, ASNs, received prefix counts
  show interfaces terse   - View 10G/100G fiber interfaces & transit statuses
  show route              - Display inet.0 active routing table entries
  show chassis hardware   - Display MX960 modular chassis, RE, and MPC cards
  show system uptime      - Display routing engine uptime and load averages
  show version            - Display Junos software release & kernel info
  ping <host>             - Send ICMP echo requests (e.g. ping 8.8.8.8)
  traceroute <host>       - Trace packet hops to target IP
  whoami                  - Display engineer credentials and NOC access tier
  clear                   - Clear screen buffer`
    } else if (lower === 'whoami') {
      response = `user: mahamudul (Md Mahamudul Hassan Khan)
role: Assistant System Engineer (Core-Access Team)
company: Amber IT Ltd (Navana Tower, Gulshan-1, Dhaka)
class: super-user (NOC Tier-2 / BGP Core Operations)
authorizations: [routing-engine, firewall-filter, ldp-mpls, vlan-cross-connect]
active-session: ttyd0 (SSH-2.0 via 103.250.64.254)`
    } else if (lower.startsWith('show bgp')) {
      response = `Groups: 3 Peers: 4 Down peers: 0
Table          Tot Paths  Act Paths Suppressed    History Damp State Pending
inet.0            849210     849210          0          0          0       0

Peer                     AS      InPkt     OutPkt    OutQ   Flaps Last Up/Dwn State|#Active/Received/Accepted/Damped...
103.250.64.1          24151     492812     381921       0       0     98d14h Establ
  inet.0: 849210/849210/849210/0
103.250.65.5          58717     610291     482910       0       0    120d04h Establ
  inet.0: 849210/849210/849210/0
10.100.0.2            58715     891230     891200       0       0    240d18h Establ
  inet.0: 42/42/42/0 (Internal-iBGP Mesh)
182.16.x.1            23688     321450     298100       0       0     45d12h Establ
  inet.0: BDIX-Peering Established`
    } else if (lower.startsWith('show int')) {
      response = `Interface               Admin Link Proto    Local                 Remote
ge-0/0/0                up    up
ge-0/0/0.0              up    up   inet     103.250.64.1/24       (Amber-Access)
xe-0/1/0                up    up
xe-0/1/0.0              up    up   inet     10.100.0.1/30         (Core Transit 10G)
xe-0/1/1                up    up
xe-0/1/1.0              up    up   inet     10.100.0.5/30         (BDIX Peering 10G)
et-0/0/0                up    up
et-0/0/0.0              up    up   inet     172.16.0.1/30         (Carrier 100G Backbone)
lo0.0                   up    up   inet     103.250.64.254        --> 0/0
fxp0.0                  up    up   inet     192.168.10.254/24     (Out-of-Band MGMT)`
    } else if (lower.startsWith('show route')) {
      response = `inet.0: 849215 destinations, 849215 routes (849215 active, 0 holddown, 0 hidden)
+ = Active Route, - = Last Active, * = Both

0.0.0.0/0          *[BGP/170] 120d 04:12:10, MED 100, localpref 100
                    AS path: 58717 I, validation-state: valid
                  > to 103.250.65.5 via xe-0/1/0.0
103.250.64.0/24    *[Direct/0] 240d 18:22:04
                  > via ge-0/0/0.0
10.100.0.0/30      *[Direct/0] 240d 18:22:04
                  > via xe-0/1/0.0
103.250.64.254/32  *[Local/0] 240d 18:22:04
                    Reject`
    } else if (lower.startsWith('show chassis') || lower.startsWith('show hard')) {
      response = `Hardware inventory:
Item             Version  Part number  Serial number     Description
Chassis                                JN94827101        MX960
Midplane         REV 05   711-030999   AC1234567         Enhanced Midplane
Routing Engine 0 REV 12   740-058375   901234567         RE-S-1800x4 (16GB RAM)
CB 0             REV 08   710-021523   CA9876543         Control Board
FPC 0            REV 32   750-053421   FP0987654         MPC7E 3D MRATE-12xQSFPP-XGE
  MIC 0                   BUILTIN      BUILTIN           12x10GE / 4x100GE MIC
Power Supply 0   Rev 06   740-028341   PS0128472         AC Power Supply (2520W)`
    } else if (lower.startsWith('show sys') || lower.startsWith('show upt')) {
      response = `Current time: 2026-11-19 16:15:32 BDT
System booted: 2026-03-22 08:31:02 BDT (34w2d 07:44 ago)
Protocols started: 2026-03-22 08:33:14 BDT (34w2d 07:42 ago)
Last configured: 2026-11-18 21:14:02 BDT (19:01:30 ago) by mahamudul
Uptime: 240 days, 7 hours, 44 minutes, 30 seconds
Load averages: 0.14, 0.18, 0.22`
    } else if (lower.startsWith('show ver')) {
      response = `Hostname: amberit-core-pe01
Model: mx960
Junos: 22.4R2-S1.4
JUNOS OS Kernel 64-bit  [20230214.341142_builder_stable_12]
JUNOS Packet Forwarding Engine Support [20230214]
JUNOS Routing Software Suite [20230214]`
    } else if (lower.startsWith('ping')) {
      const target = cmd.split(' ')[1] || '103.250.64.1'
      response = `PING ${target} (${target}): 56 data bytes
64 bytes from ${target}: icmp_seq=0 ttl=64 time=0.612 ms
64 bytes from ${target}: icmp_seq=1 ttl=64 time=0.584 ms
64 bytes from ${target}: icmp_seq=2 ttl=64 time=0.628 ms
64 bytes from ${target}: icmp_seq=3 ttl=64 time=0.591 ms

--- ${target} ping statistics ---
4 packets transmitted, 4 packets received, 0% packet loss
round-trip min/avg/max/stddev = 0.584/0.603/0.628/0.017 ms`
    } else if (lower.startsWith('traceroute')) {
      const target = cmd.split(' ')[1] || '8.8.8.8'
      response = `traceroute to ${target} (${target}), 30 hops max, 52 byte packets
 1  10.100.0.1 (10.100.0.1)  0.312 ms  0.284 ms  0.298 ms
 2  103.250.64.1 (103.250.64.1)  0.784 ms  0.751 ms  0.722 ms
 3  103.250.65.5 (103.250.65.5)  1.124 ms  1.082 ms  1.054 ms
 4  ${target} (${target})  4.218 ms  4.182 ms  4.140 ms`
    } else {
      isError = true
      response = `syntax error, expecting <command>: '${cmd}'\nType '?' or 'help' for summary of operational Junos commands.`
    }

    setTerminalHistory(prev => [
      ...prev,
      { type: 'command', cmd },
      { type: isError ? 'error' : 'response', text: response }
    ])
    setTerminalInput('')
  }

  const handleTerminalSubmit = (e) => {
    e.preventDefault()
    executeCommand(terminalInput)
  }

  const handleTerminalKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (pastCommands.length === 0) return
      const nextIndex = historyIndex === -1 ? pastCommands.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(nextIndex)
      setTerminalInput(pastCommands[nextIndex])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex === -1) return
      const nextIndex = historyIndex + 1
      if (nextIndex >= pastCommands.length) {
        setHistoryIndex(-1)
        setTerminalInput('')
      } else {
        setHistoryIndex(nextIndex)
        setTerminalInput(pastCommands[nextIndex])
      }
    }
  }

  const caseStudies = [
    {
      id: "CS-01 · bdNOG 21 & ISP Core",
      title: "Advanced BGP Routing & Traffic Engineering",
      desc: "Architected multi-homed BGP configurations with upstream transit providers and Internet Exchanges (IX). Handled prefix-list filtering, AS-path prepending, and automated BGP convergence.",
      metric: "Zero-downtime failover with optimal upstream path selection",
      tags: ["BGP", "Traffic Engineering", "MikroTik", "ISP Peering"]
    },
    {
      id: "CS-02 · Enterprise Service Provider",
      title: "MPLS Layer 3 VPN (L3VPN) Core Emulation",
      desc: "Simulated multi-tenant core network (AS100) using OSPF and LDP for core transport, VRF instances for customer traffic isolation, and MP-BGP (VPNv4) for multi-site peering.",
      metric: "Complete tenant data plane isolation across shared MPLS backbone",
      tags: ["MPLS", "L3VPN", "VRF", "Cisco", "MP-BGP"]
    },
    {
      id: "CS-03 · High-Security Campus Switching",
      title: "Private VLANs & Layer 2 Attack Mitigation",
      desc: "Designed and deployed Private VLAN architecture (Primary, Community, and Isolated) to defeat broadcast spoofing, unauthorized lateral movement, and man-in-the-middle attacks.",
      metric: "Enforced strict zero-trust segmentation on shared L2 broadcast domains",
      tags: ["Private VLAN", "L2 Security", "Zero-Trust", "Switching"]
    },
    {
      id: "CS-04 · Core-Access Operations",
      title: "Centralized Syslog & Automated Backup Infrastructure",
      desc: "Constructed high-capacity enterprise Linux logging servers aggregating live syslog events from hundreds of Juniper, Cisco, and MikroTik nodes with automated config diff tracking.",
      metric: "Audit-ready configuration compliance & instant disaster recovery",
      tags: ["Linux Admin", "Syslog", "Backup Automation", "Zabbix"]
    }
  ]

  const experiences = [
    {
      period: "2026 — PRESENT",
      role: "Assistant System Engineer",
      team: "Core-Access Infrastructure Team",
      org: "Amber IT Ltd",
      location: "Gulshan, Dhaka",
      desc: "Leading daily operational scaling of core and access tier network topologies. Managing carrier-grade routing protocols across Juniper, Cisco, and MikroTik while overseeing central log servers and backup resilience."
    },
    {
      period: "2026 — 2026",
      role: "Technical Support Engineer",
      team: "Network Operations Center (NOC)",
      org: "A. K. Khan Telecom Limited",
      location: "Gulshan Avenue, Dhaka",
      desc: "Executed 24/7 real-time infrastructure surveillance using Zabbix and LibreNMS. Resolved critical Layer 2/3 incidents, engineered OSPF/BGP failovers, and maintained maximum network uptime."
    },
    {
      period: "2025 — 2025",
      role: "NOC Engineer Intern",
      team: "Network Operations Center",
      org: "Dot Internet",
      location: "Rayer Bazar, Dhaka",
      desc: "Configured and maintained ISP-tier MikroTik edge routers, Optical Line Terminals (OLT), and customer ONUs. Managed IP allocation schemas and monitored fiber link health."
    }
  ]

  return (
    <div className="relative min-h-screen bg-[#08080a] text-[#f4f4f2] selection:bg-[#d4ff3f] selection:text-[#08080a]">
      {/* PACKET TRANSMISSION SPINE (Anchored cleanly to viewport edge) */}
      <div className="fixed left-0 top-0 bottom-0 w-[2px] bg-[#1a1a20] z-40 pointer-events-none">
        <div 
          className="absolute top-0 left-0 w-full bg-[#d4ff3f] transition-all duration-75 ease-out shadow-[0_0_12px_#d4ff3f]"
          style={{ height: `${scrollProgress}%` }}
        ></div>
        <div 
          className="absolute -left-[3px] w-[8px] h-[8px] rounded-full bg-[#d4ff3f] shadow-[0_0_16px_#d4ff3f] glow-packet transition-all duration-75 ease-out"
          style={{ top: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* TOP NAVIGATION */}
      <header className="sticky top-0 z-30 bg-[#08080a]/80 backdrop-blur-md border-b border-[#1c1c24] px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a 
              href="#" 
              onClick={() => {
                setActiveSection('')
                if (window.location.hash) {
                  window.history.replaceState(null, null, window.location.pathname)
                }
              }}
              className="flex items-center gap-2 group"
            >
              <span className="font-bold tracking-tight text-lg mono text-white">
                mahamudul<span className="text-[#d4ff3f]">.me</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#16161d] border border-[#2b2b36] text-[#d4ff3f] mono font-semibold">
                CORE-NOC
              </span>
            </a>

            {/* Live Packet Telemetry Badge directly integrated in Header */}
            <div className="hidden lg:flex items-center gap-2 text-[10px] mono uppercase bg-[#111118] px-2.5 py-1 rounded border border-[#22222e] text-[#8e8e99]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff3f] animate-ping"></span>
              <span>FLOW: <strong className="text-[#d4ff3f]">{Math.round(scrollProgress)}%</strong></span>
              <span className="text-[#3b3b47]">|</span>
              <span>1.2ms</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-xs mono tracking-wider uppercase">
            {navItems.map((item) => {
              const isActive = activeSection === item.id
              return (
                <a 
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setActiveSection(item.id)}
                  className={`transition-all duration-150 relative py-1 ${
                    isActive 
                      ? 'text-[#d4ff3f] font-bold' 
                      : 'text-[#9e9ea8] hover:text-[#d4ff3f]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#d4ff3f] shadow-[0_0_8px_#d4ff3f]" />
                  )}
                </a>
              )
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a 
              href="https://www.linkedin.com/in/md-mahamudul-hassan-khan/" 
              target="_blank" 
              rel="noreferrer"
              className="px-3.5 py-1.5 text-xs font-bold rounded bg-[#d4ff3f] text-[#08080a] hover:bg-[#c2f02b] transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,255,63,0.3)]"
            >
              <span>CONNECT</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#1c1c24] space-y-2 mono text-xs uppercase">
            {navItems.map((item) => {
              const isActive = activeSection === item.id
              return (
                <a 
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => {
                    setActiveSection(item.id)
                    setMobileMenuOpen(false)
                  }}
                  className={`block py-1.5 transition-colors ${
                    isActive
                      ? 'text-[#d4ff3f] font-bold pl-2 border-l-2 border-[#d4ff3f]'
                      : 'text-slate-300 hover:text-[#d4ff3f]'
                  }`}
                >
                  {item.mobileLabel}
                </a>
              )
            })}
          </div>
        )}
      </header>

      {/* MAIN CONTAINER */}
      <div className="px-4 sm:px-6 lg:px-8">
        <main className="max-w-6xl mx-auto space-y-32 py-12 md:py-20">

          {/* HERO SECTION WITH INTERACTIVE 3D NET3D TOPOLOGY */}
          <section className="relative min-h-[75vh] md:min-h-[85vh] flex flex-col justify-center py-10 md:py-16 overflow-hidden">
            {/* 3D Clos Fabric Canvas (Like walana.tech) */}
            <div className="absolute inset-0 pointer-events-none">
              <NetworkCanvas />
              <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_65%_60%_at_35%_50%,rgba(8,8,10,0.85),rgba(8,8,10,0.25)_65%,transparent)]"></div>
            </div>

            <div className="relative z-10 space-y-8 max-w-4xl">
              <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded bg-[#13131a]/90 backdrop-blur-md border border-[#23232c] text-xs mono text-[#d4ff3f]">
                <span className="w-2 h-2 rounded-full bg-[#d4ff3f] animate-pulse"></span>
                <span>MD MAHAMUDUL HASSAN (SHIHAB) · CORE-ACCESS @ AMBER IT</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight uppercase leading-[1.05]">
                  The strongest networks are <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4ff3f] via-[#00f0ff] to-white">invisible.</span>
                </h1>
                <p className="text-lg md:text-2xl text-[#9b9ba4] max-w-2xl leading-relaxed font-light">
                  Engineering carrier-grade routing, core-access resilience, and automated logging for mission-critical enterprise environments.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4 mono text-xs font-semibold">
                <a 
                  href="#work"
                  className="px-6 py-3.5 bg-[#d4ff3f] text-[#08080a] rounded hover:bg-[#c2f02b] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(212,255,63,0.3)]"
                >
                  <span>EXPLORE PRODUCTION WORK</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
                <a 
                  href="#terminal"
                  className="px-6 py-3.5 border border-[#2e2e38] bg-[#101017]/90 backdrop-blur-md text-[#f4f4f2] rounded hover:border-[#d4ff3f] transition-all flex items-center gap-2"
                >
                  <TerminalIcon className="w-4 h-4 text-[#d4ff3f]" />
                  <span>LAUNCH DIAGNOSTIC CLI</span>
                </a>
              </div>
            </div>
          </section>

          {/* MARQUEE PROTOCOL TICKER */}
          <section className="relative overflow-hidden py-4 border-y border-[#1c1c24] bg-[#0c0c10]">
            <div className="animate-marquee whitespace-nowrap flex gap-8 items-center text-xs mono tracking-widest uppercase text-[#888894]">
              <span>BGP PEERING & MULTIHOMING</span>
              <span className="text-[#d4ff3f]">✦</span>
              <span>OSPF & EIGRP ROUTING</span>
              <span className="text-[#d4ff3f]">✦</span>
              <span>MPLS LAYER 3 VPN (VRF)</span>
              <span className="text-[#d4ff3f]">✦</span>
              <span>MIKROTIK ROUTEROS</span>
              <span className="text-[#d4ff3f]">✦</span>
              <span>JUNIPER JUNOS</span>
              <span className="text-[#d4ff3f]">✦</span>
              <span>CISCO ENTERPRISE SWITCHING</span>
              <span className="text-[#d4ff3f]">✦</span>
              <span>ZABBIX & LIBRENMS MONITORING</span>
              <span className="text-[#d4ff3f]">✦</span>
              <span>bdNOG 21 & 22 TTT CERTIFIED</span>
              <span className="text-[#d4ff3f]">✦</span>
              <span>ENTERPRISE LINUX SYSADMIN</span>
              <span className="text-[#d4ff3f]">✦</span>
              <span>OPTICAL FIBER (OLT / ONU)</span>
              <span className="text-[#d4ff3f]">✦</span>
            </div>
          </section>

          {/* 01 / ABOUT */}
          <section id="about" className="space-y-8 scroll-mt-24">
            <p className="text-xs mono tracking-widest uppercase text-[#d4ff3f]">01 // About</p>
            
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Where high throughput meets zero packet loss.
            </h2>

            <div className="grid md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-2 space-y-5 text-base md:text-lg text-[#adadb8] leading-relaxed font-light">
                <p>
                  As an <strong className="text-white font-medium">Assistant System Engineer in the Core-Access team at Amber IT Ltd</strong>, I manage and scale high-density routing and access networks across corporate and enterprise clients.
                </p>
                <p>
                  My day-to-day operations revolve around mission-critical protocol configuration across <strong className="text-[#d4ff3f] font-mono">Juniper</strong>, <strong className="text-[#d4ff3f] font-mono">Cisco</strong>, and <strong className="text-[#d4ff3f] font-mono">MikroTik</strong> environments. To prevent outages before they happen, I oversee centralized Linux Log Servers and continuous network surveillance.
                </p>
                <p>
                  A passionate attendee and Train-the-Trainer (TTT) graduate of <strong className="text-white">bdNOG 21 and bdNOG 22</strong>, I apply international operational standards and threat mitigation principles across modern service provider infrastructures.
                </p>
              </div>

              {/* Stats Box */}
              <div className="p-6 rounded-lg bg-[#0e0e14] border border-[#202029] space-y-6">
                <div>
                  <div className="text-3xl md:text-4xl font-extrabold mono text-[#d4ff3f]">Amber IT</div>
                  <div className="text-xs text-[#80808c] uppercase mono mt-1">Core-Access Team, Gulshan</div>
                </div>
                <div className="border-t border-[#1c1c24] pt-4">
                  <div className="text-3xl font-extrabold mono text-white">bdNOG 22</div>
                  <div className="text-xs text-[#80808c] uppercase mono mt-1">Information Security (TTT)</div>
                </div>
                <div className="border-t border-[#1c1c24] pt-4">
                  <div className="text-3xl font-extrabold mono text-[#d4ff3f]">Multi-Vendor</div>
                  <div className="text-xs text-[#80808c] uppercase mono mt-1">Juniper · Cisco · MikroTik · Linux</div>
                </div>
              </div>
            </div>
          </section>

          {/* 02 / SKILLS */}
          <section id="skills" className="space-y-8 scroll-mt-24">
            <p className="text-xs mono tracking-widest uppercase text-[#d4ff3f]">02 // Skills</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What I run in production.</h2>

            <div className="space-y-4">
              <div className="p-6 rounded-lg bg-[#0e0e14] border border-[#1f1f28] hover:border-[#d4ff3f]/50 transition-all">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Network className="w-5 h-5 text-[#d4ff3f]" />
                  <span>Routing, Switching & Protocols</span>
                </h3>
                <div className="flex flex-wrap gap-2 mono text-xs">
                  {["BGP (iBGP/eBGP)", "OSPF Dynamic Routing", "EIGRP", "MPLS L3VPN", "Traffic Engineering", "VLAN / Private VLANs", "IPv4 & IPv6 Dual-Stack", "Subnetting / VLSM"].map((tag, i) => (
                    <span key={i} className="px-3 py-1 rounded bg-[#161620] border border-[#2b2b38] text-[#d6d6e0]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-lg bg-[#0e0e14] border border-[#1f1f28] hover:border-[#d4ff3f]/50 transition-all">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[#00f0ff]" />
                  <span>Vendor Hardware & OS</span>
                </h3>
                <div className="flex flex-wrap gap-2 mono text-xs">
                  {["MikroTik RouterOS", "Juniper JunOS", "Cisco Catalyst / IOS", "OLT (GPON/EPON)", "BDCOM & VSOL", "ONU Provisioning", "Fiber SFP+/QSFP Modules"].map((tag, i) => (
                    <span key={i} className="px-3 py-1 rounded bg-[#161620] border border-[#2b2b38] text-[#d6d6e0]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-lg bg-[#0e0e14] border border-[#1f1f28] hover:border-[#d4ff3f]/50 transition-all">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Server className="w-5 h-5 text-[#d4ff3f]" />
                  <span>Systems, Monitoring & Automation</span>
                </h3>
                <div className="flex flex-wrap gap-2 mono text-xs">
                  {["Enterprise Linux Sysadmin", "Zabbix Infrastructure Surveillance", "LibreNMS SNMP", "Centralized Log Server (Syslog)", "Backup Automation", "PNETLab Virtual Topology", "Wireshark Deep Packet Inspection"].map((tag, i) => (
                    <span key={i} className="px-3 py-1 rounded bg-[#161620] border border-[#2b2b38] text-[#d6d6e0]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-lg bg-[#0e0e14] border border-[#1f1f28] hover:border-[#d4ff3f]/50 transition-all">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#ff4b72]" />
                  <span>Security & Operational Resilience</span>
                </h3>
                <div className="flex flex-wrap gap-2 mono text-xs">
                  {["bdNOG TTT Security Principles", "Threat Mitigation", "Access Control Lists (ACL)", "L2 Loop Protection", "NOC Incident Response", "High Availability (HA)"].map((tag, i) => (
                    <span key={i} className="px-3 py-1 rounded bg-[#161620] border border-[#2b2b38] text-[#d6d6e0]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 03 / EXPERIENCE */}
          <section id="experience" className="space-y-8 scroll-mt-24">
            <p className="text-xs mono tracking-widest uppercase text-[#d4ff3f]">03 // Experience</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Carrier-grade track record.</h2>

            <div className="space-y-6">
              {experiences.map((exp, idx) => (
                <div 
                  key={idx}
                  className="p-6 md:p-8 rounded-lg bg-[#0c0c12] border border-[#1d1d26] hover:border-[#d4ff3f]/40 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
                    <span className="mono text-xs font-bold text-[#d4ff3f]">{exp.period}</span>
                    <span className="text-xs mono text-[#6e6e78]">{exp.location}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                  <p className="text-sm mono text-[#00f0ff] mt-0.5">{exp.org} · {exp.team}</p>
                  
                  <p className="text-sm md:text-base text-[#9b9ba4] mt-4 leading-relaxed font-light">
                    {exp.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 04 / LABS & CASE STUDIES */}
          <section id="work" className="space-y-8 scroll-mt-24">
            <p className="text-xs mono tracking-widest uppercase text-[#d4ff3f]">04 // Case Studies & Labs</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Work that stayed up.</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {caseStudies.map((cs, idx) => (
                <div 
                  key={idx}
                  className="p-6 md:p-8 rounded-lg bg-[#0c0c12] border border-[#1e1e28] flex flex-col justify-between hover:border-[#d4ff3f]/50 transition-all group"
                >
                  <div>
                    <span className="mono text-xs text-[#d4ff3f]">{cs.id}</span>
                    <h3 className="text-xl font-bold text-white mt-2 group-hover:text-[#d4ff3f] transition-colors">
                      {cs.title}
                    </h3>
                    <p className="text-sm text-[#9b9ba4] mt-3 leading-relaxed font-light">
                      {cs.desc}
                    </p>
                    
                    <div className="mt-4 p-3 rounded bg-[#14141c] border-l-2 border-[#d4ff3f] text-xs text-[#cfcfe0] mono">
                      {cs.metric}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-6 pt-4 border-t border-[#1a1a24]">
                    {cs.tags.map((t, ti) => (
                      <span key={ti} className="text-[11px] mono px-2 py-0.5 rounded bg-[#161620] text-[#8e8ea0]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 05 / JUNIPER JUNOS OS INTERACTIVE DIAGNOSTIC TERMINAL */}
          <section id="terminal" className="space-y-6 scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs mono tracking-widest uppercase text-[#d4ff3f]">05 // Live Carrier CLI Diagnostics</p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-1">Junos OS Operational Console.</h2>
              </div>
              <div className="flex items-center gap-2 text-xs mono text-[#d4ff3f] bg-[#14141c] px-3 py-1.5 rounded border border-[#2b2b38] self-start sm:self-auto">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>JUNIPER MX960 · ROUTING ENGINE 0</span>
              </div>
            </div>

            {/* Quick Command Suggestion Toolbar */}
            <div className="flex flex-wrap items-center gap-2 text-xs mono text-[#838396]">
              <span className="text-[#a0a0b2] font-semibold">Quick Junos Commands:</span>
              {[
                'show bgp summary',
                'show interfaces terse',
                'show route',
                'show chassis hardware',
                'show system uptime',
                'show version',
                'ping 8.8.8.8',
                'whoami',
                'clear'
              ].map((cmd) => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => executeCommand(cmd)}
                  className="px-2.5 py-1 rounded bg-[#12121a] hover:bg-[#1f1f2c] text-[#b0b0c5] hover:text-[#d4ff3f] border border-[#242434] transition-all hover:border-[#d4ff3f]/50"
                >
                  {cmd}
                </button>
              ))}
            </div>

            {/* Terminal Window Box */}
            <div 
              onClick={() => terminalInputRef.current?.focus()}
              className="rounded-xl overflow-hidden bg-[#050507] border border-[#23232e] shadow-2xl cursor-text transition-all hover:border-[#383848]"
            >
              {/* Terminal Title Bar */}
              <div className="px-4 py-3 bg-[#0f0f15] border-b border-[#1f1f29] flex items-center justify-between select-none">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                  <span className="text-xs mono text-[#9595a8] ml-2">
                    mahamudul@amberit-core01: ~ (Junos OS 22.4R2)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] mono text-[#646478]">
                  <span>RE-S-1800x4</span>
                  <span>·</span>
                  <span>SSH-2.0-OpenSSH_9.3</span>
                </div>
              </div>

              {/* Terminal Screen Body (Auto-scrolling stream where old commands move up) */}
              <div className="p-4 md:p-6 font-mono text-xs md:text-sm space-y-3 min-h-[300px] max-h-[460px] overflow-y-auto">
                {terminalHistory.map((line, idx) => (
                  <div key={idx} className="leading-relaxed">
                    {line.type === 'system' && (
                      <div className="text-[#88889c] whitespace-pre-wrap">{line.text}</div>
                    )}
                    {line.type === 'command' && (
                      <div className="flex items-center gap-2 text-white font-bold pt-2">
                        <span className="text-[#d4ff3f] select-none">mahamudul@amberit-core01&gt;</span>
                        <span className="text-white">{line.cmd}</span>
                      </div>
                    )}
                    {line.type === 'response' && (
                      <div className="whitespace-pre-wrap text-[#d1d1e0] pl-3 border-l-2 border-[#202030] my-1 font-mono text-[11px] md:text-xs">
                        {line.text}
                      </div>
                    )}
                    {line.type === 'error' && (
                      <div className="whitespace-pre-wrap text-[#ff5f56] pl-3 border-l-2 border-[#ff5f56]/50 my-1 font-mono text-[11px] md:text-xs">
                        {line.text}
                      </div>
                    )}
                  </div>
                ))}

                {/* Active Interactive Prompt Form (Stays in front at bottom) */}
                <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 pt-2 text-white">
                  <span className="text-[#d4ff3f] font-bold select-none whitespace-nowrap">
                    mahamudul@amberit-core01&gt;
                  </span>
                  <input 
                    ref={terminalInputRef}
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    onKeyDown={handleTerminalKeyDown}
                    placeholder="type a junos command e.g. 'show bgp summary' or '?'..."
                    className="flex-1 bg-transparent border-none outline-none font-mono text-xs md:text-sm text-white placeholder-[#505060]"
                    autoComplete="off"
                    spellCheck="false"
                  />
                  <span className="w-2 h-4 bg-[#d4ff3f] animate-pulse inline-block flex-shrink-0" />
                </form>

                <div ref={terminalEndRef} />
              </div>
            </div>
          </section>

          {/* 06 / NETWORK & SECURITY TOOLBOX */}
          <NetworkToolbox />

          {/* 07 / CERTIFICATIONS & EDUCATION */}
          <section id="education" className="space-y-8 scroll-mt-24">
            <p className="text-xs mono tracking-widest uppercase text-[#d4ff3f]">07 // Credentials</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Accreditation & Industry Training.</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg bg-[#0c0c12] border border-[#1e1e28]">
                <span className="text-xs mono text-[#d4ff3f]">CISCO NETWORKING ACADEMY</span>
                <h3 className="text-lg font-bold text-white mt-1">Linux Essentials</h3>
                <p className="text-xs mono text-[#838394] mt-2">ID: f5bd7451-b763-45ed-9adf-b76832b7a123</p>
                <div className="mt-4 text-xs text-[#a0a0b0]">Core Linux CLI, shell scripting, file management & permissions.</div>
              </div>

              <div className="p-6 rounded-lg bg-[#0c0c12] border border-[#1e1e28]">
                <span className="text-xs mono text-[#00f0ff]">GOVT. ACCREDITED (SICIP)</span>
                <h3 className="text-lg font-bold text-white mt-1">IT Support Service (Level-3)</h3>
                <p className="text-xs mono text-[#838394] mt-2">Validity: Sep 2025 — Aug 2030</p>
                <div className="mt-4 text-xs text-[#a0a0b0]">Enterprise computer troubleshooting, maintenance & hardware systems.</div>
              </div>

              <div className="p-6 rounded-lg bg-[#0c0c12] border border-[#1e1e28]">
                <span className="text-xs mono text-[#d4ff3f]">POLYTECHNIC DIPLOMA</span>
                <h3 className="text-lg font-bold text-white mt-1">Computer Science & Tech</h3>
                <p className="text-xs mono text-[#838394] mt-2">Patuakhali Polytechnic Institute (2022–2025)</p>
                <div className="mt-4 text-xs text-[#a0a0b0]">Engineering foundation, algorithms, and telecommunications.</div>
              </div>
            </div>
          </section>

          {/* 08 / CONTACT */}
          <section id="contact" className="space-y-8 scroll-mt-24 pt-8">
            <p className="text-xs mono tracking-widest uppercase text-[#d4ff3f]">08 // Contact</p>
            
            <div className="p-8 md:p-14 rounded-2xl bg-gradient-to-b from-[#11111a] to-[#08080a] border border-[#232330] space-y-8">
              <div>
                <h2 className="text-4xl md:text-6xl font-extrabold uppercase tracking-tight">
                  Route your traffic <span className="text-[#d4ff3f]">here.</span>
                </h2>
                <p className="text-[#9b9ba4] text-base md:text-lg mt-3 max-w-xl font-light">
                  Open to enterprise network architecture consultations, ISP core discussions, and engineering opportunities.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a 
                  href="https://www.linkedin.com/in/md-mahamudul-hassan-khan/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-6 py-3.5 bg-[#d4ff3f] text-[#08080a] rounded font-bold mono text-xs hover:bg-[#c2f02b] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(212,255,63,0.3)]"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LINKEDIN PROFILE ↗</span>
                </a>
                <a 
                  href="https://github.com/mahamudulhasaankhan" 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-6 py-3.5 border border-[#2d2d3a] bg-[#101017] text-white rounded font-bold mono text-xs hover:border-[#d4ff3f] transition-all flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  <span>GITHUB REPOSITORIES ↗</span>
                </a>
              </div>

              <div className="border-t border-[#1e1e28] pt-6 flex flex-wrap justify-between items-center gap-4 text-xs mono text-[#7c7c8c]">
                <span>Dhaka, Bangladesh · On-site / Hybrid</span>
                <span>Amber IT Ltd · Core-Access Network Operations</span>
                <span>ASN Peering & BGP Infrastructure</span>
              </div>
            </div>
          </section>

        </main>

        {/* FOOTER */}
        <footer className="max-w-6xl mx-auto py-12 border-t border-[#181820] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs mono text-[#646473]">
          <div>
            © {new Date().getFullYear()} Md Mahamudul Hassan (Shihab) Khan.
          </div>
          <div className="flex items-center gap-3">
            <span>PACKET SPUR 100G</span>
            <span>·</span>
            <span>CLOUDFLARE CDN</span>
            <span>·</span>
            <span>GITHUB PAGES</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
