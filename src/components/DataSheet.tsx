import { useRef, useState } from 'react'
import { Download, RotateCcw, Upload } from 'lucide-react'
import { Sheet } from './Sheet'
import { useStore, getExportPayload } from '../store/useStore'
import { categories, colorPalette } from '../data/categories'

function formatBackupAge(iso: string | null): string {
  if (!iso) return 'nunca hiciste una'
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24))
  if (days <= 0) return 'hoy'
  if (days === 1) return 'ayer'
  return `hace ${days} días`
}

export function DataSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const importData = useStore((s) => s.importData)
  const resetToSeed = useStore((s) => s.resetToSeed)
  const categoryColors = useStore((s) => s.categoryColors)
  const setCategoryColor = useStore((s) => s.setCategoryColor)
  const cardStyle = useStore((s) => s.cardStyle)
  const setCardStyle = useStore((s) => s.setCardStyle)
  const lastBackupAt = useStore((s) => s.lastBackupAt)
  const markBackupDone = useStore((s) => s.markBackupDone)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleExport = () => {
    const payload = getExportPayload()
    const blob = new Blob([payload], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gymapp-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    markBackupDone()
  }

  const handleImportClick = () => fileInputRef.current?.click()

  const handleFile = async (file: File) => {
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      if (!Array.isArray(parsed.exercises) || !Array.isArray(parsed.days)) {
        throw new Error('Formato inválido')
      }
      importData(parsed)
      setMessage('Datos importados correctamente.')
    } catch {
      setMessage('No se pudo leer el archivo. Verificá que sea un backup válido de GymApp.')
    }
  }

  const handleReset = () => {
    if (confirm('¿Restaurar la rutina original que subiste? Se van a perder los cambios hechos desde la web.')) {
      resetToSeed()
      setMessage('Rutina restaurada al backup original.')
    }
  }

  return (
    <Sheet open={open} title="Ajustes y datos" onClose={onClose}>
      <div className="flex flex-col gap-3 pb-2">
        <div className="panel-2 rounded-xl p-3.5">
          <p className="mb-2 text-sm font-bold text-ink-light">Estilo de tarjeta</p>
          <p className="mb-2.5 text-xs text-dim">Cómo se marca el color de categoría en cada ejercicio.</p>
          <div className="flex gap-2">
            <button
              onClick={() => setCardStyle('stripe')}
              className={`tap-scale flex-1 rounded-lg py-2.5 text-xs font-bold ${
                cardStyle === 'stripe' ? 'accent-fill' : 'panel text-dim'
              }`}
            >
              Franja lateral
            </button>
            <button
              onClick={() => setCardStyle('tint')}
              className={`tap-scale flex-1 rounded-lg py-2.5 text-xs font-bold ${
                cardStyle === 'tint' ? 'accent-fill' : 'panel text-dim'
              }`}
            >
              Fondo con tinte
            </button>
          </div>
        </div>

        <div className="panel-2 rounded-xl p-3.5">
          <p className="mb-1 text-sm font-bold text-ink-light">Colores de categoría</p>
          <p className="mb-3 text-xs text-dim">Tocá un color de la paleta, o el círculo grande para elegir cualquier otro.</p>
          <div className="flex flex-col gap-3.5">
            {categories.map((c) => (
              <div key={c.id}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs font-bold text-ink-light">{c.label}</span>
                  <label className="tap-scale relative h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-line">
                    <span className="absolute inset-0" style={{ background: categoryColors[c.id] }} />
                    <input
                      type="color"
                      value={categoryColors[c.id]}
                      onChange={(e) => setCategoryColor(c.id, e.target.value)}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      aria-label={`Color personalizado para ${c.label}`}
                    />
                  </label>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {colorPalette.map((hex) => {
                    const selected = categoryColors[c.id].toLowerCase() === hex.toLowerCase()
                    return (
                      <button
                        key={hex}
                        onClick={() => setCategoryColor(c.id, hex)}
                        className="tap-scale h-6 w-6 shrink-0 rounded-full"
                        style={{
                          background: hex,
                          boxShadow: selected ? `0 0 0 2px var(--color-panel-2), 0 0 0 3.5px ${hex}` : 'none',
                        }}
                        aria-label={hex}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel-2 rounded-xl p-3.5">
          <p className="text-sm text-dim">
            Todo se guarda solo en este dispositivo (no hay nube ni cuenta). El navegador puede llegar a borrarlo —
            por ejemplo, si limpiás datos de navegación o pasan varios días sin abrir la app. Hacé backups seguido.
          </p>
          <p className="mt-2 font-mono text-xs text-orange-light">Último backup: {formatBackupAge(lastBackupAt)}</p>
        </div>

        <button onClick={handleExport} className="panel-2 tap-scale flex items-center gap-3 rounded-xl px-4 py-3.5 text-left">
          <span className="accent-fill flex h-9 w-9 items-center justify-center rounded-full">
            <Download size={16} />
          </span>
          <span>
            <span className="block text-sm font-bold text-ink-light">Exportar backup</span>
            <span className="block text-xs text-dim">Descarga un .json con toda tu rutina</span>
          </span>
        </button>

        <button onClick={handleImportClick} className="panel-2 tap-scale flex items-center gap-3 rounded-xl px-4 py-3.5 text-left">
          <span className="panel flex h-9 w-9 items-center justify-center rounded-full text-ink-light">
            <Upload size={16} />
          </span>
          <span>
            <span className="block text-sm font-bold text-ink-light">Importar backup</span>
            <span className="block text-xs text-dim">Reemplaza los datos actuales por un .json</span>
          </span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        <button onClick={handleReset} className="panel-2 tap-scale flex items-center gap-3 rounded-xl px-4 py-3.5 text-left">
          <span className="panel flex h-9 w-9 items-center justify-center rounded-full text-red">
            <RotateCcw size={16} />
          </span>
          <span>
            <span className="block text-sm font-bold text-ink-light">Restaurar original</span>
            <span className="block text-xs text-dim">Vuelve a la rutina que subiste al principio</span>
          </span>
        </button>

        {message && <p className="text-center text-xs text-orange-light">{message}</p>}
      </div>
    </Sheet>
  )
}
