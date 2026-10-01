<script setup lang="ts">
const { t } = useLocale()
import { exhibits } from '~/data/catalog'
useSeoMeta({ title: () => t('科教展馆 | CERN Minecraft'), description: () => t('Minecraft 科教展区与网页实验室，正式内容待补充。') })
</script>

<template>
  <div><section class="intro"><div class="site-shell reveal-up"><NuxtLink class="breadcrumb" to="/">{{ t('首页 /') }}</NuxtLink><h1>{{ t('科教展馆') }}</h1><p>{{ t('在 Minecraft 中参观与学习。展馆介绍和学习路线待补充。') }}</p></div></section>
    <section class="site-shell section"><h2 class="section-title mb-8 reveal-up">{{ t('游戏内展区') }}</h2><div class="grid gap-9 md:grid-cols-3"><NuxtLink v-for="exhibit in exhibits" :key="exhibit.slug" :to="`/exhibition/${exhibit.slug}`" class="building-card exhibition-card glass-panel reveal-up group"><MediaPlaceholder :label="t('展区图片占位')" /><p class="content-type mt-5">{{ t('Minecraft 内体验') }}</p><h3 class="mt-2 flex justify-between text-2xl font-bold text-cern group-hover:underline">{{ t(exhibit.name) }} <span aria-hidden="true">→</span></h3><p class="mt-3 text-sm text-muted">{{ t('主题与小游戏说明待补充。') }}</p></NuxtLink></div></section>
    <section id="lab" class="exhibition-section"><div class="site-shell section reveal-up"><h2 class="section-title">{{ t('网页实验室') }}</h2><p class="mt-5 text-muted">{{ t('互动内容待补充。') }}</p></div></section>
  </div>
</template>
