<script setup lang="ts">
const route = useRoute()
const auth = useAuthStore()
const signup = computed(() => route.path === '/register')
const name = ref('')
const email = ref('')
const password = ref('')
const busy = ref(false)
const message = ref('')
useSeoMeta({ title: () => signup.value ? 'Регистрация' : 'Вход', robots: 'noindex' })
async function submit() {
  if (busy.value) return
  busy.value = true
  message.value = ''
  try {
    await $fetch('/api/auth/' + (signup.value ? 'register' : 'login'), { method: 'POST', body: { name: signup.value ? name.value : undefined, email: email.value, password: password.value } })
    await auth.load($fetch)
    await navigateTo('/profile')
  } catch (error) {
    const code = (error as { statusCode?: number }).statusCode
    message.value = code === 409 ? 'Этот адрес уже зарегистрирован.' : code === 401 ? 'Проверьте почту и пароль.' : 'Не удалось продолжить. Проверьте данные и повторите попытку.'
  } finally { busy.value = false }
}
</script>
<template><section class="panel narrow section account-panel">
  <small class="eyebrow">GAMEHUB / АККАУНТ</small><h1>{{ signup ? 'Регистрация' : 'Вход' }}</h1>
  <form class="stack" @submit.prevent="submit">
    <label v-if="signup">Имя<input v-model="name" required minlength="2" maxlength="40" autocomplete="nickname"></label>
    <label>Почта<input v-model="email" type="email" required autocomplete="email"></label>
    <label>Пароль<input v-model="password" type="password" required minlength="8" maxlength="128" :autocomplete="signup ? 'new-password' : 'current-password'"></label>
    <p v-if="message" role="alert">{{ message }}</p><button class="button" :disabled="busy">{{ signup ? 'Создать аккаунт' : 'Войти' }}</button>
  </form>
  <NuxtLink :to="signup ? '/login' : '/register'">{{ signup ? 'У меня есть аккаунт' : 'Создать аккаунт →' }}</NuxtLink>
</section></template>
