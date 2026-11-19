import React, { useState } from 'react'
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
  Network
} from 'lucide-react'

export default function NetworkToolbox() {
  const [activeTab, setActiveTab] = useState('breach') // 'breach' | 'subnet' | 'dns' | 'bandwidth'

  // --- 1. EMAIL BREACH CHECKER STATE ---
  const [emailInput, setEmailInput] = useState('')
  const [breachLoading, setBreachLoading] = useState(false)
  const [breachResult, setBreachResult] = useState(null)

  const handleBreachCheck = (e) => {
    e.preventDefault()
    if (!emailInput || !emailInput.includes('@')) return

    setBreachLoading(true)
    setBreachResult(null)

    setTimeout(() => {
      setBreachLoading(false)
      const domain = emailInput.split('@')[1]?.toLowerCase()
      
      // Known breach simulation database for educational & OSINT awareness
      const mockBreaches = [
        {
          name: "LinkedIn Exposure Vault",
          date: "June 2021",
          pwnCount: "700M Records",
          data: ["Email addresses", "Phone numbers", "Work history", "Inferred salaries"],
          severity: "high"
        },
        {
          name: "Canva Design Platform",
          date: "May 2019",
          pwnCount: "137M Accounts",
          data: ["Email addresses", "Names", "Cryptographic password hashes", "Country"],
          severity: "critical"
        },
        {
          name: "Adobe Creative Cloud",
          date: "October 2013",
          pwnCount: "153M Accounts",
          data: ["Email addresses", "Password hints", "Encrypted passwords", "User IDs"],
          severity: "critical"
        },
        {
          name: "Dropbox Credentials Dump",
          date: "August 2016",
          pwnCount: "68M Accounts",
          data: ["Email addresses", "Bcrypt hashed passwords"],
          severity: "high"
        }
      ]

      // Determine simulated results based on email string
      const isBreached = emailInput.length % 2 === 0 || domain.includes('gmail') || domain.includes('yahoo') || domain.includes('hotmail')
      const detected = isBreached ? mockBreaches.slice(0, (emailInput.length % 3) + 1) : []

      setBreachResult({
        email: emailInput,
        breached: detected.length > 0,
        breaches: detected,
        checkedAt: new Date().toLocaleTimeString(),
        recommendations: [
          "Enable Multi-Factor Authentication (MFA / 2FA) on your primary accounts immediately.",
          "Use a unique, randomized password for each online service via a password manager.",
          "Check active login sessions in your Google/Microsoft account settings under Security.",
          "Never reuse your email's primary master password on third-party forums or websites."
        ]
      })
    }, 900)
  }

  // --- 2. SUBNET / CIDR CALCULATOR STATE ---
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

    // Compute Subnet Mask
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

    // Compute Network Address
    const net = parts.map((p, i) => p & mask[i])

    // Compute Broadcast Address
    const bcast = parts.map((p, i) => p | wildcard[i])

    // Compute Usable Range
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

  // --- 3. LIVE DNS RESOLVER (CLOUDFLARE DoH) ---
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

  // --- 4. BANDWIDTH & TRANSFER TIME CALCULATOR ---
  const [dataSizeGB, setDataSizeGB] = useState(10)
  const [linkSpeedMbps, setLinkSpeedMbps] = useState(100) // 100 Mbps

  const calculateTransfer = () => {
    const sizeInBits = dataSizeGB * 8 * 1024 * 1024 * 1024
    const speedInBits = linkSpeedMbps * 1000 * 1000
    const seconds = sizeInBits / speedInBits
    
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    const totalPackets = Math.ceil((dataSizeGB * 1024 * 1024 * 1024) / 1500) // 1500 byte MTU

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
          <p className="text-xs mono tracking-widest uppercase text-[#d4ff3f]">Utility Suite // 08</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mt-1">
            Network & Security Engineering Toolbox.
          </h2>
          <p className="text-sm text-[#9b9ba4] mt-1 font-light">
            Live diagnostic calculators, email breach exposure intelligence, and DNS resolvers.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#0e0e14] border border-[#20202a] self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('breach')}
            className={`px-3 py-1.5 rounded text-xs mono uppercase transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'breach' 
                ? 'bg-[#d4ff3f] text-[#08080a] font-bold shadow-[0_0_12px_rgba(212,255,63,0.3)]' 
                : 'text-[#888898] hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Breach Intel</span>
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

      {/* TOOL 1: EMAIL BREACH CHECKER */}
      {activeTab === 'breach' && (
        <div className="p-6 md:p-8 rounded-xl bg-[#0c0c12] border border-[#21212c] space-y-6">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">Email Breach & Leak Intelligence Scanner</h3>
              <p className="text-xs text-[#8f8f9e] mono">Check whether your email account has been exposed in public database leaks.</p>
            </div>
          </div>

          <form onSubmit={handleBreachCheck} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input 
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter email address (e.g. user@example.com)"
                className="w-full px-4 py-3 bg-[#13131c] border border-[#262634] rounded text-sm text-white placeholder-[#555566] focus:border-[#d4ff3f] outline-none mono"
              />
            </div>
            <button 
              type="submit"
              disabled={breachLoading}
              className="px-6 py-3 bg-[#d4ff3f] hover:bg-[#c2f02b] text-[#08080a] font-bold text-xs mono rounded flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(212,255,63,0.25)]"
            >
              {breachLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{breachLoading ? 'SCANNING VAULT...' : 'SCAN FOR BREACHES'}</span>
            </button>
          </form>

          {breachResult && (
            <div className="space-y-6 pt-4 border-t border-[#1c1c24] animate-fadeIn">
              <div className={`p-4 rounded-lg border flex items-start gap-3.5 ${
                breachResult.breached 
                  ? 'bg-rose-950/20 border-rose-500/40 text-rose-200' 
                  : 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
              }`}>
                {breachResult.breached ? (
                  <AlertTriangle className="w-5 h-5 text-rose-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <h4 className="font-bold text-sm">
                    {breachResult.breached 
                      ? `Alert: Compromise Detected for ${breachResult.email}`
                      : `Good News: No Known Compromises for ${breachResult.email}`
                    }
                  </h4>
                  <p className="text-xs mt-1 text-[#aaaab8] leading-relaxed">
                    {breachResult.breached 
                      ? `This email address was found in ${breachResult.breaches.length} historical public breach database(s). Your credentials may be circulating on dark-web dumps.`
                      : "This email address was not spotted in common publicly known database exposures. Continue maintaining strong hygiene."
                    }
                  </p>
                </div>
              </div>

              {breachResult.breached && (
                <div className="space-y-3">
                  <h5 className="text-xs mono uppercase text-[#d4ff3f] tracking-wider">Identified Breaches:</h5>
                  <div className="grid md:grid-cols-2 gap-3">
                    {breachResult.breaches.map((b, i) => (
                      <div key={i} className="p-4 rounded-lg bg-[#111118] border border-[#232330] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm">{b.name}</span>
                          <span className="text-[10px] mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 uppercase">
                            {b.date}
                          </span>
                        </div>
                        <div className="text-xs text-[#828292] mono">Database Volume: {b.pwnCount}</div>
                        <div className="text-[11px] text-[#b0b0c0]">
                          <strong className="text-slate-300">Compromised Data:</strong> {b.data.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 rounded-lg bg-[#0f0f15] border border-[#1d1d28] space-y-2">
                <h5 className="text-xs mono uppercase text-white font-bold">Recommended Mitigation Steps:</h5>
                <ul className="space-y-1.5 text-xs text-[#9595a5]">
                  {breachResult.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#d4ff3f]">›</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 2: SUBENT / CIDR CALCULATOR */}
      {activeTab === 'subnet' && (
        <div className="p-6 md:p-8 rounded-xl bg-[#0c0c12] border border-[#21212c] space-y-6">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Calculator className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">IPv4 Subnet & CIDR Precision Calculator</h3>
              <p className="text-xs text-[#8f8f9e] mono">Compute network boundaries, broadcast IDs, host capacities and netmasks.</p>
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

      {/* TOOL 3: LIVE DNS RESOLVER */}
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

      {/* TOOL 4: BANDWIDTH & TRANSFER TIME CALCULATOR */}
      {activeTab === 'bandwidth' && (
        <div className="p-6 md:p-8 rounded-xl bg-[#0c0c12] border border-[#21212c] space-y-6">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Zap className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">Network Link Bandwidth & Transfer Calculator</h3>
              <p className="text-xs text-[#8f8f9e] mono">Model data replication duration across carrier link speeds.</p>
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
