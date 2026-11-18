import { useEffect, useState, type CSSProperties } from 'react'
import { AnimatePresence } from 'motion/react'
import { useAlbum } from './hooks/useAlbum'
import Intro from './components/Intro'
import Book from './components/Book'
import Petals from './components/Petals'
import Editor from './pages/Editor'

function Home() {
  const { album, ready } = useAlbum(); const [open, setOpen] = useState(false)
  if (!ready) return <div className="load">♡</div>
  return <div className="app" style={{ '--accent': album.accent } as CSSProperties}>
    <Petals />
    <AnimatePresence>{!open && <Intro key="intro" album={album} onOpen={() => setOpen(true)} />}</AnimatePresence>
    {open && <Book album={album} onHome={() => setOpen(false)} />}
  </div>
}
export default function App() {
  const [h, setH] = useState(location.hash)
  useEffect(() => { const f = () => setH(location.hash); addEventListener('hashchange', f); return () => removeEventListener('hashchange', f) }, [])
  return h.startsWith('#/editar') ? <Editor /> : <Home />
}
