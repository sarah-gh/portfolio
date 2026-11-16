<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MARQUEE_SKILLS, SKILL_GROUPS } from '~/constants/profile'

const root = useTemplateRef<HTMLElement>('root')

useGsap(root, ({ reduced }) => {
  gsap.from('.skills__heading > *', {
    y: 50,
    opacity: 0,
    duration: 1.1,
    stagger: 0.12,
    scrollTrigger: { trigger: '.skills__heading', start: 'top 82%' },
  })

  ScrollTrigger.batch('.skill-card', {
    start: 'top 88%',
    once: true,
    onEnter: cards => gsap.from(cards, { y: 70, opacity: 0, rotateX: -18, duration: 1.1, stagger: 0.1, overwrite: true }),
  })
  gsap.utils.toArray<HTMLElement>('.skill-card').forEach((card) => {
    gsap.from(card.querySelectorAll('.skill-chip'), {
      scale: 0.6,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(2)',
      stagger: 0.04,
      scrollTrigger: { trigger: card, start: 'top 82%' },
    })
  })

  if (reduced) return

  // Marquees never stop; scrolling makes them rush, then they ease back to cruising speed.
  const rows = gsap.utils.toArray<HTMLElement>('.marquee__track').map((track, i) => {
    const forward = i % 2 === 1
    return gsap.fromTo(track, { xPercent: forward ? -50 : 0 }, { xPercent: forward ? 0 : -50, duration: 38, ease: 'none', repeat: -1 })
  })
  ScrollTrigger.create({
    trigger: root.value,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 250, 6)
      gsap.timeline({ defaults: { overwrite: true } })
        .to(rows, { timeScale: boost, duration: 0.2 })
        .to(rows, { timeScale: 1, duration: 1.4, ease: 'power2.out' })
    },
  })
})
</script>

<template>
  <section
    id="skills"
    ref="root"
    class="skills"
    data-scene="skills"
  >
    <div
      class="container skills__heading"
      data-lag="0.15"
    >
      <p class="eyebrow">
        Skills
      </p>
      <h2 class="section-title">
        My <em>toolkit</em>
      </h2>
    </div>

    <div
      class="marquee"
      aria-hidden="true"
    >
      <div
        v-for="(row, index) in MARQUEE_SKILLS"
        :key="index"
        class="marquee__row"
      >
        <div class="marquee__track">
          <span
            v-for="(skill, i) in [...row, ...row]"
            :key="i"
            class="marquee__item"
          >{{ skill }}</span>
        </div>
      </div>
    </div>

    <div class="container">
      <ul class="skills__grid">
        <li
          v-for="group in SKILL_GROUPS"
          :key="group.title"
          class="skill-card glass"
        >
          <h3>{{ group.title }}</h3>
          <ul class="skill-card__chips">
            <li
              v-for="skill in group.skills"
              :key="skill"
              class="skill-chip"
            >
              {{ skill }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.skills {
  position: relative;
  z-index: 1;
  padding-block: var(--space-section);
}

.marquee {
  display: grid;
  gap: .8rem;
  margin-block: clamp(3rem, 8vh, 5rem);
  overflow: hidden;
  transform: rotate(-2deg);
}

.marquee__row {
  overflow: hidden;
}

.marquee__track {
  display: flex;
  width: max-content;
  gap: 2.5rem;
  padding-right: 2.5rem;
}

.marquee__item {
  font-size: clamp(2rem, 6vw, 4.8rem);
  font-weight: 600;
  letter-spacing: -.04em;
  white-space: nowrap;
  color: transparent;
  -webkit-text-stroke: 1px rgb(196 165 255 / 55%);
}

.marquee__row:nth-child(2) .marquee__item {
  -webkit-text-stroke: 0;
  color: rgb(245 243 255 / 85%);
}

.marquee__item::after {
  content: "✦";
  margin-left: 2.5rem;
  font-size: .5em;
  vertical-align: middle;
  -webkit-text-stroke: 0;
  color: var(--color-pink);
}

.skills__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 19rem), 1fr));
  gap: 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
  perspective: 1000px;
}

.skill-card {
  padding: 1.5rem;
  transition: border-color .4s, transform .4s var(--ease-out);
}

.skill-card:hover {
  border-color: rgb(196 165 255 / 45%);
  transform: translateY(-4px);
}

.skill-card h3 {
  margin: 0 0 1rem;
  font-family: var(--font-mono);
  font-size: .8rem;
  font-weight: 500;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.skill-card__chips {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.skill-chip {
  padding: .3rem .75rem;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 999px;
  background: rgb(255 255 255 / 4%);
  font-size: .88rem;
}
</style>
