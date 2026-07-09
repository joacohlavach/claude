import { useEffect, useRef, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { Sheet } from './Sheet'
import { Chip } from './Chip'
import { categories } from '../data/categories'
import { useStore } from '../store/useStore'
import { compressImage } from '../lib/image'
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
  const [imagen, setImagen] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setNombre(exercise?.nombre ?? '')
      setTren(exercise?.tren ?? defaultTren ?? null)
      setCategoria(exercise?.categoria ?? null)
      setImagen(exercise?.imagen ?? null)
      setImageError(null)
    }
  }, [open, exercise, defaultTren])

  const handleImagePick = async (file: File) => {
    setImageError(null)
    try {
      const dataUrl = await compressImage(file)
      setImagen(dataUrl)
    } catch {
      setImageError('No se pudo cargar la imagen. Probá con otra foto.')
    }
  }

  const handleSave = () => {
    if (!nombre.trim()) return
    if (exercise) {
      updateExercise(exercise.id, { nombre: nombre.trim(), tren, categoria, imagen })
      onSaved?.({ ...exercise, nombre: nombre.trim(), tren, categoria, imagen })
    } else {
      const created = addExercise(nombre.trim(), tren, categoria, imagen)
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
          <label className="mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wide text-dim">
            Imagen de referencia
          </label>
          {imagen ? (
            <div className="relative">
              <img src={imagen} alt="" className="h-36 w-full rounded-xl object-cover" />
              <button
                onClick={() => setImagen(null)}
                className="panel tap-scale absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-red"
                aria-label="Quitar imagen"
              >
                <X size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="panel-2 tap-scale flex h-24 w-full flex-col items-center justify-center gap-1.5 rounded-xl text-dim"
            >
              <ImagePlus size={20} />
              <span className="font-mono text-[11px]">Elegir foto</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleImagePick(e.target.files[0])}
          />
          {imageError && <p className="mt-1.5 text-xs text-red">{imageError}</p>}
          {imagen && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-1.5 font-mono text-[11px] text-orange-light"
            >
              Cambiar foto
            </button>
          )}
        </div>

        <div>
          <label className="mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wide text-dim">
            Nombre
          </label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Sentadilla búlgara"
            className="panel-2 w-full rounded-xl px-3.5 py-2.5 text-sm text-ink-light outline-none placeholder:text-dim"
          />
        </div>

        <div>
          <label className="mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wide text-dim">
            Tren
          </label>
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
          <label className="mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wide text-dim">
            Clasificación
          </label>
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
          className="accent-fill tap-scale mt-2 rounded-xl py-3 text-center text-sm font-bold disabled:opacity-40"
        >
          Guardar
        </button>

        {exercise && (
          <button onClick={handleDelete} className="tap-scale rounded-xl py-2 text-center text-xs font-bold text-red">
            Eliminar del catálogo
          </button>
        )}
      </div>
    </Sheet>
  )
}
