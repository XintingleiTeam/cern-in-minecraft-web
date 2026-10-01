import { commonMessages } from '~/data/locales/common'
import { componentMessages } from '~/data/locales/components'
import { pageMessages } from '~/data/locales/pages'

export const locales = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'zh-Hans', label: '简体中文' },
  { code: 'zh-Hant', label: '繁體中文' },
] as const
export type Locale = (typeof locales)[number]['code']
const messages: Record<string, { en: string; fr: string; 'zh-Hant': string }> = { ...pageMessages, ...componentMessages, ...commonMessages }

export function useLocale() {
  const locale = useState<Locale>('locale', () => 'en')
  function setLocale(value: string) {
    if (!locales.some(item => item.code === value)) return
    locale.value = value as Locale
    if (import.meta.client) {
      try { localStorage.setItem('cern-locale', value) } catch { /* Language still works when storage is unavailable. */ }
    }
  }
  function t(source: string, params: Record<string, string | number> = {}) {
    const message = locale.value === 'zh-Hans' ? source : messages[source]?.[locale.value] ?? source
    return message.replace(/\{(\w+)\}/g, (match, key: string) => String(params[key] ?? match))
  }
  return { locale, locales, setLocale, t }
}
