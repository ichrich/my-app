<script setup lang="ts">
import type { LibraryItem, User } from '~/types/content'
definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Личный кабинет', robots: 'noindex' })
const auth = useAuthStore()
const user = auth.user!
const form = reactive({ name: user.name, avatar: user.avatar, bio: user.bio })
const { data: library, error } = await useFetch<LibraryItem[]>('/api/library')
const tab = ref('all')
const labels: Record<string, string> = { all: 'Библиотека', favorite: 'Избранное', wishlist: 'Хочу сыграть', activity: 'Активность', settings: 'Настройки' }
const states: Record<string, string> = { playing: 'Играю', finished: 'Пройдено', wishlist: 'Хочу сыграть' }
const items = computed(() => (library.value || []).filter(row => tab.value === 'favorite' ? row.favorite : tab.value === 'wishlist' ? row.status === 'wishlist' : true))
const message = ref('')
const busy = ref(false)
async function save() {
  busy.value = true
  try { auth.user = await $fetch<User>('/api/users/me', { method: 'PATCH', body: form }); message.value = 'Профиль сохранён.' }
  catch { message.value = 'Проверьте поля и повторите попытку.' }
  finally { busy.value = false }
}
async function logout() {
  try { await $fetch('/api/auth/logout', { method: 'POST' }); auth.user = null; await navigateTo('/') }
  catch { message.value = 'Не удалось завершить сеанс.' }
}
</script>
<template><section class="section">
  <div class="panel profile-head"><img v-if="auth.user?.avatar" :src="auth.user.avatar" alt="" class="avatar">
    <div><small class="eyebrow">ЛИЧНЫЙ КАБИНЕТ</small><h1>{{ auth.user?.name }}</h1><p>{{ auth.user?.bio }}</p></div>
    <NuxtLink v-if="auth.user?.role === 'admin'" class="button" to="/admin/games">Управление порталом</NuxtLink><button class="button ghost" @click="logout">Выйти</button>
  </div>
  <div class="tabs"><button v-for="(label, key) in labels" :key="key" class="button ghost" :aria-pressed="tab === key" @click="tab = key">{{ label }}</button></div>
  <p v-if="message" role="status">{{ message }}</p>
  <form v-if="tab === 'settings'" class="panel stack narrow" @submit.prevent="save">
    <label>Имя<input v-model="form.name" required minlength="2" maxlength="40"></label><label>Ссылка на аватар<input v-model="form.avatar" type="url"></label>
    <label>О себе<textarea v-model="form.bio" maxlength="500" /></label><button class="button" :disabled="busy">Сохранить</button>
  </form>
  <p v-else-if="error" role="alert">Библиотека временно недоступна.</p>
  <p v-else-if="!items.length">Здесь пока пусто. <NuxtLink to="/games">Перейти в каталог →</NuxtLink></p>
  <ul v-else-if="tab === 'activity'" class="stack"><li v-for="row in items" :key="row.entryId">{{ row.updatedAt.slice(0, 10) }} · {{ row.entry.title }} · {{ states[row.status] || 'Избранное' }}</li></ul>
  <div v-else class="grid"><div v-for="row in items" :key="row.entryId"><EntryCard :entry="row.entry" /><p class="muted">{{ states[row.status] }}</p></div></div>
</section></template>
