<script setup lang="ts">
const assetPath = useAssetPath()
useHead({ link: [{ rel: 'icon', type: 'image/x-icon', href: assetPath('/favicon.ico') }] })
const effects = ref<{ leave: (el: Element, done: () => void) => void; enter: (el: Element, done: () => void) => void }>()
function leave(el: Element, done: () => void) { effects.value ? effects.value.leave(el, done) : done() }
function enter(el: Element, done: () => void) { effects.value ? effects.value.enter(el, done) : done() }
</script>
<template>
  <NuxtRouteAnnouncer />
  <a class="skip-link" href="#main">跳到主要内容</a>
  <SiteEffects ref="effects" />
  <SiteHeader />
  <main id="main" tabindex="-1"><NuxtPage :transition="{ css: false, mode: 'out-in', onLeave: leave, onEnter: enter }" /></main>
  <SiteFooter />
</template>
