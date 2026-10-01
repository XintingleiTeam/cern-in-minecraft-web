<script setup lang="ts">
const { t } = useLocale()
const assetPath = useAssetPath()
</script>
<template>
  <footer class="main-footer">
    <div class="footer-container">
      <div class="footer-links">
        <div class="footer-identity">
          <NuxtLink class="footer-brand" to="/" :aria-label="t('CERN Minecraft 项目首页')"><span class="footer-brand-name">XINTINGLEI</span><span class="footer-brand-subtitle">CERN IN MINECRAFT</span></NuxtLink>
          <p class="footer-description">{{ t('CERN 园区还原与科教展馆') }}<br>{{ t('非官方 Minecraft 科教项目') }}</p>
        </div>
        <nav class="footer-column" aria-labelledby="footer-explore"><h2 id="footer-explore">{{ t('探索项目') }}</h2><NuxtLink to="/about">{{ t('关于项目') }}</NuxtLink><NuxtLink to="/campus">{{ t('园区还原') }}</NuxtLink><NuxtLink to="/exhibition">{{ t('科教展馆') }}</NuxtLink></nav>
        <nav class="footer-column" aria-labelledby="footer-visit"><h2 id="footer-visit">{{ t('参观与体验') }}</h2><NuxtLink to="/visit">{{ t('参观指南') }}</NuxtLink><NuxtLink to="/exhibition#lab">{{ t('网页实验室') }}</NuxtLink></nav>
        <nav class="footer-column footer-resources" aria-labelledby="footer-resources"><h2 id="footer-resources">{{ t('相关资源') }}</h2><a href="https://home.cern/" target="_blank" rel="noopener noreferrer">{{ t('CERN 官方网站') }} <span aria-hidden="true">↗</span></a><a href="https://github.com/XintingleiTeam/cern-in-minecraft-web" target="_blank" rel="noopener noreferrer">{{ t('项目源码') }} <span aria-hidden="true">↗</span></a><a :href="assetPath('/reference/SOURCES.md')">{{ t('图片来源与署名') }}</a></nav>
      </div>
      <div class="footer-meta">
        <span class="footer-project-note">{{ 'CERN IN MINECRAFT · ' + t('新亭泪') }}</span>
        <div class="footer-credits"><a class="footer-source" href="https://github.com/BaizhouziYou/xintinglei-website" target="_blank" rel="noopener noreferrer">Design & Motion · Xintinglei <span aria-hidden="true">↗</span></a><a class="footer-license" :href="assetPath('/credits/xintinglei-LICENSE.txt')">AGPL-3.0</a></div>
      </div>
    </div>
  </footer>
</template>
