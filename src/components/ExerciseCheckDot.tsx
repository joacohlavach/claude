import { Check } from 'lucide-react'

export function ExerciseCheckDot({ done, onToggle }: { done: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      onPointerDown={(e) => e.stopPropagation()}
      className="rail-check tap-scale"
      style={{ background: done ? 'var(--color-green)' : 'var(--color-panel-2)' }}
      aria-pressed={done}
      aria-label={done ? 'Marcar ejercicio como no hecho' : 'Marcar ejercicio como hecho'}
    >
      {done ? (
        <Check size={11} strokeWidth={3} />
      ) : (
        <span
          className="block rounded-full"
          style={{ width: 8, height: 8, border: '1.5px solid var(--color-line)' }}
        />
      )}
    </button>
  )
}
