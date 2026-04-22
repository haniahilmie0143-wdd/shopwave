import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../redux/authSlice'

const Navbar = () => {
  const { cartItems } = useSelector((state) => state.cart)
  const { userInfo } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-dark/80 backdrop-blur-xl border-b border-glass-border'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="font-display text-xl font-bold tracking-tight">
          <span className="gradient-text">ShopWave</span>
        </Link>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { path: '/', label: 'Home' },
            { path: '/cart', label: 'Shop' },
            { path: '/login', label: 'Account' },
          ].map(({ path, label }) => (
            <Link key={path} to={path}
              className={`text-sm font-medium transition-all duration-200 relative group ${
                location.pathname === path ? 'text-primary' : 'text-silver hover:text-bright'
              }`}>
              {label}
              <span className={`absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300 ${
                location.pathname === path ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative p-2 glass rounded-xl hover:border-primary/40 transition-all duration-200 border border-glass-border group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-silver group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px]">
                {totalItems}
              </span>
            )}
          </Link>

          {userInfo ? (
            <div className="flex items-center gap-2">
              {userInfo.isAdmin && (
                <Link to="/admin" className="text-xs font-semibold bg-primary/10 text-primary border border-primary/30 px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-all duration-200">
                  Admin
                </Link>
              )}
              <div className="relative group">
                <button className="w-9 h-9 bg-gradient-to-br from-primary to-purple-500 rounded-full text-xs font-bold text-white flex items-center justify-center shadow-glow">
                  {userInfo.name.charAt(0).toUpperCase()}
                </button>
                <div className="absolute right-0 top-12 w-44 glass rounded-2xl border border-glass-border shadow-card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-glass-border">
                    <p className="text-xs font-semibold text-bright truncate">{userInfo.name}</p>
                    <p className="text-xs text-silver truncate">{userInfo.email}</p>
                  </div>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-silver hover:text-bright hover:bg-glass-hover transition-colors">
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="text-sm font-semibold bg-primary text-white px-5 py-2 rounded-full hover:bg-primary-glow transition-all duration-200 shadow-glow">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar