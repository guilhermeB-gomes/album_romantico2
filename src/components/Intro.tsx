import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import type { Album } from '../types'
import { Lily } from './Lily'
export default function Intro({ album, onOpen }: { album: Album; onOpen: () => void }) {
  const mx = useMotionValue(0), my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 50, damping: 18 }), sy = useSpring(my, { stiffness: 50, damping: 18 })
  const ax = useTransform(sx, v => v * -34), ay = useTransform(sy, v => v * -24), bx = useTransform(sx, v => v * 22), by = useTransform(sy, v => v * 16)
  return (
    <motion.section className="intro" onPointerMove={e => { mx.set(e.clientX / innerWidth - .5); my.set(e.clientY / innerHeight - .5) }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }} transition={{ duration: 1.2 }}>
      <motion.div className="lily la" style={{ x: ax, y: ay }}><motion.div initial={{ opacity: 0, scale: .7, rotate: -20 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: .5, duration: 1.6, ease: 'easeOut' }}><Lily size={220} /></motion.div></motion.div>
      <motion.div className="lily lb" style={{ x: bx, y: by }}><motion.div initial={{ opacity: 0, scale: .7, rotate: 20 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: .9, duration: 1.6, ease: 'easeOut' }}><Lily size={170} /></motion.div></motion.div>
      <div className="intro-c">
        <motion.p className="quote" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 1.2 }}>{album.introQuote}</motion.p>
        <h1 className="script" aria-label={album.nameB}>{[...album.nameB].map((ch, i) => <motion.span key={i} initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ delay: 2 + i * .12, duration: .9 }}>{ch}</motion.span>)}</h1>
        <motion.p className="sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3, duration: 1.2 }}>{album.introSub}</motion.p>
        <motion.button className="cta" onClick={onOpen} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.6, duration: 1 }} whileHover={{ scale: 1.04 }} whileTap={{ scale: .96 }}>Abrir nosso álbum ♡</motion.button>
      </div>
    </motion.section>
  )
}
