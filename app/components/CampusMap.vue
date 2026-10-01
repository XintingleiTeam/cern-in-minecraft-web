<script setup lang="ts">
import { buildings } from '~/data/catalog'
const { t } = useLocale()
const assetPath = useAssetPath()
const view = ref('map')
const detail = ref(false)
const selected = ref<(typeof buildings)[number] | null>(null)
const viewport = ref<HTMLElement>()
const sidebar = ref<HTMLElement>()
const mapLoaded = ref(false)
const detailLoaded = ref(false)
const loadError = ref(false)
const retry = ref(0)
const size = ref(1)
const camera = ref({ x: 0, y: 0, scale: 1 })
const dragging = ref(false)
const regions = Array.from({ length: 16 }, (_, i) => ({ id: `${'ABCD'[i % 4]}${Math.floor(i / 4) + 1}` }))
const pointers = new Map<number, { x: number; y: number }>()
let observer: ResizeObserver | undefined
const planeStyle = computed(() => ({ transform: `translate3d(${camera.value.x}px, ${camera.value.y}px, 0) scale(${camera.value.scale})` }))
function setCamera(x: number, y: number, scale: number) {
  if (!detail.value) { camera.value = { x: 0, y: 0, scale: 1 }; return }
  // C4 is the third column and fourth row of the overview.
  camera.value = { x: Math.max(size.value - .75 * size.value * scale, Math.min(-.5 * size.value * scale, x)), y: Math.max(size.value - size.value * scale, Math.min(-.75 * size.value * scale, y)), scale }
}
function reset() { setCamera(-2 * size.value, -3 * size.value, 4) }
async function enterRegion() {
  detailLoaded.value = false; detail.value = true; selected.value = null; loadError.value = false; reset()
  await nextTick(); viewport.value?.focus({ preventScroll: true })
}
async function overview() {
  detail.value = false; selected.value = null; pointers.clear(); dragging.value = false
  setCamera(0, 0, 1)
  await nextTick(); viewport.value?.querySelector<HTMLButtonElement>('[data-region="C4"]')?.focus({ preventScroll: true })
}
function zoom(factor: number, x = size.value / 2, y = size.value / 2) {
  const old = camera.value, scale = Math.max(4, Math.min(12, old.scale * factor)), ratio = scale / old.scale
  setCamera(x - (x - old.x) * ratio, y - (y - old.y) * ratio, scale)
}
function point(event: PointerEvent | WheelEvent) {
  const rect = viewport.value!.getBoundingClientRect()
  return { x: event.clientX - rect.left, y: event.clientY - rect.top }
}
function pointerDown(event: PointerEvent) {
  if (!detail.value || event.button !== 0 || (event.target as Element).closest('button, a')) return
  viewport.value?.focus({ preventScroll: true }); viewport.value?.setPointerCapture(event.pointerId)
  pointers.set(event.pointerId, point(event)); dragging.value = true
}
function pointerMove(event: PointerEvent) {
  if (!pointers.has(event.pointerId)) return
  const before = [...pointers.values()]; pointers.set(event.pointerId, point(event)); const after = [...pointers.values()]
  if (after.length === 1) setCamera(camera.value.x + after[0]!.x - before[0]!.x, camera.value.y + after[0]!.y - before[0]!.y, camera.value.scale)
  else if (after.length === 2) {
    const midpoint = (a: typeof after) => ({ x: (a[0]!.x + a[1]!.x) / 2, y: (a[0]!.y + a[1]!.y) / 2 })
    const distance = (a: typeof after) => Math.hypot(a[0]!.x - a[1]!.x, a[0]!.y - a[1]!.y)
    const old = midpoint(before), next = midpoint(after), scale = Math.max(4, Math.min(12, camera.value.scale * distance(after) / Math.max(1, distance(before)))), ratio = scale / camera.value.scale
    setCamera(next.x - (old.x - camera.value.x) * ratio, next.y - (old.y - camera.value.y) * ratio, scale)
  }
}
function pointerUp(event: PointerEvent) { pointers.delete(event.pointerId); dragging.value = pointers.size > 0 }
function wheel(event: WheelEvent) {
  if (!detail.value) return
  event.preventDefault(); const p = point(event); zoom(event.deltaY < 0 ? 1.12 : 1 / 1.12, p.x, p.y)
}
function keyboard(event: KeyboardEvent) {
  if (!detail.value || event.target !== viewport.value) return
  const moves: Record<string, [number, number]> = { ArrowLeft: [40, 0], ArrowRight: [-40, 0], ArrowUp: [0, 40], ArrowDown: [0, -40] }
  if (moves[event.key]) { event.preventDefault(); const [x, y] = moves[event.key]!; setCamera(camera.value.x + x, camera.value.y + y, camera.value.scale) }
  else if (['+', '=', '-', '0', 'Escape'].includes(event.key)) {
    event.preventDefault()
    if (event.key === 'Escape') void overview()
    else if (event.key === '0') reset()
    else zoom(event.key === '-' ? 1 / 1.4 : 1.4)
  }
}
async function selectBuilding(building: (typeof buildings)[number]) {
  selected.value = building
  if (matchMedia('(max-width: 760px)').matches) {
    await nextTick(); sidebar.value?.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
}
async function closeCard() {
  const slug = selected.value?.slug; selected.value = null
  await nextTick(); viewport.value?.querySelector<HTMLButtonElement>(`[data-place="${slug}"]`)?.focus({ preventScroll: true })
}
onMounted(() => {
  const image = viewport.value?.querySelector<HTMLImageElement>('.map-overview-image')
  if (image?.complete) { mapLoaded.value = image.naturalWidth > 0; loadError.value = !mapLoaded.value }
  observer = new ResizeObserver(([entry]) => {
    if (!entry || entry.contentRect.width <= 0) return
    const next = entry.contentRect.width, ratio = next / size.value; size.value = next
    setCamera(camera.value.x * ratio, camera.value.y * ratio, camera.value.scale)
  })
  if (viewport.value) observer.observe(viewport.value)
})
onBeforeUnmount(() => observer?.disconnect())
</script>
<template>
  <div class="campus-explorer">
    <div class="explorer-heading">
      <div><p class="content-type">CERN / MINECRAFT</p><h2>{{ t('探索园区') }}</h2></div>
      <div class="view-switch" :aria-label="t('浏览方式')"><button type="button" :aria-pressed="view === 'map'" @click="view = 'map'">{{ t('地图') }}</button><button type="button" :aria-pressed="view === 'list'" @click="view = 'list'">{{ t('建筑列表') }}</button></div>
    </div>
    <div v-show="view === 'map'">
      <div class="map-toolbar"><div class="map-breadcrumb"><button :disabled="!detail" @click="overview">{{ t('园区总览') }}</button><span v-if="detail" aria-hidden="true">/</span><strong v-if="detail">C4 · {{ t('示范分区') }}</strong></div><a href="https://maps.cern.ch/" target="_blank" rel="noopener noreferrer">MapCERN ↗</a></div>
      <div class="map-layout">
        <div class="map-frame">
          <div ref="viewport" class="map-viewport" :class="{ 'is-detail': detail, 'is-dragging': dragging }" tabindex="0" role="region" :aria-label="t(detail ? '局部地图，可拖动缩放' : '园区分区地图')" aria-describedby="map-help" :data-zoom="camera.scale" @pointerdown="pointerDown" @pointermove="pointerMove" @pointerup="pointerUp" @pointercancel="pointerUp" @lostpointercapture="pointerUp" @wheel="wheel" @keydown="keyboard">
            <div class="map-plane" :style="planeStyle">
              <img class="map-overview-image" :src="assetPath('/maps/cern-overview.jpg') + '?v=' + retry" :alt="t('CERN 园区及周边航拍参考图')" draggable="false" width="1024" height="1024" @load="mapLoaded = true" @error="loadError = true">
              <img v-if="detail" class="map-detail-image" :class="{ loaded: detailLoaded }" :src="assetPath('/maps/cern-c4.jpg') + '?v=' + retry" alt="" draggable="false" width="1600" height="1600" @load="detailLoaded = true" @error="loadError = true">
              <div class="region-grid" :class="{ 'region-grid-hidden': detail }" :inert="detail || undefined" :aria-hidden="detail || undefined">
                <button v-for="region in regions" :key="region.id" class="region-cell" :class="{ available: region.id === 'C4' }" :data-region="region.id" :disabled="region.id !== 'C4' || !mapLoaded" :aria-label="`${region.id} · ${t(region.id === 'C4' ? '进入示范分区' : '待补充')}`" @click="enterRegion"><span>{{ region.id }}</span><small>{{ t(region.id === 'C4' ? '探索' : '待补充') }} <b v-if="region.id === 'C4'" aria-hidden="true">↗</b></small></button>
              </div>
              <Transition name="map-pins"><div v-if="detail && detailLoaded" class="building-pins"><button v-for="building in buildings" :key="building.slug" class="building-pin" :class="{ selected: selected?.slug === building.slug }" :data-place="building.slug" :style="{ left: `${50 + building.x / 4}%`, top: `${75 + building.y / 4}%`, transform: `translate(-50%, -50%) scale(${1 / camera.scale})` }" :aria-label="t(building.name)" :aria-pressed="selected?.slug === building.slug" @click="selectBuilding(building)"><span>{{ building.marker }}</span></button></div></Transition>
            </div>
            <button v-if="detail" class="map-return" @click="overview"><span aria-hidden="true">←</span>{{ t('返回总览') }}</button>
            <div class="map-compass" aria-hidden="true">N<span>↑</span></div>
            <div v-if="detail" class="map-zoom" :aria-label="t('地图缩放')"><button :aria-label="t('放大')" :disabled="camera.scale >= 12" @click="zoom(1.4)">+</button><button :aria-label="t('缩小')" :disabled="camera.scale <= 4" @click="zoom(1 / 1.4)">−</button><button :aria-label="t('重置视图')" @click="reset">↺</button></div>
            <div v-if="loadError || !mapLoaded || (detail && !detailLoaded)" class="map-load" role="status"><span>{{ t(loadError ? '地图暂时无法加载' : '正在加载地图…') }}</span><button v-if="loadError" @click="loadError = false; retry++">{{ t('重试') }}</button></div>
            <div class="map-source"><span>© CERN · MapCERN</span><span>{{ detail ? 'C4' : '4 × 4' }}</span></div>
          </div>
          <p id="map-help" class="map-help">{{ t(detail ? '拖动平移，滚轮、双指或按钮缩放；按 Esc 或点击按钮返回总览。' : '选择蓝色分区，进入局部地图。其余分区待补充。') }}</p>
        </div>
        <aside ref="sidebar" class="map-sidebar" :aria-label="t('分区与建筑信息')">
          <Transition name="map-info" mode="out-in">
            <div v-if="selected" :key="selected.slug" class="map-building-card">
              <div class="sidebar-eyebrow"><span>C4 / {{ selected.marker }}</span><button :aria-label="t('关闭建筑信息')" @click="closeCard">×</button></div>
              <figure class="building-photo">
                <img :src="assetPath(selected.media.src)" :alt="t(selected.media.alt)">
                <figcaption>{{ t(selected.media.title) }} · <a :href="selected.media.source" target="_blank" rel="noopener noreferrer">{{ selected.media.credit }} ↗</a></figcaption>
              </figure>
              <h3 id="selected-name">{{ t(selected.name) }}</h3><p>{{ t(selected.description) }}</p>
              <dl><div><dt>{{ t('建筑编号') }}</dt><dd>{{ selected.number }}</dd></div><div><dt>{{ t('还原状态') }}</dt><dd>{{ t('待补充') }}</dd></div><div><dt>{{ t('所在分区') }}</dt><dd>C4</dd></div></dl>
              <NuxtLink id="place-detail" class="map-detail-link" :to="`/campus/${selected.slug}`">{{ t('查看建筑详情') }} <span aria-hidden="true">→</span></NuxtLink>
            </div>
            <div v-else :key="detail ? 'region' : 'overview'" class="map-introduction">
              <span class="sidebar-eyebrow">{{ detail ? 'C4 / CERN' : '01 / 16' }}</span><h3>{{ t(detail ? '示范分区' : '从地图开始探索') }}</h3><p>{{ t(detail ? '选择地图上的建筑标记，查看还原档案。' : '从园区总览走进局部，逐步查看建筑与还原记录。') }}</p>
              <button v-if="!detail" class="map-detail-link" :disabled="!mapLoaded" @click="enterRegion">{{ t('进入示范分区') }} <span>C4 ↗</span></button>
              <div v-else class="map-building-list"><button v-for="building in buildings" :key="building.slug" @click="selectBuilding(building)"><span>{{ building.marker }}</span>{{ t(building.name) }}<b aria-hidden="true">↗</b></button></div>
              <div class="map-legend"><span><i></i>{{ t('可浏览分区') }}</span><span><i></i>{{ t('待补充') }}</span></div>
            </div>
          </Transition>
          <p class="map-demo-note">{{ t('建筑位置来自 MapCERN；分区为本站导航划分，航拍底图非实时。Minecraft 还原资料待补充。') }}</p>
        </aside>
      </div>
    </div>
    <div v-if="view === 'list'" class="map-alternative"><p>{{ t('选择建筑，查看现实与还原的对照及项目档案。') }}</p><BuildingCards /></div>
  </div>
</template>
<style scoped>
.explorer-heading { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 32px; }
.explorer-heading .content-type { letter-spacing: .14em; font-size: 10px; margin-bottom: 8px; }
.explorer-heading h2 { font-size: clamp(26px, 3vw, 38px); font-weight: 650; }
.view-switch { display: flex; flex-shrink: 0; padding: 4px; border: 1px solid #ffffff25; border-radius: 28px; }
.view-switch button { min-height: 44px; padding: 6px 20px; border-radius: 24px; color: #9ea8b5; font-size: 13px; transition: background .2s, color .2s; }
.view-switch button[aria-pressed=true] { background: #ededf0; color: #111113; }
.map-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 12px 0; border-top: 1px solid #ffffff24; font-size: 12px; color: #a3aebb; }
.map-breadcrumb { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; }
.map-breadcrumb button { min-height: 44px; color: #d6dee9; }
.map-breadcrumb strong { font-weight: 500; color: #8fb7ee; }
.map-toolbar a { white-space: nowrap; padding: 12px 0; }
.map-layout { display: grid; grid-template-columns: minmax(0, 680px) minmax(240px, 1fr); gap: 40px; }
.map-viewport { position: relative; aspect-ratio: 1; overflow: hidden; background: #12171d; border: 1px solid #ffffff25; border-radius: 6px; isolation: isolate; touch-action: pan-y; }
.map-viewport.is-detail { touch-action: none; cursor: grab; }
.map-viewport.is-dragging { cursor: grabbing; }
.map-viewport:focus-visible { outline-offset: 3px; }
.map-plane { position: absolute; inset: 0; transform-origin: 0 0; transition: transform .65s cubic-bezier(.22,.7,.2,1); }
.is-dragging .map-plane { transition: none; }
.map-overview-image { width: 100%; height: 100%; object-fit: cover; filter: saturate(.55) brightness(.7); pointer-events: none; user-select: none; }
.map-detail-image { position: absolute; left: 50%; top: 75%; width: 25%; height: 25%; max-width: none; opacity: 0; filter: saturate(.7) brightness(.85); transition: opacity .5s .25s; pointer-events: none; user-select: none; }
.map-detail-image.loaded { opacity: 1; }
.region-grid { position: absolute; inset: 0; display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(4, 1fr); transition: opacity .25s; }
.region-grid-hidden { opacity: 0; pointer-events: none; }
.region-cell { border-right: 1px solid #ffffff26; border-bottom: 1px solid #ffffff26; padding: 12px; text-align: left; display: flex; flex-direction: column; justify-content: space-between; color: #e4e8ec; background: #07101628; }
.region-cell:disabled { cursor: default; }
.region-cell>span { font: 12px ui-monospace, monospace; opacity: .7; }
.region-cell small { font-size: 10px; opacity: .75; }
.region-cell:nth-last-child(-n+4) small { transform: translateY(-26px); }
.region-cell.available { outline: 2px solid #88b4f5; outline-offset: -2px; background: #488bdd3b; box-shadow: inset 0 0 40px #669be733; transition: background .2s; }
.region-cell.available:hover, .region-cell.available:focus-visible { background: #488bdd77; }
.region-cell.available>span, .region-cell.available small { opacity: 1; color: #fff; }
.region-cell.available small { display: flex; justify-content: space-between; font-weight: 600; }
.map-compass { position: absolute; right: 12px; top: 12px; display: flex; align-items: center; gap: 6px; padding: 4px 9px; background: #080c12bd; border-radius: 3px; font: 10px ui-monospace, monospace; pointer-events: none; }
.map-compass span { font-size: 20px; }
.map-source { position: absolute; bottom: 0; left: 0; right: 0; display: flex; justify-content: space-between; gap: 10px; padding: 7px 12px; background: #080c12ce; font-size: 9px; color: #c1ccd7; pointer-events: none; }
.map-help { color: #8693a3; font-size: 11px; line-height: 1.7; padding: 14px 0; }
.map-zoom { position: absolute; right: 12px; bottom: 40px; display: flex; flex-direction: column; border: 1px solid #ffffff40; border-radius: 5px; overflow: hidden; background: #0b0e13eb; }
.map-zoom button { width: 44px; height: 44px; font-size: 23px; border-bottom: 1px solid #ffffff20; }
.map-zoom button:last-child { border: 0; }
.map-zoom button:disabled { color: #59616c; cursor: default; }
.map-zoom button:not(:disabled):hover { background: #ffffff15; }
.map-load { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); padding: 16px 20px; background: #080c12eb; border: 1px solid #ffffff30; border-radius: 5px; font-size: 12px; text-align: center; }
.map-load button { display: block; margin: 8px auto 0; padding: 8px 20px; color: #8fb7ee; }
.building-pins { position: absolute; inset: 0; pointer-events: none; }
.building-pin { position: absolute; width: 46px; height: 46px; border: 1px solid #fff9; border-radius: 50%; color: #fff; background: #0b1624eb; display: grid; place-items: center; pointer-events: auto; box-shadow: 0 3px 16px #0008; }
.building-pin:hover, .building-pin.selected { background: #88b4f5; color: #0c1420; border-color: #d4e5ff; }
.building-pin>span { font: 600 16px ui-monospace, monospace; }
.map-sidebar { padding: 20px 0 0; display: flex; flex-direction: column; border-top: 2px solid #88b4f5; align-self: start; }
.sidebar-eyebrow { display: flex; align-items: center; justify-content: space-between; min-height: 32px; color: #8d9db0; font: 11px ui-monospace, monospace; letter-spacing: .12em; }
.sidebar-eyebrow button { width: 44px; height: 44px; font: 24px sans-serif; }
.map-sidebar h3 { font-size: 27px; line-height: 1.4; margin: 20px 0; font-weight: 600; }
.map-sidebar p { font-size: 13px; color: #9eabb9; line-height: 1.9; }
.map-detail-link { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 48px; width: 100%; margin-top: 28px; border-block: 1px solid #ffffff26; color: #9bc3fb; font-size: 13px; }
.map-detail-link:disabled { opacity: .4; }
.map-detail-link:hover { color: white; }
.map-legend { display: flex; gap: 18px; flex-wrap: wrap; margin-top: 36px; color: #9eabb9; font-size: 11px; }
.map-legend>span { display: flex; align-items: center; gap: 8px; }
.map-legend i { width: 8px; height: 8px; background: #8fb7ee; }
.map-legend>span:last-child i { border: 1px solid #6b7786; background: none; }
.map-sidebar .map-demo-note { margin-top: 30px; padding-top: 22px; border-top: 1px solid #ffffff19; font-size: 11px; color: #8592a2; }
.map-building-list { margin-top: 22px; }
.map-building-list button { display: flex; align-items: center; gap: 14px; width: 100%; min-height: 54px; border-bottom: 1px solid #ffffff20; font-size: 14px; }
.map-building-list button:hover { color: #9bc3fb; }
.map-building-list span { font: 11px ui-monospace, monospace; color: #8fb7ee; }
.map-building-list b { margin-left: auto; font-weight: 400; }
.building-photo { margin-top: 12px; }
.building-photo img { width: 100%; aspect-ratio: 16/10; object-fit: cover; border-radius: 3px; }
.building-photo figcaption { font-size: 10px; line-height: 1.7; color: #8d9db0; margin-top: 8px; }
.building-photo a { text-decoration: underline; text-underline-offset: 3px; }
.map-return { position: absolute; left: 12px; top: 12px; display: flex; align-items: center; gap: 10px; min-height: 44px; padding: 8px 14px; border: 1px solid #ffffff60; border-radius: 5px; background: #0b0e13ed; font-size: 12px; color: #edf3fc; }
.map-return:hover { background: #223249; }
.map-return span { font-size: 20px; }
.map-building-card dl { margin-top: 20px; font-size: 12px; }
.map-building-card dl>div { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #ffffff15; }
.map-building-card dt { color: #8d9db0; }
.map-alternative>p { color: #9eabb9; font-size: 13px; margin-bottom: 28px; }
.map-info-enter-active, .map-info-leave-active, .map-pins-enter-active, .map-pins-leave-active { transition: opacity .2s, transform .2s; }
.map-info-enter-from, .map-info-leave-to { opacity: 0; transform: translateY(8px); }
.map-pins-enter-from, .map-pins-leave-to { opacity: 0; }
@media (max-width: 1000px) { .map-layout { grid-template-columns: minmax(0, 1fr) 240px; gap: 24px; } }
@media (max-width: 760px) {
  .explorer-heading { align-items: start; flex-direction: column; gap: 18px; margin-bottom: 24px; }
  .view-switch { align-self: stretch; }
  .view-switch button { flex: 1; }
  .map-layout { grid-template-columns: 1fr; gap: 14px; }
  .map-toolbar { font-size: 11px; }
  .map-breadcrumb { gap: 8px; }
  .region-cell { padding: 7px; }
  .region-cell>span { font-size: 10px; }
  .region-cell small { font-size: 8px; padding-bottom: 12px; }
  .map-sidebar { padding: 16px 20px 20px; background: #ffffff04; border-radius: 4px; }
  .map-sidebar h3 { font-size: 23px; margin-top: 12px; }
  .map-legend { margin-top: 22px; }
  .building-photo img { max-height: 220px; }
}
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none !important; } }
</style>
