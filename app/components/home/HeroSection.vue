<script setup lang="ts">
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { SITE } from '~/constants/site'

const hero = useTemplateRef<HTMLElement>('hero')
const [firstName, ...rest] = SITE.name.split(' ')
const lastName = rest.join(' ')

useGsap(hero, ({ reduced }) => {
  gsap.set('[data-intro]', { visibility: 'visible' })
  if (reduced) return

  const name = SplitText.create('.hero__line', { type: 'chars', charsClass: 'hero__char', aria: 'none' })
  const lead = SplitText.create('.hero__lead', { type: 'words', mask: 'words' })

  // Slow, soft reveal: each letter rises out of a blur and tips forward into place.
  const intro = gsap.timeline({ delay: 0.3 })
  intro
    .from('.hero__eyebrow', { opacity: 0, y: 16, duration: 1.2 })
    .from(name.chars, {
      opacity: 0,
      yPercent: 110,
      rotateX: -100,
      filter: 'blur(16px)',
      transformOrigin: '50% 100% -0.4em',
      duration: 2.2,
      ease: 'expo.out',
      stagger: { each: 0.065, from: 'start' },
    }, 0.25)
    .to('.hero__role-text', {
      duration: 1.8,
      scrambleText: { text: SITE.role, chars: '{}<>/#;01', revealDelay: 0.5, speed: 0.3 },
    }, 1.2)
    .from(lead.words, { yPercent: 100, opacity: 0, duration: 1.1, stagger: 0.035 }, 1.7)
    .from('.hero__actions > *', { y: 24, opacity: 0, duration: 1, stagger: 0.12 }, 2.1)
    .from('.hero__scroll', { opacity: 0, y: -10, duration: 1.2 }, 2.6)

  // After the intro the letters keep breathing in a gentle wave.
  gsap.to(name.chars, {
    y: -6,
    duration: 2.4,
    ease: 'sine.inOut',
    delay: 3,
    stagger: { each: 0.14, repeat: -1, yoyo: true },
  })

  // Letters lift and glow under the cursor.
  for (const char of name.chars) {
    char.addEventListener('pointerenter', () => {
      gsap.to(char, { scale: 1.12, color: '#c4a5ff', duration: 0.35, ease: 'back.out(3)', overwrite: 'auto' })
    })
    char.addEventListener('pointerleave', () => {
      gsap.to(char, { scale: 1, color: '', duration: 0.8, ease: 'power2.out', overwrite: 'auto' })
    })
  }

  // Scrolling away: the content drifts up, spreads and fades.
  gsap.to('.hero__content', {
    yPercent: -22,
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: hero.value, start: 'top top', end: 'bottom top', scrub: 1.8 },
  })
  gsap.to('.hero__line', {
    letterSpacing: '0.04em',
    ease: 'none',
    scrollTrigger: { trigger: hero.value, start: 'top top', end: 'bottom top', scrub: 1.8 },
  })
})
</script>

<template>
  <section
    ref="hero"
    class="hero"
    data-scene="hero"
  >
    <div
      class="hero__content"
      data-intro
    >
      <p class="hero__eyebrow">
        <span class="hero__status" />
        Open to new roles · {{ SITE.location }} · 東京
      </p>
      <h1
        class="hero__name"
        :aria-label="SITE.name"
      >
        <span class="hero__line">{{ firstName }}</span>
        <span class="hero__line hero__line--accent">{{ lastName }}</span>
      </h1>
      <p class="hero__role">
        <span class="hero__role-text">{{ SITE.role }}</span>
      </p>
      <p class="hero__lead">
        I build interactive web experiences with Vue, Nuxt, Three.js and GSAP, from 3D configurators to map-based sales platforms.
      </p>
      <div class="hero__actions">
        <BaseButton to="/#work">
          Explore my work
        </BaseButton>
        <BaseButton
          to="/#contact"
          variant="ghost"
        >
          Get in touch
        </BaseButton>
      </div>
    </div>
    <div
      class="hero__scroll"
      aria-hidden="true"
    >
      <span>Scroll</span>
      <i />
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  min-height: 100svh;
  padding: 7rem 1.25rem 5rem;
  text-align: center;
}

.hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: .6rem;
  margin: 0 0 1.5rem;
  padding: .4rem .9rem;
  border: 1px solid rgb(255 255 255 / 12%);
  border-radius: 999px;
  background: rgb(255 255 255 / 4%);
  backdrop-filter: blur(10px);
  font-family: var(--font-mono);
  font-size: .76rem;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.hero__status {
  width: .5rem;
  height: .5rem;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 0 0 rgb(74 222 128 / 60%);
  animation: pulse 2.4s infinite;
}

@keyframes pulse {
  70% { box-shadow: 0 0 0 .55rem rgb(74 222 128 / 0%); }
  100% { box-shadow: 0 0 0 0 rgb(74 222 128 / 0%); }
}

.hero__name {
  margin: 0;
  font-size: clamp(3.6rem, 13vw, 11rem);
  font-weight: 600;
  line-height: .92;
  letter-spacing: -.055em;
}

.hero__line {
  display: block;
  perspective: 700px;
}

.hero__line--accent {
  font-family: var(--font-display);
  font-weight: 400;
  font-style: italic;
  letter-spacing: -.02em;
  color: var(--color-accent);
  text-shadow: 0 0 60px rgb(196 165 255 / 35%);
}

.hero__line :deep(.hero__char) {
  display: inline-block;
  will-change: transform;
}

.hero__role {
  margin: 1.4rem 0 0;
  font-family: var(--font-mono);
  font-size: clamp(1rem, 2.4vw, 1.35rem);
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--color-text);
}

.hero__role::before,
.hero__role::after {
  color: var(--color-pink);
}

.hero__role::before {
  content: "<";
  margin-right: .4em;
}

.hero__role::after {
  content: "/>";
  margin-left: .4em;
}

.hero__lead {
  max-width: 38rem;
  margin: 1.4rem auto 2.2rem;
  font-size: clamp(1rem, 1.8vw, 1.2rem);
  color: var(--color-text-muted);
}

.hero__actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: .9rem;
}

.hero__scroll {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  display: grid;
  justify-items: center;
  gap: .6rem;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-size: .7rem;
  letter-spacing: .3em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.hero__scroll i {
  position: relative;
  width: 1px;
  height: 3.5rem;
  overflow: hidden;
  background: rgb(255 255 255 / 15%);
}

.hero__scroll i::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(transparent, var(--color-accent));
  animation: scroll-cue 2.2s cubic-bezier(.65, 0, .35, 1) infinite;
}

@keyframes scroll-cue {
  from { transform: translateY(-100%); }
  to { transform: translateY(100%); }
}

@media (max-width: 560px) {
  .hero__eyebrow {
    font-size: .64rem;
    letter-spacing: .06em;
  }

  .hero__name {
    font-size: 16vw;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__status,
  .hero__scroll i::after {
    animation: none;
  }
}
</style>
