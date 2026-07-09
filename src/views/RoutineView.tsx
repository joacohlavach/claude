import { useState } from 'react'
import { Plus } from 'lucide-react'
import { DayCard } from '../components/DayCard'
import { ExercisePickerSheet } from '../components/ExercisePickerSheet'
import { useStore } from '../store/useStore'

export function RoutineView() {
  const days = useStore((s) => s.days)
  const routineName = useStore((s) => s.routineName)
  const setRoutineName = useStore((s) => s.setRoutineName)
  const addDay = useStore((s) => s.addDay)
  const reorderDays = useStore((s) => s.reorderDays)

  const [pickerDayId, setPickerDayId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState(routineName)

  const sortedDays = [...days].sort((a, b) => a.orden - b.orden)

  const move = (dayId: string, direction: 'up' | 'down') => {
    const ids = sortedDays.map((d) => d.id)
    const idx = ids.indexOf(dayId)
    const swapWith = direction === 'up' ? idx - 1 : idx + 1
    if (swapWith < 0 || swapWith >= ids.length) return
    ;[ids[idx], ids[swapWith]] = [ids[swapWith], ids[idx]]
    reorderDays(ids)
  }

  const commitName = () => {
    setRoutineName(nameDraft.trim() || routineName)
    setEditingName(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-ash">Tu rutina</p>
        {editingName ? (
          <input
            autoFocus
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => e.key === 'Enter' && commitName()}
            className="clay-pressed mt-1 w-full rounded-lg px-2 py-1 text-2xl font-extrabold text-ash-light outline-none"
          />
        ) : (
          <h1
            className="mt-0.5 text-2xl font-extrabold tracking-tight text-ash-light"
            onClick={() => setEditingName(true)}
          >
            {routineName}
          </h1>
        )}
      </div>

      {sortedDays.map((day) => (
        <DayCard
          key={day.id}
          day={day}
          isFirst={day.orden === sortedDays[0]?.orden}
          isLast={day.orden === sortedDays[sortedDays.length - 1]?.orden}
          onMove={(dir) => move(day.id, dir)}
          onAddExercise={() => setPickerDayId(day.id)}
        />
      ))}

      <button
        onClick={() => addDay(`Día ${sortedDays.length + 1}`)}
        className="clay tap-scale flex items-center justify-center gap-2 rounded-3xl py-4 text-sm font-extrabold text-ember-light"
      >
        <Plus size={17} /> Agregar día
      </button>

      <ExercisePickerSheet open={pickerDayId !== null} onClose={() => setPickerDayId(null)} dayId={pickerDayId} />
    </div>
  )
}
