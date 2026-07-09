export type TrenBloque = 'superior' | 'inferior'

export type CategoryId = 'fuerza' | 'potencia' | 'pliometria' | 'hipertrofia'

export interface Category {
  id: CategoryId
  label: string
  color: string
  colorSoft: string
}

export interface Exercise {
  id: string
  nombre: string
  tren: TrenBloque | null
  categoria: CategoryId | null
  origen: 'seed' | 'custom'
  imagen?: string | null
}

export interface DayExerciseEntry {
  id: string
  exerciseId: string
  bloqueOriginal: string
  orden: number
  series: number | null
  reps: number | null
  peso: number | null
  notas: string
}

export interface RoutineDay {
  id: string
  titulo: string
  orden: number
  ejercicios: DayExerciseEntry[]
}

export interface WeekProgress {
  weekStart: string
  days: boolean[]
}
