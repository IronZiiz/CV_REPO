import { Check, Copy, Mail } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { LinkedinIcon } from '@/components/brand-icons'
import { useI18n } from '@/i18n/context'
import { LINKEDIN_URL } from '@/lib/contact'
import { cn } from '@/lib/utils'

const item =
  'flex w-full cursor-pointer items-center gap-3 rounded-[clamp(6px,0.7vw,11px)] px-3 py-2.5 text-left text-sm font-semibold text-foreground transition-colors hover:bg-brand/10 hover:text-brand focus-visible:bg-brand/10'

/*
 * Quick contact in the header: after the CV, getting in touch is what a visitor most
 * often came to do, so it is one click away instead of two or three (Contato panel,
 * then an icon). Copying the address is the fastest path; LinkedIn is the other one.
 */
export function ContactMenu({ buttonClassName }: { buttonClassName: string }) {
  const { t } = useI18n()
  const email = t('social.email')
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Closes on a click outside or on Esc (which hands focus back to the button).
  useEffect(() => {
    if (!open) return
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      setOpen(false)
      buttonRef.current?.focus()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  // "Copiado!" for two seconds, then back to the normal label.
  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
    } catch {
      // Clipboard blocked (insecure context, permissions): fall back to the mail app.
      window.location.href = `mailto:${email}`
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="contact-menu"
        aria-label={t('header.contact')}
        title={t('header.contact')}
        className={cn(buttonClassName, 'cursor-pointer')}
      >
        <Mail aria-hidden="true" size={20} />
      </button>

      {open && (
        <div
          id="contact-menu"
          className="absolute top-full right-0 z-50 mt-2 w-64 rounded-[clamp(10px,1vw,16px)] border border-border bg-background/95 p-1.5 shadow-lg backdrop-blur-md"
        >
          <button type="button" onClick={copyEmail} className={item}>
            {copied ? <Check size={18} aria-hidden="true" className="text-brand" /> : <Copy size={18} aria-hidden="true" />}
            <span className="min-w-0">
              <span className="block">{copied ? t('header.emailCopied') : t('header.copyEmail')}</span>
              <span className="block truncate text-xs font-normal text-muted-foreground">{email}</span>
            </span>
          </button>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className={item} onClick={() => setOpen(false)}>
            <LinkedinIcon className="size-[18px]" />
            <span>
              LinkedIn
              <span className="sr-only"> {t('projects.newTab')}</span>
            </span>
          </a>
          {/* Announced to screen readers when the address lands on the clipboard. */}
          <span role="status" className="sr-only">
            {copied ? t('header.emailCopied') : ''}
          </span>
        </div>
      )}
    </div>
  )
}
