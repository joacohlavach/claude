export function getMondayISO(d: Date): string {
  const date = new Date(d)
  const day = date.getDay() // 0=domingo, 1=lunes, ... 6=sábado
  const diff = (day === 0 ? -6 : 1) - day
  date.setDate(date.getDate() + diff)
  date.setHours(0, 0, 0, 0)
  return date.toISOString().slice(0, 10)
}

export const WEEKDAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
