import React, { useState } from 'react'
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Code2, 
  Briefcase, 
  User, 
  Terminal, 
  ChevronRight,
  Menu,
  X,
  Sparkles,
  ArrowUpRight
} from 'lucide-react'

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const projects = [
    {
      title: "Fullstack E-Commerce Platform",
      description: "A high-performance modern web store with real-time inventory, Stripe payment integration, and dark mode.",
      tech: ["React", "Node.js", "Tailwind CSS", "MongoDB"],
      github: "https://github.com",
      live: "https://example.com"
    },
    {
      title: "AI Chat & Productivity Dashboard",
      description: "Interactive dashboard featuring real-time AI assistance, dynamic data charts, and lightning-fast search.",
      tech: ["React", "Vite", "Tailwind CSS", "OpenAI API"],
      github: "https://github.com",
      live: "https://example.com"
    },
    {
      title: "Cloud Infrastructure Monitor",
      description: "A monitoring console that tracks server metrics, latency, uptime, and sends alert notifications.",
      tech: ["React", "TypeScript", "WebSocket", "Docker"],
      github: "https://github.com",
      live: "https://example.com"
    }
  ]

  const skills = [
    { category: "Frontend", items: ["React.js", "JavaScript (ES6+)", "TypeScript", "Tailwind CSS", "HTML5 / CSS3", "Next.js"] },
    { category: "Backend & DB", items: ["Node.js", "Express", "MongoDB", "PostgreSQL", "REST APIs", "GraphQL"] },
    { category: "DevOps & Tools", items: ["Git & GitHub", "Cloudflare", "Docker", "Linux", "Vite", "Vercel / Netlify"] }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/70 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white group">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <Terminal className="w-4 h-4" />
            </span>
            <span>Mahamudul<span className="text-indigo-400">.me</span></span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#about" className="hover:text-indigo-400 transition-colors">About</a>
            <a href="#skills" className="hover:text-indigo-400 transition-colors">Skills</a>
            <a href="#projects" className="hover:text-indigo-400 transition-colors">Projects</a>
            <a href="#contact" className="hover:text-indigo-400 transition-colors">Contact</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a 
              href="#contact" 
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/40"
            >
              Get in Touch
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden px-6 py-4 bg-slate-900 border-b border-slate-800 space-y-3">
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-300 hover:text-indigo-400">About</a>
            <a href="#skills" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-300 hover:text-indigo-400">Skills</a>
            <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-300 hover:text-indigo-400">Projects</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-300 hover:text-indigo-400">Contact</a>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-28">
        {/* Hero Section */}
        <section className="pt-12 md:pt-20 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Available for new projects & opportunities</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight">
            Building modern web experiences with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">speed & precision</span>.
          </h1>

          <p className="mt-6 text-base md:text-lg text-slate-400 max-w-2xl leading-relaxed">
            Hi, I'm <span className="text-white font-semibold">Md Mahamudul Hassan Khan</span> — a passionate developer specializing in building modern web applications, clean user interfaces, and robust cloud architectures.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a 
              href="#projects" 
              className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-semibold text-white shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all hover:gap-3"
            >
              <span>Explore My Work</span>
              <ChevronRight className="w-4 h-4" />
            </a>
            <a 
              href="https://github.com/mahamudulhasaankhan" 
              target="_blank" 
              rel="noreferrer"
              className="px-6 py-3 rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-medium flex items-center gap-2 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="space-y-8 scroll-mt-24">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Technical Skills</h2>
            <p className="text-slate-400 text-sm">Technologies and tools I work with daily</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {skills.map((skillGroup, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-all">
                <h3 className="font-semibold text-lg text-indigo-300 mb-4">{skillGroup.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((item, itemIdx) => (
                    <span 
                      key={itemIdx}
                      className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/50"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="space-y-8 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Featured Projects</h2>
              <p className="text-slate-400 text-sm mt-1">Some of the projects I've built and deployed</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((proj, idx) => (
              <div 
                key={idx} 
                className="group flex flex-col justify-between p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <Code2 className="w-5 h-5" />
                    </span>
                    <div className="flex items-center gap-2">
                      <a href={proj.github} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-white transition-colors" title="Source Code">
                        <Github className="w-4 h-4" />
                      </a>
                      <a href={proj.live} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-white transition-colors" title="Live Preview">
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold group-hover:text-indigo-400 transition-colors mb-2">
                    {proj.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    {proj.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-800/60">
                  {proj.tech.map((t, tIdx) => (
                    <span key={tIdx} className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="scroll-mt-24">
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-b from-slate-900/80 to-slate-950 border border-slate-800 text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Let's build something together!</h2>
            <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto">
              Feel free to reach out if you have a project in mind, want to collaborate, or just want to say hi.
            </p>

            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <a 
                href="mailto:your-email@example.com" 
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>Send Email</span>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                className="px-6 py-3 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold flex items-center gap-2 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 mt-20 py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} My Portfolio. Hosted on GitHub Pages & protected by Cloudflare.</p>
      </footer>
    </div>
  )
}
