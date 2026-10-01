<script setup lang="ts">
const assetPath = useAssetPath()
const { t } = useLocale()
import { buildings } from '~/data/catalog'
</script>
<template>
  <div class="grid gap-9 md:grid-cols-3 md:gap-8">
    <article v-for="building in buildings" :key="building.slug" class="building-card gallery-item glass-panel reveal-up" :data-building="building.slug"><NuxtLink :to="`/campus/${building.slug}`" class="building-image-link"><img :src="assetPath(building.media.src)" :alt="t(building.media.alt)" loading="lazy"></NuxtLink><div class="gallery-caption"><span class="content-type">{{ t('建筑还原 · 档案待补充') }}</span><h3><NuxtLink :to="`/campus/${building.slug}`">{{ t(building.name) }}<span aria-hidden="true">→</span></NuxtLink></h3><p>{{ t(building.description) }}</p><a class="photo-credit" :href="building.media.source" target="_blank" rel="noopener noreferrer">{{ t(building.media.title) }} · {{ building.media.credit }} ↗</a></div></article>
  </div>
</template>
