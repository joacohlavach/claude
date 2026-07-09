import { ClipboardList, Dumbbell } from 'lucide-react'
import type { View } from '../App'

const tabs: { id: View; label: string; icon: typeof ClipboardList }[] = [
  { id: 'rutina', label: 'Rutina', icon: ClipboardList },
  { id: 'ejercicios', label: 'Ejercicios', icon: Dumbbell },
]

export function FloatingNav({ active, onChange }: { active: View; onChange: (v: View) => void }) {
  return (
    <nav
      className="panel fixed inset-x-4 bottom-0 z-30 mb-4 flex items-center gap-1.5 rounded-2xl p-1.5"
      style={{ marginBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`tap-scale flex flex-1 flex-col items-center gap-1 rounded-xl py-2.5 ${
              isActive ? 'accent-fill' : 'text-dim'
            }`}
          >
            <Icon size={19} strokeWidth={2} />
            <span className="font-mono text-[10.5px] font-medium uppercase tracking-wide">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
