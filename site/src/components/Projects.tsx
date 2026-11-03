import { ExternalLink, Images, Lock } from 'lucide-react'
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
import { OUT_OF_FOCUS, useReadingFocus } from '@/hooks/use-reading-focus'
import { useI18n, type Dictionary } from '@/i18n/context'
import { cn } from '@/lib/utils'

type Project = Dictionary['projects']['items'][number]

interface Media {
  src: string
  // Framing inside the wide header.
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
  // Portrait photo in a wide header: frame the band with the faces.
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
  // This site: the repository link is pending (DECISIONS.md).
  portfolio: {},
}

// SITE_LAYOUT (Projetos): left column, then a right column that starts lower.
const LEFT = ['dashboard', 'hackathon', 'cvnn']
const RIGHT = ['api', 'finetuning', 'portfolio']
// Single-column (mobile) reading order follows the zigzag.
const MOBILE_ORDER: Record<string, string> = {
  dashboard: 'max-md:order-1',
  api: 'max-md:order-2',
  hackathon: 'max-md:order-3',
  finetuning: 'max-md:order-4',
  cvnn: 'max-md:order-5',
  portfolio: 'max-md:order-6',
}

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

function ProjectCard({ project, dimmed }: { project: Project; dimmed: boolean }) {
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
      <h3 className="text-[clamp(1.15rem,1.7vw,1.75rem)] leading-tight font-bold text-brand">
        {project.title}{' '}
        {project.institution && <span className="font-normal">{project.institution}</span>}
      </h3>
      <p className="mt-1 text-[clamp(1rem,1.4vw,1.5rem)] text-brand">{project.period}</p>
    </>
  )

  return (
    <article
      data-project={project.id}
      className={cn(
        MOBILE_ORDER[project.id],
        'transition-[opacity,filter] duration-500 ease-out',
        dimmed && OUT_OF_FOCUS,
      )}
    >
      <GlowCard
        backdrop={<Backdrop media={media} />}
        // Lighter grain over screenshots so the date stays readable.
        className="min-h-[clamp(9rem,12vw,13rem)] [&_.glass-noise]:opacity-[0.06]"
        contentClassName="h-full"
      >
        {primary ? (
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
          <li key={chip} className="rounded-md border border-border bg-surface px-2 py-0.5 text-sm font-semibold text-muted-foreground sm:text-base">
            {chip}
          </li>
        ))}
        {project.highlights.map((chip) => (
          <li key={chip} className="rounded-md border border-brand/50 bg-background px-2 py-0.5 text-sm font-bold text-brand sm:text-base">
            {chip}
          </li>
        ))}
      </ul>

      <p className="mt-4 text-[clamp(1rem,1.35vw,1.45rem)] leading-relaxed text-muted-foreground md:text-justify">
        <RichText text={project.description} />
      </p>

      {closedSource ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground sm:text-base">
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
          <div className="mt-4 flex flex-wrap gap-3">
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
    </article>
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

export function Projects() {
  const { dict } = useI18n()
  const byId = Object.fromEntries(dict.projects.items.map((item) => [item.id, item]))
  const gridRef = useRef<HTMLDivElement>(null)
  const inFocus = useReadingFocus(gridRef, 'project')

  const column = (ids: string[], className?: string) => (
    <div className={cn('contents md:flex md:flex-col md:gap-[clamp(9rem,18vw,18rem)]', className)}>
      {ids.map((id) => (
        <ProjectCard key={id} project={byId[id]} dimmed={inFocus !== null && inFocus !== id} />
      ))}
    </div>
  )

  return (
    <section aria-labelledby="projetos" className="px-4 pt-[clamp(2rem,4vw,4rem)] pb-16 sm:px-[5.5vw]">
      <h2 id="projetos" className="sr-only">
        {dict.projects.title}
      </h2>
      <div className="relative">
        <span aria-hidden="true" className="absolute top-0 bottom-0 left-1 w-1 bg-brand md:left-1/2 md:-translate-x-1/2" />
        <div ref={gridRef} className="flex flex-col gap-28 pl-8 md:grid md:grid-cols-2 md:gap-x-[5vw] md:pl-0">
          {column(LEFT)}
          {column(RIGHT, 'md:pt-[clamp(18rem,34vw,36rem)]')}
        </div>
      </div>
      <div className="mt-[clamp(4rem,8vw,8rem)]">
        <SocialLinks />
      </div>
    </section>
  )
}
