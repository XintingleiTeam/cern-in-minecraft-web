export default defineNuxtPlugin(() => {
  const { locale, locales } = useLocale()
  onNuxtReady(() => {
    let saved: string | null = null
    try {
      saved = localStorage.getItem('cern-locale')
    } catch { /* Browser language detection also works without local storage. */ }
    locale.value = locales.find(item => item.code === saved)?.code
      ?? browserLocale(navigator.languages.length ? navigator.languages : [navigator.language])
  })
})
