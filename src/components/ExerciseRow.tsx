import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ImageIcon, Trash2 } from 'lucide-react'
import { NumberField } from './NumberField'
import { ImageLightbox } from './ImageLightbox'
import { useStore } from '../store/useStore'
import { hexToRgba } from '../lib/color'
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
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const updateDayExercise = useStore((s) => s.updateDayExercise)
  const removeDayExercise = useStore((s) => s.removeDayExercise)
  const categoryColors = useStore((s) => s.categoryColors)
  const cardStyle = useStore((s) => s.cardStyle)

  const color = exercise?.categoria ? categoryColors[exercise.categoria] : null

  const summary = [
    entry.series ? `${entry.series}x${entry.reps ?? '-'}` : null,
    entry.peso ? `${entry.peso}kg` : null,
  ]
    .filter(Boolean)
    .join(' · ')

  const toggle = () => setExpanded((v) => !v)

  const cardStyleProps =
    color && cardStyle === 'tint' ? { background: hexToRgba(color, 0.16) } : undefined

  return (
    <div
      className={`panel-2 relative rounded-xl px-3.5 py-3 ${color && cardStyle === 'stripe' ? 'overflow-hidden' : ''}`}
      style={cardStyleProps}
    >
      {color && cardStyle === 'stripe' && (
        <span className="absolute inset-y-0 left-0 w-1.5" style={{ background: color }} />
      )}
      <div
        role="button"
        tabIndex={0}
        className="flex w-full items-center gap-3 text-left"
        onClick={toggle}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggle()}
      >
        {exercise?.imagen ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setLightboxOpen(true)
            }}
            className="tap-scale shrink-0"
          >
            <img src={exercise.imagen} alt="" className="h-9 w-9 rounded-lg object-cover" />
          </button>
        ) : null}
        <span className="min-w-0 flex-1">
          <span className={`block text-sm font-medium text-ink-light ${expanded ? '' : 'truncate'}`}>
            {exercise?.nombre ?? 'Ejercicio eliminado'}
          </span>
          {summary && <span className="block font-mono text-[11px] text-dim">{summary}</span>}
        </span>
        <motion.span animate={{ rotate: expanded ? 180 : 0 }} className="shrink-0 text-dim">
          <ChevronDown size={16} />
        </motion.span>
      </div>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="overflow-hidden"
        >
          {exercise?.imagen && (
            <button onClick={() => setLightboxOpen(true)} className="tap-scale mt-3 block w-full overflow-hidden rounded-xl">
              <img src={exercise.imagen} alt={exercise.nombre} className="max-h-44 w-full object-cover" />
            </button>
          )}
          {!exercise?.imagen && (
            <p className="mt-3 flex items-center gap-1.5 font-mono text-[11px] text-dim">
              <ImageIcon size={12} /> sin imagen de referencia — se puede agregar desde el catálogo
            </p>
          )}
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
            className="panel mt-2 w-full resize-none rounded-xl px-3 py-2 text-xs text-ink-light outline-none placeholder:text-dim"
          />
          <button
            onClick={() => removeDayExercise(dayId, entry.id)}
            className="tap-scale mt-2 flex items-center gap-1.5 text-xs font-bold text-red"
          >
            <Trash2 size={13} /> Quitar de este día
          </button>
        </motion.div>
      )}

      <ImageLightbox
        src={lightboxOpen ? exercise?.imagen ?? null : null}
        alt={exercise?.nombre ?? ''}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  )
}
