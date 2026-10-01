<script setup lang="ts">
const { t } = useLocale()
useSeoMeta({ title: () => t('参观指南 | CERN Minecraft'), description: () => t('Minecraft 服务器信息、版本要求与参观方法待公布。') })
</script>

<template>
  <div><section class="intro"><div class="site-shell reveal-up"><NuxtLink class="breadcrumb" to="/">{{ t('首页 /') }}</NuxtLink><h1>{{ t('参观指南') }}</h1><p>{{ t('服务器信息与开放安排待公布。') }}</p></div></section><section class="site-shell section"><div class="detail-grid !mt-0"><article class="reveal-up"><h2 class="section-title">{{ t('进入 Minecraft 园区') }}</h2><dl class="metadata"><div><dt>{{ t('游戏版本') }}</dt><dd>{{ t('待公布') }}</dd></div><div><dt>{{ t('服务器地址') }}</dt><dd>{{ t('待公布') }}</dd></div><div><dt>{{ t('资源包与模组') }}</dt><dd>{{ t('待公布') }}</dd></div><div><dt>{{ t('开放时间') }}</dt><dd>{{ t('待公布') }}</dd></div></dl><h2 class="mt-12 text-2xl font-bold">{{ t('参观流程') }}</h2><p class="body-copy">{{ t('进入方式、操作说明与参观路线待补充。') }}</p></article><aside class="reveal-up" style="transition-delay: 100ms"><h2 class="text-xl font-bold">{{ t('提前了解') }}</h2><p class="body-copy">{{ t('可以先浏览园区档案与展馆介绍。') }}</p><NuxtLink class="text-link" to="/campus">{{ t('园区还原') }}<span aria-hidden="true">→</span></NuxtLink><br><NuxtLink class="text-link" to="/exhibition">{{ t('科教展馆') }}<span aria-hidden="true">→</span></NuxtLink></aside></div></section></div>
</template>
