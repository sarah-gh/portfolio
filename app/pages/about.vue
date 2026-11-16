<script setup lang="ts">
import { INTRO_STATEMENT } from '~/constants/profile'
import { SITE } from '~/constants/site'

definePageMeta({ layout: 'immersive' })
usePageSeo({ title: 'About', description: INTRO_STATEMENT })
</script>

<template>
  <div class="about">
    <header class="container about__header">
      <p class="eyebrow">
        About
      </p>
      <h1 class="section-title">
        {{ SITE.name }}, <em>{{ SITE.role }}</em>
      </h1>
      <p class="about__lead">
        {{ INTRO_STATEMENT }}
      </p>
      <p class="about__lead">
        I have spent more than five years building production Vue and Nuxt apps, from banking dashboards in Mashhad to white-label real-estate platforms for Canadian property developers. I now live in Tokyo and work remotely.
      </p>
    </header>
    <ExperienceSection />
    <SkillsSection />
    <EducationSection />
    <ContactSection />
  </div>
</template>

<style scoped>
.about {
  background:
    radial-gradient(ellipse at 10% 0%, rgb(84 32 79 / 40%), transparent 45%),
    radial-gradient(ellipse at 90% 10%, rgb(25 60 102 / 40%), transparent 45%);
}

.about__header {
  padding-top: clamp(8rem, 18vh, 11rem);
}

.about__lead {
  max-width: 48rem;
  margin: 1.5rem 0 0;
  font-size: clamp(1.05rem, 1.8vw, 1.25rem);
  color: var(--color-text-muted);
}
</style>
