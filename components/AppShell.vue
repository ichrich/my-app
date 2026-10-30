<script setup lang="ts">
defineProps<{ admin?: boolean }>()
const links = [
  { to: '/games', label: 'Игры', icon: 'games' as const },
  { to: '/news', label: 'Новости', icon: 'news' as const },
  { to: '/events', label: 'События', icon: 'calendar' as const },
]
</script>
<template>
  <div class="app-frame">
    <a class="skip-link button" href="#main-content">К содержимому</a>
    <header class="app-header"><div class="header-inner shell">
      <NuxtLink class="brand" to="/" aria-label="GameHub, главная"><AppIcon name="brand" /><span>GameHub</span></NuxtLink>
      <nav class="rail-links" aria-label="Основная навигация">
        <NuxtLink v-for="link in links" :key="link.to" :to="link.to" :title="link.label" :aria-label="link.label">
          <AppIcon :name="link.icon" /><span>{{ link.label }}</span>
        </NuxtLink>
      </nav>
    </div></header>
    <div class="app-workspace">
      <main id="main-content" class="shell"><slot /></main>
    </div>
    <footer class="app-footer">
      <div class="shell footer">
        <NuxtLink class="brand" to="/"><AppIcon name="brand" /> GameHub</NuxtLink>
        <NuxtLink to="/games">Каталог игр</NuxtLink>
      </div>
    </footer>
  </div>
</template>
