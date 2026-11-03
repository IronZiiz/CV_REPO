import { useId } from 'react'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

export type Section = 'about' | 'projects'

interface SectionSwitchProps {
  value: Section
  onChange: (value: Section) => void
  labels: Record<Section, string>
  ariaLabel: string
  className?: string
}

const EASE = 'duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]'

// Two-segment slide switch adapted from BUTTONS_STYLE (switch8): the thumb slides
// under the active label, and both labels stay visible as in SITE_LAYOUT.
export function SectionSwitch({ value, onChange, labels, ariaLabel, className }: SectionSwitchProps) {
  const id = useId()

  return (
    <div className={className}>
      <div className="relative inline-grid h-11 grid-cols-[1fr_1fr] items-center rounded-full border border-border bg-background p-1 font-ui text-sm font-semibold shadow-sm">
        <Switch
          id={id}
          checked={value === 'projects'}
          onCheckedChange={(checked) => onChange(checked ? 'projects' : 'about')}
          className={cn(
            'peer absolute inset-1 h-auto w-auto border-0 data-[state=checked]:bg-transparent data-[state=unchecked]:bg-transparent',
            '[&_span]:h-full [&_span]:w-1/2 [&_span]:bg-brand [&_span]:shadow-md [&_span]:transition-transform',
            '[&_span]:duration-500 [&_span]:ease-[cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full',
          )}
        />
        <span
          className={cn(
            'pointer-events-none relative min-w-24 px-5 text-center transition-colors text-on-brand',
            'peer-data-[state=checked]:text-muted-foreground',
            EASE,
          )}
        >
          {labels.about}
        </span>
        <span
          className={cn(
            'pointer-events-none relative min-w-24 px-5 text-center transition-colors text-muted-foreground',
            'peer-data-[state=checked]:text-on-brand',
            EASE,
          )}
        >
          {labels.projects}
        </span>
      </div>
      <Label className="sr-only" htmlFor={id}>
        {ariaLabel}
      </Label>
    </div>
  )
}
