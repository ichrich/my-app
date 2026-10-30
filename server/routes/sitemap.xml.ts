import { db } from '../utils/db'
export default defineEventHandler(async event => {
  const base = useRuntimeConfig(event).public.siteUrl.replace(/\/$/, '').replaceAll('&', '&amp;').replaceAll('<', '&lt;')
  const entries = await db.entry.findMany({ where: { published: true, kind: { in: ['games', 'news', 'events'] } } })
  const paths = ['/', '/games', '/news', '/events', ...entries.map(row => '/' + row.kind + '/' + row.slug)]
  setHeader(event, 'Content-Type', 'application/xml')
  return '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    paths.map(path => '<url><loc>' + base + path + '</loc></url>').join('') + '</urlset>'
})
