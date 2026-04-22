import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { removeFromCart, addToCart } from '../redux/cartSlice'

const CartPage = () => {
  const { cartItems } = useSelector((state) => state.cart)
  const { userInfo } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  const shipping = subtotal > 100 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  if (cartItems.length === 0) return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-6 pt-24">
      <div className="text-center">
        <div className="w-24 h-24 glass border border-glass-border rounded-3xl flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-silver/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <p className="font-display text-2xl font-bold text-bright mb-2">Your cart is empty</p>
        <p className="text-silver text-sm mb-8">Add something premium to get started</p>
        <Link to="/" className="bg-primary text-white px-8 py-3.5 rounded-2xl font-display font-bold hover:bg-primary-glow transition-all shadow-glow">
          Browse collection →
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark page-enter pt-24">
      <div className="orb w-96 h-96 bg-primary/6 top-32 -right-48" />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="font-display text-4xl font-bold text-bright mb-2">Your cart</h1>
        <p className="text-silver text-sm mb-10">{cartItems.length} item{cartItems.length > 1 ? 's' : ''}</p>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 flex flex-col gap-4">
            {cartItems.map((item) => (
              <div key={item._id} className="glass border border-glass-border rounded-3xl p-4 flex gap-4 items-center group hover:border-primary/20 transition-all duration-300">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-dark-3 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item._id}`} className="font-display font-semibold text-bright text-sm hover:text-primary transition-colors line-clamp-1">{item.name}</Link>
                  <p className="text-primary font-bold text-lg mt-1">${item.price}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center glass border border-glass-border rounded-xl overflow-hidden">
                    <button onClick={() => dispatch(addToCart({ ...item, qty: Math.max(1, item.qty - 1) }))}
                      className="px-3 py-2 text-silver hover:text-bright hover:bg-glass-hover transition-colors">−</button>
                    <span className="px-3 py-2 text-sm font-bold text-bright border-x border-glass-border">{item.qty}</span>
                    <button onClick={() => dispatch(addToCart({ ...item, qty: Math.min(item.countInStock, item.qty + 1) }))}
                      className="px-3 py-2 text-silver hover:text-bright hover:bg-glass-hover transition-colors">+</button>
                  </div>
                  <button onClick={() => dispatch(removeFromCart(item._id))}
                    className="p-2 text-silver/40 hover:text-red-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:w-80">
            <div className="glass border border-glass-border rounded-3xl p-6 sticky top-24">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-t-3xl" />
              <h2 className="font-display font-bold text-bright text-lg mb-6">Order summary</h2>
              <div className="flex flex-col gap-3 text-sm">
                {[
                  { label: 'Subtotal', val: `$${subtotal.toFixed(2)}` },
                  { label: 'Shipping', val: shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}` },
                  { label: 'Tax (8%)', val: `$${tax.toFixed(2)}` },
                ].map(({ label, val }) => (
                  <div key={label} className="flex justify-between text-silver">
                    <span>{label}</span><span>{val}</span>
                  </div>
                ))}
                <div className="border-t border-glass-border pt-3 mt-1 flex justify-between font-display font-bold text-bright text-xl">
                  <span>Total</span><span className="gradient-text">${total.toFixed(2)}</span>
                </div>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-silver/50 mt-3">Add ${(100 - subtotal).toFixed(2)} more for free shipping</p>
              )}
              <button onClick={() => userInfo ? navigate('/shipping') : navigate('/login')}
                className="w-full mt-6 bg-primary text-white py-4 rounded-2xl font-display font-bold hover:bg-primary-glow transition-all shadow-glow">
                Checkout →
              </button>
              <Link to="/" className="block text-center text-sm text-silver/50 hover:text-silver mt-4 transition-colors">
                ← Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage