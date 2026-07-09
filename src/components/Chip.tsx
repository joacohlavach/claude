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
      className={`tap-scale shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wide ${
        active ? 'border-transparent' : 'panel-2 border-line text-dim'
      }`}
      style={active ? { background: activeColor ?? 'var(--color-orange)', color: '#17110a' } : undefined}
    >
      {children}
    </button>
  )
}
