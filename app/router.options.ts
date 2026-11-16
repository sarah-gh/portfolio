import type { RouterConfig } from '@nuxt/schema'
import { ScrollSmoother } from 'gsap/ScrollSmoother'

/**
 * When ScrollSmoother is active, useSmoothScroll() handles scroll position after navigation,
 * so the router must not jump the page itself. Otherwise keep normal browser behaviour.
 */
export default {
  scrollBehavior(to, _from, savedPosition) {
    if (import.meta.client && ScrollSmoother.get()) return false
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, top: 0 }
    return { top: 0 }
  },
} satisfies RouterConfig
