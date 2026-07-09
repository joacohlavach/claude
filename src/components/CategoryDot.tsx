import type { CategoryId } from '../types'
import { categoryMap } from '../data/categories'

export function CategoryDot({ categoria, size = 10 }: { categoria: CategoryId | null; size?: number }) {
  const color = categoria ? categoryMap[categoria].color : '#3f3f46'
  return (
    <span
      className="inline-block shrink-0 rounded-full"
      style={{
        width: size,
        height: size,
        background: color,
        boxShadow: categoria ? `0 0 8px ${color}99` : 'none',
      }}
    />
  )
}
