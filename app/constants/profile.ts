import type { Education, Experience, Language, SkillGroup, Stat } from '#shared/types/profile'

export const INTRO_STATEMENT
  = 'I turn complex product ideas into fast, maintainable Vue and Nuxt applications: 3D property configurators, map-based apps and animation-rich interfaces that people enjoy using.'

export const STATS: Stat[] = [
  { value: 5, suffix: '+', label: 'years building production Vue & Nuxt apps' },
  { value: 20, suffix: '+', label: 'client sites shipped on a white-label platform' },
  { value: 14, prefix: '2–', suffix: ' days', label: 'to launch a new client site, down from 1–2 months' },
  { value: 5, prefix: '~', label: 'banks using risk dashboards I built' },
]

export const SKILL_GROUPS: SkillGroup[] = [
  { title: 'Languages', skills: ['JavaScript (ES6+)', 'TypeScript', 'HTML5', 'CSS3 / SCSS'] },
  { title: 'Frameworks & State', skills: ['Vue 3', 'Nuxt', 'Pinia', 'TanStack Query', 'Vue Router', 'Vue 2 / Vuex', 'React (basic)'] },
  { title: 'Interactive & 3D', skills: ['Three.js / WebGL', 'GSAP ScrollTrigger', 'PixiJS', 'Mapbox GL JS', 'Threebox', 'Unity WebGL'] },
  { title: 'Performance & Testing', skills: ['Nuxt SSR', 'Stale-while-revalidate', 'Lazy loading', 'Virtual scrolling', 'Data-bound SVG', 'Vitest'] },
  { title: 'UI Libraries', skills: ['Tailwind CSS', 'shadcn-vue', 'Reka UI', 'Vuetify', 'Bootstrap'] },
  { title: 'APIs & Integrations', skills: ['REST APIs', 'Socket.IO', 'Stripe', 'Onfido', 'ECharts', 'Node.js / Express', 'PostgreSQL', 'Redis'] },
  { title: 'Tools & Workflow', skills: ['Vite', 'Docker', 'GitHub Actions', 'Git / GitHub', 'Jira', 'Cursor', 'Claude Code'] },
]

/** Shown in the always-moving marquee rows. */
export const MARQUEE_SKILLS: string[][] = [
  ['Vue 3', 'Nuxt', 'TypeScript', 'Three.js', 'GSAP', 'Pinia', 'Mapbox', 'PixiJS', 'Tailwind CSS'],
  ['WebGL', 'ScrollTrigger', 'TanStack Query', 'Socket.IO', 'Vitest', 'Node.js', 'SVG', 'Vite', 'Reka UI'],
]

export const EXPERIENCES: Experience[] = [
  {
    role: 'Freelance Front-End Developer',
    company: 'Independent',
    location: 'Remote · Tokyo',
    period: 'Mar 2026 – Present',
    highlights: [
      'Develop responsive landing pages and marketing websites as part of a small remote team.',
      'Use Claude Code for scaffolding, refactoring and debugging, while owning implementation decisions and reviewing AI-generated code.',
    ],
    stack: ['Nuxt', 'Vue 3', 'TypeScript', 'GSAP'],
  },
  {
    role: 'Front-End Developer',
    company: 'Qoo Studio',
    location: 'Remote',
    period: 'Aug 2023 – Feb 2026',
    context: 'Canadian real-estate sales-technology studio building white-label platforms for property developers.',
    highlights: [
      'Developed most of the buyer app of the white-label sales platform; reusable templates and per-client themes cut new site delivery from 1–2 months to 2–14 days across 20+ projects.',
      'Designed and built a rule-based home configurator (lot → model → elevation → options) that became the base for 3 later client sites.',
      'Turned a 24,000-line designer SVG into an interactive, data-driven 52-lot site plan.',
      'Built a multi-purchaser worksheet with Onfido ID verification, schema validation and Vitest tests.',
      'Cut floorplan images loaded on first visit by ~70% and added stale-while-revalidate caching.',
      'Built scroll-driven 3D marketing sites with Three.js and GSAP, and proposed team-wide peer code reviews.',
    ],
    stack: ['Vue 3', 'TypeScript', 'Pinia', 'TanStack Query', 'Mapbox', 'Three.js', 'GSAP'],
  },
  {
    role: 'Front-End Developer',
    company: 'Radepa',
    location: 'Part-time · Remote',
    period: 'Dec 2022 – Mar 2024',
    highlights: [
      'Migrated a mentorship marketplace from a Vue SPA to Nuxt SSR with page metadata and Open Graph tags, checked with Lighthouse and PageSpeed Insights.',
      'Developed most of the marketplace user panel, and built the user panel and landing pages of a job-matching platform in a team of three.',
    ],
    stack: ['Nuxt', 'Vue', 'Vuetify'],
  },
  {
    role: 'Front-End Developer',
    company: 'Part Software Group',
    location: 'Mashhad, Iran',
    period: 'Oct 2021 – Aug 2023',
    highlights: [
      'Built role-based IT and operational risk dashboards used by about 5 Iranian banks, with charts and map visualizations.',
      'Created a reusable dynamic form builder that generates data-entry forms from configuration.',
      'Built the Vue front end and a Node.js REST API (MVC, PostgreSQL, Redis) for a community platform.',
    ],
    stack: ['Vue', 'ECharts', 'Node.js', 'PostgreSQL', 'Redis'],
  },
]

export const EDUCATION: Education[] = [
  {
    degree: 'B.Sc. Computer Engineering',
    school: 'Sadjad University',
    location: 'Mashhad, Iran',
    period: '2019 – 2023',
  },
]

export const LANGUAGES: Language[] = [
  { name: 'Persian', level: 'Native', proficiency: 100 },
  { name: 'English', level: 'B2 · Professional working', proficiency: 72 },
  { name: 'Japanese', level: 'A1 · Basic', proficiency: 18 },
]
