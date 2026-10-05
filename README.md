# Edzel's Portfolio

Personal portfolio site, live at **https://xenutheflock.github.io/**.

Built with React 19, TypeScript, Vite, Tailwind CSS v4, and Motion.

## Run locally

```bash
npm install
npm run dev      # dev server at http://localhost:5173
npm run build    # type-check and build to dist/
npm run preview  # serve the built site
npm run lint
```

## Editing content

Most changes only touch the data files:

| File | What it holds |
| --- | --- |
| `src/data/profile.ts` | Name, role, email, social links |
| `src/data/projects.ts` | Project list (title, description, tags, link, image) |
| `src/data/stack.ts` | Tech stack shown in the Skills section |
| `src/data/sections.ts` | Section order, used for the `01/05` numbering |

Images live in `public/`:

- `public/projects/` holds project screenshots, named as in `projects.ts`. A 2:1 size such as 1900 x 950 works best. If a file is missing, the project title is shown instead.
- `public/head.webp` is the hero drawing. Dark mode inverts it with CSS, so only one file is needed.
- `public/og-image.png` is the 1200 x 630 preview shown when the link is shared.

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes `dist/` to GitHub Pages.

This needs **Settings → Pages → Source** set to **GitHub Actions**.
