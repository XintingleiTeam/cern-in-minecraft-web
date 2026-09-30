<script setup lang="ts">
const assetPath = useAssetPath()
import { buildings } from '~/data/catalog'
const dialog = ref<HTMLDialogElement>()
const selected = ref<(typeof buildings)[number]>(buildings[0])
function closeBackdrop(event: MouseEvent) {
  if (event.target !== dialog.value) return
  const bounds = dialog.value.getBoundingClientRect()
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.value.close()
}
</script>

<template>
  <button id="open-map" class="text-link" @click="dialog?.showModal()">查看园区示意图 <span aria-hidden="true">→</span></button>
  <dialog ref="dialog" id="map-dialog" class="map-dialog" aria-labelledby="map-title" @click="closeBackdrop">
    <button class="close-dialog" aria-label="关闭园区示意图" @click="dialog?.close()">×</button>
    <h2 id="map-title" class="section-title">园区示意图</h2><p class="my-4 text-sm text-muted">概念示意，非实际园区布局。选择标记查看建筑。</p>
    <div class="relative map-surface"><img :src="assetPath('/campus.svg')" width="900" height="590" class="w-full" alt="方块建筑与道路构成的概念园区" />
      <button v-for="building in buildings" :key="building.slug" class="map-pin" :style="{ left: `${building.x}%`, top: `${building.y}%` }" :aria-label="building.name" :aria-pressed="selected.slug === building.slug" :data-place="building.slug" @click="selected = building">{{ building.marker }}</button>
    </div>
    <div class="mt-5 flex flex-wrap items-center justify-between gap-3" aria-live="polite"><div><strong id="selected-name">{{ selected.name }}</strong><p class="mt-1 text-sm text-muted">建筑介绍待补充</p></div><NuxtLink id="place-detail" class="text-link" :to="`/campus/${selected.slug}`" @click="dialog?.close()">查看建筑详情 <span aria-hidden="true">→</span></NuxtLink></div>
  </dialog>
</template>
