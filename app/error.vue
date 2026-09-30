<script setup lang="ts">
import type { NuxtError } from '#app'
defineProps<{ error: NuxtError }>()
</script>

<template>
  <main class="site-shell min-h-screen py-24"><p class="text-cern">{{ error.statusCode }}</p><h1 class="section-title mt-4">{{ error.statusCode === 404 ? '页面不存在' : '页面暂时无法加载' }}</h1><p class="my-6 text-muted">请返回项目首页继续浏览。</p><button class="solid-button" @click="clearError({ redirect: '/' })">返回首页 →</button></main>
</template>
