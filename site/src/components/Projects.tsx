import { ExternalLink, Images, Lock } from 'lucide-react'
import { useState, type ReactNode } from 'react'

import api from '@/assets/img/api.jpg'
import dashboard from '@/assets/img/dashboard.jpg'
import finetuning from '@/assets/img/finetuning.jpg'
import hackathon from '@/assets/img/hackathon.jpg'
import { GithubIcon } from '@/components/brand-icons'
import { ProjectGallery, type GalleryItem } from '@/components/ProjectGallery'
import { RichText } from '@/components/RichText'
import { SocialLinks } from '@/components/SocialLinks'
import { ConnectedCarousel } from '@/components/ui/connected-carousel'
import { useI18n, type Dictionary } from '@/i18n/context'
import { PAGE_GRID } from '@/lib/layout'
import { cn } from '@/lib/utils'

type Project = Dictionary['projects']['items'][number]

// Images from IMGS/, shown behind the open card and on its sliver. CVNN and this
// portfolio have none: their card is a plain surface.
const COVER = 'inset-0 size-full object-cover'

// The two wide screenshots at 70% of the height a cover would give them (30% less
// zoom), centred along the top edge.
const ZOOMED_OUT = 'top-0 left-1/2 h-[70%] w-auto max-w-none -translate-x-1/2'

const MEDIA: Record<string, { src: string; fit: string } | undefined> = {
  dashboard: { src: dashboard, fit: ZOOMED_OUT },
  api: { src: api, fit: ZOOMED_OUT },
  // Portrait photo: keep the band with the faces.
  hackathon: { src: hackathon, fit: `${COVER} object-[center_27%]` },
  finetuning: { src: finetuning, fit: `${COVER} object-top` },
}

// Background fade: the image shows at the top and dissolves before the text gets dense.
const FADE = 'linear-gradient(to bottom, black 0%, rgb(0 0 0 / 0.55) 30%, transparent 70%)'

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

// Carousel order.
const ORDER = ['dashboard', 'api', 'hackathon', 'finetuning', 'cvnn', 'portfolio']

const outlineButton =
  'inline-flex items-center gap-2 rounded-full border border-brand px-4 py-1.5 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-on-brand'

// The open card: the project's image as a fading background, the text over it.
function ProjectContent({ project }: { project: Project }) {
  const { t, dict } = useI18n()
  const [galleryOpen, setGalleryOpen] = useState(false)
  // The dictionary types the galleries per project id; only some projects have one.
  const galleries: Record<string, GalleryItem[] | undefined> = dict.projects.galleries
  const gallery = galleries[project.id] ?? []
  const links = LINKS[project.id] ?? {}
  const closedSource = CLOSED_SOURCE.includes(project.id)
  const primary = closedSource ? DEMO_URL || undefined : links.demo ?? links.code
  const media = MEDIA[project.id]

  const title = (
    <>
      {project.title}{' '}
      {project.institution && <span className="font-normal">{project.institution}</span>}
    </>
  )
  const titleAction = 'text-left underline-offset-4 hover:underline'

  return (
    <div className="relative flex h-full flex-col p-4 sm:p-5">
      {media && (
        <img
          src={media.src}
          alt=""
          aria-hidden="true"
          draggable={false}
          className={cn('pointer-events-none absolute opacity-35 dark:opacity-30', media.fit)}
          style={{ maskImage: FADE, WebkitMaskImage: FADE }}
        />
      )}

      <div className="relative flex min-w-0 flex-1 flex-col">
        {/*
         * The title does what the whole card did before: a closed-source project opens
         * its gallery (same as "ver imagens ilustrativas"), the others open their link.
         */}
        <h3 className="text-lg leading-tight font-bold text-brand">
          {closedSource && gallery.length > 0 ? (
            <button type="button" onClick={() => setGalleryOpen(true)} className={cn(titleAction, 'cursor-pointer')}>
              {title}
            </button>
          ) : primary ? (
            <a href={primary} target="_blank" rel="noopener noreferrer" className={titleAction}>
              {title}
              <span className="sr-only"> {t('projects.newTab')}</span>
            </a>
          ) : (
            title
          )}
        </h3>
        <p className="mt-0.5 text-sm text-brand">{project.period}</p>

        <ul className="mt-2.5 flex flex-wrap gap-1">
          {project.chips.map((chip) => (
            <li key={chip} className="rounded-md border border-border bg-background/70 px-1.5 py-0.5 text-xs font-semibold text-muted-foreground">
              {chip}
            </li>
          ))}
          {project.highlights.map((chip) => (
            <li key={chip} className="rounded-md border border-brand/50 bg-background px-1.5 py-0.5 text-xs font-bold text-brand">
              {chip}
            </li>
          ))}
        </ul>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          <RichText text={project.description} />
        </p>

        {closedSource ? (
          <div className="mt-auto flex flex-wrap items-center gap-2.5 pt-3">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Lock size={15} aria-hidden="true" />
              {t('projects.copyright')}
            </p>
            {gallery.length > 0 && (
              <button type="button" onClick={() => setGalleryOpen(true)} className={cn(outlineButton, 'cursor-pointer')}>
                <Images size={16} aria-hidden="true" />
                {t('projects.gallery')}
              </button>
            )}
            {DEMO_URL && (
              <ProjectLink href={DEMO_URL} label={t('projects.demoFictitious')} newTab={t('projects.newTab')} icon={<ExternalLink size={16} aria-hidden="true" />} />
            )}
          </div>
        ) : (
          (links.demo || links.code) && (
            <div className="mt-auto flex flex-wrap gap-2.5 pt-3">
              {links.demo && (
                <ProjectLink href={links.demo} label={t('projects.demo')} newTab={t('projects.newTab')} icon={<ExternalLink size={16} aria-hidden="true" />} />
              )}
              {links.code && (
                <ProjectLink href={links.code} label={t('projects.code')} newTab={t('projects.newTab')} icon={<GithubIcon className="size-4" />} />
              )}
            </div>
          )
        )}
      </div>

      <ProjectGallery
        // Remounted per opening, so the carousel always starts at the first image.
        key={galleryOpen ? 'open' : 'closed'}
        items={gallery}
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        label={`${project.title} — ${t('projects.gallery')}`}
      />
    </div>
  )
}

function ProjectLink({ href, label, newTab, icon }: { href: string; label: string; newTab: string; icon: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={outlineButton}>
      {icon}
      {label}
      <span className="sr-only">{newTab}</span>
    </a>
  )
}

// The projects as a connected carousel on the page grid.
export function Projects() {
  const { dict, t } = useI18n()
  const byId = Object.fromEntries(dict.projects.items.map((item) => [item.id, item]))
  const items = ORDER.map((id) => ({ id, label: byId[id].title, image: MEDIA[id]?.src, project: byId[id] }))

  return (
    <section aria-labelledby="projetos" className={cn(PAGE_GRID, 'gap-y-5 pt-[clamp(1.25rem,2.5vw,2.5rem)] pb-16')}>
      <h2 id="projetos" className="col-span-12 text-[clamp(1.75rem,2.8vw,3rem)] font-bold text-brand">
        {dict.projects.title}
      </h2>

      <ConnectedCarousel
        items={items}
        renderContent={(item) => <ProjectContent project={item.project} />}
        label={dict.projects.title}
        prevLabel={t('projects.rowPrev')}
        nextLabel={t('projects.rowNext')}
        className="col-span-12"
      />

      <div className="col-span-12 mt-[clamp(3rem,6vw,6rem)]">
        <SocialLinks />
      </div>
    </section>
  )
}
