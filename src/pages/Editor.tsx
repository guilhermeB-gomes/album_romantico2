import { useState } from 'react'
import type { Album, Layout, Photo } from '../types'
import { useAlbum } from '../hooks/useAlbum'
import { toDataUrl, fileToUrl } from '../services/storage'

const LAYOUTS: Layout[] = ['polaroid', 'frame', 'full', 'collage']
const CHAPS: [string, string][] = [['story', 'Nossa História'], ['months', '11 Meses de Nós'], ['gallery', 'Nossos Momentos'], ['details', 'Pequenos Detalhes'], ['letters', 'Cartas'], ['timeline', 'Linha do Tempo'], ['reasons', 'Motivos'], ['future', 'Nosso Futuro'], ['final', 'Última Página']]

function Field({ l, v, on, area, type = 'text' }: { l: string; v: string; on: (s: string) => void; area?: boolean; type?: string }) {
  return <label className="fld">{l}{area ? <textarea rows={3} value={v} onChange={e => on(e.target.value)} /> : <input type={type} value={v} onChange={e => on(e.target.value)} />}</label>
}
function ListEd<T extends Record<string, string>>({ items, on, fields, blank }: { items: T[]; on: (v: T[]) => void; fields: [keyof T & string, string, boolean?][]; blank: T }) {
  return <div>{items.map((it, i) => <div className="row" key={i}>
    {fields.map(([k, l, ml]) => <Field key={k} l={l} area={ml} v={it[k]} on={s => on(items.map((x, j) => j === i ? { ...x, [k]: s } : x))} />)}
    <button className="danger" onClick={() => on(items.filter((_, j) => j !== i))}>Remover</button></div>)}
    <button onClick={() => on([...items, { ...blank }])}>+ Adicionar</button></div>
}

