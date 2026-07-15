import { useRef } from 'react'
import { Reorder, useDragControls } from 'framer-motion'
import { ExerciseRow } from './ExerciseRow'
import { ExerciseCheckDot } from './ExerciseCheckDot'
import { useStore } from '../store/useStore'
import { getTodayISO } from '../lib/week'
import type { DayExerciseEntry, Exercise } from '../types'

const LONG_PRESS_MS = 350

export function SortableExerciseRow({
  entry,
  exercise,
  dayId,
}: {
  entry: DayExerciseEntry
  exercise: Exercise | undefined
  dayId: string
}) {
  const controls = useDragControls()
  const toggleExerciseCompleted = useStore((s) => s.toggleExerciseCompleted)
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearPressTimer = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current)
      pressTimer.current = null
    }
  }

  const done = entry.completadoFecha === getTodayISO()

  return (
    <Reorder.Item
      value={entry}
      dragListener={false}
      dragControls={controls}
      onPointerDown={(e) => {
        pressTimer.current = setTimeout(() => controls.start(e), LONG_PRESS_MS)
      }}
      onPointerUp={clearPressTimer}
      onPointerLeave={clearPressTimer}
      whileDrag={{ scale: 1.03, zIndex: 20, boxShadow: '0 12px 28px rgba(0,0,0,0.5)' }}
      className="relative"
      style={{ touchAction: 'none' }}
    >
      <ExerciseCheckDot done={done} onToggle={() => toggleExerciseCompleted(dayId, entry.id)} />
      <ExerciseRow entry={entry} exercise={exercise} dayId={dayId} />
    </Reorder.Item>
  )
}
