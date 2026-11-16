// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: ['@nuxt/eslint'],

  // Components are registered by file name only (AppHeader, not LayoutAppHeader).
  components: [{ path: '~/components', pathPrefix: false }],
  devtools: { enabled: true },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: '%s · Sara Ghotbzadeh',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#090a16' },
        { name: 'author', content: 'Sara Ghotbzadeh' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Geist:wght@300..700&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap' }],
      // Marks JS as available before first paint, so intro content can start hidden (see main.css).
      script: [{ innerHTML: 'document.documentElement.classList.add(\'js\')' }],
    },
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      // Set NUXT_PUBLIC_SITE_URL to the live domain, e.g. https://saraghotbzadeh.com
      // Used for canonical links, Open Graph URLs, structured data and the sitemap.
      siteUrl: '',
    },
  },
  compatibilityDate: '2026-11-01',

  nitro: {
    // Static builds (`nuxt generate`) also emit these server routes as files.
    prerender: { routes: ['/sitemap.xml', '/robots.txt'] },
  },

  typescript: {
    strict: true,
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },
})
