import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../redux/authSlice'

const AdminLayout = ({ children }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userInfo } = useSelector((state) => state.auth)

  const handleLogout = () => { dispatch(logout()); navigate('/login') }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-primary/15 text-primary border border-primary/20'
        : 'text-silver hover:bg-glass-hover hover:text-bright border border-transparent'
    }`

  const navItems = [
    { to: '/admin', label: 'Dashboard', end: true, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
    { to: '/admin/products', label: 'Products', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /> },
    { to: '/admin/orders', label: 'Orders', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /> },
    { to: '/admin/users', label: 'Users', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /> },
  ]

  return (
    <div className="min-h-screen flex bg-dark">
      <aside className="w-60 bg-dark-2 border-r border-glass-border flex flex-col fixed h-full">
        <div className="px-5 py-6 border-b border-glass-border">
          <p className="font-display text-lg font-bold gradient-text">ShopWave</p>
          <p className="text-xs text-silver/50 mt-0.5 uppercase tracking-widest">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {navItems.map(({ to, label, end, icon }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">{icon}</svg>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-glass-border">
          <div className="px-4 py-3 glass rounded-xl border border-glass-border mb-2">
            <p className="text-xs font-semibold text-bright truncate">{userInfo?.name}</p>
            <p className="text-xs text-silver/50 truncate">{userInfo?.email}</p>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-silver hover:bg-red-500/10 hover:text-red-400 transition-all duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-60 p-8 min-h-screen">
        {children}
      </main>
    </div>
  )
}

export default AdminLayout