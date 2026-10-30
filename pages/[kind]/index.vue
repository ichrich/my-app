<script setup lang="ts">
const content = useContentStore()
const route = useRoute()
const labels: Record<string, string> = { games: 'Каталог игр', news: 'Новости', events: 'События' }
const kind = computed(() => String(route.params.kind))
if (!["games","news"].includes(kind.value)) throw createError({ statusCode: 404, fatal: true })
useSeoMeta({ title: () => labels[kind.value] })
const query = computed(() => route.query)
const { data, status, error, refresh } = await useAsyncData('catalog:' + kind.value, () => content.list(kind.value, query.value), { watch: [kind, query] })
const filters = [
  { key: 'genre', label: 'Жанр', options: [['RPG','RPG'], ['Action','Action'], ['Adventure','Adventure'], ['Strategy','Strategy'], ['Simulation','Simulation'], ['Puzzle','Puzzle']] },
  { key: 'platform', label: 'Платформа', options: [['PC','PC'], ['PlayStation','PlayStation'], ['Xbox','Xbox'], ['Switch','Switch']] },
  { key: 'status', label: 'Статус', options: [['released','Вышла'], ['upcoming','Ожидается']] }
]
const sortOptions = [['', 'По дате добавления'], ['popularity', 'По популярности'], ['rating', 'По рейтингу']]
const hasCriteria = computed(() => ['q', 'genre', 'platform', 'status', 'year', 'sort'].some(key => route.query[key]))
const search = ref(String(route.query.q || ''))
watch(() => route.query.q, value => { search.value = String(value || '') })
function update(key: string, value: string) {
  return navigateTo({ query: { ...route.query, page: undefined, [key]: value || undefined } })
}
</script>
<template>
  <div class="section"><h1>{{ labels[kind] }}</h1>
    <form class="catalog-search" role="search" @submit.prevent="update('q', search.trim())">
      <input v-model="search" type="search" aria-label="Поиск по названию" placeholder="Поиск по названию">
      <button class="button">Найти</button>
    </form>
    <div v-if="kind === 'games'" class="catalog-filters" role="group" aria-label="Фильтры каталога">
      <ChoiceField v-for="filter in filters" :key="filter.key" :label="filter.label"
        :model-value="String(route.query[filter.key] || '')" :options="[['', filter.label], ...filter.options]"
        @update:model-value="update(filter.key, $event || '')" />
      <input aria-label="Год выхода" placeholder="Год выхода" type="number" min="1970" max="2100"
        :value="route.query.year" @change="update('year', ($event.target as HTMLInputElement).value)">
    </div>
    <div class="catalog-results-bar">
      <p class="muted">{{ data ? 'Найдено: ' + data.total : 'Результаты' }}</p>
      <NuxtLink v-if="hasCriteria" class="catalog-reset" :to="route.path" @click="search = ''">Сбросить</NuxtLink>
      <ChoiceField v-if="kind === 'games'" label="Сортировка"
        :model-value="String(route.query.sort || '')" :options="sortOptions"
        @update:model-value="update('sort', $event || '')" />
    </div>
    <p v-if="status === 'pending'" role="status">Загружаем…</p>
    <div v-else-if="error" role="alert">Ошибка загрузки. <button class="button ghost" @click="refresh()">Повторить</button></div>
    <p v-else-if="!data?.items.length">По заданным условиям ничего не найдено.</p>
    <template v-else>
      <div class="grid"><EntryCard v-for="entry in data.items" :key="entry.id" :entry="entry" /></div>
      <nav v-if="data.pages > 1" class="pager" aria-label="Страницы">
        <NuxtLink v-if="data.page > 1" class="button ghost" :to="{query:{ ...route.query, page: data.page - 1 }}">← Назад</NuxtLink>
        <span>{{ data.page }} / {{ data.pages }}</span>
        <NuxtLink v-if="data.page < data.pages" class="button ghost" :to="{query:{ ...route.query, page: data.page + 1 }}">Далее →</NuxtLink>
      </nav>
    </template>
  </div>
</template>
