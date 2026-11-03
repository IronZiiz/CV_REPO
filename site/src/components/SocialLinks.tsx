import { GithubIcon, InstagramIcon, LinkedinIcon, OrcidIcon } from '@/components/brand-icons'
import { useI18n } from '@/i18n/context'

const LINKS = [
  { key: 'instagram', href: 'https://www.instagram.com/physics_zilli', svg: <InstagramIcon /> },
  { key: 'linkedin', href: 'https://www.linkedin.com/in/thiago-zilli-44881120a', svg: <LinkedinIcon /> },
  { key: 'orcid', href: 'https://orcid.org/0009-0003-0503-1359', svg: <OrcidIcon /> },
  { key: 'github', href: 'https://github.com/IronZiiz', svg: <GithubIcon /> },
] as const

// Contact block shared by Sobre (Contato) and the bottom of Projetos.
export function SocialLinks() {
  const { t } = useI18n()
  const email = t('social.email')

  return (
    <nav aria-label={t('social.label')} className="flex flex-col items-center gap-3">
      <ul className="flex items-center gap-4 sm:gap-5">
        {LINKS.map(({ key, href, svg }) => (
          <li key={key}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t(`social.${key}`)}
              title={t(`social.${key}`)}
              className="block size-11 text-brand transition-transform duration-200 hover:scale-110 sm:size-12"
            >
              {svg}
            </a>
          </li>
        ))}
      </ul>
      <a
        href={`mailto:${email}`}
        className="text-lg font-medium text-brand underline-offset-4 hover:underline sm:text-xl"
      >
        {email}
      </a>
    </nav>
  )
}
