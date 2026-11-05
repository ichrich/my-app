import type { H3Event } from 'h3'
import { viewer, publicUser } from './session'
import { db } from './db'
import { z } from 'zod'
const entry = z.object({
  slug: z.string().min(1).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(1).max(120), body: z.string().max(30000),
  image: z.string().max(1000).regex(/^(https:\/\/|\/[^/]|$)/),
  published: z.boolean(),
  data: z.object({
    genre: z.string().max(60).optional(), platforms: z.array(z.string().max(40)).max(10).optional(),
    release: z.string().max(10).optional(), status: z.string().max(30).optional(),
    rating: z.number().min(0).max(10).optional(), popularity: z.number().nonnegative().optional(),
    requirements: z.string().max(3000).optional(), gallery: z.array(z.string().url().startsWith('https://')).max(12).optional(),
    trailer: z.string().url().startsWith('https://').optional(), target: z.string().regex(/^\/games\/[a-z0-9-]+$/).optional()
  })
})
export const adminHandler = defineEventHandler(async event => {
  const user = await viewer(event)
  if (!user || user.role !== 'admin') throw createError({ statusCode: user ? 403 : 401 })
  const kind = getRouterParam(event, 'kind')!
  const id = getRouterParam(event, 'id')
  const method = getMethod(event)
  return kind === 'users'
    ? manageUsers(event, method, id, user.id)
    : manageEntries(event, method, kind, id)
})

async function manageUsers(event: H3Event, method: string, id: string | undefined, adminId: string) {
  if (method === 'GET') return db.user.findMany({ select: publicUser, orderBy: { name: 'asc' } })
  if (method !== 'PATCH' || !id || id === adminId) throw createError({ statusCode: 400 })
  const data = await readValidatedBody(event, z.object({ role: z.enum(['admin', 'user']) }).parse)
  return db.user.update({ where: { id }, data, select: publicUser })
}

async function manageEntries(event: H3Event, method: string, kind: string, id?: string) {
  if (!['games', 'news', 'events', 'banners'].includes(kind)) throw createError({ statusCode: 404 })
  if (method === 'GET') return db.entry.findMany({ where: { kind }, orderBy: { createdAt: 'desc' } })
  if (method === 'POST' && !id) {
    const data = await readValidatedBody(event, entry.parse)
    return db.entry.create({ data: { kind, ...data } })
  }
  if (!id) throw createError({ statusCode: 405 })
  const where = { id, kind }
  if (!await db.entry.findFirst({ where })) throw createError({ statusCode: 404 })
  if (method === 'PATCH') return db.entry.update({ where, data: await readValidatedBody(event, entry.parse) })
  if (method === 'DELETE') return db.entry.delete({ where })
  throw createError({ statusCode: 405 })
}
