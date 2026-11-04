import { useEffect, useState } from 'react'

import { About } from '@/components/About'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { PlasmaBackground } from '@/components/PlasmaBackground'
import { Projects } from '@/components/Projects'
import type { Section } from '@/components/ui/section-switch'
import { useI18n } from '@/i18n/context'
import { ABOUT_PANELS, type AboutPanel } from '@/lib/layout'

// The sheet that covers the screen on the first paint and fades away (.page-reveal
// in index.css). It drops out of the DOM once the animation ends, so it never sits
// over the page; visitors who prefer reduced motion get no sheet at all.
function PageReveal() {
  const [done, setDone] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  if (done) return null
  return <div aria-hidden="true" className="page-reveal" onAnimationEnd={() => setDone(true)} />
}

type Enter = 'from-left' | 'from-right'

export default function App() {
  const { t } = useI18n()
  const [section, setSection] = useState<Section>('about')
  // Only animate after a real switch, not on first load.
  const [switched, setSwitched] = useState(false)
  // The Sobre section shown below the hero, chosen in the header.
  const [panel, setPanel] = useState<AboutPanel>('whoAmI')
  const [panelEnter, setPanelEnter] = useState<Enter>()

  // Drives the --brand colour swap (green in Sobre, blue in Projetos) in index.css.
  useEffect(() => {
    document.documentElement.dataset.section = section
  }, [section])

  function changeSection(next: Section) {
    setSwitched(true)
    // The whole <main> slides in; the panel inside must not slide a second time.
    setPanelEnter(undefined)
    setSection(next)
  }

  // Slides towards the link's side: a link to the right enters from the right.
  function changePanel(next: AboutPanel) {
    // From Projetos (where only Contato is linked), go back to Sobre on that panel.
    if (section !== 'about') {
      changeSection('about')
      setPanel(next)
      return
    }
    if (next === panel) return
    setPanelEnter(ABOUT_PANELS.indexOf(next) > ABOUT_PANELS.indexOf(panel) ? 'from-right' : 'from-left')
    setPanel(next)
  }

  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip">
      <PageReveal />
      <PlasmaBackground />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:z-50 focus:-translate-x-1/2 focus:rounded-full focus:bg-brand focus:px-5 focus:py-2 focus:text-sm focus:font-semibold focus:text-on-brand"
      >
        {t('a11y.skipToContent')}
      </a>
      <Header inAbout={section === 'about'} panel={panel} onPanelChange={changePanel} />
      <Hero section={section} onSectionChange={changeSection} />
      {/* Remounting on `section` replays the slide-in in the switch's direction. */}
      <main
        id="main"
        tabIndex={-1}
        key={section}
        className="flex-1 outline-none"
        data-enter={switched ? (section === 'projects' ? 'from-right' : 'from-left') : undefined}
      >
        {section === 'about' ? <About key={panel} panel={panel} enter={panelEnter} /> : <Projects />}
      </main>
    </div>
  )
}
