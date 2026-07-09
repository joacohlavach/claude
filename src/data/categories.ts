import type { Category, CategoryId, TrenBloque } from '../types'

export const categories: Category[] = [
  { id: 'fuerza', label: 'Fuerza', color: '#ef4444', colorSoft: 'rgba(239,68,68,0.16)' },
  { id: 'potencia', label: 'Potencia', color: '#f97316', colorSoft: 'rgba(249,115,22,0.16)' },
  { id: 'pliometria', label: 'Pliometría', color: '#a1a1aa', colorSoft: 'rgba(161,161,170,0.18)' },
  { id: 'hipertrofia', label: 'Hipertrofia', color: '#c2410c', colorSoft: 'rgba(194,65,12,0.18)' },
]

export const categoryMap: Record<CategoryId, Category> = Object.fromEntries(
  categories.map((c) => [c.id, c]),
) as Record<CategoryId, Category>

export const trenLabels: Record<TrenBloque, string> = {
  superior: 'Tren Superior',
  inferior: 'Tren Inferior',
}
