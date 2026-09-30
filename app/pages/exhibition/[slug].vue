<script setup lang="ts">
import { exhibits } from '~/data/catalog'
definePageMeta({ key: route => route.path })
const route = useRoute()
const exhibit = exhibits.find(item => item.slug === route.params.slug)
if (!exhibit) throw createError({ statusCode: 404, statusMessage: '展区页面不存在' })
useSeoMeta({ title: `${exhibit.name} | CERN Minecraft`, description: `${exhibit.name}的展馆主题、学习目标与 Minecraft 玩法，内容待补充。` })
</script>

<template>
  <div v-if="exhibit"><section class="intro"><div class="site-shell"><NuxtLink class="breadcrumb" to="/exhibition">科教展馆 / 游戏内展区</NuxtLink><h1>{{ exhibit.name }}</h1><p>展区主题与介绍待补充。</p></div></section><section class="site-shell section"><MediaPlaceholder class="min-h-64 md:min-h-[420px]" label="展馆实景图片占位" note="Minecraft 实景待补充" /><div class="detail-grid"><article><h2 class="section-title">展区介绍</h2><p class="body-copy">主题背景、展品及参观路线待补充。</p><h2 class="mt-12 text-2xl font-bold">学习目标</h2><p class="body-copy">知识点与体验后的学习目标待补充。</p><h2 class="mt-12 text-2xl font-bold">Minecraft 内玩法</h2><p class="body-copy">互动装置、操作步骤与小游戏规则待补充。</p></article><aside><h2 class="text-xl font-bold">参观信息</h2><dl class="metadata"><div><dt>开放状态</dt><dd>待公布</dd></div><div><dt>建议时长</dt><dd>待补充</dd></div><div><dt>适合人群</dt><dd>待补充</dd></div></dl><NuxtLink to="/visit" class="text-link">参观指南 <span aria-hidden="true">→</span></NuxtLink><br><NuxtLink to="/exhibition" class="text-link">返回科教展馆 <span aria-hidden="true">→</span></NuxtLink></aside></div></section></div>
</template>
