import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

mkdirSync('public/icons', { recursive: true })

// Geometric "G": ring arc with a right-facing gap + inward bar.
const RING = 'M 39.96 16.64 A 13 13 0 1 0 39.96 33.36'
const BAR = 'M 41 25 L 30 25'

function badgeSvg({ size = 64, radius = 0, scale = 1 } = {}) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#e2895a" />
        <stop offset="55%" stop-color="#d97a44" />
        <stop offset="100%" stop-color="#a85128" />
      </linearGradient>
      <linearGradient id="g" gradientUnits="userSpaceOnUse" x1="32" y1="12" x2="32" y2="38">
        <stop offset="0%" stop-color="#1c1408" />
        <stop offset="100%" stop-color="#120d05" />
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="64" height="64" rx="${radius}" fill="url(#bg)" />
    <g transform="translate(32 32) scale(${scale}) translate(-32 -32)">
      <path d="${RING}" fill="none" stroke="url(#g)" stroke-width="6.2" stroke-linecap="round" />
      <path d="${BAR}" fill="none" stroke="url(#g)" stroke-width="6.2" stroke-linecap="round" />
    </g>
  </svg>`
}

const jobs = [
  { name: 'apple-touch-icon.png', size: 180, radius: 0, scale: 1 },
  { name: 'icon-192.png', size: 192, radius: 18, scale: 1 },
  { name: 'icon-512.png', size: 512, radius: 18, scale: 1 },
  { name: 'icon-maskable-512.png', size: 512, radius: 0, scale: 0.72 },
]

for (const job of jobs) {
  const svg = badgeSvg(job)
  await sharp(Buffer.from(svg)).resize(job.size, job.size).png().toFile(`public/icons/${job.name}`)
  console.log('generated', job.name)
}

await sharp(Buffer.from(badgeSvg({ radius: 18 }))).resize(64, 64).png().toFile('public/icons/favicon.png')
console.log('generated favicon.png')
