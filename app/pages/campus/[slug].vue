<script setup lang="ts">
const { t } = useLocale()
import { buildings } from '~/data/catalog'
import { cernMedia } from '~/data/media'
definePageMeta({ key: route => route.path })
const route = useRoute()
const index = buildings.findIndex(item => item.slug === route.params.slug)
const building = buildings[index]
if (!building) throw createError({ statusCode: 404, message: t('建筑页面不存在') })
const media = cernMedia[index]!
useSeoMeta({ title: () => `${t(building.name)} | CERN Minecraft`, description: () => t('{name}的现实参考与 Minecraft 还原档案，内容待补充。', { name: t(building.name) }) })
</script>
<template>
  <div v-if="building" class="building-detail"><header class="detail-intro site-shell reveal-up"><nav class="detail-breadcrumb" :aria-label="t('面包屑')"><NuxtLink to="/">{{ t('首页') }}</NuxtLink><span>/</span><NuxtLink to="/campus">{{ t('园区还原') }}</NuxtLink><span>/</span><span>{{ t('建筑档案') }}</span></nav><p class="detail-category">{{ t('建筑还原') }}</p><h1>{{ t(building.name) }}</h1><p class="detail-lead">{{ t('建筑名称、位置与简介待补充。') }}</p><div class="detail-byline"><span>{{ t('还原状态：待补充') }}</span><span>{{ t('更新日期：待补充') }}</span></div></header>
    <section class="site-shell detail-body"><ImageCompare class="reveal-up" :subject="t(building.name)" :media="media" /><div class="detail-grid"><article class="article-copy"><nav class="article-index reveal-up" :aria-label="t('本页目录')"><a href="#overview">{{ t('建筑介绍') }}</a><a href="#reconstruction">{{ t('还原记录') }}</a><a href="#references">{{ t('参考资料') }}</a></nav><section id="overview" class="reveal-up"><h2>{{ t('建筑介绍') }}</h2><p class="body-copy">{{ t('建筑背景、用途与空间结构待补充。') }}</p></section><section id="reconstruction" class="reveal-up"><h2>{{ t('还原记录') }}</h2><p class="body-copy">{{ t('建造过程、空间比例与还原细节待补充。') }}</p><div class="record-placeholder"><span>{{ t('日期待补充') }}</span><p>{{ t('建造记录待补充。') }}</p></div></section><section id="references" class="reveal-up"><h2>{{ t('参考资料') }}</h2><p class="body-copy">{{ t('工程图纸与正式建筑资料待补充。当前照片用于演示页面布局，尚未与建筑档案建立对应关系。') }}</p><a :href="media.source" class="source-reference" target="_blank" rel="noopener noreferrer"><span>{{ t(media.title) }}<small>{{ media.credit }}</small></span><span aria-hidden="true">↗</span></a></section></article><aside class="archive-sidebar reveal-up" style="transition-delay: 100ms"><h2>{{ t('建筑档案') }}</h2><dl class="metadata"><div><dt>{{ t('所在区域') }}</dt><dd>{{ t('待补充') }}</dd></div><div><dt>{{ t('还原状态') }}</dt><dd>{{ t('待补充') }}</dd></div><div><dt>{{ t('建造成员') }}</dt><dd>{{ t('待补充') }}</dd></div><div><dt>{{ t('资料整理') }}</dt><dd>{{ t('待补充') }}</dd></div></dl><h3>{{ t('继续浏览') }}</h3><NuxtLink v-for="other in buildings.filter(b => b.slug !== building.slug)" :key="other.slug" :to="`/campus/${other.slug}`" class="related-building">{{ t(other.name) }} <span aria-hidden="true">→</span></NuxtLink><NuxtLink to="/campus" class="text-link mt-4">{{ t('全部建筑与导览 →') }}</NuxtLink></aside></div></section>
  </div>
</template>
