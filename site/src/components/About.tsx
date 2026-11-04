import type { ReactNode } from 'react'

import alura from '@/assets/img/alura.jpg'
import lethbridge from '@/assets/img/lethbridge.png'
import ufpr from '@/assets/img/ufpr.png'
import { BrazilFlag, UsaFlag } from '@/components/flag-icons'
import { RichText } from '@/components/RichText'
import { SocialLinks } from '@/components/SocialLinks'
import { GlowCard } from '@/components/ui/glow-card'
import { useI18n } from '@/i18n/context'
import { PAGE_GRID, type AboutPanel } from '@/lib/layout'
import { cn } from '@/lib/utils'

// Logos from IMGS/. University logos sit on a white tile (as in SITE_LAYOUT) so their
// dark lettering stays visible in dark mode; the Alura icon is already a round badge.
const EDUCATION_LOGOS: Record<string, { src: string; className: string }> = {
  ufpr: { src: ufpr, className: 'h-14 w-20 rounded-lg bg-white object-contain p-1.5 sm:h-16 sm:w-22' },
  lethbridge: { src: lethbridge, className: 'h-14 w-20 rounded-lg bg-white object-contain p-1.5 sm:h-16 sm:w-22' },
  alura: { src: alura, className: 'size-14 rounded-full object-cover sm:size-16' },
}

// Flags are drawn as SVG (flag-icons) so they render the same on every system.
const FLAGS: Record<string, ((props: { title: string }) => ReactNode) | undefined> = {
  pt: ({ title }) => <BrazilFlag title={title} />,
  en: ({ title }) => <UsaFlag title={title} />,
}

// Lists inside a panel reuse the page columns (subgrid), so cards keep the 32px gutter.
const subgrid = 'col-span-12 grid grid-cols-subgrid gap-y-6'

interface AboutProps {
  panel: AboutPanel
  // Slide direction after a switch in the header (data-enter in index.css).
  enter?: 'from-left' | 'from-right'
}

// One Sobre section at a time, picked in the header, so it fits above the fold.
export function About({ panel, enter }: AboutProps) {
  const { dict } = useI18n()
  const { whoAmI, stack, education, languages, contact } = dict.about
  const titles: Record<AboutPanel, string> = {
    whoAmI: whoAmI.title,
    stack: stack.title,
    education: education.title,
    languages: languages.title,
    contact: contact.title,
  }

  return (
    <section
      aria-labelledby={`panel-${panel}`}
      data-enter={enter}
      className={cn(PAGE_GRID, 'content-start gap-y-5 pt-[clamp(1.25rem,2.5vw,2.5rem)] pb-8')}
    >
      <h2 id={`panel-${panel}`} className="col-span-12 text-[clamp(1.75rem,2.8vw,3rem)] font-bold text-brand">
        {titles[panel]}
      </h2>

      {/* Three paragraphs, one per 4-column block on wide screens. */}
      {panel === 'whoAmI' &&
        whoAmI.paragraphs.map((paragraph) => (
          <p
            key={paragraph.slice(0, 24)}
            className="col-span-12 text-[0.95rem] leading-[1.6] text-muted-foreground lg:col-span-4 xl:text-base"
          >
            <RichText text={paragraph} />
          </p>
        ))}

      {panel === 'stack' && (
        <ul className={subgrid}>
          {stack.groups.map((group) => (
            <li key={group.title} className="col-span-12 sm:col-span-6 xl:col-span-3">
              <GlowCard className="h-full p-5">
                <h3 className="text-lg font-bold text-brand">{group.title}</h3>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="chip-outline rounded-md border border-border bg-background/70 px-2 py-0.5 text-sm font-medium text-muted-foreground transition-colors hover:text-brand"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </GlowCard>
            </li>
          ))}
        </ul>
      )}

      {panel === 'education' && (
        <ul className={subgrid}>
          {education.items.map((item) => {
            const logo = EDUCATION_LOGOS[item.id]
            return (
              <li key={item.id} className="col-span-12 md:col-span-4">
                <GlowCard className="h-full p-4" contentClassName="flex items-center gap-3 sm:gap-4">
                  <img src={logo.src} alt={item.logoAlt} className={cn('shrink-0', logo.className)} />
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold wrap-break-word text-brand">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.institution}
                      {item.location && (
                        <>
                          <br />
                          {item.location}
                        </>
                      )}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.period}</p>
                  </div>
                </GlowCard>
              </li>
            )
          })}
        </ul>
      )}

      {/* Two cards, centred: columns 3–6 and 7–10. */}
      {panel === 'languages' && (
        <ul className={subgrid}>
          {languages.items.map((item, index) => (
            <li key={item.id} className={cn('col-span-12 sm:col-span-6 lg:col-span-4', index === 0 && 'lg:col-start-3')}>
              <GlowCard className="h-full p-4" contentClassName="flex items-center gap-3 sm:gap-4">
                {FLAGS[item.id]?.({ title: item.name })}
                <div className="min-w-0">
                  <h3 className="text-lg font-bold wrap-break-word text-brand sm:text-xl">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.level}</p>
                </div>
              </GlowCard>
            </li>
          ))}
        </ul>
      )}

      {panel === 'contact' && (
        <>
          <p className="col-span-12 text-center text-[clamp(1.05rem,1.45vw,1.5rem)] leading-relaxed text-muted-foreground lg:col-span-8 lg:col-start-3">
            <RichText text={contact.text} />
          </p>
          <div className="col-span-12 mt-6">
            <SocialLinks />
          </div>
        </>
      )}
    </section>
  )
}
