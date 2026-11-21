import React, { useState } from 'react'
import { AlertTriangle, ShieldCheck, Clock, Terminal, ChevronRight, Activity, Zap, Cpu } from 'lucide-react'

export default function NocWarRoom() {
  const [activeIncident, setActiveIncident] = useState(0)

  const incidents = [
    {
      id: "INC-2026-0814",
      time: "02:14 AM BDT",
      severity: "SEV-1 CRITICAL",
      severityColor: "text-rose-400 bg-rose-950/60 border-rose-800",
      title: "Upstream Metro Fiber Cut & 40G Automated BGP Failover",
      summary: "Primary 40Gbps DWDM subsea optical link severed during metro civil construction. BFD microsecond polling triggered instant eBGP path convergence to secondary transit.",
      metrics: {
        mttd: "18ms",
        mttr: "42ms (Automated)",
        packetLoss: "0.00%",
        restoredBandwidth: "40 Gbps"
      },
      timeline: [
        { time: "02:14:02.102", text: "Physical Layer 1 loss on et-0/0/0.0 (DWDM Carrier Transceiver Rx optical power dropped below -32 dBm)." },
        { time: "02:14:02.120", text: "BFD session down triggered BGP route withdrawal for AS58717 transit neighbor." },
        { time: "02:14:02.144", text: "Junos FIB reprogrammed: AS-path prepended secondary transit via Navana BDIX core interface xe-0/1/0.0." },
        { time: "02:14:02.164", text: "Zero customer disconnect. Central syslog recorded incident and Zabbix automated alert escalated to Tier-2 NOC." }
      ],
      tags: ["DWDM Optical", "BGP Path Prepend", "BFD 18ms", "Junos MX960", "Carrier High-Availability"]
    },
    {
      id: "INC-2026-0422",
      time: "11:42 AM BDT",
      severity: "SEV-2 ELEVATED",
      severityColor: "text-amber-400 bg-amber-950/60 border-amber-800",
      title: "L2 Broadcast Storm & Rogue DHCP Neutralization via PVLAN",
      summary: "A misconfigured tenant switch injected rogue DHCP offers and looped broadcast frames across enterprise access tier. Mitigated with PVLAN & DHCP snooping.",
      metrics: {
        mttd: "45s",
        mttr: "2m 10s",
        packetLoss: "< 0.4%",
        isolatedPorts: "12 Access Ports"
      },
      timeline: [
        { time: "11:42:15", text: "LibreNMS flagged CPU spike (88%) on edge distribution switch due to broadcast packet deluge." },
        { time: "11:42:35", text: "Discovered rogue DHCP server spoofing gateway 103.250.64.1 on untrusted access port ge-0/0/14." },
        { time: "11:43:10", text: "Enforced Private VLAN isolation (Primary 100, Isolated 101) blocking lateral broadcast flooding." },
        { time: "11:44:25", text: "DHCP Snooping database verified valid binding; rogue server permanently shunned with port-security." }
      ],
      tags: ["Private VLAN", "DHCP Snooping", "Storm Control", "Cisco Catalyst", "L2 Security"]
    },
    {
      id: "INC-2025-1108",
      time: "04:30 PM BDT",
      severity: "SEV-3 RESILIENCE",
      severityColor: "text-emerald-400 bg-emerald-950/60 border-emerald-800",
      title: "Central Syslog Ingestion Scale: 200+ Carrier Nodes & Zabbix HA",
      summary: "Engineered scalable centralized Debian Rsyslog infrastructure aggregating live log streams from 200+ MikroTik, Cisco, and Juniper routers with config diff automation.",
      metrics: {
        mttd: "Continuous",
        mttr: "Audit-Ready",
        throughput: "15k events/sec",
        storageRetention: "90 Days Encrypted"
      },
      timeline: [
        { time: "Phase 1", text: "Isolated syslog transport into dedicated OOB Management VRF preventing control plane starvation." },
        { time: "Phase 2", text: "Constructed logrotate pipelines with SHA-256 integrity hashing for ISP compliance auditing." },
        { time: "Phase 3", text: "Integrated Zabbix SNMP trap traps with automated Discord/Telegram webhooks for instant on-call escalation." }
      ],
      tags: ["Enterprise Linux", "Rsyslog", "Zabbix HA", "MikroTik CCR", "Log Analytics"]
    }
  ]

  const inc = incidents[activeIncident]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs mono tracking-widest uppercase text-[#d4ff3f]">NOC WAR ROOM // INCIDENT ARCHIVE</span>
            <span className="px-2 py-0.5 rounded bg-[#151522] text-[#9090a2] text-[10px] mono border border-[#27273a]">
              PRODUCTION POST-MORTEMS
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white">
            When Mission-Critical Networks Go Down.
          </h3>
          <p className="text-sm text-[#9b9ba4] mt-1 max-w-2xl font-light">
            Real incident retrospectives from daily carrier operations: root causes, automated failovers, and MTTR benchmarks.
          </p>
        </div>

        {/* Incident Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#0e0e14] border border-[#20202a] self-start sm:self-auto overflow-x-auto max-w-full">
          {incidents.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveIncident(idx)}
              className={`px-3 py-1.5 rounded text-xs mono transition-all whitespace-nowrap font-semibold ${
                activeIncident === idx
                  ? 'bg-[#d4ff3f] text-[#08080a] shadow-[0_0_12px_rgba(212,255,63,0.3)]'
                  : 'text-[#888898] hover:text-white'
              }`}
            >
              <span>{item.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Incident Detail Box */}
      <div className="p-6 md:p-8 rounded-xl bg-[#0c0c12] border border-[#232330] space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#1c1c28] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] mono px-2 py-0.5 rounded border font-bold ${inc.severityColor}`}>
                {inc.severity}
              </span>
              <span className="text-xs mono text-[#7c7c8e]">{inc.time}</span>
              <span className="text-xs mono text-[#505060]">·</span>
              <span className="text-xs mono text-[#00f0ff]">{inc.id}</span>
            </div>
            <h4 className="text-xl md:text-2xl font-bold text-white">
              {inc.title}
            </h4>
          </div>

          <div className="flex items-center gap-2 text-xs mono text-[#00ff66] bg-[#112417] px-3 py-1.5 rounded border border-[#00ff66]/40">
            <ShieldCheck className="w-4 h-4 text-[#00ff66]" />
            <span>FULL MITIGATION ACHIEVED</span>
          </div>
        </div>

        {/* Incident Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(inc.metrics).map(([key, val]) => (
            <div key={key} className="p-3 rounded-lg bg-[#12121a] border border-[#1f1f2c]">
              <span className="text-[10px] text-[#707082] uppercase mono block">
                {key.replace(/([A-Z])/g, ' $1')}
              </span>
              <span className="text-base font-extrabold text-[#d4ff3f] mono mt-1 block">
                {val}
              </span>
            </div>
          ))}
        </div>

        {/* Incident Summary */}
        <div className="p-4 rounded-lg bg-[#14141e] border-l-2 border-[#d4ff3f] text-sm text-[#c8c8d8] font-light leading-relaxed">
          {inc.summary}
        </div>

        {/* Incident Timeline Logs */}
        <div className="space-y-3">
          <span className="text-xs mono uppercase text-[#88889a] font-semibold tracking-wider block">
            Sequence of Events & Resolution:
          </span>
          <div className="space-y-2">
            {inc.timeline.map((step, sIdx) => (
              <div key={sIdx} className="flex items-start gap-3 text-xs mono p-2.5 rounded bg-[#0f0f16] border border-[#1b1b26]">
                <span className="text-[#00f0ff] font-bold shrink-0">{step.time}</span>
                <span className="text-[#707080]">➔</span>
                <span className="text-[#d0d0de] leading-relaxed font-light">{step.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#181822]">
          {inc.tags.map((t, ti) => (
            <span key={ti} className="text-[11px] mono px-2 py-0.5 rounded bg-[#161622] text-[#8e8ea0] border border-[#242436]">
              #{t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
