import fs from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// Public base path. '/' for local dev and for a user site (<user>.github.io);
// the deploy workflow sets /<repo>/ for a project site.
const base = process.env.VITE_BASE ?? '/'
// Absolute address of the published site (with trailing slash). Social previews
// and the canonical link need absolute URLs, so they only appear when it is set.
const siteUrl = process.env.SITE_URL

const SOCIAL_PROFILES = [
  'https://www.linkedin.com/in/thiago-zilli-44881120a',
  'https://github.com/IronZiiz',
  'https://orcid.org/0009-0003-0503-1359',
  'https://www.instagram.com/physics_zilli',
]

// Writes title, description, social-preview and structured-data tags into
// index.html at build time, reading the text from src/i18n/pt.json so the
// copy lives in one place. (The page also updates them in the browser when the
// language changes; this is for crawlers and link previews, which don't run JS.)
function seoTags(): Plugin {
  const pt = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, 'src/i18n/pt.json'), 'utf8'))
  const { title, description } = pt.meta as { title: string; description: string }
  const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
  const image = `${siteUrl ?? base}og-image.jpg`

  const tags = [
    `<meta name="description" content="${escape(description)}" />`,
    `<meta name="theme-color" content="#278c67" />`,
    ...(siteUrl ? [`<link rel="canonical" href="${siteUrl}" />`] : []),
    `<link rel="apple-touch-icon" href="${base}apple-touch-icon.png" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escape(title)}" />`,
    `<meta property="og:description" content="${escape(description)}" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:locale:alternate" content="en_US" />`,
    ...(siteUrl ? [`<meta property="og:url" content="${siteUrl}" />`] : []),
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escape(title)}" />`,
    `<meta name="twitter:description" content="${escape(description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Thiago Zilli',
      jobTitle: 'Físico e Cientista de Dados',
      ...(siteUrl ? { url: siteUrl } : {}),
      sameAs: SOCIAL_PROFILES,
    })}</script>`,
  ]

  return {
    name: 'seo-tags',
    transformIndexHtml(html) {
      return html
        .replace('<meta name="description" content="" />', '')
        .replace(/<title>.*?<\/title>/, `<title>${escape(title)}</title>`)
        .replace('</head>', `    ${tags.join('\n    ')}\n  </head>`)
    },
  }
}

// Starts downloading the Montserrat files used above the fold before the CSS is
// parsed, so the web font is usually ready at first paint (less layout shift).
function preloadFonts(): Plugin {
  return {
    name: 'preload-fonts',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const files = Object.keys(ctx.bundle ?? {}).filter((file) => /montserrat-latin-(400|700)-normal-.*\.woff2$/.test(file))
        return {
          html,
          tags: files.map((file) => ({
            tag: 'link',
            attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `${base}${file}`, crossorigin: '' },
            injectTo: 'head' as const,
          })),
        }
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), seoTags(), preloadFonts()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
