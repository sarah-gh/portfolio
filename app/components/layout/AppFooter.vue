<script setup lang="ts">
import { SITE, SOCIAL_LINKS } from '~/constants/site'

const appConfig = useAppConfig()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <p>© {{ year }} {{ SITE.name }}</p>
      <ul
        v-if="appConfig.ui.showFooterSocials"
        class="footer__links"
      >
        <li
          v-for="link in SOCIAL_LINKS"
          :key="link.href"
        >
          <a
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
          >{{ link.label }}</a>
        </li>
      </ul>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.footer__inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-2);
}

.footer__links {
  display: flex;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
