import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import type { Album, Letter, Photo } from '../types'
import { Lily } from './Lily'

export const elapsed = (iso: string) => {
  const s = new Date(iso + 'T00:00:00'), n = new Date()
  if (isNaN(+s) || s > n) return { y: 0, m: 0, d: 0, total: 0 }
  let y = n.getFullYear() - s.getFullYear(), m = n.getMonth() - s.getMonth(), d = n.getDate() - s.getDate()
  if (d < 0) { m--; d += new Date(n.getFullYear(), n.getMonth(), 0).getDate() }
  if (m < 0) { y--; m += 12 }
  return { y, m, d, total: Math.floor((+n - +s) / 864e5) }
}
const fmt = (iso: string) => { const d = new Date(iso + 'T00:00:00'); return isNaN(+d) ? iso : d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }) }

function Pic({ p, onClick }: { p: Photo; onClick?: () => void }) {
  return <button type="button" className="pic" onClick={onClick} aria-label={'Ampliar: ' + (p.caption || 'foto')}>
    {p.src ? <img src={p.src} alt={p.caption || 'Foto do casal'} loading="lazy" draggable={false} /> : <div className="ph"><Lily size={44} /><span>Foto de exemplo<br />Adicione a sua em /#/editar</span></div>}
  </button>
}
const Head = ({ n, t }: { n: string; t: string }) => <header className="head"><span className="lab">Capítulo {n}</span><h2>{t}</h2><i className="rule" /></header>

function Flip({ front, back, small }: { front: string; back: string; small?: boolean }) {
  const [f, setF] = useState(false)
  return <button className={'flip' + (small ? ' sm' : '')} aria-pressed={f} onClick={() => setF(!f)}>
    <motion.span className="fi" animate={{ rotateY: f ? 180 : 0 }} transition={{ duration: .75, ease: [.3, .8, .3, 1] }}>
      <span className="ff"><i>♡</i>{front}</span><span className="fb">{back}</span>
    </motion.span></button>
}

function LetterModal({ l, onClose }: { l: Letter; onClose: () => void }) {
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); addEventListener('keydown', k); return () => removeEventListener('keydown', k) }, [onClose])
  return createPortal(
    <motion.div className="lm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <div className="lm-in" role="dialog" aria-modal="true" aria-label={l.title} onClick={e => e.stopPropagation()}>
        <motion.div className="env" initial={{ y: 60, opacity: 0, scale: .9 }} animate={{ y: 0, opacity: [0, 1, 1, 0], scale: 1 }} transition={{ duration: 2, times: [0, .2, .8, 1] }}>
          <motion.div className="env-flap" initial={{ rotateX: 0 }} animate={{ rotateX: 180 }} transition={{ delay: .7, duration: .9, ease: 'easeInOut' }} />
        </motion.div>
        <motion.article className="paper" initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 1, ease: [.2, .8, .3, 1] }}>
          <h3>{l.title}</h3>
          <p>{l.text.split(/\s+/).map((w, i) => <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3 + i * .045 }}>{w} </motion.span>)}</p>
          <button className="ghost" onClick={onClose}>Fechar carta</button>
        </motion.article>
      </div>
    </motion.div>, document.body)
}

function Letters({ items }: { items: Letter[] }) {
  const [o, setO] = useState<number | null>(null)
  return <>
    <div className="envs">{items.map((l, i) => <button key={i} className="envbtn" onClick={() => setO(i)}><span className="mini"><span /></span><small>Carta {String(i + 1).padStart(2, '0')}</small><b>{l.title}</b></button>)}</div>
    <AnimatePresence>{o !== null && <LetterModal key={o} l={items[o]} onClose={() => setO(null)} />}</AnimatePresence>
  </>
}

