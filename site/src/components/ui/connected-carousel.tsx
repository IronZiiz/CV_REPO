import { MotionConfig, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

/*
 * Connected carousel, adapted from a Calendly-style component (Next.js + fixed pixel
 * sizes) to this site: plain <img>, sizes derived from the 12-column page grid, the
 * open card's height measured from its content, and autoplay driven by a CSS
 * animation on the progress bar instead of a requestAnimationFrame loop.
 *
 * One card is open in the centre; its neighbours shrink into tall slivers joined to it
 * by small notches. Pages are virtual (…, -1, 0, 1, …), so the row loops forever.
 */

export interface ConnectedCarouselItem {
  id: string
  // Shown vertically on the slivers, and as the name of its progress tab.
  label: string
  image?: string
}

interface ConnectedCarouselProps<T extends ConnectedCarouselItem> {
  items: T[]
  // What the open card shows.
  renderContent: (item: T) => ReactNode
  label: string
  prevLabel: string
  nextLabel: string
  autoPlayInterval?: number
  className?: string
}

const OFFSETS = [-3, -2, -1, 0, 1, 2, 3] as const

const SPRING = { type: 'spring', stiffness: 220, damping: 26, mass: 0.75 } as const

const GUTTER = 32

interface Slot {
  x: number
  y: number
  width: number
  height: number
  opacity: number
}

// Where each offset sits, measured from the track's centre, for a container width.
function layout(cw: number, height: number) {
  const tier = cw >= 1024 ? 'desktop' : cw >= 640 ? 'tablet' : 'mobile'
  const gap = tier === 'mobile' ? 10 : 16
  let activeW: number
  let sideW: number
  let farW = 0

  if (tier === 'desktop') {
    // Open card at 70% of an 8-column span; each side splits what is left into a
    // wider near card and a narrower far one.
    const col = (cw - 11 * GUTTER) / 12
    activeW = 0.7 * (8 * col + 7 * GUTTER)
    const side = (cw - activeW) / 2 - 2 * gap
    sideW = side * 0.58
    farW = side - sideW
  } else if (tier === 'tablet') {
    activeW = 0.7 * (cw - 2 * (gap + 72))
    sideW = (cw - activeW) / 2 - gap
  } else {
    // Phones keep the full width: 30% narrower would leave the text column too thin.
    sideW = 28
    activeW = cw - 2 * (gap + sideW)
  }

  const sideH = height * 0.67
  const farH = height * 0.4
  const slot = (x: number, width: number, h: number, opacity = 1): Slot => ({ x, y: -h / 2, width, height: h, opacity })

  const slots: Record<number, Slot> = {
    0: slot(-activeW / 2, activeW, height),
    1: slot(activeW / 2 + gap, sideW, sideH),
    [-1]: slot(-activeW / 2 - gap - sideW, sideW, sideH),
    2: slot(activeW / 2 + 2 * gap + sideW, farW, farH, tier === 'desktop' ? 1 : 0),
    [-2]: slot(-activeW / 2 - 2 * gap - sideW - farW, farW, farH, tier === 'desktop' ? 1 : 0),
    3: slot(cw / 2 + 40, farW || sideW, farH, 0),
    [-3]: slot(-cw / 2 - 40 - (farW || sideW), farW || sideW, farH, 0),
  }
  return { tier, gap, activeW, slots }
}

// The small concave piece that bridges the gap between two cards.
function Notch({ side, width, height }: { side: 'left' | 'right'; width: number; height: number }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 z-10 my-auto text-surface"
      style={{ width, height, [side === 'left' ? 'left' : 'right']: 'calc(100% - 1px)' }}
    >
      <svg viewBox="0 0 20 37.3338" preserveAspectRatio="none" className="block size-full fill-current">
        <path d="M0 0C0 0 1.2422 13.5759 10 13.5759C18.7578 13.5759 20 0 20 0V37.3338C20 37.3338 18.7578 23.7578 10 23.7578C1.2422 23.7578 0 37.3338 0 37.3338V0Z" />
      </svg>
    </span>
  )
}

