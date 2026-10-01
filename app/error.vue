<script setup lang="ts">
const { t } = useLocale()
import type { NuxtError } from '#app'
const props = defineProps<{ error: NuxtError }>()
useSeoMeta({
  title: () => `${t(props.error.statusCode === 404 ? '页面不存在' : '页面暂时无法加载')} | CERN Minecraft`,
  description: () => t('请返回项目首页继续浏览。'),
})
</script>

<template>
  <main class="site-shell min-h-screen py-24"><p class="text-cern">{{ error.statusCode }}</p><h1 class="section-title mt-4">{{ t(error.statusCode === 404 ? '页面不存在' : '页面暂时无法加载') }}</h1><p class="my-6 text-muted">{{ t('请返回项目首页继续浏览。') }}</p><button class="solid-button" @click="clearError({ redirect: '/' })">{{ t('返回首页 →') }}</button></main>
</template>
