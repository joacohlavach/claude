import { motion } from 'framer-motion'
import { Logo } from './Logo'

export function Splash() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-ink"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.45, delay: 0.1 } }}
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 14, stiffness: 180 }}
      >
        <Logo size={96} />
      </motion.div>
      <motion.h1
        className="text-2xl font-extrabold tracking-tight text-ash-light"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
      >
        Gym<span className="text-ember">App</span>
      </motion.h1>
      <motion.div
        className="h-1 w-24 overflow-hidden rounded-full bg-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        <motion.div
          className="h-full w-full bg-gradient-to-r from-ember-light to-blaze"
          initial={{ x: '-100%' }}
          animate={{ x: '0%' }}
          transition={{ delay: 0.4, duration: 0.7, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  )
}
