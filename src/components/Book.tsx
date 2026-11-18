import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion, animate, useMotionValue, useTransform, AnimatePresence } from 'motion/react'
import type { Album } from '../types'
import { buildPages, Pic } from './Pages'
import MusicPlayer from './MusicPlayer'
import { reduce } from '../hooks/useAlbum'

function Sheet({ i, idx, n, cover, children }: { i: number; idx: number; n: number; cover?: boolean; children: ReactNode }) {
  const flipped = idx > i, r = useMotionValue(flipped ? -180 : 0)
  const shade = useTransform(r, [0, -90, -180], [0, .45, 0]), op = useTransform(r, [0, -150, -180], [1, 1, 0])
  useEffect(() => { const c = animate(r, flipped ? -180 : 0, { duration: reduce ? .01 : 1.1, ease: [.645, .045, .355, 1] }); return () => c.stop() }, [flipped, r])
  const live = i === idx
  return <motion.div className="sheet" style={{ rotateY: r, opacity: op, zIndex: flipped ? n + i : n - i }} aria-hidden={!live} {...(live ? {} : ({ inert: '' } as Record<string, string>))}>
    <div className={'front' + (cover ? ' cover' : '')}><div className="scroll">{Math.abs(i - idx) <= 1 ? children : null}</div><motion.div className="shade" style={{ opacity: shade }} /></div>
    <div className="back" />
  </motion.div>
}

export default function Book({ album, onHome }: { album: Album; onHome: () => void }) {
  const [idx, setIdx] = useState(0), [lb, setLb] = useState<number | null>(null), [menu, setMenu] = useState<'' | 'idx' | 'share'>(''), [msg, setMsg] = useState('')
  const pages = useMemo(() => buildPages(album, setIdx, setLb), [album]), n = pages.length
  const go = useCallback((d: number) => setIdx(i => Math.min(n - 1, Math.max(0, i + d))), [n])
  useEffect(() => { const t = setTimeout(() => setIdx(1), reduce ? 0 : 1100); return () => clearTimeout(t) }, [])
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (lb !== null) { if (e.key === 'Escape') setLb(null); if (e.key === 'ArrowRight') setLb(i => (i! + 1) % album.photos.length); if (e.key === 'ArrowLeft') setLb(i => (i! - 1 + album.photos.length) % album.photos.length); return }
      if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); if (e.key === 'Home') setIdx(0); if (e.key === 'End') setIdx(n - 1); if (e.key === 'Escape') setMenu('')
    }
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  }, [go, lb, n, album.photos.length])
  const t0 = useRef<[number, number]>([0, 0])
  const link = location.origin + location.pathname
  const share = async () => { try { await navigator.share({ title: album.title, url: link }) } catch { /* cancelado */ } }
  const copy = async () => { try { await navigator.clipboard.writeText(link); setMsg('Link copiado!') } catch { setMsg('Copie o endereço pela barra do navegador.') } }
  const full = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.()
  const p = lb !== null ? album.photos[lb] : null
  return <motion.div className="stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
    <header className="bar">
      <button onClick={onHome} aria-label="Voltar à abertura">‹ Início</button>
      <div className="bar-r"><MusicPlayer src={album.music} />
        <button onClick={() => setMenu(menu === 'idx' ? '' : 'idx')} aria-expanded={menu === 'idx'}>Índice</button>
        <button onClick={() => setMenu(menu === 'share' ? '' : 'share')} aria-expanded={menu === 'share'}>Compartilhar</button>
        <button onClick={full} aria-label="Tela cheia">⤢</button></div>
      <AnimatePresence>{menu && <motion.div className="pop" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
        {menu === 'idx' ? pages.map((pg, i) => <button key={i} aria-current={i === idx} onClick={() => { setIdx(i); setMenu('') }}><span>{i + 1}</span>{pg.t}</button>)
          : <><button onClick={copy}>Copiar link</button>{'share' in navigator && <button onClick={share}>Compartilhar…</button>}<a href="#/editar">Editar álbum</a><p>{msg || 'As alterações ficam salvas só neste dispositivo. Para outra pessoa ver a sua versão, publique o projeto (veja o README).'}</p></>}
      </motion.div>}</AnimatePresence>
    </header>
    <div className="book" onTouchStart={e => { t0.current = [e.touches[0].clientX, e.touches[0].clientY] }} onTouchEnd={e => { const dx = e.changedTouches[0].clientX - t0.current[0], dy = e.changedTouches[0].clientY - t0.current[1]; if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) go(dx < 0 ? 1 : -1) }}>
      {pages.map((pg, i) => <Sheet key={i} i={i} idx={idx} n={n} cover={pg.cover}>{pg.node}</Sheet>)}
      <div className="tap prev" onClick={() => go(-1)} /><div className="tap next" onClick={() => go(1)} />
    </div>
    <nav className="pager" aria-label="Páginas"><button onClick={() => go(-1)} disabled={idx === 0} aria-label="Página anterior">‹</button><span aria-live="polite">{idx + 1} / {n}</span><button onClick={() => go(1)} disabled={idx === n - 1} aria-label="Próxima página">›</button></nav>
    {createPortal(<AnimatePresence>{p && <motion.div className="lbx" role="dialog" aria-modal="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLb(null)}>
      <button className="x" aria-label="Fechar" onClick={() => setLb(null)}>×</button>
      <motion.figure initial={{ scale: .92 }} animate={{ scale: 1 }} onClick={e => e.stopPropagation()}><Pic p={p} /><figcaption>{p.caption}</figcaption></motion.figure>
      {album.photos.length > 1 && <><button className="ar l" aria-label="Foto anterior" onClick={e => { e.stopPropagation(); setLb((lb! - 1 + album.photos.length) % album.photos.length) }}>‹</button><button className="ar r" aria-label="Próxima foto" onClick={e => { e.stopPropagation(); setLb((lb! + 1) % album.photos.length) }}>›</button></>}
    </motion.div>}</AnimatePresence>, document.body)}
  </motion.div>
}
