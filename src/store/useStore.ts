import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'
import type { CardStyle, CategoryId, DayExerciseEntry, Exercise, RoutineDay, TrenBloque, WeekProgress } from '../types'
import { seedDays, seedExercises } from '../data/seed'
import { categories } from '../data/categories'
import { getMondayISO } from '../lib/week'

const defaultCategoryColors = Object.fromEntries(categories.map((c) => [c.id, c.color])) as Record<
  CategoryId,
  string
>

interface GymState {
  exercises: Exercise[]
  days: RoutineDay[]
  routineName: string
  weekProgress: WeekProgress
  categoryColors: Record<CategoryId, string>
  cardStyle: CardStyle

  setRoutineName: (name: string) => void
  toggleWeekDay: (index: number) => void
  setCategoryColor: (id: CategoryId, color: string) => void
  setCardStyle: (style: CardStyle) => void

  addExercise: (
    nombre: string,
    tren: TrenBloque | null,
    categoria: CategoryId | null,
    imagen?: string | null,
  ) => Exercise
  updateExercise: (id: string, patch: Partial<Pick<Exercise, 'nombre' | 'tren' | 'categoria' | 'imagen'>>) => void
  deleteExercise: (id: string) => void

  addDay: (titulo: string) => void
  renameDay: (dayId: string, titulo: string) => void
  deleteDay: (dayId: string) => void
  reorderDays: (orderedIds: string[]) => void

  addExerciseToDay: (dayId: string, exerciseId: string) => void
  updateDayExercise: (dayId: string, entryId: string, patch: Partial<Omit<DayExerciseEntry, 'id' | 'exerciseId'>>) => void
  removeDayExercise: (dayId: string, entryId: string) => void
  reorderDayExercises: (dayId: string, orderedEntryIds: string[]) => void

  resetToSeed: () => void
  importData: (payload: { exercises: Exercise[]; days: RoutineDay[]; routineName?: string }) => void
}

export const useStore = create<GymState>()(
  persist(
    (set, get) => ({
      exercises: seedExercises,
      days: seedDays,
      routineName: 'Plan 3 días',
      weekProgress: { weekStart: getMondayISO(new Date()), days: [false, false, false, false, false, false, false] },
      categoryColors: defaultCategoryColors,
      cardStyle: 'stripe',

      setRoutineName: (name) => set({ routineName: name }),

      setCategoryColor: (id, color) =>
        set((s) => ({ categoryColors: { ...s.categoryColors, [id]: color } })),

      setCardStyle: (style) => set({ cardStyle: style }),

      toggleWeekDay: (index) =>
        set((s) => {
          const currentMonday = getMondayISO(new Date())
          const days =
            s.weekProgress.weekStart === currentMonday
              ? [...s.weekProgress.days]
              : [false, false, false, false, false, false, false]
          days[index] = !days[index]
          return { weekProgress: { weekStart: currentMonday, days } }
        }),

      addExercise: (nombre, tren, categoria, imagen = null) => {
        const exercise: Exercise = { id: uuid(), nombre, tren, categoria, origen: 'custom', imagen }
        set((s) => ({ exercises: [...s.exercises, exercise] }))
        return exercise
      },

      updateExercise: (id, patch) =>
        set((s) => ({
          exercises: s.exercises.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        })),

      deleteExercise: (id) =>
        set((s) => ({
          exercises: s.exercises.filter((e) => e.id !== id),
          days: s.days.map((d) => ({
            ...d,
            ejercicios: d.ejercicios.filter((entry) => entry.exerciseId !== id),
          })),
        })),

      addDay: (titulo) =>
        set((s) => ({
          days: [
            ...s.days,
            { id: uuid(), titulo, orden: s.days.length + 1, ejercicios: [] },
          ],
        })),

      renameDay: (dayId, titulo) =>
        set((s) => ({
          days: s.days.map((d) => (d.id === dayId ? { ...d, titulo } : d)),
        })),

      deleteDay: (dayId) =>
        set((s) => ({
          days: s.days.filter((d) => d.id !== dayId).map((d, i) => ({ ...d, orden: i + 1 })),
        })),

      reorderDays: (orderedIds) =>
        set((s) => {
          const byId = new Map(s.days.map((d) => [d.id, d]))
          const reordered = orderedIds
            .map((id, i) => {
              const d = byId.get(id)
              return d ? { ...d, orden: i + 1 } : null
            })
            .filter((d): d is RoutineDay => d !== null)
          return { days: reordered }
        }),

      addExerciseToDay: (dayId, exerciseId) =>
        set((s) => ({
          days: s.days.map((d) =>
            d.id === dayId
              ? {
                  ...d,
                  ejercicios: [
                    ...d.ejercicios,
                    {
                      id: uuid(),
                      exerciseId,
                      bloqueOriginal: '',
                      orden: d.ejercicios.length + 1,
                      series: null,
                      reps: null,
                      peso: null,
                      notas: '',
                    },
                  ],
                }
              : d,
          ),
        })),

      updateDayExercise: (dayId, entryId, patch) =>
        set((s) => ({
          days: s.days.map((d) =>
            d.id === dayId
              ? {
                  ...d,
                  ejercicios: d.ejercicios.map((entry) =>
                    entry.id === entryId ? { ...entry, ...patch } : entry,
                  ),
                }
              : d,
          ),
        })),

      removeDayExercise: (dayId, entryId) =>
        set((s) => ({
          days: s.days.map((d) =>
            d.id === dayId
              ? { ...d, ejercicios: d.ejercicios.filter((e) => e.id !== entryId) }
              : d,
          ),
        })),

      reorderDayExercises: (dayId, orderedEntryIds) =>
        set((s) => ({
          days: s.days.map((d) => {
            if (d.id !== dayId) return d
            const byId = new Map(d.ejercicios.map((e) => [e.id, e]))
            const reordered = orderedEntryIds
              .map((id, i) => {
                const e = byId.get(id)
                return e ? { ...e, orden: i + 1 } : null
              })
              .filter((e): e is DayExerciseEntry => e !== null)
            return { ...d, ejercicios: reordered }
          }),
        })),

      resetToSeed: () => set({ exercises: seedExercises, days: seedDays, routineName: 'Plan 3 días' }),

      importData: (payload) =>
        set({
          exercises: payload.exercises,
          days: payload.days,
          routineName: payload.routineName ?? get().routineName,
        }),
    }),
    {
      name: 'gymapp-storage',
      version: 1,
    },
  ),
)

export const getExportPayload = () => {
  const { exercises, days, routineName } = useStore.getState()
  return JSON.stringify({ exercises, days, routineName }, null, 2)
}
