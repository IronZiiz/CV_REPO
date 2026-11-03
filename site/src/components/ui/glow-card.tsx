import type { ComponentProps, PointerEvent, ReactNode } from 'react'

import { cn } from '@/lib/utils'

// Card with the cursor-following light from CARDS CONTEXT (tech-stack), rebuilt
// with CSS variables instead of framer-motion and tinted with the brand colour.
// Glass finish with volume (.glass-card, .glass-noise in index.css).
interface GlowCardProps extends ComponentProps<'div'> {
  contentClassName?: string
  // Rendered under the light (e.g. a project's background image).
  backdrop?: ReactNode
}

export function GlowCard({ className, contentClassName, backdrop, children, onPointerMove, ...props }: GlowCardProps) {
  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--glow-x', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--glow-y', `${event.clientY - rect.top}px`)
    onPointerMove?.(event)
  }

  return (
    <div
      onPointerMove={handlePointerMove}
      className={cn(
        'glass-card group relative overflow-hidden rounded-xl border border-brand/60 hover:border-brand',
        className,
      )}
      {...props}
    >
      {backdrop}
      <div aria-hidden="true" className="glass-noise" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(180px_circle_at_var(--glow-x)_var(--glow-y),color-mix(in_oklab,var(--brand)_22%,transparent),transparent_70%)]"
      />
      <div className={cn('relative', contentClassName)}>{children}</div>
    </div>
  )
}
