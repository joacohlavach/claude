import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Chip } from '../components/Chip'
import { CategoryDot } from '../components/CategoryDot'
import { ExerciseFormSheet } from '../components/ExerciseFormSheet'
import { useStore } from '../store/useStore'
import { categories } from '../data/categories'
import type { Exercise, TrenBloque } from '../types'

type TabId = TrenBloque | 'sin-clasificar'

export function ExerciseLibraryView() {
  const exercises = useStore((s) => s.exercises)
  const [tab, setTab] = useState<TabId>('superior')
  const [editing, setEditing] = useState<Exercise | null>(null)
  const [creating, setCreating] = useState(false)

  const unclassifiedCount = useMemo(() => exercises.filter((e) => !e.tren).length, [exercises])

  const visible = useMemo(() => {
    if (tab === 'sin-clasificar') return exercises.filter((e) => !e.tren)
    return exercises.filter((e) => e.tren === tab)
  }, [exercises, tab])

  const groups = useMemo(() => {
    const byCategory = categories.map((cat) => ({
      cat,
      items: visible.filter((e) => e.categoria === cat.id),
    }))
    const uncategorized = visible.filter((e) => !e.categoria)
    return { byCategory, uncategorized }
  }, [visible])

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-ash">Catálogo</p>
        <h1 className="mt-0.5 text-2xl font-extrabold tracking-tight text-ash-light">Lista de ejercicios</h1>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        <Chip active={tab === 'superior'} onClick={() => setTab('superior')}>
          Tren Superior
        </Chip>
        <Chip active={tab === 'inferior'} onClick={() => setTab('inferior')}>
          Tren Inferior
        </Chip>
        <Chip active={tab === 'sin-clasificar'} onClick={() => setTab('sin-clasificar')} activeColor="#a1a1aa">
          Sin clasificar {unclassifiedCount > 0 ? `(${unclassifiedCount})` : ''}
        </Chip>
      </div>

      <button
        onClick={() => setCreating(true)}
        className="clay-ember tap-scale flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-extrabold text-white"
      >
        <Plus size={16} /> Nuevo ejercicio
      </button>

      {tab === 'sin-clasificar' ? (
        <ExerciseGroup title="Sin clasificar" items={visible} onEdit={setEditing} />
      ) : (
        <>
          {groups.byCategory.map(({ cat, items }) => (
            <ExerciseGroup key={cat.id} title={cat.label} color={cat.color} items={items} onEdit={setEditing} />
          ))}
          {groups.uncategorized.length > 0 && (
            <ExerciseGroup title="Sin categoría" items={groups.uncategorized} onEdit={setEditing} />
          )}
        </>
      )}

      {visible.length === 0 && (
        <p className="py-8 text-center text-sm text-ash">No hay ejercicios acá todavía.</p>
      )}

      <ExerciseFormSheet open={editing !== null} onClose={() => setEditing(null)} exercise={editing} />
      <ExerciseFormSheet
        open={creating}
        onClose={() => setCreating(false)}
        defaultTren={tab === 'sin-clasificar' ? null : tab}
      />
    </div>
  )
}

function ExerciseGroup({
  title,
  color,
  items,
  onEdit,
}: {
  title: string
  color?: string
  items: Exercise[]
  onEdit: (e: Exercise) => void
}) {
  if (items.length === 0) return null
  return (
    <section>
      <h3 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ash">
        <span className="h-2 w-2 rounded-full" style={{ background: color ?? '#52525b' }} />
        {title}
        <span className="text-ash/50">· {items.length}</span>
      </h3>
      <div className="flex flex-col gap-2">
        {items.map((e) => (
          <button
            key={e.id}
            onClick={() => onEdit(e)}
            className="glass tap-scale flex items-center gap-3 rounded-2xl px-4 py-3 text-left"
          >
            <CategoryDot categoria={e.categoria} size={10} />
            <span className="flex-1 text-sm text-ash-light">{e.nombre}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
