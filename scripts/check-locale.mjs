import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

const compile = file => ts.transpileModule(fs.readFileSync(new URL(file, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
const { browserLocale } = await import('data:text/javascript;base64,' + Buffer.from(compile('../app/utils/browserLocale.ts')).toString('base64'))
for (const [languages, expected] of [
  [['en-US'], 'en'], [['fr-CA'], 'fr'], [['zh'], 'zh-Hans'], [['zh-CN'], 'zh-Hans'], [['zh-SG'], 'zh-Hans'],
  [['zh-TW'], 'zh-Hant'], [['zh-HK'], 'zh-Hant'], [['zh-MO'], 'zh-Hant'],
  [['zh-Hans-HK'], 'zh-Hans'], [['zh-Hant-CN'], 'zh-Hant'],
  [['de-DE', 'fr-FR', 'en'], 'fr'], [['en', 'fr'], 'en'], [['bad_tag', 'fr'], 'fr'], [['ja'], 'en'], [[], 'en'],
]) assert.equal(browserLocale(languages), expected, JSON.stringify(languages))

const plugin = compile('../app/plugins/locale.client.ts').replace('export default ', '')
for (const [saved, languages, blocked, expected] of [
  ['en', ['fr'], false, 'en'], ['zh-Hant', ['fr'], false, 'zh-Hant'],
  [null, ['fr'], false, 'fr'], ['invalid', ['zh-TW'], false, 'zh-Hant'],
  [null, ['zh-CN'], true, 'zh-Hans'], [null, [], false, 'fr'],
]) {
  const locale = { value: 'en' }
  vm.runInNewContext(plugin, {
    defineNuxtPlugin: fn => fn(), onNuxtReady: fn => fn(), browserLocale,
    useLocale: () => ({ locale, locales: ['en', 'fr', 'zh-Hans', 'zh-Hant'].map(code => ({ code })) }),
    navigator: { languages, language: 'fr-FR' },
    localStorage: { getItem: () => { if (blocked) throw new Error('Storage blocked'); return saved }, setItem: () => assert.fail('Automatic detection must not save a manual preference') },
  })
  assert.equal(locale.value, expected)
}
console.log('PASS: browser language matching, Chinese scripts, preference order, saved selection, blocked storage and English fallback.')
