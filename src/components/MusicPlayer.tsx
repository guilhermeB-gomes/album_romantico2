import { useRef, useState } from 'react'
export default function MusicPlayer({ src }: { src: string }) {
  const a = useRef<HTMLAudioElement>(null); const [on, setOn] = useState(false); const [v, setV] = useState(.6); const [mute, setMute] = useState(false)
  if (!src) return null
  const toggle = async () => { const el = a.current!; if (on) { el.pause(); setOn(false) } else { try { el.volume = v; await el.play(); setOn(true) } catch { alert('Não foi possível tocar este áudio.') } } }
  return <div className="music">
    <audio ref={a} src={src} loop muted={mute} />
    <button onClick={toggle} aria-pressed={on} aria-label={on ? 'Pausar música' : 'Tocar música'}>{on ? '❚❚' : '▶'}</button>
    <span className={'eq' + (on ? ' on' : '')} aria-hidden="true"><i /><i /><i /></span>
    <input type="range" min="0" max="1" step=".05" value={v} aria-label="Volume" onChange={e => { const n = +e.target.value; setV(n); if (a.current) a.current.volume = n }} />
    <button onClick={() => setMute(!mute)} aria-pressed={mute} aria-label={mute ? 'Reativar som' : 'Silenciar'}>{mute ? '🔇' : '🔈'}</button>
  </div>
}
