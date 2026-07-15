import { useRef } from 'react'
import { Reorder, useDragControls, type PanInfo } from 'framer-motion'
import { ExerciseRow } from './ExerciseRow'
import { ExerciseCheckDot } from './ExerciseCheckDot'
import { useStore } from '../store/useStore'
import { getTodayISO } from '../lib/week'
import { markDragEnded } from '../lib/dragGuard'
import type { DayExerciseEntry, Exercise } from '../types'

const LONG_PRESS_MS = 350
const MOVE_CANCEL_PX = 10

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
  const startPoint = useRef<{ x: number; y: number } | null>(null)
  const armed = useRef(false)

  const clearPressTimer = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current)
      pressTimer.current = null
    }
    startPoint.current = null
    armed.current = false
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    startPoint.current = { x: e.clientX, y: e.clientY }
    armed.current = false
    pressTimer.current = setTimeout(() => {
      armed.current = true
      controls.start(e)
    }, LONG_PRESS_MS)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (armed.current || !startPoint.current) return
    const dx = e.clientX - startPoint.current.x
    const dy = e.clientY - startPoint.current.y
    // Moved before the long-press fired: the user is scrolling, not dragging.
    // Cancel the pending drag and let the page scroll normally.
    if (Math.hypot(dx, dy) > MOVE_CANCEL_PX) clearPressTimer()
  }

  const handleDragEnd = (_e: unknown, _info: PanInfo) => {
    markDragEnded()
  }

  const done = entry.completadoFecha === getTodayISO()

  return (
    <Reorder.Item
      value={entry}
      dragListener={false}
      dragControls={controls}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={clearPressTimer}
      onPointerLeave={clearPressTimer}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.03, zIndex: 20, boxShadow: '0 12px 28px rgba(0,0,0,0.5)' }}
      className="relative"
    >
      <ExerciseCheckDot done={done} onToggle={() => toggleExerciseCompleted(dayId, entry.id)} />
      <ExerciseRow entry={entry} exercise={exercise} dayId={dayId} />
    </Reorder.Item>
  )
}
