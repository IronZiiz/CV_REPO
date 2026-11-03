# Portfolio — Thiago Zilli

Personal site (Portuguese and English) built with React, Vite, TypeScript and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve the production build
npm run lint
```

## Where things are

| What | Where |
|---|---|
| Page text (PT / EN) | `src/i18n/pt.json`, `src/i18n/en.json` — no text lives in components. `**word**` makes text bold. |
| Colours and theme | `src/index.css` (tokens at the top) |
| Animated background | `src/components/PlasmaBackground.tsx`, shader in `plasma-shader.ts` |
| Animation speed | `CYCLE_SECONDS` in `src/lib/motion.ts` (background and portrait line move together) |
| Project links | `LINKS` in `src/components/Projects.tsx` |
| Images | `src/assets/img/` |
| CV download | put the file at `public/THIAGO_ZILLI_CV.pdf` |

## Publish on GitHub Pages

1. Create a repository containing **only the contents of this folder** (`site/`).
2. On GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to the `main` branch. `.github/workflows/deploy.yml` builds and publishes the site.

The address is `https://<user>.github.io/<repository>/`, or `https://<user>.github.io/` if the
repository is named `<user>.github.io`. The workflow detects which one applies, so no configuration
is needed. Link previews (WhatsApp, LinkedIn) and the canonical link use that address automatically.

To build with a custom address locally:

```bash
VITE_BASE=/my-repo/ SITE_URL=https://user.github.io/my-repo/ npm run build
```
