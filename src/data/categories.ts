import type { Category, CategoryId, TrenBloque } from '../types'

export const categories: Category[] = [
  { id: 'fuerza', label: 'Fuerza', color: '#bd4f45', colorSoft: 'rgba(189,79,69,0.16)' },
  { id: 'potencia', label: 'Potencia', color: '#d97a44', colorSoft: 'rgba(217,122,68,0.16)' },
  { id: 'pliometria', label: 'Pliometría', color: '#8a8d93', colorSoft: 'rgba(138,141,147,0.18)' },
  { id: 'hipertrofia', label: 'Hipertrofia', color: '#a8763f', colorSoft: 'rgba(168,118,63,0.18)' },
]

export const categoryMap: Record<CategoryId, Category> = Object.fromEntries(
  categories.map((c) => [c.id, c]),
) as Record<CategoryId, Category>

export const trenLabels: Record<TrenBloque, string> = {
  superior: 'Tren Superior',
  inferior: 'Tren Inferior',
}
