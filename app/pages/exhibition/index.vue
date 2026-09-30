<script setup lang="ts">
import { exhibits } from '~/data/catalog'
useSeoMeta({ title: '科教展馆 | CERN Minecraft', description: 'Minecraft 科教展区与网页实验室，正式内容待补充。' })
</script>

<template>
  <div><section class="intro"><div class="site-shell"><NuxtLink class="breadcrumb" to="/">首页 /</NuxtLink><h1>科教展馆</h1><p>在 Minecraft 中参观与学习。展馆介绍和学习路线待补充。</p></div></section>
    <section class="site-shell section"><h2 class="section-title mb-8">游戏内展区</h2><div class="grid gap-9 md:grid-cols-3"><NuxtLink v-for="exhibit in exhibits" :key="exhibit.slug" :to="`/exhibition/${exhibit.slug}`" class="building-card exhibition-card glass-panel reveal-up group"><MediaPlaceholder label="展区图片占位" /><p class="content-type mt-5">Minecraft 内体验</p><h3 class="mt-2 flex justify-between text-2xl font-bold text-cern group-hover:underline">{{ exhibit.name }} <span aria-hidden="true">→</span></h3><p class="mt-3 text-sm text-muted">主题与小游戏说明待补充。</p></NuxtLink></div></section>
    <section id="lab" class="exhibition-section"><div class="site-shell section"><h2 class="section-title">网页实验室</h2><p class="mt-5 text-muted">互动内容待补充。</p></div></section>
  </div>
</template>
