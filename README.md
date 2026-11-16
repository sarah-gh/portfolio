# Sara Ghotbzadeh — Portfolio

Personal portfolio built with **Nuxt 4**, **TypeScript** (strict), **Three.js** and **GSAP** (ScrollTrigger, SplitText, ScrambleText).

## Requirements

- Node.js **22.22.3+** (see `.nvmrc`)

## Commands

```bash
npm install        # install dependencies (also runs `nuxt prepare`)
npm run dev        # dev server at http://localhost:3000
npm run build      # production build (SSR)
npm run generate   # static build for static hosting
npm run lint       # ESLint (with stylistic rules)
npm run typecheck  # vue-tsc type check
```

## Project structure

```
portfolio/
├── app/                      # Vue application (Nuxt 4 srcDir)
│   ├── assets/css/           # global styles + design tokens (tokens.css)
│   ├── components/           # auto-imported by file name (no folder prefix)
│   │   ├── layout/           # AppHeader, AppFooter
│   │   ├── ui/               # generic, reusable building blocks (Base*)
│   │   ├── home/             # home sections: Hero, Intro, Skills, Experience, Education, Work, Contact
│   │   ├── project/          # project-specific components
│   │   └── three/            # CodeScene: full-screen WebGL background (use inside <ClientOnly>)
│   ├── composables/          # useProjects, usePageSeo, useGsap (scoped GSAP + auto cleanup)
│   ├── constants/            # site info, navigation, profile (resume content), scene config
│   ├── layouts/              # default.vue, immersive.vue (full-bleed, floating header)
│   ├── plugins/              # gsap.client.ts registers GSAP plugins
│   ├── pages/                # file-based routes
│   ├── utils/                # pure helper functions (auto-imported)
│   ├── app.config.ts         # reactive UI settings
│   ├── app.vue               # root component
│   └── error.vue             # 404 / error page
├── server/                   # Nitro server
│   ├── api/projects/         # GET /api/projects, GET /api/projects/:slug
│   └── data/                 # data source (swap for CMS / DB later)
├── shared/types/             # types shared by app and server (#shared/...)
├── public/models/glyphs.glb  # 3D code glyphs, exported by design/export-glyphs.py
├── design/                   # Blender sources and export scripts
├── nuxt.config.ts
└── eslint.config.mjs
```

## Conventions

- **Data flow:** `server/data` → `server/api` → `composables` → `pages` → `components`.
  Pages never import data directly, so the data source can change without touching the UI.
- **Types** live in `shared/types` and are imported with `#shared/types/...`.
- **Components:** `ui/` components know nothing about the domain; feature folders (`home/`, `project/`) may.
- **Styles:** use the CSS variables in `tokens.css`; components use scoped styles with BEM-like class names.
- **Where to add more:** `app/middleware/` for route guards, `app/plugins/` for plugins, `server/utils/` for server helpers.

## Editing content

- Site name, email and social links: `app/constants/site.ts`
- Navigation: `app/constants/navigation.ts`
- Resume content (stats, skills, experience, education, languages): `app/constants/profile.ts`
- Projects (order = display order, `featured` = shown on the home page): `server/data/projects.ts`

## Animation & 3D

- **Hero:** SplitText letter reveal on the name, ScrambleText on the role, then a slow breathing wave.
- **Scene:** `app/components/three/CodeScene.vue` renders the glyphs and shapes. Objects always spin and float a little;
  a scrubbed timeline moves them between per-section layouts defined in `app/constants/scene.ts`
  (sections are matched by `data-scene="..."`). Scroll speed boosts the spin and hovering an object kicks it.
- **Sections** use `useGsap()`, which scopes selectors to the component and reverts everything on unmount.
- All motion respects `prefers-reduced-motion`.
- Regenerate the glyph model: `blender --background --python design/export-glyphs.py`
