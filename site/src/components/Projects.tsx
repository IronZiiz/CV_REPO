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

// Images from IMGS/, with the framing for a tall panel. CVNN and this portfolio have
// none: their open card is text only, and their sliver a plain surface.
const MEDIA: Record<string, { src: string; position: string } | undefined> = {
  dashboard: { src: dashboard, position: 'object-left-top' },
  api: { src: api, position: 'object-left-top' },
  // Portrait photo: keep the band with the faces.
  hackathon: { src: hackathon, position: 'object-[center_27%]' },
  finetuning: { src: finetuning, position: 'object-left-top' },
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

// Carousel order.
const ORDER = ['dashboard', 'api', 'hackathon', 'finetuning', 'cvnn', 'portfolio']

const outlineButton =
  'inline-flex items-center gap-2 rounded-full border border-brand px-4 py-1.5 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-on-brand'

// The open card: text on the left, the image on the right (on top on phones).
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

  const image = media && (
    <img
      src={media.src}
      alt=""
      draggable={false}
      className={cn('absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]', media.position)}
    />
  )
  const imageFrame = 'group relative block h-40 w-full shrink-0 overflow-hidden rounded-[clamp(14px,1.6vw,22px)] bg-background/60 md:h-auto md:w-[34%]'

  return (
    <div className="flex h-full flex-col gap-4 p-4 sm:p-6 md:flex-row md:gap-6 lg:p-7">
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="text-xl leading-tight font-bold text-brand lg:text-2xl">
          {project.title}{' '}
          {project.institution && <span className="font-normal">{project.institution}</span>}
        </h3>
        <p className="mt-1 text-base text-brand">{project.period}</p>

        <ul className="mt-3 flex flex-wrap gap-1.5">
          {project.chips.map((chip) => (
            <li key={chip} className="rounded-md border border-border bg-background/70 px-2 py-0.5 text-xs font-semibold text-muted-foreground sm:text-sm">
              {chip}
            </li>
          ))}
          {project.highlights.map((chip) => (
            <li key={chip} className="rounded-md border border-brand/50 bg-background px-2 py-0.5 text-xs font-bold text-brand sm:text-sm">
              {chip}
            </li>
          ))}
        </ul>

        <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground xl:text-base">
          <RichText text={project.description} />
        </p>

        {closedSource ? (
          <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
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
      </div>

      {/*
       * The image does what the card did before: a closed-source project opens its
       * gallery (same as "ver imagens ilustrativas"), the others open their link.
       */}
      {media &&
        (closedSource && gallery.length > 0 ? (
          <button
            type="button"
            onClick={() => setGalleryOpen(true)}
            aria-label={`${project.title} — ${t('projects.gallery')}`}
            className={cn(imageFrame, 'order-first cursor-pointer md:order-none')}
          >
            {image}
          </button>
        ) : primary ? (
          <a
            href={primary}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} — ${links.demo ? t('projects.demo') : t('projects.code')} ${t('projects.newTab')}`}
            className={cn(imageFrame, 'order-first md:order-none')}
          >
            {image}
          </a>
        ) : (
          <div className={cn(imageFrame, 'order-first md:order-none')}>{image}</div>
        ))}

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
