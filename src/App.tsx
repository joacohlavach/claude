import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Splash } from './components/Splash'
import { TopBar } from './components/TopBar'
import { FloatingNav } from './components/FloatingNav'
import { DataSheet } from './components/DataSheet'
import { RoutineView } from './views/RoutineView'
import { ExerciseLibraryView } from './views/ExerciseLibraryView'

export type View = 'rutina' | 'ejercicios'

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [view, setView] = useState<View>('rutina')
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 1300)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <AnimatePresence>{showSplash && <Splash key="splash" />}</AnimatePresence>

      <div className="mx-auto min-h-full max-w-md">
        <TopBar onOpenSettings={() => setSettingsOpen(true)} />

        <div className="px-4 pb-36 pt-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              {view === 'rutina' ? <RoutineView /> : <ExerciseLibraryView />}
            </motion.div>
          </AnimatePresence>
        </div>

        <FloatingNav active={view} onChange={setView} />
        <DataSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
    </>
  )
}

export default App
