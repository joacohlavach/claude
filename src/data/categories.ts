import type { Category, TrenBloque } from '../types'

export const categories: Category[] = [
  { id: 'fuerza', label: 'Fuerza', color: '#bd4f45' },
  { id: 'potencia', label: 'Potencia', color: '#d97a44' },
  { id: 'pliometria', label: 'Pliometría', color: '#8a8d93' },
  { id: 'hipertrofia', label: 'Hipertrofia', color: '#a8763f' },
]

export const trenLabels: Record<TrenBloque, string> = {
  superior: 'Tren Superior',
  inferior: 'Tren Inferior',
}

// Paleta amplia para elegir color de categoría, más allá de los 4 tonos por defecto.
export const colorPalette: string[] = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#eab308',
  '#84cc16',
  '#22c55e',
  '#10b981',
  '#14b8a6',
  '#06b6d4',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
  '#f43f5e',
  '#a8763f',
  '#8a8d93',
]
