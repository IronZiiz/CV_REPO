import { useEffect, useState, type RefObject } from 'react'

// Reading line a bit above the middle of the viewport, where the eye usually rests.
const READING_LINE = 0.45

/*
 * Which block is being read, among the elements carrying `data-<attribute>`:
 * the one crossed by the reading line (or the nearest); when two overlap
 * (Projetos' zigzag) the one whose centre is closer wins. At the very bottom of
 * the page the lowest block wins, since the line can no longer reach it.
 */
export function useReadingFocus(containerRef: RefObject<HTMLElement | null>, attribute: string) {
  const [inFocus, setInFocus] = useState<string | null>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const items = [...(containerRef.current?.querySelectorAll<HTMLElement>(`[data-${attribute}]`) ?? [])]
      if (!items.length) return
      const rects = items.map((item) => item.getBoundingClientRect())

      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      if (atBottom) {
        const lowest = rects.reduce((best, rect, i) => (rect.bottom > rects[best].bottom ? i : best), 0)
        setInFocus(items[lowest].dataset[attribute] ?? null)
        return
      }

      const line = window.innerHeight * READING_LINE
      let best = 0
      let bestScore = Infinity
      rects.forEach(({ top, bottom }, i) => {
        const outside = line < top ? top - line : line > bottom ? line - bottom : 0
        const score = outside * 10 + Math.abs((top + bottom) / 2 - line)
        if (score < bestScore) {
          bestScore = score
          best = i
        }
      })
      setInFocus(items[best].dataset[attribute] ?? null)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(frame)
    }
  }, [containerRef, attribute])

  return inFocus
}

// Classes for a block that is out of focus; hovering or tabbing into it brings it back.
// Visitors who ask the system for more contrast get everything fully visible.
export const OUT_OF_FOCUS =
  'opacity-35 blur-[1px] focus-within:opacity-100 focus-within:blur-none hover:opacity-100 hover:blur-none contrast-more:opacity-100 contrast-more:blur-none'
