<script setup lang="ts">
const assetPath = useAssetPath()
import { exhibits } from '~/data/catalog'
import { cernMedia } from '~/data/media'
useSeoMeta({ title: 'CERN · Minecraft 项目', description: 'CERN 园区还原与 Minecraft 科教展馆项目。当前为简体中文演示版本。' })
</script>
<template>
  <div class="home-page">
    <HeroCarousel />
    <section class="site-shell project-introduction reveal-up"><div><p class="content-type">CERN · MINECRAFT 项目</p><h2 class="section-title">园区还原与科教展馆</h2></div><div><p class="body-copy">项目简介待补充。建筑还原、科教展馆与 Minecraft 游戏内体验内容待补充。</p><NuxtLink class="text-link" to="/about">了解项目 →</NuxtLink></div></section>
    <section class="site-shell section"><div class="section-heading reveal-up"><h2 class="section-title">园区还原</h2><NuxtLink class="text-link" to="/campus">全部建筑与导览 <span aria-hidden="true">→</span></NuxtLink></div><div class="feature-layout campus-feature"><ImageCompare class="mask-reveal-el" dark /><div class="reveal-up"><p class="editorial-category">建筑与空间</p><h3>现实与还原</h3><p class="body-copy">现实参考照片、建筑资料与 Minecraft 还原记录待补充。</p><NuxtLink class="text-link" to="/campus">查看建筑档案 →</NuxtLink></div></div><BuildingCards /></section>
    <section class="feature-section"><div class="site-shell"><div class="section-heading reveal-up"><h2 class="section-title">科教展馆</h2><NuxtLink to="/exhibition" class="text-link">参观科教展馆 <span aria-hidden="true">→</span></NuxtLink></div><div class="exhibition-layout"><ReferencePhoto :media="cernMedia[3]" class="mask-reveal-el" caption="CERN 科学演示 · 临时展示图片" /><div class="reveal-up"><p class="editorial-category">在 Minecraft 中体验</p><p class="body-copy">展馆主题、学习路线与游戏内互动内容待补充。</p><div class="exhibit-links"><NuxtLink v-for="exhibit in exhibits" :key="exhibit.slug" :to="`/exhibition/${exhibit.slug}`"><span>{{ exhibit.name }}<small>主题介绍待补充</small></span><span aria-hidden="true">↗</span></NuxtLink></div></div></div></div></section>
    <section class="site-shell section progress-section"><div class="section-heading"><h2 class="section-title">项目进展</h2><span class="content-type">建造与开发记录</span></div><div v-for="category in ['建造记录', '展馆制作', '项目公告']" :key="category" class="progress-row"><span class="progress-date">日期待补充</span><span class="editorial-category">{{ category }}</span><div><h3>更新记录待补充</h3><p>标题、摘要与正式内容待补充。</p></div></div></section>
    <section class="marquee-section" aria-label="CERN in Minecraft"><div class="marquee-content" aria-hidden="true"><div v-for="n in 2" :key="n" class="marquee-group"><span v-for="m in 2" :key="m">CERN <span class="outline">IN MINECRAFT</span> XINTINGLEI</span></div></div></section>
    <section class="image-strip-section" aria-label="CERN 官方参考图集"><p class="site-shell content-type mb-5">CERN 官方照片 · 临时参考素材</p><div class="strip-container" aria-hidden="true"><div v-for="n in 8" :key="n" class="strip-item"><img :src="assetPath(cernMedia[(n - 1) % 4]!.src)" alt="" loading="lazy"></div></div><div class="site-shell strip-credits"><a v-for="media in cernMedia" :key="media.src" :href="media.source" target="_blank" rel="noopener noreferrer">{{ media.title }} · {{ media.credit }} ↗</a></div></section>
    <section class="cta-section"><div class="cta-blur-bg"></div><div class="site-shell cta-container reveal-up"><h2 class="section-title">参观与参与</h2><p class="body-copy">服务器信息与参观方式待公布。</p><NuxtLink class="cta-button mt-5" to="/visit">查看参观指南 →</NuxtLink></div></section>
  </div>
</template>
