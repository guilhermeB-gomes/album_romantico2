import { useEffect, useRef } from 'react'
import { reduce } from '../hooks/useAlbum'
export default function Petals() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (reduce) return
    const c = ref.current!, x = c.getContext('2d')!
    const size = () => { c.width = innerWidth; c.height = innerHeight }; size(); addEventListener('resize', size)
    const low = (navigator.hardwareConcurrency || 4) <= 4 || innerWidth < 600
    const ps = Array.from({ length: low ? 12 : 24 }, () => ({ x: Math.random() * c.width, y: Math.random() * c.height, s: 4 + Math.random() * 6, v: .25 + Math.random() * .5, a: Math.random() * 6, g: Math.random() > .75 }))
    let raf = 0
    const loop = () => {
      if (!document.hidden) {
        x.clearRect(0, 0, c.width, c.height)
        for (const p of ps) {
          p.y += p.v; p.a += .012; p.x += Math.sin(p.a) * .5; if (p.y > c.height + 20) { p.y = -20; p.x = Math.random() * c.width }
          x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.g ? 'rgba(214,180,119,.5)' : 'rgba(232,185,194,.6)'
          x.beginPath(); x.ellipse(0, 0, p.s, p.s / 2, 0, 0, 7); x.fill(); x.restore()
        }
      }
      raf = requestAnimationFrame(loop)
    }
    loop(); return () => { cancelAnimationFrame(raf); removeEventListener('resize', size) }
  }, [])
  return <canvas ref={ref} className="petals" aria-hidden="true" />
}
