import { useStore } from '../store/useStore'
import { getMondayISO, WEEKDAY_LABELS } from '../lib/week'

export function WeekTracker() {
  const weekProgress = useStore((s) => s.weekProgress)
  const toggleWeekDay = useStore((s) => s.toggleWeekDay)

  const currentMonday = getMondayISO(new Date())
  const days = weekProgress.weekStart === currentMonday ? weekProgress.days : [false, false, false, false, false, false, false]
  const doneCount = days.filter(Boolean).length

  return (
    <section className="panel rounded-2xl p-3.5">
      <div className="mb-2.5 flex items-center justify-between">
        <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-dim">Esta semana</p>
        <p className="font-mono text-[11px] font-medium text-orange">{doneCount}/7</p>
      </div>
      <div className="flex items-center justify-between gap-1.5">
        {WEEKDAY_LABELS.map((label, i) => {
          const done = days[i]
          return (
            <button
              key={i}
              onClick={() => toggleWeekDay(i)}
              className={`tap-scale flex h-10 flex-1 items-center justify-center rounded-full font-mono text-xs font-bold ${
                done ? 'accent-fill' : 'panel-2 text-dim'
              }`}
              aria-pressed={done}
              aria-label={label}
            >
              {label}
            </button>
          )
        })}
      </div>
    </section>
  )
}
