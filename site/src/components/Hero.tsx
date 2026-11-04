import { PortraitFrame } from '@/components/PortraitFrame'
import { SectionSwitch, type Section } from '@/components/ui/section-switch'
import { useI18n } from '@/i18n/context'
import { PAGE_GRID } from '@/lib/layout'
import { cn } from '@/lib/utils'

interface HeroProps {
  section: Section
  onSectionChange: (section: Section) => void
}

// Portrait and name on 8 columns, the Sobre/Projetos switch on the last 4 (stacked
// on small screens): one row keeps the panel below it above the fold.
export function Hero({ section, onSectionChange }: HeroProps) {
  const { t } = useI18n()

  return (
    <section className={cn(PAGE_GRID, 'items-center gap-y-6 pt-[clamp(1.25rem,2.5vw,2.5rem)]')}>
      <div className="col-span-12 flex items-center gap-[clamp(0.75rem,2vw,2rem)] lg:col-span-8">
        <PortraitFrame alt={t('hero.portraitAlt')} />

        <h1 className="text-[clamp(1.75rem,3.8vw,4rem)] leading-tight text-brand">
          {t('hero.name')} <span className="font-bold">{t('hero.role')}</span>
        </h1>
      </div>

      <SectionSwitch
        value={section}
        onChange={onSectionChange}
        labels={{ about: t('nav.about'), projects: t('nav.projects') }}
        ariaLabel={t('nav.label')}
        className="col-span-12 flex justify-center lg:col-span-4 lg:justify-end"
      />
    </section>
  )
}
