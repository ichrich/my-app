export default defineNuxtConfig({
  compatibilityDate: '2025-07-01',
  modules: ['@pinia/nuxt'],
  css: ['~/assets/theme.css', '~/assets/main.scss'],
  runtimeConfig: { public: { siteUrl: 'http://localhost:3000' } },
  app: { head: { htmlAttrs: { lang: 'ru', 'data-theme': 'dark' }, titleTemplate: '%s · GameHub' } }
})
