import type { Project, ProjectPreview } from '#shared/types/project'

/** All projects, or only featured ones. */
export function useProjects(options: { featured?: boolean } = {}) {
  return useFetch<ProjectPreview[]>('/api/projects', {
    key: options.featured ? 'projects-featured' : 'projects-all',
    query: options.featured ? { featured: 'true' } : undefined,
    default: () => [],
  })
}

/** A single project by slug. */
export function useProject(slug: MaybeRefOrGetter<string>) {
  return useFetch<Project>(() => `/api/projects/${toValue(slug)}`, {
    key: `project-${toValue(slug)}`,
  })
}
