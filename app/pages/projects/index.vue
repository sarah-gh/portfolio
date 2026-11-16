<script setup lang="ts">
usePageSeo({ title: 'Projects', description: 'Selected front-end projects by Sara Ghotbzadeh.' })

const { data: projects } = await useProjects()
const showList = ref(false)
</script>

<template>
  <section
    class="projects"
    aria-labelledby="projects-title"
  >
    <InfiniteProjectGallery
      v-if="!showList && projects.length"
      :projects="projects"
    />
    <div class="projects__heading">
      <h1 id="projects-title">
        Selected Work
      </h1>
      <button
        v-if="projects.length"
        type="button"
        @click="showList = !showList"
      >
        {{ showList ? 'Show gallery' : 'Browse project list' }}
      </button>
    </div>
    <p
      v-if="!showList && projects.length"
      class="projects__hint"
    >
      Drag or scroll to explore
    </p>
    <div
      v-if="projects.length"
      :class="{ 'projects__list--hidden': !showList }"
      class="projects__list"
    >
      <ul>
        <li
          v-for="project in projects"
          :key="project.slug"
        >
          <NuxtLink :to="`/projects/${project.slug}`">{{ project.title }}</NuxtLink>
          <p>{{ project.summary }}</p>
        </li>
      </ul>
    </div>
    <p
      v-else
      class="projects__list"
    >
      Projects are currently unavailable.
    </p>
  </section>
</template>

<style scoped>
.projects { position: relative; isolation: isolate; min-height: calc(100svh - 5rem); background: #0b0c1b; overflow: hidden; border: 1px solid var(--color-border); }
.projects__heading { position: relative; display: flex; flex-wrap: wrap; gap: .6rem; justify-content: space-between; align-items: center; margin: 1rem; pointer-events: none; }
.projects__heading h1, .projects__heading button, .projects__hint { margin: 0; padding: .5rem .8rem; background: #111225ed; border-radius: .5rem; color: #f5f3ff; }
.projects__heading h1 { font-size: clamp(1.1rem, 3vw, 1.7rem); }
.projects__heading button { pointer-events: auto; cursor: pointer; border: 1px solid var(--color-border); font: inherit; }
.projects__hint { position: absolute; bottom: 1rem; right: 1rem; pointer-events: none; }
.projects__list { position: relative; max-width: 50rem; margin: auto; padding: 2rem; background: var(--color-bg); }
.projects__list--hidden:not(:focus-within) { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip-path: inset(50%); }
.projects__list ul { margin: 0; padding-left: 1.2rem; }
.projects__list p { color: var(--color-text-muted); }
</style>
