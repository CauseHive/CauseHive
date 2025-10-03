import { Outlet, Link, NavLink, useLocation, useNavigation, useNavigate } from 'react-router-dom'
import { authStore } from '@/lib/auth'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useEffect } from 'react'
import { Toaster } from '@/components/ui/toast'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export function AppLayout() {
  const user = authStore.getUser()
  const navigate = useNavigate()
  const location = useLocation()
  const navigation = useNavigation()

  const { data: unreadCount } = useQuery({
    queryKey: ['notifications-unread-count'],
    queryFn: async () => {
      const { data } = await api.get('/notifications/', { params: { unread_only: true, page_size: 1 } })
      return data.count as number
    },
    enabled: !!user,
    staleTime: 30_000
  })
  const { data: combined } = useUserProfile()
  const profile = combined?.profile

  // Google OAuth is now handled by dedicated callback page

  useEffect(() => {
    NProgress.configure({ showSpinner: false })
  }, [])

  useEffect(() => {
    if (navigation.state === 'loading') {
      NProgress.start()
    } else {
      NProgress.done()
      // Smoothly restore scroll to top on completed navigation
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
    }
  }, [navigation.state])
  const signOut = async () => {
    try {
      const refresh = localStorage.getItem('ch_refresh')
      await api.post('/user/auth/logout/', refresh ? { refresh } : undefined)
    } catch (err) {
      // Log logout failure for observability but continue to clear local state
      console.warn('Logout request failed; clearing local auth state anyway', err)
    }
    authStore.clear(); navigate('/', { replace: true })
  }
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Toaster>
      <header className="sticky top-0 z-40 border-b border-slate-200 backdrop-blur bg-white/90">
        <div className="container flex items-center justify-between py-3">
          <Link to="/" className="font-semibold tracking-tight text-lg">
            CauseHive
          </Link>
          <nav className="flex items-center gap-5 text-sm">
            {user && (
              <>
                <NavLink to="/notifications" className={({isActive})=> isActive? 'text-primary font-medium relative':'text-slate-600 relative'}>
                  Notifications
                  {typeof unreadCount === 'number' && unreadCount > 0 && (
                    <span className="absolute -top-2 -right-3 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] font-medium text-white">{unreadCount > 99 ? '99+' : unreadCount}</span>
                  )}
                </NavLink>
                <NavLink to="/profile" className={({isActive})=> isActive? 'outline outline-2 outline-emerald-500 rounded-full':''}>
                  {!profile && (
                    <div className="h-8 w-8 rounded-full animate-pulse bg-slate-300 dark:bg-slate-700" aria-label="Loading avatar" />
                  )}
                  {profile?.profile_picture ? (
                    <img src={profile.profile_picture} alt={user.first_name || user.email} className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                  ) : profile && (
                    <div className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm">{(user.first_name || user.email).slice(0,1).toUpperCase()}</div>
                  )}
                </NavLink>
                <button onClick={signOut} className="text-slate-600 text-xs">Sign out</button>
              </>
            )}
            {/* Show Sign in / Register only on the landing page for unauthenticated users */}
            {!user && location.pathname === '/' && (
              <>
                <Link to="/login" className="text-slate-600">Sign in</Link>
                <Link to="/signup" className="px-3 py-1 rounded bg-emerald-600 text-white">Register</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="container flex-1 py-6">
        <Outlet />
      </main>
      <footer className="mt-auto border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-3">
          <div>© {new Date().getFullYear()} CauseHive</div>
          <nav className="flex items-center gap-4">
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/how-it-works">How it works</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>
      </footer>
      </Toaster>
    </div>
  )
}
