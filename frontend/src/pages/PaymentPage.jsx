import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import axios from 'axios'
import { clearCart } from '../redux/cartSlice'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const CheckoutForm = ({ total, orderData }) => {
  const stripe = useStripe()
  const elements = useElements()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userInfo } = useSelector((state) => state.auth)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError(null)

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })

    if (stripeError) {
      setError(stripeError.message)
      setLoading(false)
      return
    }

    if (paymentIntent.status === 'succeeded') {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }
        const { data: order } = await axios.post('/api/orders', orderData, config)
        await axios.put(`/api/orders/${order._id}/pay`, {
          id: paymentIntent.id,
          status: paymentIntent.status,
          update_time: new Date().toISOString(),
          email_address: userInfo.email,
        }, config)
        dispatch(clearCart())
        navigate(`/order/${order._id}`)
      } catch {
        setError('Payment succeeded but order creation failed. Please contact support.')
        setLoading(false)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="glass border border-glass-border rounded-2xl p-4">
        <PaymentElement options={{
          style: {
            base: {
              color: '#e8eaf6',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              '::placeholder': { color: '#a0a8c0' },
            }
          }
        }} />
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-sm text-red-400">
          {error}
        </div>
      )}

      <button type="submit" disabled={!stripe || loading}
        className="bg-primary text-white py-4 rounded-2xl font-display font-bold hover:bg-primary-glow transition-all duration-200 shadow-glow disabled:opacity-50">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </span>
        ) : `Pay $${total} →`}
      </button>

      <div className="flex items-center justify-center gap-2 text-xs text-silver/40">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Secured by Stripe
      </div>
    </form>
  )
}

const PaymentPage = () => {
  const navigate = useNavigate()
  const { cartItems, shippingAddress } = useSelector((state) => state.cart)
  const { userInfo } = useSelector((state) => state.auth)
  const [clientSecret, setClientSecret] = useState('')
  const [error, setError] = useState(null)

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  const shipping = subtotal > 100 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = (subtotal + shipping + tax).toFixed(2)

  const orderData = {
    orderItems: cartItems.map((item) => ({
      name: item.name, qty: item.qty, image: item.image,
      price: item.price, product: item._id,
    })),
    shippingAddress,
    paymentMethod: 'Stripe',
    itemsPrice: subtotal.toFixed(2),
    shippingPrice: shipping.toFixed(2),
    taxPrice: tax.toFixed(2),
    totalPrice: total,
  }

  useEffect(() => {
    if (!userInfo) { navigate('/login'); return }
    if (cartItems.length === 0) { navigate('/cart'); return }
    if (!shippingAddress.address) { navigate('/shipping'); return }

    const createIntent = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }
        const { data } = await axios.post('/api/payment/create-payment-intent', { amount: total }, config)
        setClientSecret(data.clientSecret)
      } catch {
        setError('Failed to initialize payment. Please try again.')
      }
    }
    createIntent()
  }, [])

  if (error) return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="glass border border-red-500/20 rounded-3xl p-8 text-center max-w-sm">
        <p className="text-red-400 text-sm">{error}</p>
        <button onClick={() => navigate('/cart')} className="mt-4 text-primary text-sm hover:underline">← Back to cart</button>
      </div>
    </div>
  )

  if (!clientSecret) return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />
          <div className="absolute inset-0 border-2 border-transparent border-t-primary rounded-full animate-spin" />
        </div>
        <p className="text-xs text-silver uppercase tracking-widest">Preparing payment</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 relative overflow-hidden">
      <div className="orb w-96 h-96 bg-primary/10 top-1/4 -right-48" />
      <div className="orb w-64 h-64 bg-purple-500/8 bottom-1/4 -left-32" />
      <div className="absolute inset-0 opacity-[0.02]"
        style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px'}} />

      <div className="glass border border-glass-border rounded-3xl p-8 w-full max-w-md relative page-enter">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-t-3xl" />

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {['Shipping', 'Payment', 'Confirm'].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 ${i === 1 ? 'text-primary' : i === 0 ? 'text-emerald-400' : 'text-silver/30'}`}>
                <div className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center border ${
                  i === 0 ? 'bg-emerald-400 border-emerald-400 text-dark' :
                  i === 1 ? 'bg-primary border-primary text-white' :
                  'border-glass-border'}`}>
                  {i === 0 ? '✓' : i + 1}
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider">{step}</span>
              </div>
              {i < 2 && <div className="w-6 h-px bg-glass-border" />}
            </div>
          ))}
        </div>

        <div className="mb-6">
          <p className="font-display text-3xl font-bold gradient-text mb-1">Payment</p>
          <p className="text-sm text-silver">Total: <span className="text-bright font-bold font-display">${total}</span></p>
        </div>

        {/* Order summary mini */}
        <div className="glass border border-glass-border rounded-2xl p-4 mb-6">
          <p className="text-xs font-semibold text-silver uppercase tracking-wider mb-3">Order summary</p>
          <div className="flex flex-col gap-1.5 text-xs text-silver">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-bright text-sm border-t border-glass-border pt-2 mt-1">
              <span>Total</span><span className="gradient-text">${total}</span>
            </div>
          </div>
        </div>

        <Elements stripe={stripePromise} options={{
          clientSecret,
          appearance: {
            theme: 'night',
            variables: {
              colorPrimary: '#4f8ef7',
              colorBackground: '#13131e',
              colorText: '#e8eaf6',
              colorDanger: '#f87171',
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
            }
          }
        }}>
          <CheckoutForm total={total} orderData={orderData} />
        </Elements>

        <p className="text-xs text-center text-silver/30 mt-4">
          Test: 4242 4242 4242 4242 · Any future date · Any CVC
        </p>
      </div>
    </div>
  )
}

export default PaymentPage