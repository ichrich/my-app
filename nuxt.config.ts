export default defineNuxtConfig({
  compatibilityDate: '2025-07-01',
  css: ['~/assets/theme.css', '~/assets/home.scss'],
  app: { head: { htmlAttrs: { lang: 'ru', 'data-theme': 'dark' } } }
})
