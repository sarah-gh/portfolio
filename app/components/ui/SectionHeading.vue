<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <header class="section-heading">
    <h2>{{ title }}</h2>
    <p v-if="subtitle">
      {{ subtitle }}
    </p>
  </header>
</template>

<style scoped>
.section-heading {
  margin-bottom: var(--space-4);
}

.section-heading h2 {
  margin: 0;
}

.section-heading p {
  margin: var(--space-1) 0 0;
  color: var(--color-text-muted);
}
</style>