export function ConnectedCarousel<T extends ConnectedCarouselItem>({
  items,
  renderContent,
  label,
  prevLabel,
  nextLabel,
  autoPlayInterval = 7000,
  className,
}: ConnectedCarouselProps<T>) {
  const rootRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [contentH, setContentH] = useState(0)
  const [page, setPage] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)

  const total = items.length
  const activeIndex = ((page % total) + total) % total
  const { tier, gap, activeW, slots } = layout(width, contentH)

  // The track follows the grid width…
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  // …and the open card is as tall as the longest content at that width, so no
  // project is clipped and the row keeps one height while it moves.
  useLayoutEffect(() => {
    const layer = measureRef.current
    if (!layer) return
    const measure = () => setContentH(Math.max(360, ...Array.from(layer.children, (el) => el.scrollHeight)))
    const observer = new ResizeObserver(measure)
    Array.from(layer.children).forEach((el) => observer.observe(el))
    measure()
    return () => observer.disconnect()
  }, [activeW, items])

  const go = (diff: number) => setPage((current) => current + diff)

  // Jump to a tab by the shortest way round the loop.
  function select(index: number) {
    let diff = index - activeIndex
    if (diff > total / 2) diff -= total
    else if (diff < -total / 2) diff += total
    go(diff)
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    // The image gallery (a dialog inside a card) uses the arrows for its own images.
    if ((event.target as Element).closest('[role="dialog"]')) return
    if (event.key === 'ArrowLeft') go(-1)
    else if (event.key === 'ArrowRight') go(1)
  }

  // Autoplay waits while the visitor is reading (pointer or focus inside).
  const paused = hovered || focused

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={rootRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
        }}
        className={cn('relative w-full outline-none select-none', className)}
      >
        {/* Off-screen copy of every card's content, used only to measure heights. */}
        <div
          ref={measureRef}
          aria-hidden="true"
          inert
          className="pointer-events-none invisible absolute top-0 left-0 h-0 overflow-hidden"
        >
          {items.map((item) => (
            <div key={item.id} style={{ width: activeW }}>
              {renderContent(item)}
            </div>
          ))}
        </div>

        {width > 0 && contentH > 0 && (
          <div aria-live="polite" className="relative w-full" style={{ height: contentH }}>
            {OFFSETS.map((offset) => {
              const virtualIndex = page + offset
              const item = items[((virtualIndex % total) + total) % total]
              const active = offset === 0
              const showNotch = Math.abs(offset) === 1 || (Math.abs(offset) === 2 && tier === 'desktop')

              return (
                <motion.div
                  key={virtualIndex}
                  initial={false}
                  animate={{ ...slots[offset], zIndex: active ? 0 : 10 }}
                  transition={SPRING}
                  style={{ position: 'absolute', left: '50%', top: '50%', pointerEvents: slots[offset].opacity ? 'auto' : 'none' }}
                  className="rounded-[clamp(20px,2.2vw,32px)] bg-surface shadow-[0_10px_30px_rgba(95,109,119,0.10),0_4px_12px_rgba(95,109,119,0.08)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.6),0_4px_12px_rgba(0,0,0,0.4)]"
                >
                  {showNotch && (
                    <Notch side={offset < 0 ? 'left' : 'right'} width={gap + 2} height={Math.abs(offset) === 1 ? 42 : 28} />
                  )}

                  <div className="relative size-full overflow-hidden" style={{ borderRadius: 'inherit' }}>
                    {/* Sliver face: the project's image (or plain surface) and its name. */}
                    <motion.div
                      initial={false}
                      animate={{ opacity: active ? 0 : 1 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      className="absolute inset-0 p-1.5"
                    >
                      <div className="relative size-full overflow-hidden rounded-[clamp(14px,1.6vw,24px)] bg-background/60">
                        {item.image && (
                          <img src={item.image} alt="" draggable={false} className="absolute inset-0 size-full object-cover object-top opacity-90" />
                        )}
                        <span className="absolute inset-0 bg-linear-to-t from-surface/95 via-surface/30 to-transparent" />
                        {/* Wide slivers read the name across, narrow ones up the side. */}
                        {slots[offset].width >= 140 ? (
                          <span className="absolute inset-x-3 bottom-3 line-clamp-3 text-sm leading-snug font-bold text-brand">
                            {item.label}
                          </span>
                        ) : (
                          tier !== 'mobile' && (
                            <span className="absolute inset-x-0 bottom-4 mx-auto block max-h-[calc(100%-2rem)] w-fit rotate-180 truncate text-sm font-bold text-brand [writing-mode:vertical-rl]">
                              {item.label}
                            </span>
                          )
                        )}
                      </div>
                      {!active && (
                        <button
                          type="button"
                          tabIndex={-1}
                          aria-hidden="true"
                          onClick={() => go(offset)}
                          className="absolute inset-0 cursor-pointer"
                        />
                      )}
                    </motion.div>

                    {/* Open face: laid out at the open card's size, slid away when closed. */}
                    <div
                      className="absolute top-1/2 left-1/2 -translate-1/2"
                      style={{ width: activeW, height: contentH }}
                    >
                      <motion.div
                        initial={false}
                        animate={{ opacity: active ? 1 : 0, x: active ? 0 : offset < 0 ? -activeW : activeW }}
                        transition={SPRING}
                        inert={!active}
                        className={cn('size-full select-text', !active && 'pointer-events-none')}
                      >
                        {renderContent(item)}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )
            })}

            {/* At the open card's middle, one on each edge of the row. */}
            <button type="button" onClick={() => go(-1)} aria-label={prevLabel} className={cn(arrow, 'left-0')}>
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label={nextLabel} className={cn(arrow, 'right-0')}>
              <ChevronRight size={22} aria-hidden="true" />
            </button>
          </div>
        )}

        {/* One tab per item; the open tab fills up until autoplay moves on. */}
        <div className="mt-6 flex items-center justify-center">
          <div role="tablist" aria-label={label} className="flex items-center gap-1.5">
            {items.map((item, index) => {
              const selected = index === activeIndex
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-label={item.label}
                  title={item.label}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(index)}
                  className={cn(
                    'h-2 cursor-pointer overflow-hidden rounded-[3px] bg-border transition-[width] duration-300 ease-out',
                    selected ? 'w-20' : 'w-2 hover:bg-muted-foreground/40',
                  )}
                >
                  {selected && (
                    <span
                      key={page}
                      className="carousel-progress block h-full rounded-[3px] bg-brand"
                      style={{ animationDuration: `${autoPlayInterval}ms`, animationPlayState: paused ? 'paused' : 'running' }}
                      onAnimationEnd={() => go(1)}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </MotionConfig>
  )
}

const arrow =
  'absolute top-1/2 z-20 inline-flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-brand bg-background/85 text-brand shadow-sm backdrop-blur-sm transition-colors hover:bg-brand hover:text-on-brand'
