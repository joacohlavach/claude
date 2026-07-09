import { type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

interface SheetProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export function Sheet({ open, title, onClose, children }: SheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="panel fixed inset-x-0 bottom-0 z-50 max-h-[85vh] rounded-t-2xl px-5 pb-8 pt-4"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 28px)' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 300 }}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line" />
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink-light">{title}</h2>
              <button
                onClick={onClose}
                className="panel-2 tap-scale flex h-9 w-9 items-center justify-center rounded-full text-ink-light"
              >
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[65vh] overflow-y-auto no-scrollbar">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
