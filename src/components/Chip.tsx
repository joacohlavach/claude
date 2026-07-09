import type { ReactNode } from 'react'

export function Chip({
  active,
  onClick,
  children,
  activeColor,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
  activeColor?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`tap-scale rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors ${
        active ? 'border-transparent text-ink' : 'clay border-white/5 text-ash'
      }`}
      style={active ? { background: activeColor ?? '#f97316' } : undefined}
    >
      {children}
    </button>
  )
}
