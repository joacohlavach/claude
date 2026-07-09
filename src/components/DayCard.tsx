import { useState } from 'react'
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from 'lucide-react'
import { ExerciseRow } from './ExerciseRow'
import { useStore } from '../store/useStore'
import type { RoutineDay } from '../types'

export function DayCard({
  day,
  isFirst,
  isLast,
  onMove,
  onAddExercise,
}: {
  day: RoutineDay
  isFirst: boolean
  isLast: boolean
  onMove: (direction: 'up' | 'down') => void
  onAddExercise: () => void
}) {
  const exercises = useStore((s) => s.exercises)
  const renameDay = useStore((s) => s.renameDay)
  const deleteDay = useStore((s) => s.deleteDay)

  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState(day.titulo)

  const exerciseById = new Map(exercises.map((e) => [e.id, e]))
  const sortedEntries = [...day.ejercicios].sort((a, b) => a.orden - b.orden)

  const commitTitle = () => {
    renameDay(day.id, titleDraft.trim() || day.titulo)
    setEditingTitle(false)
  }

  return (
    <section className="glass rounded-3xl p-4">
      <header className="mb-3 flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ember">Día {day.orden}</span>
          {editingTitle ? (
            <input
              autoFocus
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => e.key === 'Enter' && commitTitle()}
              className="clay-pressed mt-1 w-full rounded-lg px-2 py-1 text-base font-bold text-ash-light outline-none"
            />
          ) : (
            <button
              className="flex w-full min-w-0 items-center gap-1.5 text-left"
              onClick={() => setEditingTitle(true)}
            >
              <h2 className="truncate text-base font-bold text-ash-light">{day.titulo}</h2>
              <Pencil size={12} className="shrink-0 text-ash/50" />
            </button>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            disabled={isFirst}
            onClick={() => onMove('up')}
            className="clay tap-scale flex h-7 w-7 items-center justify-center rounded-full text-ash disabled:opacity-30"
          >
            <ChevronUp size={14} />
          </button>
          <button
            disabled={isLast}
            onClick={() => onMove('down')}
            className="clay tap-scale flex h-7 w-7 items-center justify-center rounded-full text-ash disabled:opacity-30"
          >
            <ChevronDown size={14} />
          </button>
          <button
            onClick={() => confirm(`¿Eliminar "${day.titulo}"?`) && deleteDay(day.id)}
            className="clay tap-scale flex h-7 w-7 items-center justify-center rounded-full text-blaze"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-2">
        {sortedEntries.map((entry) => (
          <ExerciseRow key={entry.id} entry={entry} exercise={exerciseById.get(entry.exerciseId)} dayId={day.id} />
        ))}
        {sortedEntries.length === 0 && (
          <p className="py-3 text-center text-xs text-ash">Todavía no hay ejercicios en este día.</p>
        )}
      </div>

      <button
        onClick={onAddExercise}
        className="clay tap-scale mt-3 flex w-full items-center justify-center gap-1.5 rounded-2xl py-2.5 text-xs font-bold text-ember-light"
      >
        <Plus size={15} /> Agregar ejercicio
      </button>
    </section>
  )
}
