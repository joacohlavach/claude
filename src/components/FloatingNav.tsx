import { ClipboardList, Dumbbell } from 'lucide-react'
import type { View } from '../App'

const tabs: { id: View; label: string; icon: typeof ClipboardList }[] = [
  { id: 'rutina', label: 'Rutina', icon: ClipboardList },
  { id: 'ejercicios', label: 'Ejercicios', icon: Dumbbell },
]

export function FloatingNav({ active, onChange }: { active: View; onChange: (v: View) => void }) {
  return (
    <nav
      className="glass fixed inset-x-6 bottom-0 z-30 mb-4 flex items-center justify-around rounded-3xl p-1.5"
      style={{ marginBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`tap-scale relative flex flex-1 flex-col items-center gap-1 rounded-2xl py-2.5 transition-colors ${
              isActive ? 'clay-ember text-white' : 'text-ash'
            }`}
          >
            <Icon size={20} strokeWidth={2} />
            <span className="text-[11px] font-bold">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
