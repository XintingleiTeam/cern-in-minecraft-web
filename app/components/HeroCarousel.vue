<script setup lang="ts">
const assetPath = useAssetPath()
const { t } = useLocale()
import { features } from '~/data/media'
const active = ref(0)
const direction = ref('next')
const current = computed(() => features[active.value]!)
const focused = ref(false)
const hovering = ref(false)
const hidden = ref(false)
const inView = ref(true)
const carousel = ref<HTMLElement>()
const reduced = useState('reduced-motion', () => false)
let timer: ReturnType<typeof setInterval> | undefined
let observer: IntersectionObserver | undefined
let touchX = 0
function move(step: number) { direction.value = step > 0 ? 'next' : 'prev'; active.value = (active.value + step + 4) % 4 }
function syncTimer() {
  clearInterval(timer)
  if (!focused.value && !hovering.value && !hidden.value && inView.value && !reduced.value) timer = setInterval(() => move(1), 6500)
}
function syncVisibility() { hidden.value = document.hidden }
function blur(event: FocusEvent) { focused.value = event.relatedTarget instanceof Node && !!carousel.value?.contains(event.relatedTarget) }
watch([focused, hovering, hidden, inView, reduced], syncTimer)
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
  <section ref="carousel" class="hero-section" :aria-roledescription="t('轮播')" :aria-label="t('项目专题，CERN 官方现实参考图片')" @mouseenter="hovering = true" @mouseleave="hovering = false" @focusin="focused = true" @focusout="blur" @touchstart.passive="touchX = $event.touches[0]?.clientX ?? 0" @touchend.passive="swipe">
    <div id="heroCarousel"><Transition :name="`wipe-${direction}`"><div :key="active" class="slide active"><img :src="assetPath(current.media.src)" :alt="t(current.media.alt)" fetchpriority="high"></div></Transition></div>
    <div class="hero-text">
      <Transition name="hero-copy" mode="out-in" :css="!reduced" :duration="reduced ? 0 : { enter: 520, leave: 160 }" @before-leave="(el) => { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true') }" @before-enter="(el) => { el.removeAttribute('inert'); el.removeAttribute('aria-hidden') }">
        <div :key="active" class="hero-copy">
          <p class="hero-eyebrow"><span>{{ t(current.category) }}</span> CERN IN MINECRAFT</p>
          <h1>{{ t(current.title) }}</h1>
          <p class="hero-description">{{ t(current.description) }}</p>
          <NuxtLink :to="current.to" class="cta-link hero-cta">{{ t(current.action) }} <span aria-hidden="true">→</span></NuxtLink>
        </div>
      </Transition>
    </div>
    <span v-for="n in 15" :key="n" class="hero-particle" :style="{ left: `${(n * 37) % 100}%`, top: `${(n * 23) % 100}%`, width: `${n % 5 + 2}px`, height: `${n % 5 + 2}px`, animationDuration: `${8 + n}s`, animationDelay: `${-n}s` }" aria-hidden="true"></span>
    <button class="carousel-arrow carousel-prev" :aria-label="t('上一张')" @click="move(-1); syncTimer()"><svg viewBox="0 0 32 32" aria-hidden="true"><path class="desktop-arrow" d="M20 7 11 16 20 25" /><path class="mobile-arrow" d="M13 6 3 16l10 10M3 16h26" /></svg></button>
    <button class="carousel-arrow carousel-next" :aria-label="t('下一张')" @click="move(1); syncTimer()"><svg viewBox="0 0 32 32" aria-hidden="true"><path class="desktop-arrow" d="m12 7 9 9-9 9" /><path class="mobile-arrow" d="m19 6 10 10-10 10M29 16H3" /></svg></button>
    <div class="hero-bottom"><a :href="current.media.source" target="_blank" rel="noopener noreferrer">{{ current.media.credit }} · {{ t('官方照片临时展示') }} ↗</a><span aria-live="off" id="slide-number">{{ active + 1 }} / {{ features.length }}</span></div>
  </section>
</template>

<style scoped>
.hero-copy-enter-active > * { transition: opacity .32s ease, transform .32s cubic-bezier(.2,.8,.2,1); }
.hero-copy-enter-active > :nth-child(2) { transition-delay: .06s; }
.hero-copy-enter-active > :nth-child(3) { transition-delay: .12s; }
.hero-copy-enter-active > :nth-child(4) { transition-delay: .18s; }
.hero-copy-enter-from > * { opacity: 0; transform: translateY(18px); }
.hero-copy-leave-active { transition: opacity .16s ease, transform .16s ease; pointer-events: none; }
.hero-copy-leave-to { opacity: 0; transform: translateY(-8px); }
@media (prefers-reduced-motion: reduce) {
  .hero-copy, .hero-copy > * { transition: none !important; }
}
</style>
