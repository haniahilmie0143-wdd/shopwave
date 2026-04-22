import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Spinner from '../components/ui/Spinner'

const OrderPage = () => {
  const { id } = useParams()
  const { userInfo } = useSelector((state) => state.auth)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }
        const { data } = await axios.get(`/api/orders/${id}`, config)
        setOrder(data)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  if (loading) return <div className="pt-24"><Spinner /></div>

  return (
    <div className="min-h-screen bg-dark page-enter pt-24 relative overflow-hidden">
      <div className="orb w-96 h-96 bg-emerald-500/6 top-32 -right-48" />
      <div className="orb w-64 h-64 bg-primary/8 bottom-1/4 -left-32" />

      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Success header */}
        <div className="text-center mb-12">
          <div className="relative inline-flex mb-6">
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center justify-center">
              <svg className="w-9 h-9 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="orb w-24 h-24 bg-emerald-500/15 -top-2 -left-2" />
          </div>
          <h1 className="font-display text-4xl font-bold text-bright mb-2">Order confirmed!</h1>
          <p className="text-silver text-sm">Thank you for your purchase</p>
          <div className="inline-flex items-center gap-2 glass border border-glass-border rounded-full px-4 py-2 mt-4">
            <span className="text-xs text-silver/50">Order ID:</span>
            <span className="text-xs font-mono text-primary">{order._id.slice(-12).toUpperCase()}</span>
          </div>
        </div>

        {/* Items */}
        <div className="glass border border-glass-border rounded-3xl p-6 mb-4 relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent rounded-t-3xl" />
          <h2 className="font-display font-bold text-bright mb-5 flex items-center gap-2">
            <span className="w-6 h-6 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center text-xs text-primary">📦</span>
            Items ordered
          </h2>
          <div className="flex flex-col gap-3">
            {order.orderItems.map((item, i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-glass-border last:border-0">
                <div>
                  <p className="text-sm font-semibold text-bright">{item.name}</p>
                  <p className="text-xs text-silver mt-0.5">Qty: {item.qty}</p>
                </div>
                <p className="text-sm font-bold text-primary">${(item.price * item.qty).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping */}
        <div className="glass border border-glass-border rounded-3xl p-6 mb-4">
          <h2 className="font-display font-bold text-bright mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center text-xs">🚚</span>
            Shipping to
          </h2>
          <p className="text-sm text-silver leading-relaxed">
            {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>
        </div>

        {/* Payment summary */}
        <div className="glass border border-glass-border rounded-3xl p-6 mb-10 relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent rounded-t-3xl" />
          <h2 className="font-display font-bold text-bright mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center text-xs">💳</span>
            Payment summary
          </h2>
          <div className="flex flex-col gap-2 text-sm text-silver">
            <div className="flex justify-between"><span>Subtotal</span><span>${Number(order.itemsPrice).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>${Number(order.shippingPrice).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>${Number(order.taxPrice).toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-bright text-lg border-t border-glass-border pt-3 mt-1">
              <span>Total</span>
              <span className="gradient-text">${Number(order.totalPrice).toFixed(2)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-glass-border">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <p className="text-xs font-semibold text-emerald-400">Payment successful</p>
          </div>
        </div>

        <div className="text-center">
          <Link to="/" className="inline-block bg-primary text-white px-10 py-4 rounded-2xl font-display font-bold hover:bg-primary-glow transition-all duration-200 shadow-glow">
            Continue shopping →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderPage