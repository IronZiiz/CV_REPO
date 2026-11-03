import { useRef } from 'react'

import alura from '@/assets/img/alura.jpg'
import lethbridge from '@/assets/img/lethbridge.png'
import ufpr from '@/assets/img/ufpr.png'
import { RichText } from '@/components/RichText'
import { SocialLinks } from '@/components/SocialLinks'
import { Timeline, TimelineSection } from '@/components/Timeline'
import { GlowCard } from '@/components/ui/glow-card'
import { useReadingFocus } from '@/hooks/use-reading-focus'
import { useI18n } from '@/i18n/context'
import { cn } from '@/lib/utils'

// Logos from IMGS/. University logos sit on a white tile (as in SITE_LAYOUT) so their
// dark lettering stays visible in dark mode; the Alura icon is already a round badge.
const EDUCATION_LOGOS: Record<string, { src: string; className: string }> = {
  ufpr: { src: ufpr, className: 'h-14 w-20 rounded-lg bg-white object-contain p-1.5 sm:h-18 sm:w-26' },
  lethbridge: { src: lethbridge, className: 'h-14 w-20 rounded-lg bg-white object-contain p-1.5 sm:h-18 sm:w-26' },
  alura: { src: alura, className: 'size-14 rounded-full object-cover sm:size-18' },
}

// Timeline padding is symmetric from sm up, so mx-auto centres the cards on the page.
const cardsColumn = 'md:mx-auto md:max-w-[min(100%,60rem)]'

export function About() {
  const { dict } = useI18n()
  const { whoAmI, stack, education, contact } = dict.about
  const timelineRef = useRef<HTMLDivElement>(null)
  // Same reading focus as Projetos: sections out of focus fade back.
  const inFocus = useReadingFocus(timelineRef, 'block')
  const dimmed = (id: string) => inFocus !== null && inFocus !== id

  return (
    <Timeline ref={timelineRef}>
      <TimelineSection id="quem-sou-eu" title={whoAmI.title} dimmed={dimmed('quem-sou-eu')}>
        {/* max-w keeps lines readable on ultra-wide screens (same width as at 1440 px). */}
        <div className="max-w-[76rem] space-y-6 text-[clamp(1.05rem,1.45vw,1.6rem)] leading-relaxed text-muted-foreground md:text-justify">
          {whoAmI.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>
              <RichText text={paragraph} />
            </p>
          ))}
        </div>
      </TimelineSection>

      <TimelineSection id="stack" title={stack.title} dimmed={dimmed('stack')}>
        <ul className={`grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2 ${cardsColumn}`}>
          {stack.groups.map((group) => (
            <li key={group.title}>
              <GlowCard className="h-full p-5">
                <h3 className="text-xl font-bold text-brand">{group.title}</h3>
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
      </TimelineSection>

      <TimelineSection id="formacao" title={education.title} dimmed={dimmed('formacao')}>
        <ul className={`grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2 ${cardsColumn}`}>
          {education.items.map((item, index) => {
            const logo = EDUCATION_LOGOS[item.id]
            const isLastOdd = index === education.items.length - 1 && index % 2 === 0
            return (
              <li
                key={item.id}
                className={isLastOdd ? 'md:col-span-2 md:mx-auto md:w-[calc(50%-0.5rem)]' : undefined}
              >
                <GlowCard className="h-full p-4" contentClassName="flex items-center gap-3 sm:gap-4">
                  <img src={logo.src} alt={item.logoAlt} className={cn('shrink-0', logo.className)} />
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold wrap-break-word text-brand sm:text-xl">{item.title}</h3>
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
      </TimelineSection>

      <TimelineSection id="contato" title={contact.title} dimmed={dimmed('contato')} last>
        <p className="mx-auto max-w-3xl text-center text-[clamp(1.05rem,1.45vw,1.6rem)] leading-relaxed text-muted-foreground">
          <RichText text={contact.text} />
        </p>
        <div className="mt-12">
          <SocialLinks />
        </div>
      </TimelineSection>
    </Timeline>
  )
}
