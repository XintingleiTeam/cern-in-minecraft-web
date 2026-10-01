<script setup lang="ts">
// Xintinglei motion port: original CSS/easing and tilt math, Vue lifecycle instead of PJAX.
const overlay = ref<HTMLElement>()
const glow = ref<HTMLElement>()
const blocks = ref<{ delayIn: number; delayOut: number }[]>([])
const columns = ref(1)
const rows = ref(1)
const reduced = useState('reduced-motion', () => false)
let preference: MediaQueryList
let hover: MediaQueryList
let observer: IntersectionObserver | undefined
let entering = true
let card: HTMLElement | null = null
let frame = 0
let pointerX = 0
let pointerY = 0
let pointerTarget: EventTarget | null = null
const animations = new Set<Animation>()
const nuxt = useNuxtApp()
function resetCard() { if (card) { card.style.transform = ''; card.style.removeProperty('--mouse-x'); card.style.removeProperty('--mouse-y'); card = null } }
function reveal() {
  observer?.disconnect()
  const elements = document.querySelectorAll<HTMLElement>('.reveal-up, .mask-reveal-el')
  if (reduced.value) { elements.forEach(el => el.classList.add('in')); return }
  elements.forEach(el => el.classList.add('reveal-ready'))
  // Start content motion after the tile curtain, so the first viewport's reveal remains visible.
  if (entering) return
  observer = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('in'); observer?.unobserve(entry.target) } }, { threshold: .1 })
  elements.forEach(el => { if (!el.classList.contains('in')) observer?.observe(el) })
}
function syncVisibility() { document.documentElement.classList.toggle('page-is-hidden', document.hidden) }
function syncMotion() {
  reduced.value = preference.matches
  document.documentElement.classList.toggle('reduced-motion', reduced.value)
  if (reduced.value) { if (overlay.value) overlay.value.style.visibility = 'hidden'; animations.forEach(a => a.cancel()); resetCard() }
  reveal(); scroll()
}
function scroll() {
  const hero = document.querySelector<HTMLElement>('.hero-text')
  if (!hero) return
  const enabled = hover.matches && !reduced.value
  hero.style.transform = enabled ? `translateY(${Math.min(window.scrollY, 800) * .2}px)` : ''
  hero.style.opacity = enabled ? String(Math.max(0, 1 - window.scrollY / 600)) : ''
}
function pointer(event: PointerEvent) {
  if (!hover.matches || reduced.value) return
  pointerX = event.clientX; pointerY = event.clientY; pointerTarget = event.target
  if (frame) return
  frame = requestAnimationFrame(() => {
    frame = 0
    if (glow.value) glow.value.style.transform = `translate(calc(${pointerX}px - 50%), calc(${pointerY}px - 50%))`
    const next = pointerTarget instanceof Element ? pointerTarget.closest<HTMLElement>('.glass-panel') : null
    if (next !== card) { resetCard(); card = next }
    if (!card) return
    const rect = card.getBoundingClientRect(), x = pointerX - rect.left, y = pointerY - rect.top
    card.style.setProperty('--mouse-x', `${x}px`); card.style.setProperty('--mouse-y', `${y}px`)
    card.style.transform = `perspective(1000px) rotateX(${((y - rect.height / 2) / (rect.height / 2)) * -4}deg) rotateY(${((x - rect.width / 2) / (rect.width / 2)) * 4}deg) scale3d(1.02,1.02,1.02)`
  })
}
async function grid() {
  const size = innerWidth < 768 ? 60 : 80
  columns.value = Math.ceil(innerWidth * 1.1 / size); rows.value = Math.ceil(innerHeight * 1.2 / size)
  blocks.value = Array.from({ length: columns.value * rows.value }, (_, i) => ({ delayIn: Math.floor(i / columns.value) * 8 + Math.random() * 80, delayOut: (rows.value - Math.floor(i / columns.value)) * 8 + Math.random() * 80 }))
  await nextTick()
}
async function sweep(cover: boolean) {
  if (reduced.value || !overlay.value) return
  if (cover || !blocks.value.length) await grid()
  if (reduced.value) { overlay.value.style.visibility = 'hidden'; return }
  overlay.value.style.visibility = 'visible'
  try {
    await Promise.all([...overlay.value.children].map((el, i) => {
      const animation = el.animate([{ transform: `translate3d(0,${cover ? '-120vh' : '0'},0) scale(1.02)` }, { transform: `translate3d(0,${cover ? '0' : '120vh'},0) scale(1.02)` }], { duration: 400, delay: cover ? blocks.value[i]!.delayIn : blocks.value[i]!.delayOut, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'both' })
      animations.add(animation)
      return animation.finished.catch(() => {}).finally(() => { animations.delete(animation) })
    }))
  } finally { if (!cover && overlay.value) { overlay.value.style.visibility = 'hidden'; overlay.value.getAnimations({ subtree: true }).forEach(a => a.cancel()) } }
}
async function leave(_el: Element, done: () => void) { entering = true; observer?.disconnect(); try { await sweep(true) } finally { done() } }
async function enter(_el: Element, done: () => void) { reveal(); try { await sweep(false) } finally { entering = false; reveal(); scroll(); done() } }
defineExpose({ leave, enter })
const removeHook = nuxt.hook('page:finish', () => nextTick(() => { resetCard(); reveal(); scroll() }))
onMounted(() => {
  preference = matchMedia('(prefers-reduced-motion: reduce)'); hover = matchMedia('(hover: hover) and (pointer: fine)')
  syncMotion(); syncVisibility(); void sweep(false).finally(() => { entering = false; reveal() })
  preference.addEventListener('change', syncMotion)
  window.addEventListener('scroll', scroll, { passive: true })
  document.addEventListener('pointermove', pointer, { passive: true })
  document.addEventListener('visibilitychange', syncVisibility)
})
onBeforeUnmount(() => {
  removeHook(); observer?.disconnect(); cancelAnimationFrame(frame); resetCard()
  animations.forEach(a => a.cancel()); preference?.removeEventListener('change', syncMotion)
  window.removeEventListener('scroll', scroll); document.removeEventListener('pointermove', pointer); document.removeEventListener('visibilitychange', syncVisibility)
  document.documentElement.classList.remove('reduced-motion', 'page-is-hidden')
})
</script>

<template>
  <div class="aurora-bg" aria-hidden="true"></div>
  <div ref="glow" class="ambient-glow" aria-hidden="true"></div>
  <div ref="overlay" class="page-transition-overlay" :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }" aria-hidden="true"><div v-for="(_, i) in blocks" :key="i" class="pt-block"></div></div>
</template>
