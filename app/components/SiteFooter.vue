<script setup lang="ts">
const assetPath = useAssetPath()
const paused = useState('motion-paused', () => false)
</script>
<template>
  <footer class="main-footer"><div class="footer-container">
    <div class="footer-links"><div><NuxtLink class="footer-brand" to="/"><span class="footer-brand-name">XINTINGLEI</span><span class="footer-brand-subtitle">CERN IN MINECRAFT</span></NuxtLink><p class="body-copy">项目介绍待补充。<br>非官方 Minecraft 科教项目。</p></div><div class="footer-column"><h2>项目内容</h2><NuxtLink to="/campus">园区还原</NuxtLink><NuxtLink to="/exhibition">科教展馆</NuxtLink><NuxtLink to="/exhibition#lab">网页实验室</NuxtLink></div><div class="footer-column"><h2>参观与参与</h2><NuxtLink to="/visit">参观指南</NuxtLink><NuxtLink to="/about">关于项目</NuxtLink><a href="https://home.cern/" target="_blank" rel="noopener noreferrer">CERN 官方网站 ↗</a></div></div>
    <div class="footer-meta"><a class="footer-source" href="https://github.com/BaizhouziYou/xintinglei-website" target="_blank" rel="noopener noreferrer">Design & Motion · Xintinglei <span>↗</span></a><a class="footer-license" :href="assetPath('/credits/xintinglei-LICENSE.txt')">AGPL-3.0</a><button class="motion-toggle" :aria-pressed="paused" @click="paused = !paused">{{ paused ? '开启动效' : '暂停动效' }}</button></div>
  </div></footer>
</template>
