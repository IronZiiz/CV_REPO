import type { CSSProperties, ReactNode, Ref } from 'react'

import { OUT_OF_FOCUS } from '@/hooks/use-reading-focus'
import { cn } from '@/lib/utils'

/*
 * Vertical rail from SITE_LAYOUT (Sobre): a line at --rail with a dot on each
 * section title. Every section draws the segment from its own dot down to the
 * next dot, so the line ends exactly on the last one (Contato).
 *
 *   --pl   content left padding (titles align with the hero portrait)
 *   --rail x of the line centre, measured from the same left edge
 *   --hh   fixed height of a title row (dot is centred in it)
 *   --gap  vertical space between sections
 */
const vars = {
  '--pl': 'max(3rem, 8vw)',
  '--rail': 'max(1.25rem, 5.6vw)',
  '--hh': 'clamp(3rem, 4.6vw, 5rem)',
  '--gap': 'clamp(4rem, 8vw, 8rem)',
} as CSSProperties

export function Timeline({ children, ref }: { children: ReactNode; ref?: Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} style={vars} className="flex flex-col gap-(--gap) pt-[clamp(2rem,4vw,4rem)] pr-4 pb-16 pl-(--pl) sm:pr-[8vw]">
      {children}
    </div>
  )
}

interface TimelineSectionProps {
  id: string
  title: string
  last?: boolean
  // Out of the reading focus (see useReadingFocus); the rail itself stays solid.
  dimmed?: boolean
  children: ReactNode
  className?: string
}

export function TimelineSection({ id, title, last, dimmed, children, className }: TimelineSectionProps) {
  return (
    <section aria-labelledby={id} data-block={id} className={cn('relative', className)}>
      {!last && (
        <span
          aria-hidden="true"
          className="absolute top-[calc(var(--hh)/2)] bottom-[calc(-1*(var(--gap)+var(--hh)/2))] left-[calc(var(--rail)-var(--pl)-2px)] w-1 bg-brand"
        />
      )}
      <span
        aria-hidden="true"
        className="absolute top-[calc(var(--hh)/2)] left-[calc(var(--rail)-var(--pl))] size-[clamp(1.1rem,1.7vw,1.6rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand"
      />
      <div className={cn('transition-[opacity,filter] duration-500 ease-out', dimmed && OUT_OF_FOCUS)}>
        <h2 id={id} className="flex h-(--hh) items-center text-[clamp(2rem,3.6vw,3.75rem)] font-bold text-brand">
          {title}
        </h2>
        <div className="mt-4">{children}</div>
      </div>
    </section>
  )
}
