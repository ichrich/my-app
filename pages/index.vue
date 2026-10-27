<script setup lang="ts">
useSeoMeta({ title: 'GameHub', description: 'Главная страница игрового каталога.' })

const games = [
  {
    "title": "Slay the Spire",
    "genre": "Strategy",
    "image": "https://cdn.cloudflare.steamstatic.com/steam/apps/646570/header.jpg"
  },
  {
    "title": "Risk of Rain 2",
    "genre": "Action",
    "image": "https://cdn.cloudflare.steamstatic.com/steam/apps/632360/header.jpg"
  },
  {
    "title": "DOOM Eternal",
    "genre": "Action",
    "image": "https://cdn.cloudflare.steamstatic.com/steam/apps/782330/header.jpg"
  },
  {
    "title": "No Mans Sky",
    "genre": "Simulation",
    "image": "https://cdn.cloudflare.steamstatic.com/steam/apps/275850/header.jpg"
  }
]
const search = ref('')
const query = ref('')
const results = computed(() => games.filter(game => game.title.toLowerCase().includes(query.value)))
</script>

<template>
  <header class="shell header"><NuxtLink to="/">GameHub</NuxtLink></header>
  <main class="shell">
    <section class="intro" aria-labelledby="title">
      <SignalField />
      <h1 id="title">Во что сыграем?</h1>
      <form role="search" @submit.prevent="query = search.trim().toLowerCase()">
        <input v-model="search" type="search" aria-label="Название игры" placeholder="Поиск по названию">
        <button>Найти</button>
      </form>
    </section>

    <section class="games" aria-labelledby="games-title">
      <h2 id="games-title">{{ query ? 'Результаты поиска' : 'Недавно добавленные' }}</h2>
      <p v-if="!results.length" role="status">Игры не найдены.</p>
      <div v-else class="grid">
        <article v-for="game in results" :key="game.title">
          <img :src="game.image" alt="" loading="lazy">
          <div class="card-copy"><h3>{{ game.title }}</h3><p>{{ game.genre }}</p></div>
        </article>
      </div>
    </section>
  </main>
  <footer class="shell footer">GameHub</footer>
</template>
