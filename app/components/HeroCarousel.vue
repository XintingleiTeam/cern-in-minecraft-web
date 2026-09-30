<script setup lang="ts">
const assetPath = useAssetPath()
import { features } from '~/data/media'
const active = ref(0)
const direction = ref('next')
const current = computed(() => features[active.value]!)
const paused = ref(false)
const hovering = ref(false)
const hidden = ref(false)
const inView = ref(true)
const carousel = ref<HTMLElement>()
const reduced = useState('reduced-motion', () => false)
const motionPaused = useState('motion-paused', () => false)
let timer: ReturnType<typeof setInterval> | undefined
let observer: IntersectionObserver | undefined
let touchX = 0
function move(step: number) { direction.value = step > 0 ? 'next' : 'prev'; active.value = (active.value + step + 4) % 4 }
function syncTimer() {
  clearInterval(timer)
  if (!paused.value && !hovering.value && !hidden.value && inView.value && !reduced.value && !motionPaused.value) timer = setInterval(() => move(1), 6500)
}
function syncVisibility() { hidden.value = document.hidden }
function focus(event: FocusEvent) { if (!(event.target as HTMLElement).closest('[data-playback]')) paused.value = true }
watch([paused, hovering, hidden, inView, reduced, motionPaused], syncTimer)
onMounted(() => {
  syncVisibility(); syncTimer()
  document.addEventListener('visibilitychange', syncVisibility)
  observer = new IntersectionObserver(([entry]) => { inView.value = !!entry?.isIntersecting })
  if (carousel.value) observer.observe(carousel.value)
})
onBeforeUnmount(() => { clearInterval(timer); observer?.disconnect(); document.removeEventListener('visibilitychange', syncVisibility) })
function swipe(event: TouchEvent) { const dx = (event.changedTouches[0]?.clientX ?? touchX) - touchX; if (Math.abs(dx) > 50) { move(dx < 0 ? 1 : -1); syncTimer() } }
</script>

<template>
  <section ref="carousel" class="hero-section" aria-roledescription="轮播" aria-label="项目专题，CERN 官方现实参考图片" @mouseenter="hovering = true" @mouseleave="hovering = false" @focusin="focus" @touchstart.passive="touchX = $event.touches[0]?.clientX ?? 0" @touchend.passive="swipe">
    <div id="heroCarousel"><Transition :name="`wipe-${direction}`"><div :key="active" class="slide active"><img :src="assetPath(current.media.src)" :alt="current.media.alt" fetchpriority="high"></div></Transition></div>
    <div class="hero-text"><p class="hero-eyebrow"><span>{{ current.category }}</span> CERN IN MINECRAFT</p><h1>{{ current.title }}</h1><p class="hero-description">{{ current.description }}</p><NuxtLink :to="current.to" class="cta-link hero-cta">{{ current.action }} <span aria-hidden="true">→</span></NuxtLink></div>
    <span v-for="n in 15" :key="n" class="hero-particle" :style="{ left: `${(n * 37) % 100}%`, top: `${(n * 23) % 100}%`, width: `${n % 5 + 2}px`, height: `${n % 5 + 2}px`, animationDuration: `${8 + n}s`, animationDelay: `${-n}s` }" aria-hidden="true"></span>
    <button class="carousel-arrow carousel-prev" aria-label="上一张" @click="move(-1); syncTimer()"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M20 7 11 16 20 25" /></svg></button>
    <button class="carousel-arrow carousel-next" aria-label="下一张" @click="move(1); syncTimer()"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="m12 7 9 9-9 9" /></svg></button>
    <div class="hero-bottom"><a :href="current.media.source" target="_blank" rel="noopener noreferrer">{{ current.media.credit }} · 官方照片临时展示 ↗</a><div class="carousel-controls"><span aria-live="off" id="slide-number">{{ active + 1 }} / {{ features.length }}</span><button data-playback :aria-label="paused ? '播放轮播' : '暂停轮播'" @click="paused = !paused">{{ paused ? '播放' : '暂停' }}</button></div></div>
  </section>
</template>