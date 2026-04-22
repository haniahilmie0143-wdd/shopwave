import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'

const StatCard = ({ label, value, sub, accent }) => (
  <div className="glass border border-glass-border rounded-3xl p-6 relative overflow-hidden group hover:border-primary/20 transition-all duration-300">
    <div className={`orb w-32 h-32 -top-8 -right-8 opacity-60 ${accent || 'bg-primary/10'}`} />
    <p className="text-xs font-semibold uppercase tracking-widest text-silver/50 mb-3">{label}</p>
    <p className="font-display text-4xl font-bold gradient-text mb-1">{value}</p>
    {sub && <p className="text-xs text-silver/50">{sub}</p>}
  </div>
)

const DashboardPage = () => {
  const { userInfo } = useSelector((state) => state.auth)
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }
        const [ordersRes, usersRes] = await Promise.all([
          axios.get('/api/orders', config),
          axios.get('/api/users', config),
        ])
        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : [])
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : [])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalRevenue = orders.filter(o => o.isPaid).reduce((acc, o) => acc + o.totalPrice, 0)
  const paidOrders = orders.filter(o => o.isPaid).length
  const unpaidOrders = orders.filter(o => !o.isPaid).length

  return (
    <AdminLayout>
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Overview</p>
        <h1 className="font-display text-4xl font-bold text-bright">Dashboard</h1>
        <p className="text-silver text-sm mt-1">Welcome back, {userInfo?.name}</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />
            <div className="absolute inset-0 border-2 border-transparent border-t-primary rounded-full animate-spin" />
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Revenue" value={`$${totalRevenue.toFixed(0)}`} sub="From paid orders" accent="bg-primary/15" />
            <StatCard label="Total Orders" value={orders.length} sub={`${paidOrders} paid · ${unpaidOrders} pending`} accent="bg-purple-500/10" />
            <StatCard label="Total Users" value={users.length} sub="Registered accounts" accent="bg-emerald-500/10" />
            <StatCard label="Conversion" value={`${orders.length > 0 ? Math.round((paidOrders/orders.length)*100) : 0}%`} sub="Orders paid" accent="bg-amber-500/10" />
          </div>

          <div className="glass border border-glass-border rounded-3xl p-6 relative">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent rounded-t-3xl" />
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-bright text-lg">Recent orders</h2>
              <Link to="/admin/orders" className="text-xs font-semibold text-primary hover:text-primary-glow transition-colors uppercase tracking-wider">
                View all →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-glass-border">
                    <th className="pb-4 text-xs font-semibold uppercase tracking-wider text-silver/40">Order ID</th>
                    <th className="pb-4 text-xs font-semibold uppercase tracking-wider text-silver/40">Customer</th>
                    <th className="pb-4 text-xs font-semibold uppercase tracking-wider text-silver/40">Total</th>
                    <th className="pb-4 text-xs font-semibold uppercase tracking-wider text-silver/40">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order._id} className="border-b border-glass-border/50 hover:bg-glass-hover transition-colors">
                      <td className="py-4 font-mono text-xs text-silver/50">{order._id.slice(-10).toUpperCase()}</td>
                      <td className="py-4 text-silver">{order.user?.name || 'N/A'}</td>
                      <td className="py-4 font-display font-bold text-bright">${order.totalPrice.toFixed(2)}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          order.isPaid
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {order.isPaid ? '✓ Paid' : '⏳ Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  )
}

export default DashboardPage