<script setup lang="ts">
import { gsap } from 'gsap'

const root = useTemplateRef<HTMLElement>('root')
const { data: projects } = await useProjects({ featured: true })

const index = (i: number) => String(i + 1).padStart(2, '0')

useGsap(root, ({ reduced }) => {
  gsap.from('.work__heading > *', {
    y: 50,
    opacity: 0,
    duration: 1.1,
    stagger: 0.12,
    scrollTrigger: { trigger: '.work__heading', start: 'top 82%' },
  })

  const mm = gsap.matchMedia()

  // Desktop: pin the section and scroll the cards sideways.
  mm.add('(min-width: 960px)', () => {
    if (reduced) return
    const track = root.value!.querySelector<HTMLElement>('.work__track')!
    const distance = () => track.scrollWidth - window.innerWidth
    // Scroll distance is longer than the track, so the cards move slower than the wheel.
    const scrollLength = () => distance() * 1.6

    const horizontal = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: '.work__pin',
        start: 'top top',
        end: () => `+=${scrollLength()}`,
        pin: true,
        // Content is moved with transforms by ScrollSmoother, so the pin must be too.
        pinType: 'transform',
        scrub: 1.8,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    })

    gsap.utils.toArray<HTMLElement>('.work-card').forEach((card) => {
      gsap.from(card, {
        rotateY: -28,
        scale: 0.86,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: card, containerAnimation: horizontal, start: 'left 105%', end: 'left 50%', scrub: 1.2 },
      })
    })

    gsap.fromTo('.work__progress-bar', { scaleX: 0 }, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { trigger: '.work__pin', start: 'top top', end: () => `+=${scrollLength()}`, scrub: 1.8 },
    })
  })

  // Mobile: simple fade-up list.
  mm.add('(max-width: 959px)', () => {
    gsap.utils.toArray<HTMLElement>('.work-card').forEach((card) => {
      gsap.from(card, { y: 60, opacity: 0, duration: 1, scrollTrigger: { trigger: card, start: 'top 88%' } })
    })
  })

  return () => mm.revert()
})

/** Cards tilt slightly toward the cursor. */
function tilt(event: PointerEvent) {
  const card = event.currentTarget as HTMLElement
  const rect = card.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width - 0.5
  const y = (event.clientY - rect.top) / rect.height - 0.5
  card.style.setProperty('--tilt-x', `${(-y * 8).toFixed(2)}deg`)
  card.style.setProperty('--tilt-y', `${(x * 10).toFixed(2)}deg`)
  card.style.setProperty('--glow-x', `${(x + 0.5) * 100}%`)
  card.style.setProperty('--glow-y', `${(y + 0.5) * 100}%`)
}

function resetTilt(event: PointerEvent) {
  const card = event.currentTarget as HTMLElement
  card.style.setProperty('--tilt-x', '0deg')
  card.style.setProperty('--tilt-y', '0deg')
}
</script>

<template>
  <section
    id="work"
    ref="root"
    class="work"
    data-scene="work"
  >
    <div class="work__pin">
      <div class="container work__heading">
        <p class="eyebrow">
          Selected work
        </p>
        <h2 class="section-title">
          Things I've <em>built</em>
        </h2>
      </div>

      <ol class="work__track">
        <li
          v-for="(project, i) in projects"
          :key="project.slug"
          class="work__item"
        >
          <NuxtLink
            :to="`/projects/${project.slug}`"
            class="work-card"
            @pointermove="tilt"
            @pointerleave="resetTilt"
          >
            <span class="work-card__index">{{ index(i) }}</span>
            <p class="work-card__meta">
              {{ project.company ?? 'Personal' }}<template v-if="project.period">
                · {{ project.period }}
              </template>
            </p>
            <h3 class="work-card__title">
              {{ project.title }}
            </h3>
            <p class="work-card__summary">
              {{ project.summary }}
            </p>
            <ul class="work-card__tags">
              <li
                v-for="tag in project.tags"
                :key="tag"
              >
                <BaseTag>{{ tag }}</BaseTag>
              </li>
            </ul>
            <span class="work-card__cta">View project <span aria-hidden="true">→</span></span>
          </NuxtLink>
        </li>
        <li class="work__item work__item--more">
          <NuxtLink
            to="/projects"
            class="work-more"
          >
            <span>All projects</span>
            <span
              class="work-more__arrow"
              aria-hidden="true"
            >↗</span>
          </NuxtLink>
        </li>
      </ol>

      <div
        class="container work__progress"
        aria-hidden="true"
      >
        <span class="work__progress-bar" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.work {
  position: relative;
  z-index: 1;
}

