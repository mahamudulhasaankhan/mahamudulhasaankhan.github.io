import React, { useState } from 'react'
import { 
  Network, 
  Server, 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Layers, 
  ExternalLink, 
  Linkedin, 
  Github, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Award, 
  GraduationCap, 
  Briefcase, 
  Activity, 
  Radio, 
  Menu, 
  X, 
  ChevronRight,
  Monitor,
  Flame,
  FileText
} from 'lucide-react'

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const experiences = [
    {
      role: "Assistant System Engineer",
      team: "Core-Access Team",
      company: "Amber IT Ltd",
      type: "Full-time",
      period: "Mar 2026 - Present",
      location: "Gulshan, Dhaka, Bangladesh (On-site)",
      badge: "Current Role",
      highlights: [
        "Manage and scale robust core-access network infrastructures across enterprise clients.",
        "Execute advanced routing and switching operations across Juniper, Cisco, and MikroTik environments.",
        "Administer enterprise Linux servers and oversee centralized Log Server & automated backup operations.",
        "Ensure maximum network uptime through proactive monitoring, link redundancy, and fast incident response."
      ]
    },
    {
      role: "Technical Support Engineer",
      team: "Network Operations Center (NOC)",
      company: "A. K. Khan Telecom Limited",
      type: "Full-time",
      period: "Jan 2026 - Feb 2026",
      location: "Gulshan Avenue, Dhaka, Bangladesh",
      badge: "NOC Operations",
      highlights: [
        "Conducted 24/7 real-time infrastructure surveillance using Zabbix and LibreNMS monitoring systems.",
        "Resolved critical Layer 2 and Layer 3 incidents and managed complex MikroTik & Juniper router configurations.",
        "Handled enterprise routing protocols (OSPF, BGP) to guarantee uninterrupted ISP/telco connectivity.",
        "Maintained high SLA compliance and performed system administration tasks in Linux server environments."
      ]
    },
    {
      role: "NOC Engineer Intern",
      team: "Network Operations Center",
      company: "Dot Internet",
      type: "Internship",
      period: "Sep 2025 - Dec 2025",
      location: "Rayer Bazar, Mohammadpur, Dhaka",
      badge: "ISP Infrastructure",
      highlights: [
        "Configured and managed ISP-grade MikroTik edge routers, Optical Line Terminals (OLT), and ONU devices.",
        "Monitored live LAN/WAN network stability, implemented IP addressing schemes, and managed VLAN segmentation.",
        "Collaborated with tier-2 network teams to diagnose and resolve subscriber and backbone link connectivity issues."
      ]
    }
  ]

  const skills = [
    {
      title: "Core Routing & Protocols",
      icon: <Network className="w-5 h-5 text-cyan-400" />,
      items: ["BGP (eBGP/iBGP)", "OSPF", "EIGRP", "MPLS L3VPN", "VLAN / Private VLANs", "IPv4 & IPv6 Dual-Stack", "Traffic Engineering"]
    },
    {
      title: "Vendor Hardware & OS",
      icon: <Cpu className="w-5 h-5 text-emerald-400" />,
      items: ["MikroTik (RouterOS)", "Juniper (JunOS)", "Cisco (IOS / Switching)", "OLT / ONU (GPON/EPON)", "BDCOM & VSOL", "Fiber Infrastructure"]
    },
    {
      title: "Systems & Monitoring",
      icon: <Server className="w-5 h-5 text-indigo-400" />,
      items: ["Linux Administration", "Zabbix Surveillance", "LibreNMS", "Centralized Log Server", "Automated Backup Systems", "PNETLab & GNS3", "Wireshark Packet Analysis"]
    },
    {
      title: "Security & Operations",
      icon: <ShieldCheck className="w-5 h-5 text-rose-400" />,
      items: ["Enterprise Network Security", "Threat Mitigation (bdNOG TTT)", "NOC Incident Management", "Access Control Lists (ACL)", "Network Automation", "SLA & High Availability"]
    }
  ]

  const practicalLabs = [
    {
      title: "Information Security for Enterprise & Network Operators (TTT)",
      platform: "bdNOG 22 Conference",
      desc: "Completed rigorous Train-the-Trainer (TTT) hands-on workshop focused on securing enterprise & SP network infrastructure, threat mitigation, and operational resilience.",
      tags: ["Network Security", "bdNOG 22", "Threat Mitigation", "Infrastructure Hardening"]
    },
    {
      title: "Advanced BGP with MikroTik Workshop",
      platform: "bdNOG 21 & ISPAB",
      desc: "Intensive 3-day deep dive into complex real-world routing scenarios, traffic engineering, multihoming BGP troubleshooting, and live production problem resolution.",
      tags: ["BGP Peering", "Traffic Engineering", "MikroTik", "ISP Core"]
    },
    {
      title: "MPLS Layer 3 VPN (L3VPN) Multi-Site Emulation",
      platform: "PNETLab Virtual Topology",
      desc: "Simulated Service Provider core (AS100) connecting multi-tenant customer sites using OSPF & LDP in the core, VRF for complete traffic isolation, and MP-BGP (VPNv4).",
      tags: ["MPLS", "L3VPN", "VRF", "MP-BGP", "Cisco"]
    },
    {
      title: "Private VLANs & Advanced Layer 2 Security",
      platform: "PNETLab Virtual Topology",
      desc: "Configured Primary, Community, and Isolated VLANs to enforce strict zero-trust traffic isolation within shared broadcast domains for enterprise environments.",
      tags: ["Private VLAN", "L2 Security", "Switching", "Zero-Trust"]
    }
  ]

  const certifications = [
    {
      name: "Linux Essentials",
      issuer: "Cisco Networking Academy",
      issued: "Jan 2025",
      id: "Credential ID: f5bd7451-b763-45ed-9adf-b76832b7a123"
    },
    {
      name: "IT Support Service (Level-3)",
      issuer: "SICIP (Skills for Industry Competitiveness & Innovation)",
      issued: "Sep 2025 - Aug 2030",
      id: "Govt. Accredited Certification"
    },
    {
      name: "Advanced BGP & Network Operator Certification",
      issuer: "bdNOG (Bangladesh Network Operators Group) & ISPAB",
      issued: "bdNOG 21 & 22",
      id: "Core Internet Infrastructure"
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Network Grid & Light Effects */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[128px]"></div>
        <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[130px]"></div>
        
        {/* Subtle Network Matrix Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 font-bold text-lg tracking-tight group">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Radio className="w-4 h-4 animate-pulse text-cyan-200" />
            </span>
            <div>
              <span className="text-white">Mahamudul</span>
              <span className="text-cyan-400">.me</span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
            <a href="#experience" className="hover:text-cyan-400 transition-colors">Experience</a>
            <a href="#skills" className="hover:text-cyan-400 transition-colors">Skills</a>
            <a href="#labs" className="hover:text-cyan-400 transition-colors">Labs & bdNOG</a>
            <a href="#education" className="hover:text-cyan-400 transition-colors">Education</a>
            <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a 
              href="https://www.linkedin.com/in/md-mahamudul-hassan-khan/" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all shadow-sm"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>Connect on LinkedIn</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden px-6 py-4 bg-slate-900 border-b border-slate-800 space-y-3">
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-300 hover:text-cyan-400">About</a>
            <a href="#experience" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-300 hover:text-cyan-400">Experience</a>
            <a href="#skills" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-300 hover:text-cyan-400">Skills</a>
            <a href="#labs" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-300 hover:text-cyan-400">Labs & bdNOG</a>
            <a href="#education" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-300 hover:text-cyan-400">Education</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-300 hover:text-cyan-400">Contact</a>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-28">
        {/* Hero Section */}
        <section className="pt-8 md:pt-16 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-semibold mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Core-Access Engineer @ Amber IT Ltd</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight">
            Md Mahamudul Hassan <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">(Shihab)</span> Khan
          </h1>

          <p className="mt-4 text-lg md:text-xl font-medium text-slate-300">
            System & Network Engineer <span className="text-slate-600">|</span> Core-Access Infrastructure Specialist
          </p>

          <p className="mt-4 text-sm md:text-base text-slate-400 max-w-2xl leading-relaxed">
            Specializing in high-availability enterprise routing, BGP/OSPF, MPLS L3VPN, and multi-vendor infrastructure across <span className="text-slate-200 font-semibold">MikroTik, Juniper, Cisco, and Linux</span>. Passionate about carrier-grade stability, log management, and network automation.
          </p>

          <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
            <MapPin className="w-4 h-4 text-rose-400" />
            <span>Dhaka, Bangladesh</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-medium">Open to Opportunities</span>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a 
              href="#experience" 
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Briefcase className="w-4 h-4" />
              <span>View Professional Experience</span>
            </a>
            <a 
              href="https://www.linkedin.com/in/md-mahamudul-hassan-khan/" 
              target="_blank" 
              rel="noreferrer"
              className="px-6 py-3 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold flex items-center gap-2 transition-colors"
            >
              <Linkedin className="w-4 h-4 text-cyan-400" />
              <span>LinkedIn Profile</span>
            </a>
            <a 
              href="https://github.com/mahamudulhasaankhan" 
              target="_blank" 
              rel="noreferrer"
              className="px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-medium flex items-center gap-2 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </section>

        {/* Quick Highlights Counter */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-center">
            <div className="text-2xl md:text-3xl font-extrabold text-cyan-400">Amber IT</div>
            <div className="text-xs text-slate-400 mt-1">Core-Access Team</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-center">
            <div className="text-2xl md:text-3xl font-extrabold text-emerald-400">bdNOG 21 & 22</div>
            <div className="text-xs text-slate-400 mt-1">TTT & Advanced BGP</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-center">
            <div className="text-2xl md:text-3xl font-extrabold text-indigo-400">Multi-Vendor</div>
            <div className="text-xs text-slate-400 mt-1">MikroTik, Juniper, Cisco</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-center">
            <div className="text-2xl md:text-3xl font-extrabold text-teal-400">NOC & Logs</div>
            <div className="text-xs text-slate-400 mt-1">24/7 Enterprise Surveillance</div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="scroll-mt-24">
          <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <span className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Terminal className="w-5 h-5" />
              </span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">About Me</h2>
            </div>
            
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              As an <strong className="text-cyan-300">Assistant System Engineer in the Core-Access team at Amber IT</strong>, I manage and scale robust network infrastructures. My daily operations heavily focus on advanced routing and switching protocols across <strong className="text-slate-100">Juniper, Cisco, and MikroTik</strong> environments.
            </p>
            <p className="mt-4 text-slate-300 text-base md:text-lg leading-relaxed">
              To ensure maximum uptime and efficient troubleshooting, I also administer <strong className="text-slate-100">Linux-based systems</strong> and oversee centralized Log Server management. I am dedicated to maintaining secure, high-performance enterprise networks and continuously exploring network automation.
            </p>

            <div className="mt-8 pt-6 border-t border-slate-800/80 grid md:grid-cols-3 gap-4 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Centralized Syslog & Backups</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Carrier-Grade BGP Traffic Engineering</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Zabbix & LibreNMS Live Surveillance</span>
              </div>
            </div>
          </div>
        </section>

        {/* Work Experience Timeline */}
        <section id="experience" className="space-y-8 scroll-mt-24">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Professional Experience</h2>
            <p className="text-slate-400 text-sm mt-1">My industry career across ISP, Telecom & Core Infrastructure</p>
          </div>

          <div className="space-y-6">
            {experiences.map((exp, idx) => (
              <div 
                key={idx} 
                className="p-6 md:p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {exp.role}
                      </h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                        {exp.badge}
                      </span>
                    </div>
                    <p className="text-slate-300 font-medium text-sm mt-0.5">
                      <span className="text-cyan-300 font-semibold">{exp.company}</span> • {exp.team}
                    </p>
                  </div>
                  <div className="text-xs text-slate-400 md:text-right">
                    <p className="font-semibold text-slate-300">{exp.period}</p>
                    <p>{exp.location}</p>
                  </div>
                </div>

                <ul className="space-y-2.5 mt-4">
                  {exp.highlights.map((item, hIdx) => (
                    <li key={hIdx} className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
                      <ChevronRight className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="space-y-8 scroll-mt-24">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Technical Competencies</h2>
            <p className="text-slate-400 text-sm mt-1">Protocols, vendor hardware, systems, and network security</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {skills.map((skillGroup, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <span className="p-2 rounded-lg bg-slate-800">
                    {skillGroup.icon}
                  </span>
                  <h3 className="font-semibold text-lg text-white">{skillGroup.title}</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((item, itemIdx) => (
                    <span 
                      key={itemIdx}
                      className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/90 text-slate-200 border border-slate-700/60 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* bdNOG & Practical Labs */}
        <section id="labs" className="space-y-8 scroll-mt-24">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">bdNOG Workshops & Practical Labs</h2>
            <p className="text-slate-400 text-sm mt-1">Intensive hands-on simulations, topology engineering, and conference workshops</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {practicalLabs.map((lab, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between hover:border-cyan-500/50 transition-all group"
              >
                <div>
                  <div className="text-xs font-semibold text-cyan-400 mb-2 uppercase tracking-wider">
                    {lab.platform}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                    {lab.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    {lab.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-800/60">
                  {lab.tags.map((t, tIdx) => (
                    <span key={tIdx} className="text-[11px] px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/40">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education & Certifications */}
        <section id="education" className="space-y-8 scroll-mt-24">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Education */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-5 h-5 text-cyan-400" />
                <h3 className="text-xl font-bold">Education</h3>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
                <div>
                  <div className="text-xs font-semibold text-cyan-400">Jan 2022 – Dec 2025</div>
                  <h4 className="text-base font-bold text-white mt-1">Diploma in Engineering (Computer Science & Technology)</h4>
                  <p className="text-sm text-slate-400">Patuakhali Polytechnic Institute</p>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <div className="text-xs font-semibold text-slate-400">Jan 2019 – Feb 2021</div>
                  <h4 className="text-base font-bold text-white mt-1">Secondary School Certificate (SSC) in Science</h4>
                  <p className="text-sm text-slate-400">Rajapur Pilot High School</p>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-emerald-400" />
                <h3 className="text-xl font-bold">Licenses & Certifications</h3>
              </div>

              <div className="space-y-3">
                {certifications.map((cert, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-start gap-3">
                    <span className="p-2 rounded-lg bg-slate-800 text-emerald-400 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{cert.name}</h4>
                      <p className="text-xs text-slate-300">{cert.issuer}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{cert.issued} • {cert.id}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="scroll-mt-24">
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Let's Connect & Collaborate</h2>
            <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
              Interested in discussing core network architecture, ISP engineering, BGP routing, or exploring new career opportunities? Feel free to reach out.
            </p>

            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <a 
                href="https://www.linkedin.com/in/md-mahamudul-hassan-khan/" 
                target="_blank" 
                rel="noreferrer"
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
              >
                <Linkedin className="w-4 h-4" />
                <span>Connect on LinkedIn</span>
              </a>
              <a 
                href="https://github.com/mahamudulhasaankhan" 
                target="_blank" 
                rel="noreferrer"
                className="px-6 py-3 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold flex items-center gap-2 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Profile</span>
              </a>
            </div>

            <div className="text-xs text-slate-500 pt-4">
              Location: Gulshan / Dhaka, Bangladesh • Amber IT Ltd Core-Access Team
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 mt-20 py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Md Mahamudul Hassan (Shihab) Khan. Hosted on GitHub Pages with Cloudflare CDN & Security.</p>
      </footer>
    </div>
  )
}
