import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setCredentials } from '../redux/authSlice'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => { if (userInfo) navigate('/') }, [userInfo, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await axios.post('/api/users/login', { email, password })
      dispatch(setCredentials(data))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 relative overflow-hidden">
      <div className="orb w-96 h-96 bg-primary/10 top-1/4 -left-48" />
      <div className="orb w-64 h-64 bg-purple-500/8 bottom-1/4 -right-32" />
      <div className="absolute inset-0 opacity-[0.02]"
        style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px'}} />

      <div className="glass border border-glass-border rounded-3xl p-8 w-full max-w-md relative page-enter">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-t-3xl" />

        <div className="text-center mb-8">
          <p className="font-display text-3xl font-bold gradient-text mb-2">Welcome back</p>
          <p className="text-sm text-silver">Sign in to your ShopWave account</p>
        </div>

        {error && (
          <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { label: 'Email', type: 'email', val: email, set: setEmail },
            { label: 'Password', type: 'password', val: password, set: setPassword },
          ].map(({ label, type, val, set }) => (
            <div key={label}>
              <label className="text-xs font-semibold text-silver uppercase tracking-wider mb-2 block">{label}</label>
              <input type={type} value={val} onChange={(e) => set(e.target.value)} required
                className="w-full glass border border-glass-border rounded-2xl px-4 py-3.5 text-sm text-bright placeholder-silver/30 outline-none focus:border-primary/60 transition-all duration-300 bg-transparent" />
            </div>
          ))}

          <button type="submit" disabled={loading}
            className="bg-primary text-white py-4 rounded-2xl font-display font-bold hover:bg-primary-glow transition-all duration-200 shadow-glow disabled:opacity-50 mt-2">
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-glass-border">
          <p className="text-xs text-center text-silver/50 mb-3">Demo account</p>
          <div className="glass border border-glass-border rounded-xl px-4 py-3 text-center">
            <p className="text-xs text-silver">admin@shopwave.com <span className="text-silver/40">/</span> admin123</p>
          </div>
        </div>

        <p className="text-sm text-center text-silver mt-6">
          No account? <Link to="/register" className="text-primary hover:text-primary-glow transition-colors font-semibold">Register →</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage