export async function prefetchRoutes(_: string[]) {
  // Preload route modules to speed up first navigation. Keep list small to avoid defeating code-splitting.
  const preloaders = [
    () => import('@/pages/causes/CausesPage'),
    () => import('@/pages/donations/DonationsPage'),
    () => import('@/pages/profile/ProfilePage')
  ]
  for (const load of preloaders) {
    try {
      await load()
    } catch {
      // Ignore prefetch errors to avoid impacting navigation
    }
  }
}
