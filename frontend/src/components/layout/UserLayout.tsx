import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { authStore } from '@/lib/auth'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useState, useEffect, useMemo } from 'react'

export default function UserLayout() {
  const user = authStore.getUser()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = () => setIsMobile(window.innerWidth < 768)
    mq()
    window.addEventListener('resize', mq)
    return () => window.removeEventListener('resize', mq)
  }, [])
  const { data: unreadCount } = useQuery({
    queryKey: ['notifications-unread-count'],
    queryFn: async () => {
      const { data } = await api.get('/notifications/', { params: { unread_only: true, page_size: 1 } })
      return data.count as number
    },
    enabled: !!user
  })
  // Stable icon elements (no dynamic class risk, explicit sizing & stroke)
  const icons = useMemo(() => ({
    dash: <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18"/><path d="M3 6h18" opacity=".4"/><path d="M3 18h18" opacity=".4"/></svg>,
    causes: <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0 stroke-current" fill="none" strokeWidth="2"><path d="M12 21c6-4 8-7 8-11a8 8 0 1 0-16 0c0 4 2 7 8 11Z"/></svg>,
    donations: <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0 stroke-current" fill="none" strokeWidth="2"><path d="M4 4h16v12a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z"/><path d="M16 8h-8"/><path d="M16 12h-8"/></svg>,
    profile: <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0 stroke-current" fill="none" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c2-4 6-6 8-6s6 2 8 6"/></svg>,
    settings: <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0 stroke-current" fill="none" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H2a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 3.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 3.6a1.65 1.65 0 0 0 1-1.51V2a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 20.4 8c.27.54.4 1.14.33 1.74-.07.6.12 1.21.52 1.66.4.45.59 1.06.52 1.66-.07.6.06 1.2.33 1.74Z"/></svg>,
    bell: <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0 stroke-current" fill="none" strokeWidth="2"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 22a2 2 0 0 0 4 0"/></svg>,
    withdraw: <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0 stroke-current" fill="none" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M12 9v6"/><path d="m9 12 3-3 3 3"/></svg>
  }), [])
  return (
    <div className="flex min-h-[70vh] w-full">
      {/* Sidebar */}
      <aside
        className={(collapsed? 'w-16':'w-60') + ' group/sidebar transition-all duration-300 border-r border-slate-200/60 dark:border-slate-800/60 flex flex-col bg-white dark:bg-slate-950'}
        onMouseEnter={() => { if (!isMobile) setCollapsed(false) }}
        onMouseLeave={() => { if (!isMobile) setCollapsed(true) }}
      >
        <div className="flex items-center justify-between p-4">
          {!collapsed && (
            <div>
              <p className="text-[10px] uppercase tracking-wide text-slate-500">Account</p>
              <div className="font-medium text-sm truncate max-w-[9rem]">{user?.first_name ? `${user.first_name} ${user.last_name ?? ''}`.trim() : user?.email}</div>
            </div>
          )}
          {/* Mobile toggle button (hamburger) */}
          {isMobile && (
            <button
              onClick={()=> setCollapsed(c=> !c)}
              aria-label="Toggle sidebar"
              className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 p-2 rounded-md border border-slate-200 dark:border-slate-700"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
            </button>
          )}
        </div>
        <nav className="flex-1 space-y-1 px-2">
          {[
            { to:'/app', label:'Dashboard', icon:icons.dash, end:true },
            { to:'/app/causes', label:'Causes', icon:icons.causes },
            { to:'/app/donations', label:'Donations', icon:icons.donations },
            { to:'/app/causes/create', label:'Create Cause', icon:icons.causes },
            { to:'/app/profile', label:'Profile', icon:icons.profile },
            { to:'/app/settings', label:'Settings', icon:icons.settings },
            { to:'/app/notifications', label:'Notifications', icon:icons.bell, badge: unreadCount },
            { to:'/app/withdrawals', label:'Withdrawals', icon:icons.withdraw }
          ].map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({isActive})=>[
                'group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors relative overflow-hidden',
                isActive? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20':'hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300'
              ].join(' ')}>
              <span className="text-inherit flex items-center justify-center">{item.icon}</span>
              <span
                className={(collapsed? 'opacity-0 translate-x-2 pointer-events-none':'opacity-100 translate-x-0') + ' transition-all duration-200 ease-out truncate'}
              >{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="ml-auto inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] font-medium text-white">{item.badge > 99 ? '99+' : item.badge}</span>
              )}
            </NavLink>
          ))}
        </nav>
        {/* Logout button */}
        <div className="p-2 border-t border-slate-200/60 dark:border-slate-800/60">
          <button
            onClick={()=> { authStore.clear(); navigate('/', { replace: true }) }}
            className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            aria-label="Sign out"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/></svg>
            <span className={(collapsed? 'opacity-0 translate-x-2 pointer-events-none':'opacity-100 translate-x-0') + ' transition-all duration-200 ease-out truncate'}>Logout</span>
          </button>
        </div>
      </aside>
      <section className="flex-1 p-4 md:p-6">
        <Outlet />
      </section>
    </div>
  )
}
