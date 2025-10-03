import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { authStore } from '@/lib/auth'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useState, useEffect, useMemo } from 'react'
import { AuthDebugPanel } from '@/components/debug/AuthDebugPanel'
import { 
  LayoutDashboard, 
  Heart, 
  HandHeart, 
  Plus, 
  User, 
  Settings, 
  Bell, 
  CreditCard,
  LogOut,
  Menu,
  ShoppingCart
} from 'lucide-react'

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
  // Professional enterprise-grade icons using Lucide React
  const icons = useMemo(() => ({
    dash: <LayoutDashboard className="h-5 w-5 flex-shrink-0" />,
    causes: <Heart className="h-5 w-5 flex-shrink-0" />,
    donations: <HandHeart className="h-5 w-5 flex-shrink-0" />,
    create: <Plus className="h-5 w-5 flex-shrink-0" />,
    profile: <User className="h-5 w-5 flex-shrink-0" />,
    settings: <Settings className="h-5 w-5 flex-shrink-0" />,
    bell: <Bell className="h-5 w-5 flex-shrink-0" />,
    cart: <ShoppingCart className="h-5 w-5 flex-shrink-0" />,
    withdraw: <CreditCard className="h-5 w-5 flex-shrink-0" />,
    logout: <LogOut className="h-5 w-5 flex-shrink-0" />,
    menu: <Menu className="h-4 w-4" />
  }), [])
  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside
        className={(collapsed? 'w-14':'w-60') + ' group/sidebar transition-all duration-300 border-r border-slate-800/60 flex flex-col bg-slate-950 fixed h-screen z-30 shadow-lg left-0 top-7'}
        onMouseEnter={() => { if (!isMobile) setCollapsed(false) }}
        onMouseLeave={() => { if (!isMobile) setCollapsed(true) }}
      >
        <div className="flex items-center justify-between p-3 border-b border-slate-200/40 dark:border-slate-800/40">
          {!collapsed && (
            <div className="font-medium text-sm truncate max-w-[8rem] text-slate-900 dark:text-slate-100">
              {user?.first_name ? `${user.first_name} ${user.last_name ?? ''}`.trim() : user?.email}
            </div>
          )}
          {/* Mobile toggle button (hamburger) */}
          {isMobile && (
            <button
              onClick={()=> setCollapsed(c=> !c)}
              aria-label="Toggle sidebar"
              className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors shadow-sm hover:shadow-md"
            >
              {icons.menu}
            </button>
          )}
        </div>
        <nav className="flex-1 space-y-2 px-3 py-4">
          {[
            { to:'/app', label:'Dashboard', icon:icons.dash, end:true },
            { to:'/app/causes', label:'Causes', icon:icons.causes },
            { to:'/app/donations', label:'Donations', icon:icons.donations },
            { to:'/app/causes/create', label:'Create Cause', icon:icons.create },
            { to:'/app/cart', label:'Cart', icon:icons.cart },
            { to:'/app/profile', label:'Profile', icon:icons.profile },
            { to:'/app/settings', label:'Settings', icon:icons.settings },
            { to:'/app/notifications', label:'Notifications', icon:icons.bell, badge: unreadCount },
            { to:'/app/withdrawals', label:'Withdrawals', icon:icons.withdraw }
          ].map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({isActive})=>[
                'group flex items-center rounded-lg py-2.5 text-sm font-medium transition-all duration-200 relative overflow-hidden',
                collapsed ? 'justify-center px-2 h-10 w-10' : 'gap-3 px-3',
                isActive 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30' 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:shadow-sm'
              ].join(' ')}>
              <span className={`${collapsed ? 'flex items-center justify-center w-full h-full' : ''} text-inherit flex items-center justify-center transition-transform group-hover:scale-110`} title={collapsed ? item.label : ''}>{item.icon}</span>
              <span
                className={(collapsed? 'opacity-0 translate-x-2 pointer-events-none':'opacity-100 translate-x-0') + ' transition-all duration-300 ease-out truncate'}
              >{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="ml-auto inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white animate-pulse shadow-lg">{item.badge > 99 ? '99+' : item.badge}</span>
              )}
            </NavLink>
          ))}
        </nav>
        {/* Logout button */}
        <div className="p-3 border-t border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/20">
          <button
            onClick={()=> { authStore.clear(); navigate('/', { replace: true }) }}
            className={`w-full mb-4 flex items-center rounded-lg py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group ${
              collapsed ? 'justify-center px-2 h-10 w-10' : 'gap-3 px-3'
            }`}
            aria-label="Sign out"
          >
            <span className={`${collapsed ? 'flex items-center justify-center w-full h-full' : ''} transition-transform group-hover:scale-110`} title={collapsed ? 'Logout' : ''}>{icons.logout}</span>
            <span className={(collapsed? 'opacity-0 translate-x-2 pointer-events-none':'opacity-100 translate-x-0') + ' transition-all duration-300 ease-out truncate'}>Logout</span>
          </button>
        </div>
      </aside>
      {/* Main content with left margin to account for fixed sidebar */}
      <section className={(collapsed? 'ml-14':'ml-60') + ' flex-1 p-4 md:p-6 transition-all duration-300'}>
        <Outlet />
      </section>
      
      {/* Debug panel for development */}
      <AuthDebugPanel />
    </div>
  )
}
