import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-09-30',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      title: 'CERN · Minecraft 项目',
      meta: [{ name: 'theme-color', content: '#000000' }],
    },
  },
  nitro: { prerender: { crawlLinks: true, failOnError: true } },
})
