import { ChevronLeft, ChevronRight, ExternalLink, Images, Lock } from 'lucide-react'
import { useRef, useState, type ReactNode } from 'react'

import api from '@/assets/img/api.jpg'
import dashboard from '@/assets/img/dashboard.jpg'
import finetuning from '@/assets/img/finetuning.jpg'
import hackathon from '@/assets/img/hackathon.jpg'
import { GithubIcon } from '@/components/brand-icons'
import { ProjectGallery, type GalleryItem } from '@/components/ProjectGallery'
import { RichText } from '@/components/RichText'
import { SocialLinks } from '@/components/SocialLinks'
import { GlowCard } from '@/components/ui/glow-card'
import { useI18n, type Dictionary } from '@/i18n/context'
import { PAGE_GRID } from '@/lib/layout'
import { cn } from '@/lib/utils'

type Project = Dictionary['projects']['items'][number]

interface Media {
  src: string
  // Framing inside the poster.
  fit: string
  // Wash over the image so the title stays readable; strongest where the text sits.
  wash?: string
}

const DEFAULT_WASH =
  'from-background/87 via-background/78 to-background/50 dark:from-background/85 dark:via-background/78 dark:to-background/60'

// Screenshots: slight zoom from the top-left crops their edges (e.g. a scrollbar).
const SCREENSHOT = 'origin-top-left scale-[1.04] object-left-top group-hover:scale-[1.09]'

// Images from IMGS/. CVNN has none: the layout shows a plain grey card.
const MEDIA: Record<string, Media | undefined> = {
  dashboard: { src: dashboard, fit: SCREENSHOT },
  api: { src: api, fit: SCREENSHOT },
  // Portrait photo in a wide poster: frame the band with the faces.
  // A photo with dark clothing: a stronger wash than the screenshots.
  hackathon: {
    src: hackathon,
    fit: 'object-[center_27%] group-hover:scale-[1.05]',
    wash: 'from-background/87 via-background/82 to-background/70',
  },
  finetuning: { src: finetuning, fit: SCREENSHOT },
}

// The two RCM projects: the source is closed, and the demo runs on fictitious data.
// DEMO_URL is pending: until it is filled in, the card shows the note without a button.
const DEMO_URL = ''
const CLOSED_SOURCE = ['dashboard', 'api']

// Dashboard and API links are still pending (DECISIONS.md).
const LINKS: Record<string, { demo?: string; code?: string }> = {
  hackathon: {
    demo: 'https://avaliacaoinstitucionalmath.streamlit.app',
    code: 'https://github.com/IronZiiz/Hackathon_mathmorphosis',
  },
  finetuning: { code: 'https://github.com/IronZiiz/Domain-specific_finetunning' },
  cvnn: { code: 'https://github.com/budzinskilab' },
  // This site: the repository holds both the app and the context-engineering docs.
  portfolio: { code: 'https://github.com/IronZiiz/CV_REPO' },
}

// Left-to-right order of the row.
const ORDER = ['dashboard', 'api', 'hackathon', 'finetuning', 'cvnn', 'portfolio']

// 1 card per view on phones (with a peek of the next), 2 from sm, 3 from lg. With the
// 32px gutter (gap-8), three cards line up with columns 1–4, 5–8 and 9–12.
const CARD_WIDTH = 'w-[85%] sm:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)]'

