<script setup lang="ts">
const { t } = useLocale()
import { buildings, exhibits } from '~/data/catalog'
import { cernMedia } from '~/data/media'
const route = useRoute()
const menu = ref<HTMLDialogElement>()
const header = ref<HTMLElement>()
const menuOpen = ref(false)
const mobileExpanded = ref<number | null>(null)
const closing = ref(false)
const reduced = useState('reduced-motion', () => false)
let menuAnimation: Animation | undefined
const scrolled = ref(false)
const expanded = ref<number | null>(null)
const links = [
  { to: '/about', label: '关于项目', description: '项目背景、目标与团队介绍待补充。', children: [{ to: '/about', label: '项目介绍' }, { to: '/visit', label: '参观与参与' }] },
  { to: '/campus', label: '园区还原', description: '浏览建筑目录、现实参考与 Minecraft 还原档案。', children: buildings.map(b => ({ to: `/campus/${b.slug}`, label: b.name })) },
  { to: '/exhibition', label: '科教展馆', description: '了解 Minecraft 内的展馆主题与科教体验。', children: [...exhibits.map(e => ({ to: `/exhibition/${e.slug}`, label: e.name })), { to: '/exhibition#lab', label: '网页实验室' }] },
  { to: '/visit', label: '参观指南', description: '服务器信息、开放安排与参观流程待公布。', children: [{ to: '/visit', label: '进入 Minecraft 园区' }] },
]
const selected = computed(() => expanded.value === null ? null : links[expanded.value]!)
function syncScroll() { scrolled.value = window.scrollY > 20 }
function openMenu() {
  const dialog = menu.value
  if (!dialog || dialog.open) return
  expanded.value = null
  const index = links.findIndex(link => route.path.startsWith(link.to))
  mobileExpanded.value = index < 0 ? null : index
  closing.value = false
  dialog.showModal()
  menuOpen.value = true
  if (!reduced.value) menuAnimation = dialog.animate([
    { transform: 'translateX(100%)', opacity: .6 },
    { transform: 'translateX(0)', opacity: 1 },
  ], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' })
}
async function closeMenu() {
  const dialog = menu.value
  if (!dialog?.open || closing.value) return
  closing.value = true
  const transform = getComputedStyle(dialog).transform
  const opacity = getComputedStyle(dialog).opacity
  menuAnimation?.cancel()
  if (!reduced.value) {
    const animation = dialog.animate([
      { transform, opacity },
      { transform: 'translateX(100%)', opacity: .6 },
    ], { duration: 300, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' })
    menuAnimation = animation
    await animation.finished.catch(() => {})
  }
  dialog.close()
}
function closedMenu() { menuAnimation?.cancel(); menuOpen.value = false; closing.value = false }
watch(reduced, value => { if (value) menuAnimation?.finish() })
function dismiss(event: PointerEvent) { if (event.target instanceof Node && !header.value?.contains(event.target)) expanded.value = null }
function escapeMenu() { const index = expanded.value; expanded.value = null; if (index !== null) document.getElementById(`nav-trigger-${index}`)?.focus() }
function blurMenu(event: FocusEvent) { if (event.relatedTarget instanceof Node && !header.value?.contains(event.relatedTarget)) expanded.value = null }
watch(() => route.fullPath, () => { void closeMenu(); expanded.value = null })
onMounted(() => { syncScroll(); window.addEventListener('scroll', syncScroll, { passive: true }); document.addEventListener('pointerdown', dismiss) })
onBeforeUnmount(() => { menuAnimation?.cancel(); window.removeEventListener('scroll', syncScroll); document.removeEventListener('pointerdown', dismiss) })
</script>
<template>
  <header ref="header" class="main-header" :class="{ scrolled: scrolled || route.path !== '/' || expanded !== null }" @keydown.esc.stop="escapeMenu" @focusout="blurMenu">
    <div class="header-container">
      <NuxtLink class="header-logo" to="/" :aria-label="t('CERN Minecraft 项目首页')">CERN <span class="brand-divider">/</span><span class="brand-project">{{ t('新亭泪') }}</span></NuxtLink>
      <nav class="header-nav" :aria-label="t('主要导航')"><button v-for="(link, index) in links" :id="`nav-trigger-${index}`" :key="link.to" :data-nav="link.to" :class="{ active: route.path.startsWith(link.to) || expanded === index }" :aria-expanded="expanded === index" aria-controls="desktop-menu" @click="expanded = expanded === index ? null : index">{{ t(link.label) }}<span class="nav-chevron" aria-hidden="true"></span></button></nav>
      <LanguageSelect class="header-language" />
      <button id="open-menu" class="menu-toggle" :aria-label="t('打开导航菜单')" aria-haspopup="dialog" aria-controls="mobile-menu" :aria-expanded="menuOpen" @click="openMenu"><span></span><span></span><span></span></button>
    </div>
    <Transition name="nav-panel" @before-leave="(el) => el.setAttribute('inert', '')" @before-enter="(el) => el.removeAttribute('inert')">
      <div v-if="selected" id="desktop-menu" class="desktop-menu"><div class="site-shell mega-layout"><div><p class="content-type">CERN IN MINECRAFT</p><h2>{{ t(selected.label) }}</h2><p class="body-copy">{{ t(selected.description) }}</p><NuxtLink class="text-link mega-overview" :to="selected.to">{{ t('栏目概览') }} <span aria-hidden="true">→</span></NuxtLink></div><div class="mega-links"><p>{{ t('浏览内容') }}</p><NuxtLink v-for="child in selected.children" :key="child.to" :to="child.to">{{ t(child.label) }} <span aria-hidden="true">↗</span></NuxtLink></div><ReferencePhoto :media="cernMedia[expanded ?? 0]" :caption="t('CERN 官方现实参考')" /></div><button class="mega-close" :aria-label="t('关闭展开菜单')" @click="escapeMenu">×</button></div>
    </Transition>
  </header>
  <dialog id="mobile-menu" ref="menu" class="cern-mobile-menu" :inert="closing" aria-labelledby="menu-title" @cancel.prevent="closeMenu" @close="closedMenu">
    <div class="mobile-menu-shell">
      <div class="mobile-menu-top"><NuxtLink class="mobile-brand" to="/" @click="closeMenu">CERN <span>/</span> {{ t('新亭泪') }}</NuxtLink><button class="menu-close" autofocus :aria-label="t('关闭导航菜单')" @click="closeMenu"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button></div>
      <div class="mobile-menu-heading"><h2 id="menu-title">{{ t('探索项目') }}</h2><LanguageSelect /></div>
      <nav class="mobile-navigation" :aria-label="t('移动端导航')">
        <section v-for="(link, index) in links" :key="link.to" class="mobile-group" :data-menu="link.to">
          <button :id="'mobile-trigger-' + index" class="mobile-section-trigger" :class="{ active: route.path.startsWith(link.to) }" :aria-expanded="mobileExpanded === index" :aria-controls="'mobile-panel-' + index" @click="mobileExpanded = mobileExpanded === index ? null : index"><span>{{ t(link.label) }}</span><span class="mobile-plus" aria-hidden="true"></span></button>
          <div :id="'mobile-panel-' + index" class="mobile-submenu" :class="{ expanded: mobileExpanded === index }" :inert="mobileExpanded !== index" :aria-hidden="mobileExpanded !== index" :aria-labelledby="'mobile-trigger-' + index">
            <div class="mobile-submenu-inner"><p>{{ t(link.description) }}</p><NuxtLink class="mobile-overview" :to="link.to" @click="closeMenu">{{ t('栏目概览') }} <span aria-hidden="true">↗</span></NuxtLink><NuxtLink v-for="child in link.children" :key="child.to" :to="child.to" @click="closeMenu">{{ t(child.label) }} <span aria-hidden="true">→</span></NuxtLink></div>
          </div>
        </section>
      </nav>
      <div class="mobile-menu-bottom"><NuxtLink to="/visit" class="mobile-visit" @click="closeMenu"><span>{{ t('参观 Minecraft 园区') }}<small>{{ t('开放安排待公布') }}</small></span><span aria-hidden="true">↗</span></NuxtLink><p>CERN IN MINECRAFT <span>BY XINTINGLEI</span></p></div>
    </div>
  </dialog>
</template>

<style scoped>
.nav-panel-enter-active, .nav-panel-leave-active {
  transition: opacity .24s ease, transform .24s ease, clip-path .24s ease;
  transform-origin: top;
}
.nav-panel-enter-from, .nav-panel-leave-to {
  opacity: 0;
  transform: translateY(-12px);
  clip-path: inset(0 0 100% 0);
}
.nav-panel-enter-to, .nav-panel-leave-from { clip-path: inset(0); }
.cern-mobile-menu { position: fixed; inset: 0; width: 100%; height: 100dvh; max-width: none; max-height: none; margin: 0; padding: 0; border: 0; border-radius: 0; background: #08080a; color: #f1f3f5; overflow-y: auto; overscroll-behavior: contain; }
.cern-mobile-menu::backdrop { background: #0009; backdrop-filter: blur(8px); }
.mobile-menu-shell { display: flex; flex-direction: column; min-height: 100%; padding: env(safe-area-inset-top) max(24px, env(safe-area-inset-right)) max(24px, env(safe-area-inset-bottom)) max(24px, env(safe-area-inset-left)); }
.mobile-menu-top { display: flex; align-items: center; justify-content: space-between; min-height: 78px; border-bottom: 1px solid #ffffff1c; }
.mobile-brand { font-size: 21px; font-weight: 750; letter-spacing: .02em; }
.mobile-brand span { color: #687180; margin-inline: 9px; font-weight: 400; }
.menu-close { display: grid; place-items: center; width: 44px; height: 44px; border: 1px solid #ffffff30; border-radius: 50%; background: #ffffff06; }
.menu-close svg { width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 1.5; }
.mobile-menu-heading { display: flex; justify-content: space-between; align-items: center; padding: 34px 0 17px; color: #9ba5b1; font-size: 11px; letter-spacing: .08em; }
.mobile-menu-heading h2 { font-size: inherit; font-weight: 400; }
.mobile-group { border-bottom: 1px solid #ffffff20; }
.mobile-section-trigger { display: flex; align-items: center; justify-content: space-between; gap: 20px; width: 100%; min-height: 86px; padding: 18px 0; text-align: left; color: #d7dce2; font-size: clamp(25px, 7vw, 32px); font-weight: 550; letter-spacing: .02em; }
.mobile-section-trigger.active, .mobile-section-trigger[aria-expanded=true] { color: #fff; }
.mobile-plus { position: relative; width: 18px; height: 18px; flex: none; color: #9ba5b1; }
.mobile-plus::before, .mobile-plus::after { content: ''; position: absolute; top: 8px; left: 0; width: 18px; height: 1px; background: currentColor; transition: transform .3s ease; }
.mobile-plus::after { transform: rotate(90deg); }
.mobile-section-trigger[aria-expanded=true] .mobile-plus::after { transform: rotate(0); }
.mobile-submenu { display: grid; grid-template-rows: 0fr; opacity: 0; transition: grid-template-rows .36s cubic-bezier(.22,1,.36,1), opacity .28s ease; }
.mobile-submenu.expanded { grid-template-rows: 1fr; opacity: 1; }
.mobile-submenu-inner { min-height: 0; overflow: hidden; }
.mobile-submenu-inner p { max-width: 30em; padding: 0 0 16px 16px; border-left: 1px solid #748395; color: #a1aab6; font-size: 12px; line-height: 1.9; }
.mobile-submenu-inner a { display: flex; justify-content: space-between; align-items: center; min-height: 46px; gap: 16px; padding: 8px 0 8px 16px; color: #bfc8d3; font-size: 15px; }
.mobile-submenu-inner a.mobile-overview { color: #fff; }
.mobile-submenu-inner a:last-child { margin-bottom: 20px; }
.mobile-submenu-inner a span { color: #8291a3; }
.mobile-menu-bottom { margin-top: auto; padding-top: 40px; }
.mobile-visit { display: flex; align-items: center; justify-content: space-between; padding: 20px; gap: 18px; border: 1px solid #ffffff22; background: #ffffff04; color: #e5e9ed; font-size: 14px; }
.mobile-visit small { display: block; color: #8d98a5; font-size: 11px; margin-top: 5px; }
.mobile-visit>span:last-child { font-size: 24px; }
.mobile-menu-bottom p { display: flex; justify-content: space-between; gap: 12px; margin-top: 22px; color: #7e8895; font-size: 9px; letter-spacing: .08em; }
@media (max-height: 650px) { .mobile-menu-heading { padding-top: 20px; } .mobile-section-trigger { min-height: 70px; } .mobile-menu-bottom { padding-top: 28px; } }
@media (prefers-reduced-motion: reduce) {
  .nav-panel-enter-from, .nav-panel-leave-to { opacity: 1; transform: none; clip-path: none; }
}
</style>
