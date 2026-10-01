export function browserLocale(languages: readonly string[]) {
  for (const language of languages) {
    try {
      const locale = new Intl.Locale(language)
      if (locale.language === 'en' || locale.language === 'fr') return locale.language
      if (locale.language === 'zh') return locale.maximize().script === 'Hant' ? 'zh-Hant' : 'zh-Hans'
    } catch { /* Ignore malformed language tags and try the next preference. */ }
  }
  return 'en'
}
