import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import AdminLayout from '../../components/layout/AdminLayout'

const AdminUsersPage = () => {
  const { userInfo } = useSelector((state) => state.auth)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }
        const { data } = await axios.get('/api/users', config)
        setUsers(data)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }
      await axios.delete(`/api/users/${id}`, config)
      setUsers(users.filter((u) => u._id !== id))
      setMessage({ type: 'success', text: 'User deleted successfully.' })
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete user.' })
    }
  }

  return (
    <AdminLayout>
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Management</p>
        <h1 className="font-display text-4xl font-bold text-bright">Users</h1>
        <p className="text-silver text-sm mt-1">{users.length} registered accounts</p>
      </div>

      {message && (
        <div className={`mb-6 px-5 py-4 rounded-2xl text-sm border ${
          message.type === 'success'
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : 'bg-red-500/10 text-red-400 border-red-500/20'
        }`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />
            <div className="absolute inset-0 border-2 border-transparent border-t-primary rounded-full animate-spin" />
          </div>
        </div>
      ) : (
        <div className="glass border border-glass-border rounded-3xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-glass-border bg-dark-3/50">
                {['User', 'Email', 'Role', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-silver/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-glass-border/50 hover:bg-glass-hover transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-bright">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-silver text-xs">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      user.isAdmin
                        ? 'bg-primary/10 text-primary border-primary/20'
                        : 'bg-dark-4 text-silver/50 border-glass-border'
                    }`}>
                      {user.isAdmin ? '⚡ Admin' : 'Customer'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-silver/50 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    {!user.isAdmin && (
                      <button onClick={() => handleDelete(user._id)}
                        className="text-xs font-semibold text-red-400/50 hover:text-red-400 transition-colors">
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminUsersPage