import { Settings2 } from 'lucide-react'
import { Logo } from './Logo'

export function TopBar({ onOpenSettings }: { onOpenSettings: () => void }) {
  return (
    <div
      className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-line bg-board px-4 pb-3.5"
      style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 14px)' }}
    >
      <div className="flex items-center gap-2.5">
        <Logo size={32} />
        <span className="text-[17px] font-bold tracking-tight text-ink-light">
          Gym<span className="text-orange">App</span>
        </span>
      </div>
      <button
        onClick={onOpenSettings}
        className="panel-2 tap-scale flex h-9 w-9 items-center justify-center rounded-full text-dim"
        aria-label="Ajustes de datos"
      >
        <Settings2 size={18} />
      </button>
    </div>
  )
}
