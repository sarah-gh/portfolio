import type { Project } from '#shared/types/project'
import { projects } from '../../data/projects'

/** GET /api/projects/:slug */
export default defineEventHandler((event): Project => {
  const slug = getRouterParam(event, 'slug')
  const project = projects.find(item => item.slug === slug)

  if (!project) {
    throw createError({ statusCode: 404, statusMessage: 'Project not found' })
  }

  return project
})
