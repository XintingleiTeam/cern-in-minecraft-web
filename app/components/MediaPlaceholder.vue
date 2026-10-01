<script setup lang="ts">
const { t } = useLocale()
withDefaults(defineProps<{ label?: string; note?: string; dark?: boolean }>(), {
  label: '图片占位', note: '素材待补充', dark: false,
})
</script>

<template>
  <div class="media-placeholder" :class="{ 'media-dark': dark }">
    <svg width="44" height="34" viewBox="0 0 44 34" fill="none" aria-hidden="true"><rect x="1" y="1" width="42" height="32" stroke="currentColor" /><path d="m2 29 12-13 17 17m-7-7 7-8 12 13" stroke="currentColor" /><circle cx="33" cy="9" r="3" stroke="currentColor" /></svg>
    <span>{{ t(label) }}</span><small>{{ t(note) }}</small>
  </div>
</template>
