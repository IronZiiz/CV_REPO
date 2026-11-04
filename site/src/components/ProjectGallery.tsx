import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { useI18n } from '@/i18n/context'
import { cn } from '@/lib/utils'

// The demo screenshots, bundled by Vite and keyed by file name ("api-geral"),
// which is the `src` of each entry in the `projects.galleries` dictionaries, so
// the captions stay translatable. A relative glob: the `@` alias is not resolved
// inside import.meta.glob.
const IMAGES: Record<string, string> = Object.fromEntries(
  Object.entries(
    import.meta.glob<string>('../assets/img/demo/*.jpg', {
      eager: true,
      query: '?url',
      import: 'default',
    }),
  ).map(([path, url]) => [path.slice(path.lastIndexOf('/') + 1, -'.jpg'.length), url]),
)

export interface GalleryItem {
  src: string
  caption: string
}

/*
 * Carousel shown over the page when the visitor opens a project's illustrative
 * images: one screenshot at a time, with its caption, arrows, dots and keyboard
 * control (← → to move, Esc to close). Focus is trapped while it is open and
 * returns to the button that opened it.
 */
export function ProjectGallery({
  items,
  open,
  onClose,
  label,
}: {
  items: GalleryItem[]
  open: boolean
  onClose: () => void
  label: string
}) {
  const { t } = useI18n()
  const [index, setIndex] = useState(0)
  const dialogRef = useRef<HTMLDivElement>(null)

  const go = useCallback(
    (step: number) => setIndex((i) => (i + step + items.length) % items.length),
    [items.length],
  )

  // Keep the page from scrolling behind the overlay while it is open.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null
    dialogRef.current?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
      else if (event.key === 'ArrowRight') go(1)
      else if (event.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      opener?.focus?.()
    }
  }, [open, onClose, go])

  if (!open || items.length === 0) return null

  const current = items[index]
  const url = IMAGES[current.src]

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        // A fixed frame, so every project's carousel is the same size however
        // tall or wide its screenshots are (the dashboard's are landscape, the
        // API's are portrait crops of a long page).
        className="flex h-[85vh] max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-brand/40 bg-background outline-none"
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
          <p className="text-sm font-semibold text-muted-foreground">
            {t('projects.galleryCount')
              .replace('{current}', String(index + 1))
              .replace('{total}', String(items.length))}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('projects.galleryClose')}
            className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-brand"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* The screenshots are tall: the frame scrolls rather than shrinking them. */}
        <div className="min-h-0 flex-1 overflow-auto bg-surface">
          {url && <img src={url} alt={current.caption} className="w-full" />}
        </div>

        <div className="border-t border-border px-4 py-3">
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            {current.caption}
          </p>
          <p className="mt-1 text-xs text-muted-foreground/80">{t('projects.galleryNote')}</p>

          <div className="mt-3 flex items-center justify-between gap-3">
            <GalleryButton onClick={() => go(-1)} label={t('projects.galleryPrev')}>
              <ChevronLeft size={18} aria-hidden="true" />
            </GalleryButton>

            <ul className="flex flex-wrap items-center justify-center gap-1.5">
              {items.map((item, i) => (
                <li key={item.src}>
                  <button
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={item.caption}
                    aria-current={i === index}
                    className={cn(
                      'block size-2 cursor-pointer rounded-full transition-colors',
                      i === index ? 'bg-brand' : 'bg-border hover:bg-brand/50',
                    )}
                  />
                </li>
              ))}
            </ul>

            <GalleryButton onClick={() => go(1)} label={t('projects.galleryNext')}>
              <ChevronRight size={18} aria-hidden="true" />
            </GalleryButton>
          </div>
        </div>
      </div>
    </div>,
    // Rendered on <body>: inside the carousel's animated (transformed) cards a fixed
    // overlay would be positioned and clipped by the card, not by the viewport.
    document.body,
  )
}

function GalleryButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-brand text-brand transition-colors hover:bg-brand hover:text-on-brand"
    >
      {children}
    </button>
  )
}
