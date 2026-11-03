import { PortraitFrame } from '@/components/PortraitFrame'
import { SectionSwitch, type Section } from '@/components/ui/section-switch'
import { useI18n } from '@/i18n/context'

interface HeroProps {
  section: Section
  onSectionChange: (section: Section) => void
}

export function Hero({ section, onSectionChange }: HeroProps) {
  const { t } = useI18n()

  return (
    <section className="px-4 pt-8 sm:px-[8vw] sm:pt-12">
      <div className="flex items-center gap-[clamp(0.75rem,2vw,2rem)]">
        <PortraitFrame alt={t('hero.portraitAlt')} />

        <h1 className="text-[clamp(1.75rem,4.6vw,5rem)] leading-tight text-brand">
          {t('hero.name')} <span className="font-bold">{t('hero.role')}</span>
        </h1>
      </div>

      <SectionSwitch
        value={section}
        onChange={onSectionChange}
        labels={{ about: t('nav.about'), projects: t('nav.projects') }}
        ariaLabel={t('nav.label')}
        className="mt-6 flex justify-center"
      />
    </section>
  )
}
