<script setup lang="ts">
import type { Entry } from '~/types/content'
defineProps<{ entry: Entry }>()
const kindLabels: Record<string, string> = { games: 'Игра', events: 'Событие', news: 'Новость' }
</script>
<template>
  <article class="card">
    <div class="art"><img v-if="entry.image" :src="entry.image" alt="" loading="lazy"><span v-if="entry.data.rating" class="score"><AppIcon name="star" /> {{ entry.data.rating }}</span></div>
    <div class="card-copy"><small>{{ entry.data.genre || kindLabels[entry.kind] }}</small><h3>{{ entry.title }}</h3><p>{{ entry.data.platforms?.join(' · ') || entry.body.slice(0, 96) }}</p></div>
  </article>
</template>
