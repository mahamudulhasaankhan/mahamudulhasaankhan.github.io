import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function NetworkCanvas() {
  const canvasRef = useRef(null)

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
    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(BG, 9, 23)

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.set(0, 0.9, 11)
    camera.lookAt(0, 0, 0)

    const rig = new THREE.Group()
    scene.add(rig)

    const fab = new THREE.Group()
    rig.add(fab)
    fab.position.set(1.6, 0.2, 0)
    fab.rotation.set(-0.10, -0.42, 0)

    // Switch factory: dark box + lime edges
    const edgeMat = new THREE.LineBasicMaterial({ color: LIME, transparent: true, opacity: 0.85 })
    const edgeMatDim = new THREE.LineBasicMaterial({ color: LIME, transparent: true, opacity: 0.32 })
    const fillMat = new THREE.MeshBasicMaterial({ color: 0x111115 })

    function makeSwitch(w, h, d, dim) {
      const g = new THREE.Group()
      const geo = new THREE.BoxGeometry(w, h, d)
      g.add(new THREE.Mesh(geo, fillMat))
      g.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), dim ? edgeMatDim : edgeMat))
      return g
    }

    // Clos topology: 4 spines / 8 leaves / 16 hosts
    const spines = []
    const leaves = []
    const hosts = []

    for (let i = 0; i < 4; i++) {
      const s = makeSwitch(1.15, 0.24, 0.55)
      s.position.set((i - 1.5) * 2.0, 2.0, 0)
      fab.add(s)
      spines.push(s.position)
    }

    for (let i = 0; i < 8; i++) {
      const l = makeSwitch(0.78, 0.20, 0.5)
      l.position.set((i - 3.5) * 1.12, 0, 0)
      fab.add(l)
      leaves.push(l.position)
    }

    for (let i = 0; i < 16; i++) {
      const h = makeSwitch(0.30, 0.34, 0.30, true)
      h.position.set((i - 7.5) * 0.56, -1.7, ((i % 2) - 0.5) * 0.55)
      fab.add(h)
      hosts.push(h.position)
    }

    // Full spine <-> leaf mesh links + leaf <-> host
    const links = []
    spines.forEach(s => leaves.forEach(l => links.push([s, l])))
    hosts.forEach((h, i) => links.push([leaves[i >> 1], h]))

    const lpos = new Float32Array(links.length * 6)
    links.forEach(([a, b], k) => lpos.set([a.x, a.y, a.z, b.x, b.y, b.z], k * 6))
    const lgeo = new THREE.BufferGeometry()
    lgeo.setAttribute('position', new THREE.BufferAttribute(lpos, 3))
    fab.add(new THREE.LineSegments(lgeo, new THREE.LineBasicMaterial({
      color: LIME,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })))

    // Floor grid
    const grid = new THREE.GridHelper(36, 44, 0x22222c, 0x141418)
    grid.position.y = -2.6
    rig.add(grid)

    // Soft round sprite for glowing packets
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

    const PK = 45
    const packets = []
    const pkMat = new THREE.SpriteMaterial({
      map: glowTex,
      color: LIME,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })

    function newPath() {
      const l1 = leaves[Math.floor(Math.random() * 8)]
      const sp = spines[Math.floor(Math.random() * 4)]
      const l2 = leaves[Math.floor(Math.random() * 8)]
      const hi = Math.floor(Math.random() * 16)
      return Math.random() < 0.3
        ? [hosts[hi], leaves[hi >> 1], spines[Math.floor(Math.random() * 4)]]
        : [l1, sp, l2]
    }

    for (let i = 0; i < PK; i++) {
      const m = new THREE.Sprite(pkMat.clone())
      m.scale.set(0.18, 0.18, 1)
      packets.push({ m, path: newPath(), t: Math.random() * 2, s: 0.6 + Math.random() * 0.9 })
      fab.add(m)
    }

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

      const dt = Math.min(clock.getDelta(), 0.05)
      mx += (tx - mx) * 0.05
      my += (ty - my) * 0.05

      rig.rotation.y = mx * 0.35
      rig.rotation.x = -my * 0.25

      // Animate packet pulses along links
      for (let i = 0; i < PK; i++) {
        const p = packets[i]
        p.t += dt * p.s
        if (p.t >= 2) {
          p.t = 0
          p.path = newPath()
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
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  )
}
