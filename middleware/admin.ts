export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()
  await auth.ensureLoaded()
  if (!auth.user) return navigateTo('/login')
  if (auth.user.role !== 'admin') return abortNavigation(createError({ statusCode: 403, statusMessage: 'Access denied' }))
})