export default function Editor() {
  const { album: a, ready, status, update, reset } = useAlbum(); const [msg, setMsg] = useState('')
  if (!ready) return <div className="load">♡</div>
  const set = <K extends keyof Album>(k: K, v: Album[K]) => update({ ...a, [k]: v })
  const addPhotos = async (files: FileList | null) => {
    if (!files) return; const add: Photo[] = []
    for (const f of Array.from(files)) { try { add.push({ id: crypto.randomUUID(), src: await toDataUrl(f), caption: '', date: '', layout: LAYOUTS[(a.photos.length + add.length) % 4] }) } catch { setMsg(`"${f.name}" não é uma imagem válida.`) } }
    set('photos', [...a.photos, ...add])
  }
  const edit = (i: number, p: Partial<Photo>) => set('photos', a.photos.map((x, j) => j === i ? { ...x, ...p } : x))
  const move = (i: number, d: number) => { const l = [...a.photos], j = i + d; if (j < 0 || j >= l.length) return;[l[i], l[j]] = [l[j], l[i]]; set('photos', l) }
  const swap = async (i: number, f?: File) => { if (!f) return; try { edit(i, { src: await toDataUrl(f) }) } catch { setMsg('Imagem inválida.') } }
  const music = async (f?: File) => { if (!f) return; if (f.size > 15e6) return setMsg('Áudio acima de 15 MB.'); try { set('music', await fileToUrl(f)) } catch { setMsg('Não foi possível ler o áudio.') } }
  return <main className="editor">
    <header><h1>Editar álbum</h1><p className="stat" role="status">{status || 'Alterações são salvas automaticamente neste dispositivo.'} {msg}</p>
      <div className="acts"><a className="cta sm" href="#/">Ver álbum</a><button className="danger" onClick={() => { if (confirm('Apagar tudo e restaurar o conteúdo inicial?')) reset() }}>Restaurar conteúdo inicial</button></div></header>
    <section><h2>Geral</h2>
      <Field l="Nome 1" v={a.nameA} on={v => set('nameA', v)} /><Field l="Nome 2" v={a.nameB} on={v => set('nameB', v)} />
      <Field l="Título do álbum" v={a.title} on={v => set('title', v)} /><Field l="Data de início do namoro" type="date" v={a.startDate} on={v => set('startDate', v)} />
      <Field l="Frase de abertura" v={a.introQuote} on={v => set('introQuote', v)} /><Field l="Subtítulo da abertura" v={a.introSub} on={v => set('introSub', v)} />
      <label className="fld">Cor principal<input type="color" value={a.accent} onChange={e => set('accent', e.target.value)} /></label></section>
    <section><h2>Capítulos visíveis</h2><div className="checks">{CHAPS.map(([k, l]) => <label key={k}><input type="checkbox" checked={!a.hidden.includes(k)} onChange={e => set('hidden', e.target.checked ? a.hidden.filter(x => x !== k) : [...a.hidden, k])} />{l}</label>)}</div></section>
    <section><h2>Textos</h2>
      <Field area l="História" v={a.storyText} on={v => set('storyText', v)} /><Field area l="Frase dos meses" v={a.monthsPhrase} on={v => set('monthsPhrase', v)} />
      <Field area l="Mensagem sobre o futuro" v={a.futureText} on={v => set('futureText', v)} /><Field area l="Sonhos (um por linha)" v={a.dreams.join('\n')} on={v => set('dreams', v.split('\n'))} />
      <Field area l="Texto final" v={a.finalText} on={v => set('finalText', v)} /><Field l="Última declaração" v={a.finalNote} on={v => set('finalNote', v)} /></section>
    <section><h2>Fotografias</h2><label className="cta sm up">+ Adicionar fotos<input hidden type="file" accept="image/*" multiple onChange={e => { addPhotos(e.target.files); e.target.value = '' }} /></label>
      {a.photos.map((p, i) => <div className="row photo-row" key={p.id}>
        {p.src ? <img src={p.src} alt="" /> : <div className="thumb">Exemplo</div>}
        <Field l="Legenda" v={p.caption} on={v => edit(i, { caption: v })} /><Field l="Data (opcional)" type="date" v={p.date} on={v => edit(i, { date: v })} />
        <label className="fld">Layout<select value={p.layout} onChange={e => edit(i, { layout: e.target.value as Layout })}>{LAYOUTS.map(l => <option key={l}>{l}</option>)}</select></label>
        <label className="fld">Trocar imagem<input type="file" accept="image/*" onChange={e => swap(i, e.target.files?.[0])} /></label>
        <div className="mv"><button onClick={() => move(i, -1)} aria-label="Subir">↑</button><button onClick={() => move(i, 1)} aria-label="Descer">↓</button><button className="danger" onClick={() => { if (confirm('Remover esta foto?')) set('photos', a.photos.filter((_, j) => j !== i)) }}>Remover</button></div></div>)}</section>
    <section><h2>Pequenos detalhes</h2><ListEd items={a.details} on={v => set('details', v)} fields={[['title', 'Título'], ['text', 'Declaração', true]]} blank={{ title: '', text: '' }} /></section>
    <section><h2>Cartas</h2><ListEd items={a.letters} on={v => set('letters', v)} fields={[['title', 'Título'], ['text', 'Texto', true]]} blank={{ title: '', text: '' }} /></section>
    <section><h2>Linha do tempo</h2><ListEd items={a.timeline} on={v => set('timeline', v)} fields={[['date', 'Data'], ['title', 'Título'], ['text', 'Descrição', true]]} blank={{ date: '', title: '', text: '' }} /></section>
    <section><h2>Motivos</h2><ListEd items={a.reasons} on={v => set('reasons', v)} fields={[['reason', 'Motivo'], ['extra', 'Frase complementar']]} blank={{ reason: '', extra: '' }} /></section>
    <section><h2>Música</h2><p className="hint">Use um arquivo seu ou livre de direitos. O álbum funciona sem música.</p><input type="file" accept="audio/*" onChange={e => music(e.target.files?.[0])} />{a.music && <button className="danger" onClick={() => set('music', '')}>Remover música</button>}</section>
  </main>
}
