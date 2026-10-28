<script setup lang="ts">
const paths = {
  games: 'M6 8h12l3 10a2 2 0 0 1-3 2l-4-3h-4l-4 3a2 2 0 0 1-3-2L6 8Z M7 11v4m-2-2h4m7-1h.01m2 2h.01',
  news: 'M5 3h14v18H5z M8 7h8M8 11h8M8 15h5',
  calendar: 'M4 5h16v16H4z M8 3v4m8-4v4M4 10h16',
  bookmark: 'M6 3h12v18l-6-4-6 4V3Z',
  user: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2',
  search: 'M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-2 5 6 6',
  brand: 'M12 3 21 12 12 21 3 12 12 3Z M12 8 16 12 12 16 8 12 12 8Z',
  chevron: 'm6 9 6 6 6-6',
  heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8l8.8 8.8 8.8-8.8a5.5 5.5 0 0 0 0-7.8Z',
  star: 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z'
}
defineProps<{ name: keyof typeof paths }>()
</script>
<template>
  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <path :d="paths[name]" />
  </svg>
</template>
