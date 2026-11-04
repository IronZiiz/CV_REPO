import { Download, Globe, Moon, Sun } from 'lucide-react'
import type { ComponentProps } from 'react'

import { useTheme } from '@/hooks/use-theme'
import { useI18n } from '@/i18n/context'
import { cn } from '@/lib/utils'

// BASE_URL keeps the link working when the site is served from a sub-path (GitHub Pages).
const CV_FILES = {
  pt: `${import.meta.env.BASE_URL}Curriculo_Thiago_Zilli_PT.pdf`,
  en: `${import.meta.env.BASE_URL}Resume_Thiago_Zilli_EN.pdf`,
}

const circle =
  'inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-brand text-on-brand shadow-sm transition-[transform,background-color,color] duration-200 hover:scale-105 active:scale-95 sm:size-12'

function CircleButton({ className, ...props }: ComponentProps<'button'>) {
  return <button type="button" className={cn(circle, 'cursor-pointer', className)} {...props} />
}

export function Header() {
  const { lang, setLang, t } = useI18n()
  const { theme, toggleTheme } = useTheme()
  const themeLabel = theme === 'dark' ? t('header.lightMode') : t('header.darkMode')

  return (
    <header className="flex items-center justify-between gap-3 px-4 pt-4 sm:px-8 sm:pt-6">
      <CircleButton
        onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
        aria-label={t('header.switchLanguage')}
        title={t('header.switchLanguage')}
      >
        <Globe aria-hidden="true" size={20} />
      </CircleButton>

      <div className="flex items-center gap-2 sm:gap-3">
        <a
          href={CV_FILES[lang]}
          download
          aria-label={t('header.downloadCvLabel')}
          className="group flex items-center rounded-full"
        >
          {/*
           * The "Baixar CV" pill lives inside the round button and slides out to the
           * left on hover (and on keyboard focus): a clipping track whose width grows
           * from 0, with the pill itself sliding in from the right at the same time.
           * Shown without motion when the visitor prefers reduced motion.
           */}
          <span className="max-w-0 overflow-hidden transition-[max-width] duration-300 ease-out group-hover:max-w-[18rem] group-focus-visible:max-w-[18rem] motion-reduce:max-w-[18rem] motion-reduce:transition-none">
            <span className="mr-[-1.5rem] inline-flex h-11 translate-x-full items-center rounded-full bg-cv-pill pr-8 pl-5 text-base whitespace-nowrap text-white transition-transform duration-300 ease-out group-hover:translate-x-0 group-focus-visible:translate-x-0 motion-reduce:translate-x-0 motion-reduce:transition-none sm:h-12 sm:pr-10 sm:pl-8 sm:text-lg">
              {t('header.downloadCv')}
            </span>
          </span>
          <span className={cn(circle, 'relative group-hover:scale-105')}>
            <Download aria-hidden="true" size={20} />
          </span>
        </a>

        <CircleButton onClick={toggleTheme} aria-label={themeLabel} title={themeLabel}>
          {theme === 'dark' ? <Sun aria-hidden="true" size={20} /> : <Moon aria-hidden="true" size={20} />}
        </CircleButton>
      </div>
    </header>
  )
}
