<!--
  Full-bleed layout with smooth, inertial scrolling (see useSmoothScroll).
  The header is fixed, so it stays outside the smoothed content; the WebGL scene
  teleports itself to <body> for the same reason.
-->
<script setup lang="ts">
useSmoothScroll()
</script>

<template>
  <div class="immersive">
    <AppHeader overlay />
    <div id="smooth-wrapper">
      <div id="smooth-content">
        <main class="immersive__main">
          <slot />
        </main>
        <AppFooter class="immersive__footer" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Above the teleported WebGL canvas (z-index 0), below the header (z-index 50). */
#smooth-wrapper {
  position: relative;
  z-index: 1;
}

.immersive__main {
  position: relative;
  min-height: 100vh;
}

.immersive__footer {
  position: relative;
  z-index: 1;
  background: var(--color-bg);
}
</style>
