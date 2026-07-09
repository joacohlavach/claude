import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Sheet } from './Sheet'
import { CategoryDot } from './CategoryDot'
import { ExerciseFormSheet } from './ExerciseFormSheet'
import { useStore } from '../store/useStore'
import { trenLabels } from '../data/categories'
import type { Exercise } from '../types'

export function ExercisePickerSheet({
  open,
  onClose,
  dayId,
}: {
  open: boolean
  onClose: () => void
  dayId: string | null
}) {
  const exercises = useStore((s) => s.exercises)
  const addExerciseToDay = useStore((s) => s.addExerciseToDay)
  const [query, setQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)

  const filtered = useMemo(
    () => exercises.filter((e) => e.nombre.toLowerCase().includes(query.trim().toLowerCase())),
    [exercises, query],
  )

  const handlePick = (exercise: Exercise) => {
    if (!dayId) return
    addExerciseToDay(dayId, exercise.id)
    onClose()
  }

  const handleCreated = (exercise: Exercise) => {
    if (!dayId) return
    addExerciseToDay(dayId, exercise.id)
    setFormOpen(false)
    onClose()
  }

  return (
    <>
      <Sheet open={open && !formOpen} title="Agregar ejercicio" onClose={onClose}>
        <div className="flex flex-col gap-3 pb-2">
          <div className="clay flex items-center gap-2 rounded-xl px-3.5 py-2.5">
            <Search size={16} className="text-ash" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar en tu catálogo..."
              className="w-full bg-transparent text-sm text-ash-light outline-none placeholder:text-ash/50"
            />
          </div>

          <button
            onClick={() => setFormOpen(true)}
            className="clay tap-scale flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-bold text-ember-light"
          >
            <Plus size={16} /> Crear ejercicio nuevo
          </button>

          <div className="flex flex-col gap-1.5">
            {filtered.map((e) => (
              <button
                key={e.id}
                onClick={() => handlePick(e)}
                className="clay tap-scale flex items-center gap-3 rounded-xl px-3.5 py-3 text-left"
              >
                <CategoryDot categoria={e.categoria} size={9} />
                <span className="flex-1 text-sm text-ash-light">{e.nombre}</span>
                {e.tren && <span className="text-[10px] font-bold text-ash">{trenLabels[e.tren]}</span>}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="py-6 text-center text-sm text-ash">No hay ejercicios que coincidan.</p>
            )}
          </div>
        </div>
      </Sheet>

      <ExerciseFormSheet open={formOpen} onClose={() => setFormOpen(false)} onSaved={handleCreated} />
    </>
  )
}
