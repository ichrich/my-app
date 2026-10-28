import { defineStore } from 'pinia'
import type { User } from '~/types/content'
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const ready = ref(false)
  async function load(request = useRequestFetch()) {
    user.value = await request<User | null>('/api/users/me')
    ready.value = true
  }
  async function ensureLoaded() {
    if (!ready.value) await load()
  }
  return { user, ready, load, ensureLoaded }
})
