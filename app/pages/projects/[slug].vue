<script setup lang="ts">
const route = useRoute('projects-slug')
const slug = route.params.slug
if (typeof slug !== 'string' || !slug) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}
const { data: project, error } = await useProject(slug)

if (error.value || !project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

usePageSeo({ title: project.value.title, description: project.value.summary })
</script>

<template>
  <article
    v-if="project"
    class="project"
  >
    <NuxtLink
      to="/projects"
      class="project__back"
    >
      ← All projects
    </NuxtLink>
    <h1>{{ project.title }}</h1>
    <p class="project__meta">
      {{ project.role }}<template v-if="project.company">
        · {{ project.company }}
      </template><template v-if="project.period ?? project.year">
        · {{ project.period ?? project.year }}
      </template> · {{ formatList(project.tags) }}
    </p>
    <p>{{ project.description }}</p>
    <ul
      v-if="project.highlights?.length"
      class="project__highlights"
    >
      <li
        v-for="highlight in project.highlights"
        :key="highlight"
      >
        {{ highlight }}
      </li>
    </ul>
    <img
      v-if="project.cover"
      class="project__cover"
      :src="project.cover"
      :alt="`${project.title} portfolio cover`"
    >
    <div
      v-if="project.links"
      class="project__links"
    >
      <BaseButton
        v-if="project.links.live"
        :href="project.links.live"
      >
        Live site
      </BaseButton>
      <BaseButton
        v-if="project.links.repo"
        :href="project.links.repo"
        variant="ghost"
      >
        Source code
      </BaseButton>
    </div>
  </article>
</template>

<style scoped>
.project {
  max-width: 48rem;
}

.project__back {
  color: var(--color-text-muted);
  text-decoration: none;
}

.project__meta {
  color: var(--color-text-muted);
}

.project__highlights { display: grid; gap: .5rem; padding-left: 1.2rem; }
.project__highlights li::marker { color: var(--color-accent); }

.project__cover { border-radius: var(--radius); margin-block: var(--space-4); }

.project__links {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-4);
}
</style>
