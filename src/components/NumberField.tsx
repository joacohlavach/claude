import { Minus, Plus } from 'lucide-react'

interface NumberFieldProps {
  label: string
  value: number | null
  step?: number
  suffix?: string
  onChange: (value: number | null) => void
}

export function NumberField({ label, value, step = 1, suffix = '', onChange }: NumberFieldProps) {
  const adjust = (delta: number) => {
    const base = value ?? 0
    const next = Math.max(0, Math.round((base + delta) * 100) / 100)
    onChange(next)
  }

  return (
    <div className="clay flex flex-col items-center gap-1 rounded-2xl px-2 py-2">
      <span className="text-[10px] font-bold uppercase tracking-wide text-ash">{label}</span>
      <div className="flex items-center gap-1.5">
        <button onClick={() => adjust(-step)} className="tap-scale text-ash-light">
          <Minus size={14} />
        </button>
        <input
          type="number"
          inputMode="decimal"
          value={value ?? ''}
          placeholder="-"
          onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
          className="w-11 bg-transparent text-center text-sm font-bold text-ash-light outline-none"
        />
        <button onClick={() => adjust(step)} className="tap-scale text-ash-light">
          <Plus size={14} />
        </button>
      </div>
      {suffix && <span className="text-[9px] text-ash">{suffix}</span>}
    </div>
  )
}
