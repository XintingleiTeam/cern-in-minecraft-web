<script setup lang="ts">
const assetPath = useAssetPath()
const { t } = useLocale()
import { buildings } from '~/data/catalog'
import { cernMedia } from '~/data/media'
</script>
<template>
  <div class="grid gap-9 md:grid-cols-3 md:gap-8">
    <article v-for="(building, index) in buildings" :key="building.slug" class="building-card gallery-item glass-panel reveal-up" :data-building="building.slug"><NuxtLink :to="`/campus/${building.slug}`" class="building-image-link"><img :src="assetPath(cernMedia[index]!.src)" :alt="t(cernMedia[index]!.alt)" loading="lazy"></NuxtLink><div class="gallery-caption"><span class="content-type">{{ t('建筑还原 · 档案待补充') }}</span><h3><NuxtLink :to="`/campus/${building.slug}`">{{ t(building.name) }}<span aria-hidden="true">→</span></NuxtLink></h3><p>{{ t('建筑名称与介绍待补充。') }}</p><a class="photo-credit" :href="cernMedia[index]!.source" target="_blank" rel="noopener noreferrer">{{ t('临时参考图') }} · {{ cernMedia[index]!.credit }} ↗</a></div></article>
  </div>
</template>
