// Shared across rows: right after a drag ends, the row that visually ends up
// under the pointer can still receive a stray click (e.g. its own expand
// toggle). Suppress taps for a brief moment after any drag completes.
let suppressUntil = 0

export function markDragEnded() {
  suppressUntil = Date.now() + 300
}

export function shouldSuppressClick() {
  return Date.now() < suppressUntil
}
