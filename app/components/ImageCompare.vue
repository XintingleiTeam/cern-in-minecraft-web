<script setup lang="ts">
import { cernMedia, type ReferenceMedia } from '~/data/media'
const assetPath = useAssetPath()
const { t } = useLocale()
withDefaults(defineProps<{ subject?: string; media?: ReferenceMedia }>(), { subject: '园区全景', media: () => cernMedia[0] })
</script>
<template>
  <figure class="comparison">
    <div class="comparison-panorama">
      <img class="comparison-photo comparison-real" :src="assetPath(media.src)" :alt="t(media.alt)" loading="lazy">
      <img class="comparison-photo comparison-minecraft" :src="assetPath('/demo/xintinglei-3.webp')" :alt="t('{name}的 Minecraft 图片位置，暂用新亭泪游戏演示图', { name: t(subject) })" loading="lazy">
      <div class="comparison-seam" aria-hidden="true"></div>
      <div class="comparison-labels"><span>{{ t('现实参考') }}</span><span>{{ t('Minecraft 还原') }}<small>{{ t('演示图占位') }}</small></span></div>
    </div>
    <figcaption><span>{{ t(media.title) }} · <a :href="media.source" target="_blank" rel="noopener noreferrer">{{ media.credit }} ↗</a></span><span>{{ t('新亭泪演示图 · CERN 还原实景待补充') }}</span></figcaption>
  </figure>
</template>

<style scoped>
.comparison { margin: 0; border-radius: 0; background: transparent; }
.comparison-panorama { position: relative; height: clamp(350px, 42vw, 560px); overflow: hidden; border-radius: 12px; background: #101820; }
.comparison-panorama .comparison-photo { position: absolute; top: 0; width: 59%; height: 100%; object-fit: cover; }
.comparison-real { left: 0; object-position: 48% center; mask-image: linear-gradient(to right, #000 70%, transparent); }
.comparison-minecraft { right: 0; object-position: 64% center; mask-image: linear-gradient(to left, #000 70%, transparent); }
.comparison-seam { position: absolute; inset: 0 40%; backdrop-filter: blur(10px); mask-image: linear-gradient(to right, transparent, #000 45%, #000 55%, transparent); pointer-events: none; }
.comparison-labels { position: absolute; inset: 0; display: flex; justify-content: space-between; align-items: end; padding: 28px 32px; background: linear-gradient(transparent 55%, #000a); color: #fff; font-size: 20px; font-weight: 600; }
.comparison-labels>span:last-child { text-align: right; }
.comparison-labels small { display: block; font-size: 11px; font-weight: 400; color: #d5dce4; }
.comparison figcaption { position: static; display: flex; justify-content: space-between; gap: 8px 24px; padding: 14px 0 0; background: none; color: #9eaab9; font-size: 11px; line-height: 1.8; }
.comparison figcaption a { text-decoration: underline; text-underline-offset: 3px; }
@media (max-width: 760px) {
  .comparison-panorama { height: 350px; border-radius: 8px; }
  .comparison-labels { padding: 18px 14px; font-size: 15px; }
  .comparison-labels small { font-size: 10px; }
  .comparison figcaption { flex-direction: column; font-size: 10px; gap: 2px; }
}
</style>
