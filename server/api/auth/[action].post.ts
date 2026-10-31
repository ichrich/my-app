import { signIn, signOut, passwordHash, verify } from '../../utils/session'
import { db } from '../../utils/db'
import { z } from 'zod'
const credentials = z.object({
    email: z.string().trim().email().max(254).transform(value => value.toLowerCase()),
    password: z.string().min(8).max(128),
    name: z.string().trim().min(2).max(40).optional()
  })

function authenticate(user: { id: string; password: string } | null, password: string) {
  if (!user || !verify(password, user.password)) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }
  return user.id
}

async function register(input: z.infer<typeof credentials>, exists: boolean) {
  if (exists) throw createError({ statusCode: 409, statusMessage: 'Email already registered' })
  const { email, name, password } = input
  if (!name) throw createError({ statusCode: 400, statusMessage: 'Name required' })
  try {
    const user = await db.user.create({ data: { email, name, password: passwordHash(password) } })
    return user.id
  } catch (error) {
    if ((error as { code?: string }).code === 'P2002') throw createError({ statusCode: 409 })
    throw error
  }
}

export default defineEventHandler(async event => {
  const action = getRouterParam(event, 'action')
  if (action === 'logout') {
    await signOut(event)
    return { ok: true }
  }
  if (action !== 'register' && action !== 'login') throw createError({ statusCode: 404 })
  const input = await readValidatedBody(event, credentials.parse)
  const user = await db.user.findUnique({ where: { email: input.email } })
  const userId = action === 'register'
    ? await register(input, Boolean(user))
    : authenticate(user, input.password)
  await signIn(event, userId)
  return { ok: true }
})
