<script setup lang="ts">
const content = useContentStore()
const search = ref('')

useSeoMeta({ title: 'GameHub', description: 'Каталог игр и личная игровая библиотека.' })

const { data, error, refresh } = await useAsyncData('home-recent-games', () => content.list('games'))
const recent = computed(() => data.value?.items.slice(0, 4) ?? [])

function findGame() {
  return navigateTo({ path: '/games', query: { q: search.value.trim() || undefined } })
}
</script>

<template>
  <section class="home-intro" aria-labelledby="home-title">
    <SignalField />
    <h1 id="home-title">Во что сыграем?</h1>
    <form class="catalog-search home-search" role="search" @submit.prevent="findGame">
      <input v-model="search" type="search" aria-label="Название игры" placeholder="Поиск по названию">
      <button class="button">Найти</button>
    </form>
    <nav class="home-shortcuts" aria-label="Подборки игр">
      <NuxtLink to="/games?sort=popularity">Популярное</NuxtLink>
      <NuxtLink to="/games?status=upcoming">Скоро выйдет</NuxtLink>
    </nav>
  </section>

  <section class="section" aria-labelledby="recent-games">
    <div class="section-head">
      <h2 id="recent-games">Недавно добавленные</h2>
      <NuxtLink to="/games">Все игры</NuxtLink>
    </div>
    <div v-if="error" class="availability panel" role="alert">
      <p>Не удалось загрузить игры.</p>
      <button class="button ghost" @click="refresh()">Повторить</button>
    </div>
    <div v-else-if="recent.length" class="grid">
      <EntryCard v-for="entry in recent" :key="entry.id" :entry="entry" />
    </div>
    <p v-else class="muted">В каталоге пока нет игр.</p>
  </section>
  <section class="section" aria-labelledby="home-sections">
    <h2 id="home-sections">Новости и события</h2>
    <div class="home-sections">
      <NuxtLink class="panel" to="/news"><AppIcon name="news" /> Новости игр</NuxtLink>
      <NuxtLink class="panel" to="/events"><AppIcon name="calendar" /> Игровые события</NuxtLink>
    </div>
  </section>
</template>
