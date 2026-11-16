import { gsap } from 'gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

/** Registers GSAP plugins once, on the client only. */
export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, ScrambleTextPlugin)
  gsap.defaults({ ease: 'power3.out' })

  // Recalculate trigger positions after every route change.
  const router = useRouter()
  router.afterEach(() => nextTick(() => ScrollTrigger.refresh()))
})
