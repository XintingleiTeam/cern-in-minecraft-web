<script setup lang="ts">
const { t } = useLocale()
useSeoMeta({ title: () => t('园区还原 | CERN Minecraft'), description: () => t('浏览建筑还原档案与园区概念导览。建筑内容和图片待补充。') })
</script>

<template>
  <div><section class="intro"><div class="site-shell reveal-up"><NuxtLink class="breadcrumb" to="/">{{ t('首页 /') }}</NuxtLink><h1>{{ t('园区还原') }}</h1><p>{{ t('建筑资料、现实参考与 Minecraft 还原记录待补充。') }}</p></div></section><section class="site-shell section"><div class="section-heading reveal-up"><h2 class="section-title">{{ t('建筑目录') }}</h2><CampusMap /></div><p class="mb-8 text-sm text-muted reveal-up">{{ t('选择建筑，查看现实与还原的对照及项目档案。') }}</p><BuildingCards /></section></div>
</template>
