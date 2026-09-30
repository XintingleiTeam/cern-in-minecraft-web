<script setup lang="ts">
useSeoMeta({ title: '园区还原 | CERN Minecraft', description: '浏览建筑还原档案与园区概念导览。建筑内容和图片待补充。' })
</script>

<template>
  <div><section class="intro"><div class="site-shell"><NuxtLink class="breadcrumb" to="/">首页 /</NuxtLink><h1>园区还原</h1><p>建筑资料、现实参考与 Minecraft 还原记录待补充。</p></div></section><section class="site-shell section"><div class="section-heading"><h2 class="section-title">建筑目录</h2><CampusMap /></div><p class="mb-8 text-sm text-muted">选择建筑，查看现实与还原的对照及项目档案。</p><BuildingCards /></section></div>
</template>
