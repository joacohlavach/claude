import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, GripVertical, Trash2 } from 'lucide-react'
import { CategoryDot } from './CategoryDot'
import { NumberField } from './NumberField'
import { useStore } from '../store/useStore'
import type { DayExerciseEntry, Exercise } from '../types'

export function ExerciseRow({
  entry,
  exercise,
  dayId,
}: {
  entry: DayExerciseEntry
  exercise: Exercise | undefined
  dayId: string
}) {
  const [expanded, setExpanded] = useState(false)
  const updateDayExercise = useStore((s) => s.updateDayExercise)
  const removeDayExercise = useStore((s) => s.removeDayExercise)

  const summary = [
    entry.series ? `${entry.series}x${entry.reps ?? '-'}` : null,
    entry.peso ? `${entry.peso}kg` : null,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="clay rounded-2xl px-3.5 py-3">
      <button className="flex w-full items-center gap-3 text-left" onClick={() => setExpanded((v) => !v)}>
        <GripVertical size={14} className="shrink-0 text-ash/40" />
        <CategoryDot categoria={exercise?.categoria ?? null} size={10} />
        <span className="flex-1 min-w-0">
          <span className="block truncate text-sm font-semibold text-ash-light">
            {exercise?.nombre ?? 'Ejercicio eliminado'}
          </span>
          {summary && <span className="block text-[11px] text-ash">{summary}</span>}
        </span>
        <motion.span animate={{ rotate: expanded ? 180 : 0 }} className="text-ash">
          <ChevronDown size={16} />
        </motion.span>
      </button>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="overflow-hidden"
        >
          <div className="mt-3 grid grid-cols-[1fr_1fr_1.3fr] gap-2">
            <NumberField
              label="Series"
              value={entry.series}
              onChange={(v) => updateDayExercise(dayId, entry.id, { series: v })}
            />
            <NumberField
              label="Reps"
              value={entry.reps}
              onChange={(v) => updateDayExercise(dayId, entry.id, { reps: v })}
            />
            <NumberField
              label="Peso"
              value={entry.peso}
              step={2.5}
              suffix="kg"
              onChange={(v) => updateDayExercise(dayId, entry.id, { peso: v })}
            />
          </div>
          <textarea
            value={entry.notas}
            onChange={(e) => updateDayExercise(dayId, entry.id, { notas: e.target.value })}
            placeholder="Notas (técnica, sensación, progreso...)"
            rows={2}
            className="clay-pressed mt-2 w-full resize-none rounded-xl px-3 py-2 text-xs text-ash-light outline-none placeholder:text-ash/50"
          />
          <button
            onClick={() => removeDayExercise(dayId, entry.id)}
            className="tap-scale mt-2 flex items-center gap-1.5 text-xs font-bold text-blaze"
          >
            <Trash2 size={13} /> Quitar de este día
          </button>
        </motion.div>
      )}
    </div>
  )
}
