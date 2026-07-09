import { readFileSync, writeFileSync } from 'node:fs'

const raw = JSON.parse(readFileSync('src/data/rutina.raw.json', 'utf-8'))

/** @type {Map<string, {id: string, nombre: string, tren: string|null}>} */
const catalogByName = new Map()
let catalogCounter = 1

function trenFromBloque(bloque) {
  if (bloque === 'Superior') return 'superior'
  if (bloque === 'Inferior') return 'inferior'
  return null
}

const dias = new Map()

for (const row of raw.ejercicios) {
  const nombre = row.ejercicio.trim()
  if (!catalogByName.has(nombre)) {
    catalogByName.set(nombre, {
      id: `ex-${String(catalogCounter++).padStart(3, '0')}`,
      nombre,
      tren: trenFromBloque(row.bloque),
    })
  } else {
    const existing = catalogByName.get(nombre)
    if (!existing.tren) existing.tren = trenFromBloque(row.bloque)
  }

  const diaKey = row.dia
  if (!dias.has(diaKey)) {
    dias.set(diaKey, {
      id: `dia-${diaKey}`,
      titulo: row.dia_titulo,
      orden: diaKey,
      ejercicios: [],
    })
  }
  const dayExercises = dias.get(diaKey).ejercicios
  dayExercises.push({
    id: row.id,
    exerciseId: catalogByName.get(nombre).id,
    bloqueOriginal: row.bloque,
    orden: dayExercises.length + 1,
    series: row.series,
    reps: row.reps,
    peso: row.peso,
    notas: row.notas || '',
  })
}

const catalog = Array.from(catalogByName.values()).map((e) => ({
  id: e.id,
  nombre: e.nombre,
  tren: e.tren,
  categoria: null,
  origen: 'seed',
}))

const routine = {
  nombre: raw.rutina,
  dias: Array.from(dias.values()).sort((a, b) => a.orden - b.orden),
}

writeFileSync(
  'src/data/seed.ts',
  `// Generado a partir de rutina.json subido por el usuario (rama gymapp).
import type { Exercise, RoutineDay } from '../types'

export const seedExercises: Exercise[] = ${JSON.stringify(catalog, null, 2)}

export const seedDays: RoutineDay[] = ${JSON.stringify(routine.dias, null, 2)}
`,
)

console.log(`Catálogo: ${catalog.length} ejercicios únicos. Días: ${routine.dias.length}.`)
