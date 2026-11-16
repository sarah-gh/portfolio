<script setup lang="ts">
import { gsap } from 'gsap'
import { EXPERIENCES } from '~/constants/profile'

const root = useTemplateRef<HTMLElement>('root')

useGsap(root, ({ reduced }) => {
  gsap.from('.experience__heading > *', {
    y: 50,
    opacity: 0,
    duration: 1.1,
    stagger: 0.12,
    scrollTrigger: { trigger: '.experience__heading', start: 'top 82%' },
  })

  if (!reduced) {
    // The timeline line draws itself as you scroll through the jobs.
    gsap.fromTo('.timeline__progress', { scaleY: 0 }, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: '.timeline', start: 'top 65%', end: 'bottom 65%', scrub: 1.5 },
    })
  }

  gsap.utils.toArray<HTMLElement>('.job').forEach((job) => {
    gsap.timeline({ scrollTrigger: { trigger: job, start: 'top 78%', toggleClass: { targets: job, className: 'job--active' } } })
      .from(job.querySelector('.job__card'), { x: reduced ? 0 : 60, opacity: 0, duration: 1.1 })
      .from(job.querySelectorAll('.job__highlights li'), { y: 18, opacity: 0, duration: 0.7, stagger: 0.07 }, 0.3)
      .from(job.querySelectorAll('.job__stack li'), { scale: 0.7, opacity: 0, duration: 0.5, stagger: 0.04, ease: 'back.out(2)' }, 0.6)
  })
})
</script>

<template>
  <section
    id="experience"
    ref="root"
    class="experience"
    data-scene="experience"
  >
    <div class="container">
      <div
        class="experience__heading"
        data-lag="0.15"
      >
        <p class="eyebrow">
          Experience
        </p>
        <h2 class="section-title">
          Where I've <em>worked</em>
        </h2>
      </div>

      <div class="timeline">
        <span
          class="timeline__line"
          aria-hidden="true"
        ><span class="timeline__progress" /></span>
        <ol class="timeline__jobs">
          <li
            v-for="job in EXPERIENCES"
            :key="job.company + job.period"
            class="job"
          >
            <span
              class="job__dot"
              aria-hidden="true"
            />
            <article class="job__card glass">
              <p class="job__period">
                {{ job.period }} · {{ job.location }}
              </p>
              <h3 class="job__title">
                {{ job.role }} <span>@ {{ job.company }}</span>
              </h3>
              <p
                v-if="job.context"
                class="job__context"
              >
                {{ job.context }}
              </p>
              <ul class="job__highlights">
                <li
                  v-for="highlight in job.highlights"
                  :key="highlight"
                >
                  {{ highlight }}
                </li>
              </ul>
              <ul
                class="job__stack"
                aria-label="Tech stack"
              >
                <li
                  v-for="tech in job.stack"
                  :key="tech"
                >
                  <BaseTag>{{ tech }}</BaseTag>
                </li>
              </ul>
            </article>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style scoped>
.experience {
  position: relative;
  z-index: 1;
  padding-block: var(--space-section);
}

.experience__heading {
  margin-bottom: clamp(3rem, 8vh, 5rem);
}

.timeline {
  position: relative;
  max-width: 60rem;
  margin: 0 auto;
  padding-left: clamp(2rem, 5vw, 3.5rem);
}

.timeline__jobs {
  display: grid;
  gap: 2rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.timeline__line {
  position: absolute;
  top: .5rem;
  bottom: 0;
  left: .45rem;
  width: 2px;
  background: rgb(255 255 255 / 8%);
}

.timeline__progress {
  position: absolute;
  inset: 0;
  background: linear-gradient(var(--color-accent), var(--color-pink), var(--color-cyan));
  transform-origin: top;
}

.job {
  position: relative;
}

.job__dot {
  position: absolute;
  top: 1.9rem;
  left: calc(clamp(2rem, 5vw, 3.5rem) * -1 + .1rem);
  width: .75rem;
  height: .75rem;
  border: 2px solid var(--color-border);
  border-radius: 50%;
  background: var(--color-bg);
  transition: border-color .5s, box-shadow .5s, background-color .5s;
}

.job--active .job__dot {
  border-color: var(--color-accent);
  background: var(--color-accent);
  box-shadow: 0 0 0 6px rgb(196 165 255 / 15%), 0 0 24px var(--color-accent);
}

.job__card {
  padding: clamp(1.4rem, 3vw, 2rem);
}

.job__period {
  margin: 0;
  font-family: var(--font-mono);
  font-size: .8rem;
  letter-spacing: .06em;
  color: var(--color-accent);
}

.job__title {
  margin: .5rem 0 0;
  font-size: clamp(1.3rem, 2.6vw, 1.75rem);
  font-weight: 600;
  letter-spacing: -.02em;
}

.job__title span {
  font-family: var(--font-display);
  font-weight: 400;
  font-style: italic;
  color: var(--color-text-muted);
}

.job__context {
  margin: .4rem 0 0;
  color: var(--color-text-muted);
  font-size: .95rem;
}

.job__highlights {
  display: grid;
  gap: .55rem;
  margin: 1.2rem 0 0;
  padding: 0;
  list-style: none;
}

.job__highlights li {
  position: relative;
  padding-left: 1.4rem;
  color: rgb(245 243 255 / 88%);
}

.job__highlights li::before {
  content: "→";
  position: absolute;
  left: 0;
  color: var(--color-pink);
}

.job__stack {
  display: flex;
  flex-wrap: wrap;
  gap: .45rem;
  margin: 1.4rem 0 0;
  padding: 0;
  list-style: none;
}
</style>
