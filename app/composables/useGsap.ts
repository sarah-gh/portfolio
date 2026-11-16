import { gsap } from 'gsap'

export interface GsapSetupContext {
  /** True when the user asked the OS for reduced motion. */
  reduced: boolean
}

/**
 * Runs GSAP code scoped to a component root after mount and reverts everything
 * (tweens, ScrollTriggers, SplitText, matchMedia) when the component unmounts.
 * Selector strings inside `setup` only match elements inside `scope`.
 */
export function useGsap(
  scope: Readonly<Ref<HTMLElement | null | undefined>>,
  /** May return a cleanup function, which runs on unmount. */
  setup: (context: GsapSetupContext) => unknown,
) {
  let context: gsap.Context | undefined

  onMounted(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    context = gsap.context(() => {
      const cleanup = setup({ reduced })
      return typeof cleanup === 'function' ? cleanup : undefined
    }, scope.value ?? undefined)
  })

  onBeforeUnmount(() => context?.revert())
}
