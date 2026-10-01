<script setup lang="ts">
const { t } = useLocale()
useSeoMeta({ title: () => t('关于项目 | CERN Minecraft'), description: () => t('项目目标、团队与资源支持介绍，内容待补充。') })
</script>

<template>
  <div><section class="intro"><div class="site-shell reveal-up"><NuxtLink class="breadcrumb" to="/">{{ t('首页 /') }}</NuxtLink><h1>{{ t('关于项目') }}</h1><p>{{ t('项目背景、目标与参与方式待补充。') }}</p></div></section><section class="site-shell section"><div class="detail-grid !mt-0"><article class="reveal-up"><h2 class="section-title">{{ t('项目目标') }}</h2><p class="body-copy">{{ t('园区建筑还原、科教展馆与 Minecraft 互动体验的项目说明待补充。') }}</p><h2 class="mt-12 text-2xl font-bold">{{ t('项目团队') }}</h2><p class="body-copy">{{ t('项目负责人、建造成员、科学内容与技术维护分工待补充。') }}</p><h2 class="mt-12 text-2xl font-bold">{{ t('资源与支持') }}</h2><p class="body-copy">{{ t('资源提供、合作关系与长期维护安排待补充。') }}</p></article><aside class="border-t border-white/15 pt-6 reveal-up" style="transition-delay: 100ms"><h2 class="text-xl font-bold">{{ t('联系与参与') }}</h2><p class="body-copy">{{ t('联系方式与参与渠道待公布。') }}</p><NuxtLink to="/visit" class="text-link">{{ t('参观指南') }}<span aria-hidden="true">→</span></NuxtLink></aside></div></section></div>
</template>
