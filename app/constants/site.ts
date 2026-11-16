import type { SocialLink } from '#shared/types/site'

export const SITE = {
  name: 'Sara Ghotbzadeh',
  givenName: 'Sara',
  familyName: 'Ghotbzadeh',
  role: 'Front-End Developer',
  location: 'Tokyo, Japan',
  email: 'sara.ghotbzadeh@gmail.com',
  description: 'Front-End Developer building fast, maintainable web apps with Vue, Nuxt and TypeScript.',
  /** Home page <title>: the name comes first, because that is what people search for. */
  homeTitle: 'Sara Ghotbzadeh — Front-End Developer in Tokyo',
  /** Home page meta description, written to read well as a Google snippet. */
  homeDescription: 'Sara Ghotbzadeh is a Front-End Developer in Tokyo, Japan, with 5+ years of building Vue, Nuxt, Three.js and GSAP web apps: 3D configurators, map-based platforms and animation-rich interfaces.',
  /** Default social share image (1200×630), served from /public. */
  ogImage: '/og-image.jpg',
} as const

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/sarah-gh' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sara-ghotbzadeh' },
]