export type PageDef = { t: string; node: ReactNode; cover?: boolean }
export function buildPages(a: Album, go: (i: number) => void, lb: (i: number) => void): PageDef[] {
  const t = elapsed(a.startDate), months = t.y * 12 + t.m, show = (k: string) => !a.hidden.includes(k), out: PageDef[] = []
  out.push({ t: 'Capa', cover: true, node: <div className="pg cv"><Lily size={96} /><span className="script big">{a.nameA} &amp; {a.nameB}</span><h1>{a.title}</h1><i className="rule" /><small>Toque para abrir</small></div> })
  if (show('story')) out.push({ t: 'Nossa História', node: <div className="pg"><Head n="01" t="Nossa História" /><p className="lead">{a.storyText}</p>{a.photos[0] && <div className="photo l-polaroid"><Pic p={a.photos[0]} onClick={() => lb(0)} /></div>}<p className="date">Tudo começou em <b>{fmt(a.startDate)}</b></p></div> })
  if (show('months')) out.push({ t: 'Meses de Nós', node: <div className="pg"><Head n="02" t={`${months} ${months === 1 ? 'mês' : 'meses'} de amor.`} /><p className="lead">{a.monthsPhrase}</p>
    <div className="count">{([['anos', t.y], ['meses', t.m], ['dias', t.d]] as const).map(([l, v]) => <div key={l}><b>{v}</b><span>{l}</span></div>)}</div>
    <p className="date">{t.total} dias juntos até hoje</p><div className="trio">{a.photos.slice(0, 3).map((p, i) => <Pic key={p.id} p={p} onClick={() => lb(i)} />)}</div></div> })
  if (show('gallery')) {
    a.photos.forEach((p, i) => out.push({ t: 'Nossos Momentos', node: <div className={`pg photo l-${p.layout}`}>{i === 0 && <span className="lab">Capítulo 03 · Nossos Momentos</span>}<Pic p={p} onClick={() => lb(i)} /><p className="cap">{p.caption}</p>{p.date && <small className="date">{fmt(p.date)}</small>}</div> }))
    if (a.photos.length) out.push({ t: 'Grade de fotos', node: <div className="pg"><span className="lab">Nossos Momentos</span><div className="mosaic">{a.photos.map((p, i) => <Pic key={p.id} p={p} onClick={() => lb(i)} />)}</div></div> })
  }
  if (show('details')) out.push({ t: 'Pequenos Detalhes', node: <div className="pg"><Head n="04" t="Pequenos Detalhes" /><p className="hint">Toque nos cartões</p><div className="flips">{a.details.map((d, i) => <Flip key={i} front={d.title} back={d.text} />)}</div></div> })
  if (show('letters')) out.push({ t: 'Cartas', node: <div className="pg"><Head n="05" t="Cartas para Você" /><Letters items={a.letters} /></div> })
  if (show('timeline')) out.push({ t: 'Linha do Tempo', node: <div className="pg"><Head n="06" t="Nossa Linha do Tempo" /><ol className="tl">{a.timeline.map((e, i) => <motion.li key={i} initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .7 }}><time>{e.date}</time><b>{e.title}</b><p>{e.text}</p></motion.li>)}</ol></div> })
  if (show('reasons')) out.push({ t: 'Motivos', node: <div className="pg"><Head n="07" t="Motivos pelos Quais Eu Te Amo" /><p className="hint">Toque para revelar</p><div className="flips two">{a.reasons.map((r, i) => <Flip small key={i} front={`Motivo ${i + 1}`} back={`${r.reason} — ${r.extra}`} />)}</div></div> })
  if (show('future')) out.push({ t: 'Nosso Futuro', node: <div className="pg stars"><Head n="08" t="Nosso Futuro" />{Array.from({ length: 18 }, (_, i) => <i key={i} className="star" style={{ left: (i * 37) % 96 + '%', top: (i * 53) % 90 + '%', animationDelay: (i % 6) * .5 + 's' }} />)}<p className="lead">{a.futureText}</p><ul className="dreams">{a.dreams.map((d, i) => <li key={i}>{d}</li>)}</ul></div> })
  if (show('final')) out.push({ t: 'A Última Página', node: <div className="pg end"><Head n="09" t="A Última Página" /><p className="lead">{a.finalText}</p><div className="lilies"><Lily size={54} /><span className="script big">{a.nameA} &amp; {a.nameB} ♡</span><Lily size={54} /></div><p className="note">{a.finalNote}</p><div className="hearts" aria-hidden="true">♡ ♡ ♡</div><button className="cta sm" onClick={() => go(0)}>Voltar ao início</button></div> })
  return out
}
export { Pic }
