import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function NetworkCanvas() {
  const canvasRef = useRef(null)
  const [topology, setTopology] = useState('clos') // 'clos' | 'ring' | 'mesh'
  const topologyRef = useRef('clos')

  useEffect(() => {
    topologyRef.current = topology
  }, [topology])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    } catch (e) {
      return
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const LIME = 0xd4ff3f
    const BG = 0x08080a
    const CYAN = 0x00f0ff
    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(BG, 9, 25)

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.set(0, 0.9, 11)
    camera.lookAt(0, 0, 0)

    const rig = new THREE.Group()
    scene.add(rig)

    const fab = new THREE.Group()
    rig.add(fab)
    fab.position.set(1.6, 0.2, 0)
    fab.rotation.set(-0.10, -0.42, 0)

    // Switch factory
    const edgeMat = new THREE.LineBasicMaterial({ color: LIME, transparent: true, opacity: 0.85 })
    const edgeMatCyan = new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.85 })
    const edgeMatDim = new THREE.LineBasicMaterial({ color: LIME, transparent: true, opacity: 0.32 })
    const fillMat = new THREE.MeshBasicMaterial({ color: 0x111115 })

    function makeSwitch(w, h, d, dim, isCyan) {
      const g = new THREE.Group()
      const geo = new THREE.BoxGeometry(w, h, d)
      g.add(new THREE.Mesh(geo, fillMat))
      g.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), isCyan ? edgeMatCyan : (dim ? edgeMatDim : edgeMat)))
      return g
    }

    // Packet Glow Texture
    const glowTex = (() => {
      const c = document.createElement('canvas')
      c.width = c.height = 64
      const x = c.getContext('2d')
      const g = x.createRadialGradient(32, 32, 0, 32, 32, 32)
      g.addColorStop(0, 'rgba(212,255,63,1)')
      g.addColorStop(0.45, 'rgba(212,255,63,0.6)')
      g.addColorStop(1, 'rgba(212,255,63,0)')
      x.fillStyle = g
      x.fillRect(0, 0, 64, 64)
      return new THREE.CanvasTexture(c)
    })()

    // Floor grid
    const grid = new THREE.GridHelper(36, 44, 0x22222c, 0x141418)
    grid.position.y = -2.6
    rig.add(grid)

    let currentNetworkGroup = new THREE.Group()
    fab.add(currentNetworkGroup)

    let packets = []
    let packetNodes = []
    let packetPaths = []

    function buildTopology(type) {
      fab.remove(currentNetworkGroup)
      currentNetworkGroup = new THREE.Group()
      fab.add(currentNetworkGroup)

      packets = []
      packetNodes = []
      packetPaths = []

      if (type === 'clos') {
        // 1. CLOS FABRIC: 4 Spines, 8 Leaves, 16 Hosts
        const spines = []
        const leaves = []
        const hosts = []

        for (let i = 0; i < 4; i++) {
          const s = makeSwitch(1.15, 0.24, 0.55)
          s.position.set((i - 1.5) * 2.0, 2.0, 0)
          currentNetworkGroup.add(s)
          spines.push(s.position)
        }

        for (let i = 0; i < 8; i++) {
          const l = makeSwitch(0.78, 0.20, 0.5)
          l.position.set((i - 3.5) * 1.12, 0, 0)
          currentNetworkGroup.add(l)
          leaves.push(l.position)
        }

        for (let i = 0; i < 16; i++) {
          const h = makeSwitch(0.30, 0.34, 0.30, true)
          h.position.set((i - 7.5) * 0.56, -1.7, ((i % 2) - 0.5) * 0.55)
          currentNetworkGroup.add(h)
          hosts.push(h.position)
        }

        const links = []
        spines.forEach(s => leaves.forEach(l => links.push([s, l])))
        hosts.forEach((h, i) => links.push([leaves[i >> 1], h]))

        const lpos = new Float32Array(links.length * 6)
        links.forEach(([a, b], k) => lpos.set([a.x, a.y, a.z, b.x, b.y, b.z], k * 6))
        const lgeo = new THREE.BufferGeometry()
        lgeo.setAttribute('position', new THREE.BufferAttribute(lpos, 3))
        currentNetworkGroup.add(new THREE.LineSegments(lgeo, new THREE.LineBasicMaterial({
          color: LIME,
          transparent: true,
          opacity: 0.16,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })))

        packetNodes = { spines, leaves, hosts }
        packetPaths = () => {
          const l1 = leaves[Math.floor(Math.random() * 8)]
          const sp = spines[Math.floor(Math.random() * 4)]
          const l2 = leaves[Math.floor(Math.random() * 8)]
          return [l1, sp, l2]
        }
      } else if (type === 'ring') {
        // 2. METRO CORE OPTICAL RING: 8 Nodes in a circle with dual counter-rotating fiber loops
        const nodes = []
        const count = 8
        const radius = 2.4

        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * (radius * 0.75)
          const z = Math.sin(angle * 2) * 0.4
          const s = makeSwitch(0.95, 0.32, 0.45, false, i % 2 === 0)
          s.position.set(x, y, z)
          s.rotation.z = angle + Math.PI / 2
          currentNetworkGroup.add(s)
          nodes.push(s.position)
        }

        // Connect ring
        const links = []
        for (let i = 0; i < count; i++) {
          const next = (i + 1) % count
          links.push([nodes[i], nodes[next]])
          // Cross-connect chords
          if (i % 2 === 0) {
            links.push([nodes[i], nodes[(i + 4) % count]])
          }
        }

        const lpos = new Float32Array(links.length * 6)
        links.forEach(([a, b], k) => lpos.set([a.x, a.y, a.z, b.x, b.y, b.z], k * 6))
        const lgeo = new THREE.BufferGeometry()
        lgeo.setAttribute('position', new THREE.BufferAttribute(lpos, 3))
        currentNetworkGroup.add(new THREE.LineSegments(lgeo, new THREE.LineBasicMaterial({
          color: CYAN,
          transparent: true,
          opacity: 0.25,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })))

        packetNodes = nodes
        packetPaths = () => {
          const start = Math.floor(Math.random() * count)
          const next = (start + 1) % count
          const next2 = (start + 2) % count
          return [nodes[start], nodes[next], nodes[next2]]
        }
      } else if (type === 'mesh') {
        // 3. FULL MESH BGP: 7 Autonomous Routing nodes interconnected in high-density 3D web
        const nodes = []
        const coords = [
          [0, 1.8, 0],
          [-2.2, 0.8, -0.6],
          [2.2, 0.8, -0.6],
          [-1.6, -1.2, 0.5],
          [1.6, -1.2, 0.5],
          [0, -0.2, 1.2],
          [0, -1.8, -0.8]
        ]

        coords.forEach(([x, y, z], i) => {
          const s = makeSwitch(0.85, 0.28, 0.45, false, i === 0 || i === 5)
          s.position.set(x, y, z)
          currentNetworkGroup.add(s)
          nodes.push(s.position)
        })

        const links = []
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            links.push([nodes[i], nodes[j]])
          }
        }

        const lpos = new Float32Array(links.length * 6)
        links.forEach(([a, b], k) => lpos.set([a.x, a.y, a.z, b.x, b.y, b.z], k * 6))
        const lgeo = new THREE.BufferGeometry()
        lgeo.setAttribute('position', new THREE.BufferAttribute(lpos, 3))
        currentNetworkGroup.add(new THREE.LineSegments(lgeo, new THREE.LineBasicMaterial({
          color: LIME,
          transparent: true,
          opacity: 0.18,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })))

        packetNodes = nodes
        packetPaths = () => {
          const i1 = Math.floor(Math.random() * nodes.length)
          let i2 = Math.floor(Math.random() * nodes.length)
          while (i2 === i1) i2 = Math.floor(Math.random() * nodes.length)
          let i3 = Math.floor(Math.random() * nodes.length)
          while (i3 === i2 || i3 === i1) i3 = Math.floor(Math.random() * nodes.length)
          return [nodes[i1], nodes[i2], nodes[i3]]
        }
      }

      // Initialize packets
      const PK = 45
      const pkMat = new THREE.SpriteMaterial({
        map: glowTex,
        color: type === 'ring' ? CYAN : LIME,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })

      for (let i = 0; i < PK; i++) {
        const m = new THREE.Sprite(pkMat.clone())
        m.scale.set(0.20, 0.20, 1)
        packets.push({ m, path: packetPaths(), t: Math.random() * 2, s: 0.7 + Math.random() * 0.9 })
        currentNetworkGroup.add(m)
      }
    }

    buildTopology('clos')

    // Track topology change
    let activeType = 'clos'

    // Mouse parallax
    let mx = 0, my = 0, tx = 0, ty = 0
    const handlePointerMove = (e) => {
      tx = (e.clientX / window.innerWidth - 0.5)
      ty = (e.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    const resize = () => {
      const parent = canvas.parentElement
      const w = parent ? parent.clientWidth : window.innerWidth
      const h = parent ? parent.clientHeight : window.innerHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()

      if (w < 768) {
        fab.position.x = 0.2
        camera.position.z = 13
      } else {
        fab.position.x = 1.7
        camera.position.z = 11
      }
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })

    const clock = new THREE.Clock()
    let reqId

    const animate = () => {
      reqId = requestAnimationFrame(animate)

      // Check if user changed topology mode
      if (topologyRef.current !== activeType) {
        activeType = topologyRef.current
        buildTopology(activeType)
      }

      const dt = Math.min(clock.getDelta(), 0.05)
      mx += (tx - mx) * 0.05
      my += (ty - my) * 0.05

      rig.rotation.y = mx * 0.35
      rig.rotation.x = -my * 0.25

      // Slight auto spin for ring / mesh
      if (activeType === 'ring' || activeType === 'mesh') {
        currentNetworkGroup.rotation.y += dt * 0.12
      } else {
        currentNetworkGroup.rotation.y = 0
      }

      // Animate packet pulses along links
      for (let i = 0; i < packets.length; i++) {
        const p = packets[i]
        p.t += dt * p.s
        if (p.t >= 2) {
          p.t = 0
          p.path = packetPaths()
        }
        const seg = Math.min(Math.floor(p.t), 1)
        const sub = p.t - seg
        const p0 = p.path[seg]
        const p1 = p.path[seg + 1]
        if (p0 && p1) {
          p.m.position.lerpVectors(p0, p1, sub)
        }
      }

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(reqId)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('resize', resize)
      renderer.dispose()
    }
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
        aria-hidden="true"
      />

      {/* Interactive 3D Topology Switcher Pill */}
      <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 z-20 pointer-events-auto flex items-center gap-1 sm:gap-1.5 p-1 rounded-lg bg-[#0e0e14]/95 backdrop-blur-md border border-[#232330] shadow-2xl text-[9px] sm:text-[10px] mono max-w-[calc(100vw-24px)] overflow-x-auto">
        <span className="text-[#6c6c7e] px-1.5 sm:px-2 uppercase font-semibold whitespace-nowrap">3D Fabric:</span>
        {[
          { id: 'clos', label: '01/CLOS SPINES' },
          { id: 'ring', label: '02/METRO RING' },
          { id: 'mesh', label: '03/BGP FULL MESH' }
        ].map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setTopology(m.id)}
            className={`px-2 sm:px-2.5 py-1 rounded transition-all font-bold whitespace-nowrap ${
              topology === m.id
                ? 'bg-[#d4ff3f] text-[#08080a] shadow-[0_0_10px_rgba(212,255,63,0.3)]'
                : 'text-[#8e8e9e] hover:text-white hover:bg-[#1a1a24]'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  )
}
