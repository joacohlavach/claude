import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Chip } from '../components/Chip'
import { CategoryDot } from '../components/CategoryDot'
import { ExerciseFormSheet } from '../components/ExerciseFormSheet'
import { useStore } from '../store/useStore'
import { categories } from '../data/categories'
import { hexToRgba } from '../lib/color'
import type { CardStyle, Exercise, TrenBloque } from '../types'

type TabId = TrenBloque | 'sin-clasificar'

export function ExerciseLibraryView() {
  const exercises = useStore((s) => s.exercises)
  const categoryColors = useStore((s) => s.categoryColors)
  const cardStyle = useStore((s) => s.cardStyle)
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
        <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-dim">Catálogo</p>
        <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-ink-light">Lista de ejercicios</h1>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        <Chip active={tab === 'superior'} onClick={() => setTab('superior')}>
          Tren Superior
        </Chip>
        <Chip active={tab === 'inferior'} onClick={() => setTab('inferior')}>
          Tren Inferior
        </Chip>
        <Chip active={tab === 'sin-clasificar'} onClick={() => setTab('sin-clasificar')} activeColor="#8a8d93">
          Sin clasificar {unclassifiedCount > 0 ? `(${unclassifiedCount})` : ''}
        </Chip>
      </div>

      <button
        onClick={() => setCreating(true)}
        className="accent-fill tap-scale flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold"
      >
        <Plus size={16} /> Nuevo ejercicio
      </button>

      {tab === 'sin-clasificar' ? (
        <ExerciseGroup title="Sin clasificar" items={visible} onEdit={setEditing} cardStyle={cardStyle} />
      ) : (
        <>
          {groups.byCategory.map(({ cat, items }) => (
            <ExerciseGroup
              key={cat.id}
              title={cat.label}
              color={categoryColors[cat.id]}
              items={items}
              onEdit={setEditing}
              cardStyle={cardStyle}
            />
          ))}
          {groups.uncategorized.length > 0 && (
            <ExerciseGroup title="Sin categoría" items={groups.uncategorized} onEdit={setEditing} cardStyle={cardStyle} />
          )}
        </>
      )}

      {visible.length === 0 && (
        <p className="py-8 text-center text-sm text-dim">No hay ejercicios acá todavía.</p>
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
  cardStyle,
}: {
  title: string
  color?: string
  items: Exercise[]
  onEdit: (e: Exercise) => void
  cardStyle: CardStyle
}) {
  if (items.length === 0) return null
  return (
    <section>
      <h3 className="mb-2 flex items-center gap-2 text-[13px] font-bold text-ink-light">
        <span className="h-2 w-2 rounded-full" style={{ background: color ?? '#52525b' }} />
        {title}
        <span className="font-mono text-[11px] font-normal text-dim">· {items.length}</span>
      </h3>
      <div className="flex flex-col gap-2">
        {items.map((e) => (
          <button
            key={e.id}
            onClick={() => onEdit(e)}
            className={`panel tap-scale relative flex items-center gap-3 rounded-xl px-4 py-3 text-left ${
              color && cardStyle === 'stripe' ? 'overflow-hidden' : ''
            }`}
            style={color && cardStyle === 'tint' ? { background: hexToRgba(color, 0.16) } : undefined}
          >
            {color && cardStyle === 'stripe' && (
              <span className="absolute inset-y-0 left-0 w-1.5" style={{ background: color }} />
            )}
            {e.imagen ? (
              <img src={e.imagen} alt="" className="h-9 w-9 shrink-0 rounded-lg object-cover" />
            ) : (
              <CategoryDot categoria={e.categoria} size={10} />
            )}
            <span className="flex-1 text-sm text-ink-light">{e.nombre}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
