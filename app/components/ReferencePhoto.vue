<script setup lang="ts">
const assetPath = useAssetPath()
import { cernMedia } from '~/data/media'
withDefaults(defineProps<{ media?: (typeof cernMedia)[number]; caption?: string }>(), { media: () => cernMedia[0], caption: 'CERN 官方照片 · 临时现实参考' })
</script>
<template>
  <figure class="reference-photo"><img :src="assetPath(media.src)" :alt="media.alt" loading="lazy"><figcaption><span>{{ caption }}</span><a :href="media.source" target="_blank" rel="noopener noreferrer">{{ media.credit }} ↗</a></figcaption></figure>
</template>
