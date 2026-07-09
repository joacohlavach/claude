import { useState } from 'react'
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from 'lucide-react'
import { ExerciseRow } from './ExerciseRow'
import { useStore } from '../store/useStore'
import { categoryMap } from '../data/categories'
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
    <section className="panel rounded-2xl p-4">
      <header className="mb-4 flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-baseline gap-3">
          <span className="shrink-0 font-mono text-2xl font-bold text-orange">
            {String(day.orden).padStart(2, '0')}
          </span>
          {editingTitle ? (
            <input
              autoFocus
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => e.key === 'Enter' && commitTitle()}
              className="panel-2 w-full rounded-lg px-2 py-1 text-[15px] font-medium text-ink-light outline-none"
            />
          ) : (
            <button
              className="flex min-w-0 flex-1 items-center gap-1.5 text-left"
              onClick={() => setEditingTitle(true)}
            >
              <h2 className="truncate text-[15px] font-medium text-ink-light">{day.titulo}</h2>
              <Pencil size={12} className="shrink-0 text-dim" />
            </button>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            disabled={isFirst}
            onClick={() => onMove('up')}
            className="panel-2 tap-scale flex h-7 w-7 items-center justify-center rounded-full text-dim disabled:opacity-30"
          >
            <ChevronUp size={14} />
          </button>
          <button
            disabled={isLast}
            onClick={() => onMove('down')}
            className="panel-2 tap-scale flex h-7 w-7 items-center justify-center rounded-full text-dim disabled:opacity-30"
          >
            <ChevronDown size={14} />
          </button>
          <button
            onClick={() => confirm(`¿Eliminar "${day.titulo}"?`) && deleteDay(day.id)}
            className="panel-2 tap-scale flex h-7 w-7 items-center justify-center rounded-full text-red"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </header>

      <div className="rail flex flex-col gap-2">
        {sortedEntries.map((entry) => {
          const exercise = exerciseById.get(entry.exerciseId)
          const dotColor = exercise?.categoria ? categoryMap[exercise.categoria].color : '#4a4a4f'
          return (
            <div key={entry.id} className="relative">
              <span className="rail-dot" style={{ top: 22, color: dotColor }} />
              <ExerciseRow entry={entry} exercise={exercise} dayId={day.id} />
            </div>
          )
        })}
        {sortedEntries.length === 0 && (
          <p className="py-3 text-center text-xs text-dim">Todavía no hay ejercicios en este día.</p>
        )}
      </div>

      <button
        onClick={onAddExercise}
        className="panel-2 tap-scale mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold text-orange-light"
      >
        <Plus size={15} /> Agregar ejercicio
      </button>
    </section>
  )
}
