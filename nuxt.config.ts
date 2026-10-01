import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-09-30',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css', '~/assets/css/footer-banner.css', '~/assets/css/navigation.css'],
  vite: { plugins: [tailwindcss()] },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'CERN in Minecraft',
      meta: [{ name: 'theme-color', content: '#000000' }],
    },
  },
  nitro: { prerender: { crawlLinks: true, failOnError: true } },
})
