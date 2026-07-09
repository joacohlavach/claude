import { useEffect, useState } from 'react'
import { Sheet } from './Sheet'
import { Chip } from './Chip'
import { categories } from '../data/categories'
import { useStore } from '../store/useStore'
import type { CategoryId, Exercise, TrenBloque } from '../types'

interface ExerciseFormSheetProps {
  open: boolean
  onClose: () => void
  exercise?: Exercise | null
  defaultTren?: TrenBloque | null
  onSaved?: (exercise: Exercise) => void
}

export function ExerciseFormSheet({ open, onClose, exercise, defaultTren, onSaved }: ExerciseFormSheetProps) {
  const addExercise = useStore((s) => s.addExercise)
  const updateExercise = useStore((s) => s.updateExercise)
  const deleteExercise = useStore((s) => s.deleteExercise)

  const [nombre, setNombre] = useState('')
  const [tren, setTren] = useState<TrenBloque | null>(null)
  const [categoria, setCategoria] = useState<CategoryId | null>(null)

  useEffect(() => {
    if (open) {
      setNombre(exercise?.nombre ?? '')
      setTren(exercise?.tren ?? defaultTren ?? null)
      setCategoria(exercise?.categoria ?? null)
    }
  }, [open, exercise, defaultTren])

  const handleSave = () => {
    if (!nombre.trim()) return
    if (exercise) {
      updateExercise(exercise.id, { nombre: nombre.trim(), tren, categoria })
      onSaved?.({ ...exercise, nombre: nombre.trim(), tren, categoria })
    } else {
      const created = addExercise(nombre.trim(), tren, categoria)
      onSaved?.(created)
    }
    onClose()
  }

  const handleDelete = () => {
    if (!exercise) return
    if (confirm(`¿Eliminar "${exercise.nombre}" del catálogo? También se quita de los días donde esté.`)) {
      deleteExercise(exercise.id)
      onClose()
    }
  }

  return (
    <Sheet open={open} title={exercise ? 'Editar ejercicio' : 'Nuevo ejercicio'} onClose={onClose}>
      <div className="flex flex-col gap-4 pb-2">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ash">Nombre</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Sentadilla búlgara"
            className="clay w-full rounded-xl px-3.5 py-2.5 text-sm text-ash-light outline-none placeholder:text-ash/50"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ash">Tren</label>
          <div className="flex gap-2">
            <Chip active={tren === 'superior'} onClick={() => setTren('superior')}>
              Superior
            </Chip>
            <Chip active={tren === 'inferior'} onClick={() => setTren('inferior')}>
              Inferior
            </Chip>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ash">Clasificación</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Chip key={c.id} active={categoria === c.id} onClick={() => setCategoria(c.id)} activeColor={c.color}>
                {c.label}
              </Chip>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!nombre.trim()}
          className="clay-ember tap-scale mt-2 rounded-2xl py-3 text-center text-sm font-extrabold text-white disabled:opacity-40"
        >
          Guardar
        </button>

        {exercise && (
          <button onClick={handleDelete} className="tap-scale rounded-2xl py-2 text-center text-xs font-bold text-blaze">
            Eliminar del catálogo
          </button>
        )}
      </div>
    </Sheet>
  )
}
