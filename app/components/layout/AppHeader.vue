<script setup lang="ts">
import { NAV_ITEMS } from '~/constants/navigation'
import { SITE } from '~/constants/site'

defineProps<{
  /** Float over the page and hide while scrolling down (immersive layout). */
  overlay?: boolean
}>()

const hidden = ref(false)
const scrolled = ref(false)
let lastY = 0

function onScroll() {
  const y = window.scrollY
  scrolled.value = y > 24
  hidden.value = y > 240 && y > lastY
  lastY = y
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header
    class="header"
    :class="{ 'header--overlay': overlay, 'header--hidden': hidden, 'header--scrolled': scrolled }"
  >
    <div class="container header__inner">
      <NuxtLink
        to="/"
        class="header__logo"
        aria-label="Home"
      >
        <span class="header__mark">SG</span>
        <span class="header__name">{{ SITE.name }}</span>
      </NuxtLink>
      <nav aria-label="Main">
        <ul class="header__nav">
          <li
            v-for="item in NAV_ITEMS"
            :key="item.to"
          >
            <NuxtLink
              :to="item.to"
              class="header__link"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid transparent;
  transition: transform .5s cubic-bezier(.2, .8, .2, 1), background-color .4s, border-color .4s;
}

.header--overlay {
  position: fixed;
  inset: 0 0 auto;
}

.header--scrolled,
.header:not(.header--overlay) {
  background: color-mix(in srgb, var(--color-bg) 72%, transparent);
  backdrop-filter: blur(14px);
  border-bottom-color: var(--color-border);
}

.header--hidden {
  transform: translateY(-100%);
}

.header__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  padding-block: var(--space-3);
}

.header__logo {
  display: inline-flex;
  align-items: center;
  gap: .6rem;
  font-weight: 650;
  text-decoration: none;
}

.header__mark {
  display: grid;
  place-items: center;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: .6rem;
  background: linear-gradient(135deg, var(--color-violet), var(--color-pink));
  color: #fff;
  font-size: .8rem;
  letter-spacing: .04em;
}

.header__nav {
  display: flex;
  gap: clamp(.75rem, 2.5vw, 1.75rem);
  margin: 0;
  padding: 0;
  list-style: none;
}

.header__link {
  position: relative;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color .3s;
}

.header__link::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -.25rem;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform .4s cubic-bezier(.2, .8, .2, 1);
}

.header__link:hover,
.header__link.router-link-exact-active {
  color: var(--color-text);
}

.header__link:hover::after,
.header__link.router-link-exact-active::after {
  transform: scaleX(1);
  transform-origin: left;
}

@media (max-width: 560px) {
  .header__name {
    display: none;
  }
}
</style>
