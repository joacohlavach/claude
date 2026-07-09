import { useEffect, useRef, useState } from 'react'
import { Minus, Plus } from 'lucide-react'

interface NumberFieldProps {
  label: string
  value: number | null
  step?: number
  suffix?: string
  onChange: (value: number | null) => void
}

function formatValue(value: number | null) {
  return value === null ? '' : String(value).replace('.', ',')
}

export function NumberField({ label, value, step = 1, suffix = '', onChange }: NumberFieldProps) {
  const [draft, setDraft] = useState(() => formatValue(value))
  const focused = useRef(false)

  useEffect(() => {
    if (!focused.current) setDraft(formatValue(value))
  }, [value])

  const adjust = (delta: number) => {
    const base = value ?? 0
    const next = Math.max(0, Math.round((base + delta) * 100) / 100)
    onChange(next)
    setDraft(formatValue(next))
  }

  const handleChange = (raw: string) => {
    // Solo dígitos y un separador decimal (coma o punto), como en el teclado numérico en español.
    let cleaned = raw.replace(/[^0-9.,]/g, '')
    const firstSep = cleaned.search(/[.,]/)
    if (firstSep !== -1) {
      cleaned = cleaned.slice(0, firstSep + 1) + cleaned.slice(firstSep + 1).replace(/[.,]/g, '')
    }
    setDraft(cleaned)

    if (cleaned === '') {
      onChange(null)
      return
    }
    const parsed = Number(cleaned.replace(',', '.'))
    if (!Number.isNaN(parsed) && !cleaned.endsWith('.') && !cleaned.endsWith(',')) {
      onChange(parsed)
    }
  }

  return (
    <div className="clay flex min-w-0 flex-col items-center gap-1 rounded-2xl px-1 py-2">
      <span className="text-[10px] font-bold uppercase tracking-wide text-ash">{label}</span>
      <div className="flex w-full items-center gap-0.5">
        <button onClick={() => adjust(-step)} className="tap-scale shrink-0 p-1 text-ash-light">
          <Minus size={13} />
        </button>
        <input
          type="text"
          inputMode="decimal"
          value={draft}
          placeholder="-"
          onFocus={() => {
            focused.current = true
          }}
          onBlur={() => {
            focused.current = false
            setDraft(formatValue(value))
          }}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full min-w-0 flex-1 bg-transparent text-center text-sm font-bold text-ash-light outline-none"
        />
        <button onClick={() => adjust(step)} className="tap-scale shrink-0 p-1 text-ash-light">
          <Plus size={13} />
        </button>
      </div>
      {suffix && <span className="text-[9px] text-ash">{suffix}</span>}
    </div>
  )
}
