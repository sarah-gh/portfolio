<template>
  <span class="tag"><slot /></span>
</template>

<style scoped>
.tag {
  display: inline-block;
  padding: 0.1rem var(--space-2);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  font-size: 0.8rem;
  color: var(--color-text-muted);
}
</style>
