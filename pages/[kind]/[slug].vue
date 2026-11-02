<script setup lang="ts">
import type { LibraryItem } from '~/types/content'
definePageMeta({ key: route => route.path })
const content = useContentStore()
const route = useRoute()
const auth = useAuthStore()
const request = useRequestFetch()
const { data: entry, error } = await useAsyncData('entry:' + route.path, () => content.detail(String(route.params.kind), String(route.params.slug)))
if (error.value) throw createError({ statusCode: error.value.statusCode || 500, fatal: true })
useSeoMeta({ title: () => entry.value?.title, description: () => entry.value?.body.slice(0, 155), ogTitle: () => entry.value?.title, ogImage: () => entry.value?.image })
const isGame = computed(() => entry.value?.kind === 'games')
const { data: related } = await useAsyncData('related:' + route.path, async () => {
  if (!isGame.value) return []
  const list = await content.list('games', { genre: entry.value?.data.genre })
  return list.items.filter(item => item.id !== entry.value?.id).slice(0, 4)
})
const { data: news } = await useAsyncData('game-news:' + route.path, async () => {
  if (!isGame.value) return []
  const list = await content.list('news', { q: entry.value?.title })
  return list.items
})
const tab = ref('Описание')
const busy = ref(false)
const message = ref('')
const library = ref<LibraryItem[]>([])
watch(() => auth.user?.id, async id => {
  try { library.value = id && isGame.value ? await request<LibraryItem[]>('/api/library') : [] }
  catch { message.value = 'Не удалось загрузить библиотеку.' }
}, { immediate: true })
const saved = computed(() => library.value.find(row => row.entryId === entry.value?.id))
async function save(favorite: boolean, status: string) {
  if (!auth.user) return navigateTo('/login')
  if (!entry.value || busy.value) return
  busy.value = true
  message.value = ''
  try {
    await $fetch('/api/library/' + entry.value.id, { method: 'PUT', body: { favorite, status } })
    library.value = await $fetch<LibraryItem[]>('/api/library')
  } catch { message.value = 'Не удалось сохранить изменения.' }
  finally { busy.value = false }
}
</script>
<template>
  <article v-if="entry" class="section">
    <NuxtLink :to="'/' + entry.kind" class="back">← К списку</NuxtLink>
    <div class="hero detail"><img v-if="entry.image" :src="entry.image" alt=""><div class="hero-copy">
      <small>{{ entry.data.genre || 'GAMEHUB' }}</small><h1>{{ entry.title }}</h1>
      <p>{{ [entry.data.platforms?.join(' · '), entry.data.release].filter(Boolean).join(' / ') }}</p>
      <div v-if="isGame" class="filters">
        <button class="button" :disabled="busy" :aria-pressed="!!saved?.favorite" @click="save(!saved?.favorite, saved?.status || '')"><AppIcon name="heart" /> {{ saved?.favorite ? 'В избранном' : 'В избранное' }}</button>
        <ChoiceField label="Игровой статус" :disabled="busy" :model-value="saved?.status || ''"
          :options="[['', 'Добавить в библиотеку'], ['wishlist', 'Хочу сыграть'], ['playing', 'Играю'], ['finished', 'Пройдено']]"
          @update:model-value="save(!!saved?.favorite, $event || '')" />
      </div><p v-if="message" role="alert">{{ message }}</p>
    </div></div>
    <div v-if="isGame" class="tabs"><button v-for="name in ['Описание', 'Новости', 'Системные требования']" :key="name" class="button ghost" :aria-pressed="tab === name" @click="tab = name">{{ name }}</button></div>
    <Transition name="fade" mode="out-in"><section :key="tab" class="section">
      <template v-if="tab === 'Описание'"><p class="body-copy">{{ entry.body }}</p>
        <div v-if="entry.data.gallery?.length" class="grid"><a v-for="src in entry.data.gallery" :key="src" :href="src"><img class="shot" :src="src" alt="Скриншот игры" loading="lazy"></a></div>
        <p v-if="entry.data.trailer"><a class="button ghost" :href="entry.data.trailer" target="_blank" rel="noopener">Смотреть трейлер ↗</a></p>
      </template>
      <template v-else-if="tab === 'Новости'"><div v-if="news?.length" class="grid"><EntryCard v-for="item in news" :key="item.id" :entry="item" /></div><p v-else>Новостей пока нет.</p></template>
      <p v-else class="body-copy">{{ entry.data.requirements || 'Системные требования пока не опубликованы.' }}</p>
    </section></Transition>
    <section v-if="related?.length" class="section"><h2>Похожие игры</h2><div class="grid"><EntryCard v-for="item in related" :key="item.id" :entry="item" /></div></section>
  </article>
</template>
