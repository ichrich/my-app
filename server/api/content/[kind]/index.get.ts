import { db } from '../../../utils/db'
export default defineEventHandler(async event => {
  const kind = getRouterParam(event, 'kind')!
  const q = getQuery(event)
  const rows = await db.entry.findMany({ where: { kind, published: true }, orderBy: { createdAt: 'desc' } })
  const search = String(q.q || '').trim().toLowerCase()
  const results = rows.filter(row => {
    const d = row.data as Record<string, string | number | string[]>
    return row.title.toLowerCase().includes(search) &&
      (!q.genre || d.genre === q.genre) &&
      (!q.platform || (Array.isArray(d.platforms) && d.platforms.includes(String(q.platform)))) &&
      (!q.status || d.status === q.status) &&
      (!q.year || String(d.release || '').startsWith(String(q.year)))
  })
  if (q.sort === 'rating' || q.sort === 'popularity') {
    const metric = String(q.sort)
    const score = (row: typeof rows[number]) => Number((row.data as Record<string, unknown>)[metric] || 0)
    results.sort((a, b) => score(b) - score(a))
  }
  const size = 12
  const pages = Math.max(1, Math.ceil(results.length / size))
  const page = Math.min(pages, Math.max(1, Math.floor(Number(q.page) || 1)))
  return { items: results.slice((page - 1) * size, page * size), pages, page, total: results.length }
})