function Backdrop({ media }: { media: Media | undefined }) {
  if (media === undefined) return null
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <img
        src={media.src}
        alt=""
        loading="lazy"
        className={cn('h-full w-full object-cover transition-transform duration-500', media.fit)}
      />
      <div className={cn('absolute inset-0 bg-linear-to-r', media.wash ?? DEFAULT_WASH)} />
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const { t, dict } = useI18n()
  const [galleryOpen, setGalleryOpen] = useState(false)
  // The dictionary types the galleries per project id; only some projects have one.
  const galleries: Record<string, GalleryItem[] | undefined> = dict.projects.galleries
  const gallery = galleries[project.id] ?? []
  const links = LINKS[project.id] ?? {}
  const closedSource = CLOSED_SOURCE.includes(project.id)
  const primary = closedSource ? DEMO_URL || undefined : links.demo ?? links.code
  const media = MEDIA[project.id]

  const heading = (
    <>
      <h3 className="text-lg leading-tight font-bold text-brand xl:text-xl">
        {project.title}{' '}
        {project.institution && <span className="font-normal">{project.institution}</span>}
      </h3>
      <p className="mt-1 text-base text-brand">{project.period}</p>
    </>
  )

  return (
    <li data-project={project.id} className={cn('flex shrink-0 snap-start flex-col', CARD_WIDTH)}>
      {/* The poster: image, title and period, like a tile in a streaming row. */}
      <GlowCard
        backdrop={<Backdrop media={media} />}
        // Lighter grain over screenshots so the date stays readable.
        className="min-h-48 [&_.glass-noise]:opacity-[0.06]"
        contentClassName="h-full"
      >
        {/*
         * A closed-source project has nowhere to link to, so its card opens the
         * gallery — the same action as its "ver imagens ilustrativas" button.
         */}
        {closedSource && gallery.length > 0 ? (
          <button
            type="button"
            onClick={() => setGalleryOpen(true)}
            className="block h-full w-full cursor-pointer p-4 text-left sm:p-5"
            aria-label={`${project.title} — ${t('projects.gallery')}`}
          >
            {heading}
          </button>
        ) : primary ? (
          <a
            href={primary}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full p-4 sm:p-5"
            aria-label={`${project.title} — ${links.demo ? t('projects.demo') : t('projects.code')} ${t('projects.newTab')}`}
          >
            {heading}
          </a>
        ) : (
          <div className="p-4 sm:p-5">{heading}</div>
        )}
      </GlowCard>

      <ul className="mt-3 flex flex-wrap gap-2">
        {project.chips.map((chip) => (
          <li key={chip} className="rounded-md border border-border bg-surface px-2 py-0.5 text-sm font-semibold text-muted-foreground">
            {chip}
          </li>
        ))}
        {project.highlights.map((chip) => (
          <li key={chip} className="rounded-md border border-brand/50 bg-background px-2 py-0.5 text-sm font-bold text-brand">
            {chip}
          </li>
        ))}
      </ul>

      <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground xl:text-base">
        <RichText text={project.description} />
      </p>

      {/* mt-auto keeps the buttons on one line across the row, under the longest text. */}
      {closedSource ? (
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Lock size={15} aria-hidden="true" />
            {t('projects.copyright')}
          </p>
          {gallery.length > 0 && (
            <button
              type="button"
              onClick={() => setGalleryOpen(true)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-brand px-4 py-1.5 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-on-brand"
            >
              <Images size={16} aria-hidden="true" />
              {t('projects.gallery')}
            </button>
          )}
          {DEMO_URL && (
            <ProjectLink
              href={DEMO_URL}
              label={t('projects.demoFictitious')}
              newTab={t('projects.newTab')}
              icon={<ExternalLink size={16} aria-hidden="true" />}
            />
          )}
        </div>
      ) : (
        (links.demo || links.code) && (
          <div className="mt-auto flex flex-wrap gap-3 pt-4">
            {links.demo && (
              <ProjectLink href={links.demo} label={t('projects.demo')} newTab={t('projects.newTab')} icon={<ExternalLink size={16} aria-hidden="true" />} />
            )}
            {links.code && (
              <ProjectLink href={links.code} label={t('projects.code')} newTab={t('projects.newTab')} icon={<GithubIcon className="size-4" />} />
            )}
          </div>
        )
      )}

      <ProjectGallery
        // Remounted per opening, so the carousel always starts at the first image.
        key={galleryOpen ? 'open' : 'closed'}
        items={gallery}
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        label={`${project.title} — ${t('projects.gallery')}`}
      />
    </li>
  )
}

function ProjectLink({ href, label, newTab, icon }: { href: string; label: string; newTab: string; icon: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-brand px-4 py-1.5 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-on-brand"
    >
      {icon}
      {label}
      <span className="sr-only">{newTab}</span>
    </a>
  )
}

const arrow =
  'inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-brand text-brand transition-[background-color,color,opacity] hover:bg-brand hover:text-on-brand disabled:cursor-default disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-brand'

// One horizontal row of project cards on the page grid, scrolled by swipe or arrows.
export function Projects() {
  const { dict, t } = useI18n()
  const byId = Object.fromEntries(dict.projects.items.map((item) => [item.id, item]))
  const rowRef = useRef<HTMLUListElement>(null)
  // Six cards never fit in one view, so the row always starts with more to the right.
  const [edges, setEdges] = useState({ start: true, end: false })

  function updateEdges() {
    const row = rowRef.current
    if (!row) return
    setEdges({ start: row.scrollLeft <= 1, end: row.scrollLeft + row.clientWidth >= row.scrollWidth - 1 })
  }

  // One full view per click (plus the gutter), like paging a streaming row.
  function scrollRow(direction: 1 | -1) {
    const row = rowRef.current
    if (!row) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    row.scrollBy({ left: direction * (row.clientWidth + 32), behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <section aria-labelledby="projetos" className={cn(PAGE_GRID, 'gap-y-5 pt-[clamp(1.25rem,2.5vw,2.5rem)] pb-16')}>
      <div className="col-span-12 flex items-center justify-between gap-4">
        <h2 id="projetos" className="text-[clamp(1.75rem,2.8vw,3rem)] font-bold text-brand">
          {dict.projects.title}
        </h2>
        <div className="flex gap-2">
          <button type="button" onClick={() => scrollRow(-1)} disabled={edges.start} aria-label={t('projects.rowPrev')} className={arrow}>
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => scrollRow(1)} disabled={edges.end} aria-label={t('projects.rowNext')} className={arrow}>
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* py-2 leaves room for the cards' shadow, which the scroll box would clip. */}
      <ul
        ref={rowRef}
        onScroll={updateEdges}
        className="no-scrollbar col-span-12 flex snap-x snap-mandatory gap-8 overflow-x-auto py-2"
      >
        {ORDER.map((id) => (
          <ProjectCard key={id} project={byId[id]} />
        ))}
      </ul>

      <div className="col-span-12 mt-[clamp(3rem,6vw,6rem)]">
        <SocialLinks />
      </div>
    </section>
  )
}
