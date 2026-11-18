import type { Album } from '../types'
const open = () => new Promise<IDBDatabase>((res, rej) => {
  const r = indexedDB.open('album-infinito', 1)
  r.onupgradeneeded = () => r.result.createObjectStore('kv')
  r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error)
})
const tx = async <T,>(mode: IDBTransactionMode, f: (s: IDBObjectStore) => IDBRequest<T>) => {
  const db = await open()
  return new Promise<T>((res, rej) => { const q = f(db.transaction('kv', mode).objectStore('kv')); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error) })
}
export const load = () => tx<Album | undefined>('readonly', s => s.get('album'))
export const save = (a: Album) => tx('readwrite', s => s.put(a, 'album'))
export const clear = () => tx('readwrite', s => s.delete('album'))
export const toDataUrl = (f: File, max = 1200) => new Promise<string>(async (res, rej) => {
  if (!f.type.startsWith('image/')) return rej(new Error('invalid'))
  try {
    const b = await createImageBitmap(f), k = Math.min(1, max / Math.max(b.width, b.height))
    const c = document.createElement('canvas'); c.width = Math.round(b.width * k); c.height = Math.round(b.height * k)
    c.getContext('2d')!.drawImage(b, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', 0.82))
  } catch (e) { rej(e) }
})
export const fileToUrl = (f: File) => new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = () => rej(r.error); r.readAsDataURL(f) })
