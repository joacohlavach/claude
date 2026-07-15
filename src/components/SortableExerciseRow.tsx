import { Reorder, useDragControls } from 'framer-motion'
import { ExerciseRow } from './ExerciseRow'
import { ExerciseCheckDot } from './ExerciseCheckDot'
import { useStore } from '../store/useStore'
import { getTodayISO } from '../lib/week'
import { markDragEnded } from '../lib/dragGuard'
import type { DayExerciseEntry, Exercise } from '../types'

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

  const done = entry.completadoFecha === getTodayISO()

  return (
    <Reorder.Item
      value={entry}
      dragListener={false}
      dragControls={controls}
      onDragEnd={markDragEnded}
      whileDrag={{ scale: 1.03, zIndex: 20, boxShadow: '0 12px 28px rgba(0,0,0,0.5)' }}
      className="relative"
    >
      <ExerciseCheckDot done={done} onToggle={() => toggleExerciseCompleted(dayId, entry.id)} />
      <ExerciseRow
        entry={entry}
        exercise={exercise}
        dayId={dayId}
        onDragHandlePointerDown={(e) => controls.start(e)}
      />
    </Reorder.Item>
  )
}
