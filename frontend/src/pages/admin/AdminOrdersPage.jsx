import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import AdminLayout from '../../components/layout/AdminLayout'

const AdminOrdersPage = () => {
  const { userInfo } = useSelector((state) => state.auth)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }
        const { data } = await axios.get('/api/orders', config)
        setOrders(data)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const handleDeliver = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }
      await axios.put(`/api/orders/${id}/deliver`, {}, config)
      setOrders(orders.map((o) => o._id === id ? { ...o, isDelivered: true, deliveredAt: new Date() } : o))
    } catch {
      alert('Failed to mark as delivered.')
    }
  }

  return (
    <AdminLayout>
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Management</p>
        <h1 className="font-display text-4xl font-bold text-bright">Orders</h1>
        <p className="text-silver text-sm mt-1">{orders.length} total orders</p>
      </div>

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
                {['Order ID', 'Customer', 'Date', 'Total', 'Paid', 'Delivered', 'Action'].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-silver/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-glass-border/50 hover:bg-glass-hover transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-silver/50">{order._id.slice(-10).toUpperCase()}</td>
                  <td className="px-6 py-4 text-silver">{order.user?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-silver/50 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-display font-bold text-bright">${order.totalPrice.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      order.isPaid
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {order.isPaid ? `✓ ${new Date(order.paidAt).toLocaleDateString()}` : '⏳ Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      order.isDelivered
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-dark-4 text-silver/40 border-glass-border'
                    }`}>
                      {order.isDelivered ? '✓ Delivered' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {order.isPaid && !order.isDelivered && (
                      <button onClick={() => handleDeliver(order._id)}
                        className="text-xs font-semibold text-primary hover:text-primary-glow transition-colors">
                        Mark delivered
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

export default AdminOrdersPage