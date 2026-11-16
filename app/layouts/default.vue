<template>
  <div class="layout">
    <AppHeader />
    <main class="container layout__main">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout__main {
  flex: 1;
  padding-block: var(--space-5);
}
</style>
