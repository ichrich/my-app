import { db } from '../../../utils/db'
export default defineEventHandler(async event => {
  const kind = getRouterParam(event, 'kind')!
  const slug = getRouterParam(event, 'slug')!
  const entry = await db.entry.findFirst({ where: { kind, slug, published: true } })
  if (!entry) throw createError({ statusCode: 404, statusMessage: 'Page not found' })
  return entry
})
