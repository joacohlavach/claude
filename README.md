# GymApp

App personal de rutina de gimnasio. React + Vite + TypeScript + Tailwind v4, estilo glassmorphism + claymorphism, pensada para instalarse como PWA en el iPhone (Agregar a pantalla de inicio).

## Desarrollo

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build
npm run preview   # sirve dist/ localmente para probar
```

## Deploy en Netlify

El repo ya incluye `netlify.toml` con:
- Build command: `npm run build`
- Publish dir: `dist`
- Redirect SPA (`/* -> /index.html`)

Solo hace falta conectar el repo en Netlify (o arrastrar la carpeta `dist` generada). No hay backend ni variables de entorno.

## Instalar en iPhone como app

1. Abrí la web en Safari (una vez deployada en Netlify).
2. Botón compartir → **"Agregar a pantalla de inicio"**.
3. Se instala con ícono propio (la G) y abre en modo standalone, sin barra de Safari.

## Dónde vive tu data

- **Todo se guarda en `localStorage` del dispositivo** (no hay servidor ni cuenta). Si borrás datos de navegación de Safari o cambiás de celular, se pierde.
- Desde **Ajustes** (ícono de sliders arriba a la derecha) podés:
  - **Exportar backup**: descarga un `.json` con toda tu rutina y catálogo de ejercicios.
  - **Importar backup**: restaura desde un `.json` exportado antes.
  - **Restaurar original**: vuelve a la rutina que subiste originalmente (`src/data/seed.ts`).

Recomendación: exportá un backup de vez en cuando, sobre todo antes de reinstalar la PWA o cambiar de teléfono.

## Estructura de datos y personalización

- `src/data/rutina.raw.json`: el `rutina.json` original que subiste, sin tocar (referencia).
- `scripts/transform-seed.mjs`: transforma ese JSON en `src/data/seed.ts` (catálogo de ejercicios + días). Si alguna vez querés reemplazar la rutina base de cero, editá `rutina.raw.json` y corré `node scripts/transform-seed.mjs`.
- `src/data/categories.ts`: las 4 clasificaciones (Fuerza, Potencia, Pliometría, Hipertrofia) y sus colores. Editable ahí si querés otros colores.
- `scripts/generate-icons.mjs`: regenera los íconos PWA (`public/icons/`) a partir del logo. Correlo con `node scripts/generate-icons.mjs` si cambiás el diseño del logo en `src/components/Logo.tsx`.

Todo lo demás (rutina, ejercicios del catálogo, clasificación por tren/categoría, series/reps/peso/notas) es 100% editable desde la web misma — no hace falta tocar código para el uso normal.
