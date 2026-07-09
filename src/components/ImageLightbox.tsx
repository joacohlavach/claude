import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

export function ImageLightbox({
  src,
  alt,
  onClose,
}: {
  src: string | null
  alt: string
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {src && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.img
            src={src}
            alt={alt}
            className="max-h-full max-w-full rounded-xl object-contain"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          />
          <button
            onClick={onClose}
            className="panel tap-scale absolute flex h-10 w-10 items-center justify-center rounded-full text-ink-light"
            style={{ top: 'calc(env(safe-area-inset-top, 0px) + 16px)', right: 16 }}
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
