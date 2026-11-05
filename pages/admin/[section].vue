<script setup lang="ts">
import type { Entry, User } from '~/types/content'
definePageMeta({ middleware: 'admin', layout: 'admin', key: route => route.path })
useSeoMeta({ title: 'Управление порталом', robots: 'noindex' })
const sections: Record<string, string> = { games: 'Игры', news: 'Новости', events: 'События', banners: 'Баннеры', users: 'Пользователи' }
const section = String(useRoute().params.section)
if (!sections[section]) throw createError({ statusCode: 404, fatal: true })
const base = '/api/admin/' + section
const { data, error, refresh } = await useFetch<(Entry | User)[]>(base)
const search = ref('')
const sort = ref('latest')
const filter = ref('')
const rows = computed(() => {
  const label = (row: Entry | User) => 'title' in row ? row.title : row.name + ' ' + row.email
  const matches = (data.value || []).filter(row => label(row).toLowerCase().includes(search.value.toLowerCase()) &&
    (!filter.value || ('published' in row ? String(row.published) === filter.value : row.role === filter.value)))
  return sort.value === 'name' ? matches.sort((a, b) => label(a).localeCompare(label(b))) : matches
})
const blank = () => ({ id: '', title: '', slug: '', image: '', body: '', published: true, data: {} as Entry['data'] })
const form = ref(blank())
const opened = ref(false)
const platforms = ref('')
const gallery = ref('')
const busy = ref(false)
const message = ref('')
const removeId = ref('')
function edit(row?: Entry) {
  form.value = row ? { ...row, data: { ...row.data } } : blank()
  platforms.value = form.value.data.platforms?.join(', ') || ''
  gallery.value = form.value.data.gallery?.join('\n') || ''
  opened.value = true
  message.value = ''
}
async function action(path: string, method: 'POST' | 'PATCH' | 'DELETE', body?: object) {
  if (busy.value) return
  busy.value = true
  message.value = ''
  try {
    await $fetch(base + path, { method, body })
    opened.value = false
    removeId.value = ''
    await refresh()
    message.value = 'Изменения сохранены.'
  } catch { message.value = 'Операция не выполнена. Проверьте поля, уникальность адреса и права доступа.' }
  finally { busy.value = false }
}
function save() {
  const { id, data, ...body } = form.value
  const metadata = { ...data, platforms: platforms.value.split(',').map(s => s.trim()).filter(Boolean), gallery: gallery.value.split('\n').map(s => s.trim()).filter(Boolean) }
  return action(id ? '/' + id : '', id ? 'PATCH' : 'POST', { ...body, data: Object.fromEntries(Object.entries(metadata).filter(([, value]) => value !== '')) })
}
async function upload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const body = new FormData()
  body.append('image', file)
  busy.value = true
  try { form.value.image = (await $fetch<{ url: string }>('/api/uploads', { method: 'POST', body })).url }
  catch { message.value = 'Выберите JPEG, PNG или WebP размером до 3 МБ.' }
  finally { busy.value = false }
}
</script>
<template><section class="section"><small class="eyebrow">GAMEHUB / УПРАВЛЕНИЕ</small><h1>{{ sections[section] }}</h1>
  <nav class="tabs"><NuxtLink v-for="(label, key) in sections" :key="key" class="button ghost" :to="'/admin/' + key">{{ label }}</NuxtLink></nav>
  <p v-if="message" role="status">{{ message }}</p>
  <div class="filters"><input v-model="search" type="search" placeholder="Поиск" aria-label="Поиск">
    <ChoiceField v-model="sort" label="Сортировка" :options="[['latest', 'По умолчанию'], ['name', 'По названию']]" />
    <ChoiceField v-model="filter" label="Фильтр" :options="section === 'users'
      ? [['', 'Все роли'], ['user', 'Пользователь'], ['admin', 'Администратор']]
      : [['', 'Все записи'], ['true', 'Опубликованные'], ['false', 'Черновики']]" />
    <button v-if="section !== 'users'" class="button" @click="edit()">Добавить</button>
  </div>
  <form v-if="opened" class="panel stack" @submit.prevent="save">
    <label>Название<input v-model="form.title" required maxlength="120"></label><label>Адрес (slug)<input v-model="form.slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*"></label>
    <label>Текст<textarea v-model="form.body" rows="5" /></label><label>Ссылка на изображение<input v-model="form.image"></label>
    <label>Загрузить обложку<input type="file" accept="image/png,image/jpeg,image/webp" :disabled="busy" @change="upload"></label>
    <template v-if="section === 'games'"><div class="filters">
      <label>Жанр<input v-model="form.data.genre"></label><label>Платформы через запятую<input v-model="platforms"></label>
      <label>Выход<input v-model="form.data.release" type="date"></label><ChoiceField v-model="form.data.status" label="Статус" :options="[['released', 'Вышла'], ['upcoming', 'Ожидается']]" />
      <label>Рейтинг<input v-model.number="form.data.rating" type="number" min="0" max="10" step="0.1"></label><label>Популярность<input v-model.number="form.data.popularity" type="number" min="0"></label></div>
      <label>Системные требования<textarea v-model="form.data.requirements" /></label><label>Скриншоты, по одной ссылке на строку<textarea v-model="gallery" /></label><label>Трейлер<input v-model="form.data.trailer" type="url"></label>
    </template>
    <label v-if="section === 'banners'">Путь к игре<input v-model="form.data.target" placeholder="/games/slug"></label>
    <label class="check"><input v-model="form.published" type="checkbox"> Опубликовать</label>
    <div class="filters"><button class="button" :disabled="busy">Сохранить</button><button type="button" class="button ghost" :disabled="busy" @click="opened = false">Отмена</button></div>
  </form>
  <p v-if="error" role="alert">Не удалось загрузить данные.</p>
  <p v-else-if="!rows.length">Записей нет.</p>
  <div v-else class="table-wrap"><table><thead><tr><th>Название</th><th>Статус</th><th>Действия</th></tr></thead><tbody>
    <tr v-for="row in rows" :key="row.id"><template v-if="'title' in row">
      <td>{{ row.title }}</td><td>{{ row.published ? 'Опубликовано' : 'Черновик' }}</td><td>
      <button class="button ghost" @click="edit(row)">Изменить</button>
      <button v-if="removeId === row.id" class="button danger" :disabled="busy" @click="action('/' + row.id, 'DELETE')">Подтвердить</button>
      <button v-else class="button danger" @click="removeId = row.id">Удалить</button></td>
    </template><template v-else><td>{{ row.name }} · {{ row.email }}</td><td>{{ row.role }}</td><td>
      <button v-if="row.id !== useAuthStore().user?.id" class="button ghost" :disabled="busy" @click="action('/' + row.id, 'PATCH', { role: row.role === 'admin' ? 'user' : 'admin' })">Сменить роль</button>
    </td></template></tr>
  </tbody></table></div>
</section></template>