.work__pin {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100svh;
  padding-block: clamp(5rem, 10vh, 7rem) 3rem;
  overflow: hidden;
}

.work__track {
  display: flex;
  gap: 1.5rem;
  width: max-content;
  margin: clamp(2rem, 5vh, 3.5rem) 0 0;
  padding: 0 clamp(1rem, 4vw, 2.5rem);
  list-style: none;
  perspective: 1400px;
}

.work__item {
  display: flex;
}

.work-card {
  --tilt-x: 0deg;
  --tilt-y: 0deg;
  position: relative;
  display: flex;
  flex-direction: column;
  width: min(30rem, 78vw);
  min-height: 25rem;
  padding: 2rem;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: var(--radius-lg);
  background:
    radial-gradient(circle at var(--glow-x, 50%) var(--glow-y, 0%), rgb(196 165 255 / 18%), transparent 45%),
    linear-gradient(160deg, rgb(32 28 70 / 85%), rgb(14 14 32 / 85%));
  backdrop-filter: blur(14px);
  text-decoration: none;
  transform: rotateX(var(--tilt-x)) rotateY(var(--tilt-y));
  transition: transform .4s var(--ease-out), border-color .4s;
}

.work-card:hover {
  border-color: rgb(196 165 255 / 50%);
}

.work-card__index {
  position: absolute;
  top: 1rem;
  right: 1.4rem;
  font-family: var(--font-display);
  font-size: 5rem;
  font-style: italic;
  line-height: 1;
  color: rgb(255 255 255 / 7%);
}

.work-card__meta {
  margin: 0;
  font-family: var(--font-mono);
  font-size: .78rem;
  letter-spacing: .06em;
  color: var(--color-accent);
}

.work-card__title {
  margin: 1rem 0 0;
  font-size: clamp(1.5rem, 2.6vw, 2rem);
  font-weight: 600;
  line-height: 1.12;
  letter-spacing: -.03em;
}

.work-card__summary {
  margin: .9rem 0 0;
  color: var(--color-text-muted);
}

.work-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: .4rem;
  margin: auto 0 0;
  padding: 1.5rem 0 0;
  list-style: none;
}

.work-card__cta {
  margin-top: 1.4rem;
  font-weight: 600;
}

.work-card__cta span {
  display: inline-block;
  transition: transform .4s var(--ease-out);
}

.work-card:hover .work-card__cta span {
  transform: translateX(.35rem);
}

.work-more {
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 1rem;
  width: min(20rem, 78vw);
  border: 1px dashed rgb(255 255 255 / 20%);
  border-radius: var(--radius-lg);
  font-size: 1.4rem;
  font-weight: 600;
  text-decoration: none;
  transition: border-color .4s, background-color .4s;
}

.work-more:hover {
  border-color: var(--color-accent);
  background: rgb(196 165 255 / 6%);
}

.work-more__arrow {
  display: grid;
  place-items: center;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: var(--color-accent);
  color: var(--color-accent-contrast);
  transition: transform .5s var(--ease-out);
}

.work-more:hover .work-more__arrow {
  transform: rotate(45deg);
}

.work__progress {
  margin-top: 2.5rem;
}

.work__progress::before {
  content: "";
  display: block;
  height: 1px;
  background: rgb(255 255 255 / 10%);
}

.work__progress-bar {
  display: block;
  height: 2px;
  margin-top: -1.5px;
  background: var(--gradient-brand);
  transform-origin: left;
  transform: scaleX(0);
}

@media (max-width: 959px) {
  .work__pin {
    min-height: 0;
    padding-block: var(--space-section);
  }

  .work__track {
    flex-direction: column;
    width: auto;
  }

  .work-card,
  .work-more {
    width: 100%;
  }

  .work-more {
    padding: 2.5rem;
  }

  .work__progress {
    display: none;
  }
}
</style>
