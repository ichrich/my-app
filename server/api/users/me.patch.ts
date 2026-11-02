import { viewer, publicUser } from '../../utils/session'
import { db } from '../../utils/db'
import { z } from 'zod'
export default defineEventHandler(async event => {
  const user = await viewer(event)
  if (!user) throw createError({ statusCode: 401 })
  const data = await readValidatedBody(event, z.object({
    name: z.string().trim().min(2).max(40), bio: z.string().max(500),
    avatar: z.string().max(500).regex(/^(https:\/\/|$)/)
  }).parse)
  return db.user.update({ where: { id: user.id }, data, select: publicUser })
})
