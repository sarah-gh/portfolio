<script setup lang="ts">
import { gsap } from 'gsap'
import { EDUCATION, LANGUAGES } from '~/constants/profile'

const root = useTemplateRef<HTMLElement>('root')

useGsap(root, () => {
  gsap.from('.education__card', {
    y: 60,
    opacity: 0,
    duration: 1.1,
    stagger: 0.15,
    scrollTrigger: { trigger: '.education__grid', start: 'top 82%' },
  })
  gsap.from('.language__fill', {
    scaleX: 0,
    duration: 1.6,
    ease: 'expo.out',
    stagger: 0.15,
    scrollTrigger: { trigger: '.languages', start: 'top 85%' },
  })
})
</script>

<template>
  <section
    id="education"
    ref="root"
    class="education"
  >
    <div class="container">
      <p class="eyebrow">
        Education & Languages
      </p>
      <h2 class="section-title">
        Background
      </h2>

      <div class="education__grid">
        <article
          v-for="item in EDUCATION"
          :key="item.degree"
          class="education__card glass"
        >
          <span
            class="education__icon"
            aria-hidden="true"
          >🎓</span>
          <p class="education__period">
            {{ item.period }}
          </p>
          <h3>{{ item.degree }}</h3>
          <p class="education__school">
            {{ item.school }} · {{ item.location }}
          </p>
        </article>

        <article class="education__card glass">
          <h3>Languages</h3>
          <ul class="languages">
            <li
              v-for="language in LANGUAGES"
              :key="language.name"
              class="language"
            >
              <div class="language__label">
                <span>{{ language.name }}</span>
                <span>{{ language.level }}</span>
              </div>
              <div
                class="language__bar"
                role="presentation"
              >
                <span
                  class="language__fill"
                  :style="{ width: `${language.proficiency}%` }"
                />
              </div>
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.education {
  position: relative;
  z-index: 1;
  padding-block: var(--space-section);
}

.education__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
  gap: 1rem;
  margin-top: clamp(2.5rem, 6vh, 4rem);
}

.education__card {
  padding: clamp(1.5rem, 3vw, 2.2rem);
}

.education__card h3 {
  margin: .4rem 0 0;
  font-size: clamp(1.3rem, 2.5vw, 1.7rem);
  font-weight: 600;
  letter-spacing: -.02em;
}

.education__icon {
  font-size: 1.8rem;
}

.education__period {
  margin: 1rem 0 0;
  font-family: var(--font-mono);
  font-size: .8rem;
  color: var(--color-accent);
}

.education__school {
  margin: .4rem 0 0;
  color: var(--color-text-muted);
}

.languages {
  display: grid;
  gap: 1.2rem;
  margin: 1.4rem 0 0;
  padding: 0;
  list-style: none;
}

.language__label {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: .95rem;
}

.language__label span:last-child {
  color: var(--color-text-muted);
  font-size: .85rem;
}

.language__bar {
  height: 6px;
  margin-top: .5rem;
  overflow: hidden;
  border-radius: 999px;
  background: rgb(255 255 255 / 8%);
}

.language__fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--color-violet), var(--color-pink), var(--color-cyan));
  transform-origin: left;
}
</style>
