export interface Entry {
  id: string; slug: string; kind: string; title: string; body: string; image: string; published: boolean; createdAt: string
  data: { genre?: string; platforms?: string[]; release?: string; status?: string; rating?: number; popularity?: number; requirements?: string; gallery?: string[]; trailer?: string; target?: string }
}
export interface Listing { items: Entry[]; pages: number; page: number; total: number }
export interface User { id: string; email: string; name: string; role: string; avatar: string; bio: string }
export interface LibraryItem { entryId: string; entry: Entry; favorite: boolean; status: string; updatedAt: string }
