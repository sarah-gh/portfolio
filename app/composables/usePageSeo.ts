import { SITE } from '~/constants/site'

interface PageSeoOptions {
  title: string
  description?: string
  /** Use `title` as the full <title>, without the " · Sara Ghotbzadeh" suffix. */
  absoluteTitle?: boolean
  /** Share image path under /public. */
  image?: string
  type?: 'website' | 'profile' | 'article'
}

/** Absolute URL for a path, based on the configured site URL (empty in local dev). */
export function useAbsoluteUrl() {
  const base = String(useRuntimeConfig().public.siteUrl ?? '').replace(/\/$/, '')
  return (path: string) => (base ? `${base}${path}` : path)
}

/** Sets title, description, canonical link and Open Graph / Twitter tags for a page. */
export function usePageSeo({ title, description = SITE.description, absoluteTitle = false, image = SITE.ogImage, type = 'website' }: PageSeoOptions) {
  const route = useRoute()
  const absolute = useAbsoluteUrl()
  const fullTitle = absoluteTitle ? title : `${title} · ${SITE.name}`
  const path = route.path === '/' ? '/' : route.path.replace(/\/$/, '')
  const url = absolute(path)

  useSeoMeta({
    title: fullTitle,
    titleTemplate: '%s',
    description,
    ogTitle: fullTitle,
    ogDescription: description,
    ogType: type,
    ogUrl: url,
    ogSiteName: SITE.name,
    ogLocale: 'en_US',
    ogImage: absolute(image),
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: `${SITE.name}, ${SITE.role}`,
    twitterCard: 'summary_large_image',
    twitterTitle: fullTitle,
    twitterDescription: description,
    twitterImage: absolute(image),
    robots: 'index, follow, max-image-preview:large',
  })

  useHead({ link: [{ rel: 'canonical', href: url }] })
}
