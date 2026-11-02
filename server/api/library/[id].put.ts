import { viewer } from '../../utils/session'
import { db } from '../../utils/db'
import { z } from 'zod'
export default defineEventHandler(async event => {
  const user = await viewer(event)
  if (!user) throw createError({ statusCode: 401 })
  const entryId = getRouterParam(event, 'id')!
  if (!await db.entry.findFirst({ where: { id: entryId, kind: 'games', published: true } })) throw createError({ statusCode: 404 })
  const data = await readValidatedBody(event, z.object({ favorite: z.boolean(), status: z.enum(['', 'wishlist', 'playing', 'finished']) }).parse)
  const key = { userId: user.id, entryId }
  const where = { userId_entryId: key }
  if (!data.favorite && !data.status) {
    await db.library.deleteMany({ where: key })
    return null
  }
  return db.library.upsert({ where, create: { ...key, ...data }, update: data })
})
