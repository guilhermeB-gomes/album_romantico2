import { useCallback, useEffect, useRef, useState } from 'react'
import type { Album } from '../types'
import { defaultAlbum } from '../data/albumData'
import { load, save, clear } from '../services/storage'
export const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
export function useAlbum() {
  const [album, setAlbum] = useState<Album>(defaultAlbum)
  const [ready, setReady] = useState(false); const [status, setStatus] = useState('')
  const t = useRef<number>()
  useEffect(() => { load().then(a => { if (a) setAlbum({ ...defaultAlbum(), ...a }) }).catch(() => setStatus('Não foi possível ler os dados salvos.')).finally(() => setReady(true)) }, [])
  const update = useCallback((a: Album) => {
    setAlbum(a); setStatus('Salvando…'); clearTimeout(t.current)
    t.current = window.setTimeout(() => save(a).then(() => setStatus('Salvo neste dispositivo ✓')).catch(() => setStatus('Erro ao salvar: armazenamento cheio ou bloqueado.')), 500)
  }, [])
  const reset = useCallback(async () => { await clear().catch(() => {}); setAlbum(defaultAlbum()); setStatus('Conteúdo inicial restaurado.') }, [])
  return { album, ready, status, update, reset }
}
