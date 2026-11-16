import type { ProjectPreview } from '#shared/types/project'
import { projects } from '../../data/projects'

/** GET /api/projects?featured=true. Keeps the curated order from the data file. */
export default defineEventHandler((event): ProjectPreview[] => {
  const { featured } = getQuery(event)

  return projects
    .filter(project => featured !== 'true' || project.featured)
    .map(({ slug, title, summary, year, period, company, tags, cover }) => ({ slug, title, summary, year, period, company, tags, cover }))
})
