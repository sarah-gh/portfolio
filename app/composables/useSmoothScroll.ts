import { gsap } from 'gsap'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/** How far (in seconds) the content trails the real scroll position. Higher = softer. */
const SMOOTHNESS = 1.6

/**
 * Smooth, inertial scrolling with GSAP ScrollSmoother.
 * The native scrollbar still drives the page; the content follows it with a soft delay
 * and keeps gliding briefly after the user stops. Elements with `data-lag="0.2"` trail
 * a little further behind, and `data-speed="0.9"` gives parallax.
 *
 * Call once from a layout that renders `#smooth-wrapper > #smooth-content`.
 * Anything `position: fixed` must live outside the wrapper (or be teleported to body).
 */
export function useSmoothScroll() {
  const route = useRoute()
  const nuxtApp = useNuxtApp()
  let smoother: ScrollSmoother | undefined
  let effects: ScrollTrigger[] = []

  /** (Re)binds data-lag / data-speed on the current page. */
  function bindEffects() {
    if (!smoother) return
    effects.forEach(trigger => trigger.kill())
    effects = smoother.effects('[data-lag], [data-speed]') ?? []
  }

  /** Scroll to the route hash (e.g. /#work), or to the top on a new page. */
  function syncScroll() {
    if (!smoother) return
    const target = route.hash ? document.querySelector(route.hash) : null
    if (target) smoother.scrollTo(target, true, 'top top')
    else smoother.scrollTo(0, false)
  }

  onMounted(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

    smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: reduced ? 0 : SMOOTHNESS,
      smoothTouch: reduced ? 0 : 0.15,
      effects: false,
    })
    bindEffects()
    if (route.hash) requestAnimationFrame(syncScroll)
  })

  // After every page change inside this layout: new elements, new effects, new scroll position.
  const offFinish = nuxtApp.hook('page:finish', () => {
    nextTick(() => {
      bindEffects()
      syncScroll()
      ScrollTrigger.refresh()
    })
  })

  // Same-page hash links (e.g. "Explore my work" → /#work) scroll smoothly.
  watch(() => route.hash, (hash, previous) => {
    if (hash && hash !== previous) syncScroll()
  })

  onBeforeUnmount(() => {
    offFinish()
    effects.forEach(trigger => trigger.kill())
    smoother?.kill()
    smoother = undefined
  })
}
