<script setup lang="ts">
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { SITE, SOCIAL_LINKS } from '~/constants/site'

const root = useTemplateRef<HTMLElement>('root')
const magnet = useTemplateRef<HTMLElement>('magnet')

useGsap(root, ({ reduced }) => {
  if (reduced) return

  const title = SplitText.create('.contact__title', { type: 'chars,words', mask: 'chars' })
  gsap.from(title.chars, {
    yPercent: 110,
    duration: 1.2,
    ease: 'expo.out',
    stagger: 0.025,
    scrollTrigger: { trigger: '.contact__title', start: 'top 80%' },
  })
  gsap.from('.contact__reveal', {
    y: 40,
    opacity: 0,
    duration: 1,
    stagger: 0.12,
    scrollTrigger: { trigger: '.contact__title', start: 'top 70%' },
  })
})

/** The email button is pulled gently toward the cursor. */
function attract(event: PointerEvent) {
  const el = magnet.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const x = event.clientX - (rect.left + rect.width / 2)
  const y = event.clientY - (rect.top + rect.height / 2)
  gsap.to(el, { x: x * 0.3, y: y * 0.4, duration: 0.6, ease: 'power3.out' })
}

function release() {
  if (magnet.value) gsap.to(magnet.value, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.4)' })
}
</script>

<template>
  <section
    id="contact"
    ref="root"
    class="contact"
    data-scene="contact"
  >
    <div class="container contact__inner">
      <p class="eyebrow contact__reveal">
        Contact
      </p>
      <h2 class="contact__title">
        Let's build something <em>interactive</em> together.
      </h2>
      <p class="contact__text contact__reveal">
        I'm open to front-end roles with international teams in Japan and remote. The fastest way to reach me is by email.
      </p>

      <div
        class="contact__magnet-area contact__reveal"
        @pointermove="attract"
        @pointerleave="release"
      >
        <a
          ref="magnet"
          :href="`mailto:${SITE.email}`"
          class="contact__email"
        >{{ SITE.email }}</a>
      </div>

      <ul class="contact__links contact__reveal">
        <li
          v-for="link in SOCIAL_LINKS"
          :key="link.href"
        >
          <a
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
          >{{ link.label }} <span aria-hidden="true">↗</span></a>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.contact {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  min-height: 100svh;
  padding-block: var(--space-section);
  text-align: center;
}

.contact__inner {
  display: grid;
  justify-items: center;
}

.contact__title {
  max-width: 16ch;
  margin: 0;
  font-size: clamp(2.6rem, 8vw, 6.5rem);
  font-weight: 600;
  line-height: 1;
  letter-spacing: -.05em;
}

.contact__title em {
  font-family: var(--font-display);
  font-weight: 400;
  letter-spacing: -.02em;
  color: var(--color-accent);
}

.contact__text {
  max-width: 34rem;
  margin: 1.8rem 0 0;
  color: var(--color-text-muted);
}

.contact__magnet-area {
  margin-top: 2.5rem;
  padding: 2rem 3rem;
}

.contact__email {
  display: inline-block;
  padding: 1.1rem 2rem;
  border-radius: 999px;
  background: var(--gradient-brand);
  color: var(--color-accent-contrast);
  font-size: clamp(1rem, 2.4vw, 1.3rem);
  font-weight: 650;
  text-decoration: none;
  box-shadow: 0 10px 50px rgb(196 165 255 / 30%);
  overflow-wrap: anywhere;
}

.contact__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
}

.contact__links a {
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color .3s;
}

.contact__links a:hover {
  color: var(--color-text);
}
</style>
