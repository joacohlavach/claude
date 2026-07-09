import type { CategoryId } from '../types'
import { useStore } from '../store/useStore'

export function CategoryDot({ categoria, size = 10 }: { categoria: CategoryId | null; size?: number }) {
  const categoryColors = useStore((s) => s.categoryColors)
  const color = categoria ? categoryColors[categoria] : '#4a4a4f'
  return (
    <span
      className="inline-block shrink-0 rounded-full"
      style={{ width: size, height: size, background: color }}
    />
  )
}
