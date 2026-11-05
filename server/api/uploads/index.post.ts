import { viewer } from '../../utils/session'
import { db } from '../../utils/db'
import { createHash } from 'node:crypto'
export default defineEventHandler(async event => {
  const user = await viewer(event)
  if (user?.role !== 'admin') throw createError({ statusCode: user ? 403 : 401 })
  const max = 3 * 1024 * 1024
  const length = Number(getHeader(event, 'content-length'))
  if (!Number.isSafeInteger(length) || length <= 0 || length > max + 8192) throw createError({ statusCode: 413 })
  const image = (await readMultipartFormData(event))?.find(part => part.name === 'image')
  const bytes = image?.data
  if (!bytes || bytes.length > max) throw createError({ statusCode: 400 })
  const mime = bytes.subarray(0, 8).toString('hex') === '89504e470d0a1a0a' ? 'image/png' :
    bytes.subarray(0, 3).toString('hex') === 'ffd8ff' ? 'image/jpeg' :
    bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP' ? 'image/webp' : null
  if (!mime) throw createError({ statusCode: 415 })
  const id = createHash('sha256').update(bytes).digest('hex')
  await db.image.upsert({ where: { id }, create: { id, mime, bytes }, update: {} })
  return { url: '/api/uploads/' + id }
})
