import { Settings2 } from 'lucide-react'
import { Logo } from './Logo'

export function TopBar({ onOpenSettings }: { onOpenSettings: () => void }) {
  return (
    <div
      className="glass tap-scale fixed inset-x-4 top-0 z-30 mt-3 flex items-center justify-between rounded-3xl px-4 py-2.5"
      style={{ marginTop: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}
    >
      <div className="flex items-center gap-2.5">
        <Logo size={34} />
        <span className="text-[17px] font-extrabold tracking-tight text-ash-light">
          Gym<span className="text-ember">App</span>
        </span>
      </div>
      <button
        onClick={onOpenSettings}
        className="clay tap-scale flex h-9 w-9 items-center justify-center rounded-full text-ash"
        aria-label="Ajustes de datos"
      >
        <Settings2 size={18} />
      </button>
    </div>
  )
}
