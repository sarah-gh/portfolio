<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

const props = withDefaults(defineProps<{
  to?: RouteLocationRaw
  href?: string
  variant?: 'primary' | 'ghost'
}>(), {
  to: undefined,
  href: undefined,
  variant: 'primary',
})

const NuxtLink = resolveComponent('NuxtLink')
const isLink = computed(() => Boolean(props.to || props.href))
</script>

<template>
  <component
    :is="isLink ? NuxtLink : 'button'"
    :to="isLink ? (to ?? href) : undefined"
    :type="isLink ? undefined : 'button'"
    :class="['btn', `btn--${variant}`]"
  >
    <slot />
  </component>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border: 1px solid transparent;
  border-radius: var(--radius);
  font: inherit;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}

.btn--primary {
  background: var(--color-accent);
  color: var(--color-accent-contrast);
}

.btn--ghost {
  background: transparent;
  border-color: var(--color-border);
  color: var(--color-text);
}
</style>
