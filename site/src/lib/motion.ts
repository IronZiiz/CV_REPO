// One cycle of the page's ambient motion: the plasma's main wave, sin(k·x + t),
// completes one period.
export const CYCLE_SECONDS = 80

// Shader time per second so that t advances 2π per cycle (BACKGROUND.md used 0.86).
export const PLASMA_TIME_SCALE = (2 * Math.PI) / CYCLE_SECONDS
