<script setup lang="ts">
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { INTRO_STATEMENT, STATS } from '~/constants/profile'

const root = useTemplateRef<HTMLElement>('root')

useGsap(root, ({ reduced }) => {
  if (reduced) return

  // Words light up one by one as the statement scrolls through the viewport.
  const statement = SplitText.create('.intro__statement', { type: 'words' })
  gsap.fromTo(statement.words, { opacity: 0.14 }, {
    opacity: 1,
    stagger: 0.1,
    ease: 'none',
    scrollTrigger: { trigger: '.intro__statement', start: 'top 82%', end: 'bottom 40%', scrub: 1.5 },
  })

  gsap.from('.stat', {
    y: 60,
    opacity: 0,
    rotateX: -25,
    duration: 1.2,
    stagger: 0.12,
    scrollTrigger: { trigger: '.intro__stats', start: 'top 85%' },
  })

  // Count numbers up from zero the first time they appear.
  gsap.utils.toArray<HTMLElement>('.stat__number').forEach((el) => {
    const target = Number(el.dataset.value)
    const counter = { value: 0 }
    gsap.to(counter, {
      value: target,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
      onUpdate: () => {
        el.textContent = String(Math.round(counter.value))
      },
    })
  })
})
</script>

<template>
  <section
    id="about"
    ref="root"
    class="intro"
    data-scene="intro"
  >
    <div class="container">
      <p class="eyebrow">
        About
      </p>
      <p
        class="intro__statement"
        data-lag="0.12"
      >
        {{ INTRO_STATEMENT }}
      </p>

      <ul class="intro__stats">
        <li
          v-for="stat in STATS"
          :key="stat.label"
          class="stat glass"
        >
          <p class="stat__value">
            <span v-if="stat.prefix">{{ stat.prefix }}</span>
            <span
              class="stat__number"
              :data-value="stat.value"
            >{{ stat.value }}</span>
            <span v-if="stat.suffix">{{ stat.suffix }}</span>
          </p>
          <p class="stat__label">
            {{ stat.label }}
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.intro {
  position: relative;
  z-index: 1;
  padding-block: var(--space-section);
}

.intro__statement {
  max-width: 62rem;
  margin: 0;
  font-size: clamp(1.7rem, 4.2vw, 3.4rem);
  font-weight: 500;
  line-height: 1.18;
  letter-spacing: -.03em;
}

.intro__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
  gap: 1rem;
  margin: clamp(4rem, 10vh, 7rem) 0 0;
  padding: 0;
  list-style: none;
  perspective: 900px;
}

.stat {
  padding: 1.6rem 1.5rem;
}

.stat__value {
  margin: 0;
  font-size: clamp(2.4rem, 5vw, 3.6rem);
  font-weight: 600;
  line-height: 1;
  letter-spacing: -.04em;
  background: var(--gradient-brand);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.stat__label {
  margin: .8rem 0 0;
  color: var(--color-text-muted);
  font-size: .95rem;
}
</style>
