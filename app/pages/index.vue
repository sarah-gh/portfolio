<script setup lang="ts">
import { SITE } from '~/constants/site'

definePageMeta({ layout: 'immersive' })
usePageSeo({ title: SITE.homeTitle, description: SITE.homeDescription, absoluteTitle: true, type: 'profile' })
usePersonSchema()
</script>

<template>
  <div class="home">
    <ClientOnly>
      <CodeScene />
    </ClientOnly>
    <HeroSection />
    <IntroSection />
    <SkillsSection />
    <ExperienceSection />
    <EducationSection />
    <WorkSection />
    <ContactSection />
  </div>
</template>
