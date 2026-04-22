import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setCredentials } from '../redux/authSlice'

const RegisterPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => { if (userInfo) navigate('/') }, [userInfo, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) return setError('Passwords do not match')
    setError('')
    setLoading(true)
    try {
      const { data } = await axios.post('/api/users/register', { name, email, password })
      dispatch(setCredentials(data))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 relative overflow-hidden">
      <div className="orb w-96 h-96 bg-primary/10 top-1/4 -right-48" />
      <div className="orb w-64 h-64 bg-purple-500/8 bottom-1/4 -left-32" />

      <div className="glass border border-glass-border rounded-3xl p-8 w-full max-w-md relative page-enter">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-t-3xl" />

        <div className="text-center mb-8">
          <p className="font-display text-3xl font-bold gradient-text mb-2">Create account</p>
          <p className="text-sm text-silver">Join ShopWave today</p>
        </div>

        {error && (
          <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-sm text-red-400">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { label: 'Name', type: 'text', val: name, set: setName },
            { label: 'Email', type: 'email', val: email, set: setEmail },
            { label: 'Password', type: 'password', val: password, set: setPassword },
            { label: 'Confirm password', type: 'password', val: confirm, set: setConfirm },
          ].map(({ label, type, val, set }) => (
            <div key={label}>
              <label className="text-xs font-semibold text-silver uppercase tracking-wider mb-2 block">{label}</label>
              <input type={type} value={val} onChange={(e) => set(e.target.value)} required
                className="w-full glass border border-glass-border rounded-2xl px-4 py-3.5 text-sm text-bright placeholder-silver/30 outline-none focus:border-primary/60 transition-all duration-300 bg-transparent" />
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="bg-primary text-white py-4 rounded-2xl font-display font-bold hover:bg-primary-glow transition-all duration-200 shadow-glow disabled:opacity-50 mt-2">
            {loading ? 'Creating...' : 'Create account →'}
          </button>
        </form>

        <p className="text-sm text-center text-silver mt-6">
          Have an account? <Link to="/login" className="text-primary hover:text-primary-glow transition-colors font-semibold">Sign in →</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage