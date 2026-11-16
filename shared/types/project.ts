/** A portfolio project. Shared by the server API and the Vue app. */
export interface Project {
  slug: string
  title: string
  summary: string
  /** Longer write-up shown on the project detail page. */
  description: string
  /** Key contributions, shown as a list on the detail page. */
  highlights?: string[]
  role: string
  company?: string
  /** Free-form period, e.g. "2023 – 2026". */
  period?: string
  year?: number
  cover?: string
  tags: string[]
  featured: boolean
  links?: ProjectLinks
}

export interface ProjectLinks {
  live?: string
  repo?: string
}

/** Lightweight shape used in lists and cards. */
export type ProjectPreview = Pick<Project, 'slug' | 'title' | 'summary' | 'year' | 'period' | 'company' | 'tags' | 'cover'>
