<script setup lang="ts">
import { buildings, exhibits } from '~/data/catalog'
import { cernMedia } from '~/data/media'
const route = useRoute()
const menu = ref<HTMLDialogElement>()
const header = ref<HTMLElement>()
const menuOpen = ref(false)
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
function openMenu() { expanded.value = null; menu.value?.showModal(); menuOpen.value = true }
function dismiss(event: PointerEvent) { if (event.target instanceof Node && !header.value?.contains(event.target)) expanded.value = null }
function escapeMenu() { const index = expanded.value; expanded.value = null; if (index !== null) document.getElementById(`nav-trigger-${index}`)?.focus() }
function blurMenu(event: FocusEvent) { if (event.relatedTarget instanceof Node && !header.value?.contains(event.relatedTarget)) expanded.value = null }
watch(() => route.fullPath, () => { menu.value?.close(); expanded.value = null })
onMounted(() => { syncScroll(); window.addEventListener('scroll', syncScroll, { passive: true }); document.addEventListener('pointerdown', dismiss) })
onBeforeUnmount(() => { window.removeEventListener('scroll', syncScroll); document.removeEventListener('pointerdown', dismiss) })
</script>
<template>
  <header ref="header" class="main-header" :class="{ scrolled: scrolled || route.path !== '/' || expanded !== null }" @keydown.esc.stop="escapeMenu" @focusout="blurMenu">
    <div class="header-container">
      <NuxtLink class="header-logo" to="/" aria-label="CERN Minecraft 项目首页">CERN <span class="brand-divider">/</span><span class="brand-project">新亭泪</span></NuxtLink>
      <nav class="header-nav" aria-label="主要导航"><button v-for="(link, index) in links" :id="`nav-trigger-${index}`" :key="link.to" :data-nav="link.to" :class="{ active: route.path.startsWith(link.to) || expanded === index }" :aria-expanded="expanded === index" aria-controls="desktop-menu" @click="expanded = expanded === index ? null : index">{{ link.label }}<span class="nav-chevron" aria-hidden="true"></span></button></nav>
      <span class="header-language">简体中文</span>
      <button id="open-menu" class="menu-toggle" aria-label="打开导航菜单" aria-haspopup="dialog" aria-controls="mobile-menu" :aria-expanded="menuOpen" @click="openMenu"><span></span><span></span><span></span></button>
    </div>
    <div v-if="selected" id="desktop-menu" class="desktop-menu"><div class="site-shell mega-layout"><div><p class="content-type">CERN IN MINECRAFT</p><h2>{{ selected.label }}</h2><p class="body-copy">{{ selected.description }}</p><NuxtLink class="text-link mega-overview" :to="selected.to">浏览{{ selected.label }} <span aria-hidden="true">→</span></NuxtLink></div><div class="mega-links"><p>浏览内容</p><NuxtLink v-for="child in selected.children" :key="child.to" :to="child.to">{{ child.label }} <span aria-hidden="true">↗</span></NuxtLink></div><ReferencePhoto :media="cernMedia[expanded ?? 0]" caption="CERN 官方现实参考" /></div><button class="mega-close" aria-label="关闭展开菜单" @click="escapeMenu">×</button></div>
  </header>
  <dialog id="mobile-menu" ref="menu" class="cern-mobile-menu" aria-labelledby="menu-title" @close="menuOpen = false">
    <h2 id="menu-title" class="sr-only">项目导航</h2><button class="menu-close" aria-label="关闭导航菜单" @click="menu?.close()">×</button>
    <nav aria-label="移动端导航"><details v-for="link in links" :key="link.to" name="mobile-navigation" :data-menu="link.to"><summary :class="{ active: route.path.startsWith(link.to) }">{{ link.label }}<span class="chevron" aria-hidden="true"></span></summary><div class="mobile-submenu"><NuxtLink class="mobile-overview" :to="link.to" @click="menu?.close()">{{ link.label }} →</NuxtLink><p>浏览内容</p><NuxtLink v-for="child in link.children" :key="child.to" :to="child.to" @click="menu?.close()">{{ child.label }}</NuxtLink></div></details></nav>
  </dialog>
</template>
