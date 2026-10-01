<script setup lang="ts">
const { locale, locales, setLocale, t } = useLocale()
const root = ref<HTMLElement>()
const trigger = ref<HTMLButtonElement>()
const open = ref(false)
const menuId = useId()
const selected = computed(() => locales.find(language => language.code === locale.value)!)
function close(restoreFocus = false) { open.value = false; if (restoreFocus) trigger.value?.focus() }
async function show(index = locales.findIndex(language => language.code === locale.value)) {
  open.value = true
  await nextTick()
  root.value?.querySelectorAll<HTMLButtonElement>('[data-locale]')[index]?.focus()
}
function choose(code: string) { setLocale(code); close(true) }
function keyboard(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) { event.preventDefault(); event.stopPropagation(); close(true); return }
  if (event.key === 'Tab' && open.value) { close(true); return }
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  const items = [...(root.value?.querySelectorAll<HTMLButtonElement>('[data-locale]') ?? [])]
  const current = items.indexOf(document.activeElement as HTMLButtonElement)
  const index = event.key === 'Home' ? 0 : event.key === 'End' ? locales.length - 1 : (current + (event.key === 'ArrowDown' ? 1 : -1) + locales.length) % locales.length
  if (!open.value) void show(event.key === 'ArrowUp' ? locales.length - 1 : 0)
  else items[index]?.focus()
}
function outside(event: PointerEvent) { if (event.target instanceof Node && !root.value?.contains(event.target)) close() }
function blur(event: FocusEvent) { if (event.relatedTarget instanceof Node && !root.value?.contains(event.relatedTarget)) close() }
onMounted(() => document.addEventListener('pointerdown', outside))
onBeforeUnmount(() => document.removeEventListener('pointerdown', outside))
</script>

<template>
  <div ref="root" class="language-select" @keydown="keyboard" @focusout="blur">
    <button ref="trigger" class="language-trigger" data-language-trigger :data-language="locale" :aria-label="t('选择语言') + ': ' + selected.label" aria-haspopup="menu" :aria-expanded="open" :aria-controls="menuId" @click="open ? close() : show()">
      <svg class="language-globe" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18M5 6.5h14M5 17.5h14" /></svg>
      <span>{{ selected.label }}</span><svg class="language-chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
    </button>
    <Transition name="language-menu" @before-leave="el => el.setAttribute('inert', '')" @before-enter="el => el.removeAttribute('inert')">
      <div v-if="open" :id="menuId" class="language-options" role="menu" :aria-label="t('选择语言')">
        <button v-for="language in locales" :key="language.code" :data-locale="language.code" role="menuitemradio" :aria-checked="locale === language.code" :lang="language.code" tabindex="-1" @click="choose(language.code)">
          <span>{{ language.label }}</span><svg v-if="locale === language.code" viewBox="0 0 16 16" aria-hidden="true"><path d="m3 8 3 3 7-7" /></svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.language-select { position: relative; z-index: 2; display: inline-flex; color: #bdc4cc; font-size: 12px; white-space: nowrap; }
.language-trigger { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 44px; padding: 8px 10px; border: 1px solid transparent; border-radius: 6px; background: transparent; color: inherit; font: inherit; transition: background .18s ease, border-color .18s ease; }
.language-trigger:hover, .language-trigger[aria-expanded=true] { background: #ffffff08; border-color: #ffffff24; color: #f1f3f5; }
.language-trigger:focus-visible { outline: 1px solid #d4dce3; outline-offset: 3px; }
.language-select svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.2; flex: none; }
.language-select .language-chevron { width: 12px; height: 12px; stroke-width: 1.5; transition: transform .18s ease; }
.language-trigger[aria-expanded=true] .language-chevron { transform: rotate(180deg); }
.language-options { position: absolute; top: calc(100% + 8px); right: 0; min-width: 184px; padding: 6px; border: 1px solid #ffffff26; border-radius: 8px; background: #101216; box-shadow: 0 16px 40px #0008; }
.language-options button { display: flex; align-items: center; justify-content: space-between; gap: 24px; width: 100%; min-height: 44px; padding: 10px 12px; border-radius: 4px; color: #bcc5cf; font: inherit; text-align: left; }
.language-options button[aria-checked=true] { color: #fff; background: #ffffff0c; }
.language-options button:hover, .language-options button:focus-visible { color: #fff; background: #ffffff16; outline: none; }
.language-menu-enter-active, .language-menu-leave-active { transition: opacity .16s ease, transform .16s ease; }
.language-menu-enter-from, .language-menu-leave-to { opacity: 0; transform: translateY(-6px); }
@media (max-width: 1100px) { .language-select { font-size: 11px; } .language-trigger { gap: 6px; padding-inline: 8px; } }
</style>
