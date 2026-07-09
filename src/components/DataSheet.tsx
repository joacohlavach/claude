import { useRef, useState } from 'react'
import { Download, RotateCcw, Upload } from 'lucide-react'
import { Sheet } from './Sheet'
import { useStore, getExportPayload } from '../store/useStore'

export function DataSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const importData = useStore((s) => s.importData)
  const resetToSeed = useStore((s) => s.resetToSeed)
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
        <p className="text-sm text-dim">
          Todo se guarda en este dispositivo. Hacé una copia de seguridad para no perder tu rutina.
        </p>

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
