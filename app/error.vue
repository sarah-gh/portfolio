<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const message = computed(() =>
  props.error.statusCode === 404 ? 'This page does not exist.' : 'Something went wrong.',
)

useSeoMeta({ title: `Error ${props.error.statusCode}` })
</script>

<template>
  <main class="error container">
    <h1>{{ error.statusCode }}</h1>
    <p>{{ message }}</p>
    <BaseButton @click="clearError({ redirect: '/' })">
      Back to home
    </BaseButton>
  </main>
</template>

<style scoped>
.error {
  min-height: 100vh;
  display: grid;
  place-content: center;
  text-align: center;
  gap: var(--space-3);
}
</style>
