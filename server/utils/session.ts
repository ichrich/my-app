import { db } from './db'
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'
const digest = (token: string) => createHash('sha256').update(token).digest('hex')
export function passwordHash(password: string, salt = randomBytes(16).toString('hex')) {
  return salt + ':' + scryptSync(password, salt, 64).toString('hex')
}
export function verify(password: string, stored: string) {
  return timingSafeEqual(Buffer.from(stored), Buffer.from(passwordHash(password, stored.split(':')[0])))
}
export const publicUser = { id: true, email: true, name: true, role: true, avatar: true, bio: true } as const
export async function viewer(event: H3Event) {
  const token = getCookie(event, 'gh_session')
  if (!token) return null
  const session = await db.session.findUnique({ where: { token: digest(token) }, include: { user: { select: publicUser } } })
  return session && session.expires > new Date() ? session.user : null
}
export async function signIn(event: H3Event, userId: string) {
  await signOut(event)
  const token = randomBytes(32).toString('hex')
  const maxAge = 60 * 60 * 24 * 7
  await db.session.create({ data: { token: digest(token), userId, expires: new Date(Date.now() + maxAge * 1000) } })
  setCookie(event, 'gh_session', token, { path: '/', httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge })
}
export async function signOut(event: H3Event) {
  const token = getCookie(event, 'gh_session')
  if (token) await db.session.deleteMany({ where: { token: digest(token) } })
  deleteCookie(event, 'gh_session', { path: '/' })
}
