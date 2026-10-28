<script setup lang="ts">
defineProps<{ error: { statusCode: number } }>()
</script>
<template><main class="shell section"><small class="eyebrow">GAMEHUB / {{ error.statusCode }}</small><h1>{{ error.statusCode === 404 ? 'Страница потерялась' : error.statusCode === 403 ? 'Доступ ограничен' : 'Возникла ошибка' }}</h1><button class="button" @click="clearError({ redirect: '/' })">На главную</button></main></template>
