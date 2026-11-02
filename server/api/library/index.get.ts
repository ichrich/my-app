import { viewer } from '../../utils/session'
import { db } from '../../utils/db'
export default defineEventHandler(async event => {
  const user = await viewer(event)
  if (!user) throw createError({ statusCode: 401 })
  return db.library.findMany({ where: { userId: user.id, entry: { published: true } }, include: { entry: true }, orderBy: { updatedAt: 'desc' } })
})
