import { projects } from '../data/projects'

const STATIC_PATHS = ['/', '/projects', '/about', '/contact']

/** GET /sitemap.xml, built from the static pages and every project. */
export default defineEventHandler((event) => {
  const base = (useRuntimeConfig(event).public.siteUrl || getRequestURL(event).origin).replace(/\/$/, '')
  const paths = [...STATIC_PATHS, ...projects.map(project => `/projects/${project.slug}`)]
  const urls = paths
    .map(path => `  <url><loc>${base}${path}</loc><priority>${path === '/' ? '1.0' : '0.7'}</priority></url>`)
    .join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
})
