<script setup lang="ts">
const assetPath = useAssetPath()
import { cernMedia } from '~/data/media'
withDefaults(defineProps<{ subject?: string; dark?: boolean; media?: (typeof cernMedia)[number] }>(), { subject: '园区全景', dark: false, media: () => cernMedia[0] })
const view = ref<'real' | 'minecraft'>('real')
</script>
<template>
  <figure class="comparison" :class="{ 'comparison-dark': dark }">
    <div class="comparison-controls" role="group" aria-label="选择图片视角"><button :aria-pressed="view === 'real'" data-view="real" @click="view = 'real'">现实参考</button><button :aria-pressed="view === 'minecraft'" data-view="minecraft" @click="view = 'minecraft'">Minecraft 还原</button></div>
    <div aria-live="polite"><img v-if="view === 'real'" class="comparison-photo" :src="assetPath(media.src)" :alt="media.alt" loading="lazy"><MediaPlaceholder v-else :dark="dark" :label="`${subject} · Minecraft 还原`" note="游戏实景待补充" /></div>
    <figcaption v-if="view === 'real'">{{ media.title }} · 临时参考，建筑对应关系待确认 <a :href="media.source" target="_blank" rel="noopener noreferrer">{{ media.credit }} ↗</a></figcaption><figcaption v-else>Minecraft 还原实景待补充</figcaption>
  </figure>
</template>
