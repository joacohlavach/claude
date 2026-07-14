import { Settings2 } from 'lucide-react'
import { Logo } from './Logo'
import { useStore } from '../store/useStore'

const BACKUP_REMINDER_DAYS = 7

export function TopBar({ onOpenSettings }: { onOpenSettings: () => void }) {
  const lastBackupAt = useStore((s) => s.lastBackupAt)

  const backupStale =
    !lastBackupAt || Date.now() - new Date(lastBackupAt).getTime() > BACKUP_REMINDER_DAYS * 24 * 60 * 60 * 1000

  return (
    <div
      className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-board px-4 pb-3.5"
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
        className="panel-2 tap-scale relative flex h-9 w-9 items-center justify-center rounded-full text-dim"
        aria-label="Ajustes de datos"
      >
        <Settings2 size={18} />
        {backupStale && (
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red" aria-hidden="true" />
        )}
      </button>
    </div>
  )
}
