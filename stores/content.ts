import { defineStore } from 'pinia'
import type { Entry, Listing } from '~/types/content'

export const useContentStore = defineStore('content', () => {
  function list(kind: string, query?: Record<string, unknown>) {
    return $fetch<Listing>('/api/content/' + kind, { query })
  }

  function detail(kind: string, slug: string) {
    return $fetch<Entry>('/api/content/' + kind + '/' + slug)
  }

  return { list, detail }
})
