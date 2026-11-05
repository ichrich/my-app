import { db } from '../../utils/db'
export default defineEventHandler(async event => {
  const image = await db.image.findUnique({ where: { id: getRouterParam(event, 'id')! } })
  if (!image) throw createError({ statusCode: 404 })
  setHeaders(event, { 'Content-Type': image.mime, 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' })
  return Buffer.from(image.bytes)
})
