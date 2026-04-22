import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { addToCart } from '../redux/cartSlice'
import Spinner from '../components/ui/Spinner'
import Message from '../components/ui/Message'

const ProductPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`)
        setProduct(data)
      } catch {
        setError('Product not found.')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, qty }))
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return <div className="pt-24"><Spinner /></div>
  if (error) return <div className="p-8 max-w-xl mx-auto mt-24"><Message type="error">{error}</Message></div>

  return (
    <div className="min-h-screen bg-dark page-enter pt-24">
      <div className="orb w-96 h-96 bg-primary/8 top-32 -right-48" />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-silver hover:text-primary transition-colors mb-12 group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to collection
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

          {/* Image */}
          <div className="relative">
            <div className="orb w-64 h-64 bg-primary/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="glass border border-glass-border rounded-3xl overflow-hidden aspect-square relative">
              <img src={product.image} alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent" />
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6 justify-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">{product.brand} · {product.category}</span>
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-bright mt-3 leading-tight">{product.name}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <svg key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'text-amber-400' : 'text-glass-border'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-silver">{product.rating} · {product.numReviews} reviews</span>
            </div>

            <div className="flex items-baseline gap-3">
              <p className="font-display text-5xl font-bold gradient-text">${product.price}</p>
              {product.countInStock > 0 && (
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full">In stock</span>
              )}
            </div>

            <div className="h-px bg-gradient-to-r from-glass-border via-primary/20 to-glass-border" />

            <p className="text-silver leading-relaxed">{product.description}</p>

            {/* Qty stepper */}
            {product.countInStock > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-silver">Quantity</span>
                <div className="flex items-center glass border border-glass-border rounded-xl overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="px-4 py-3 text-silver hover:text-bright hover:bg-glass-hover transition-colors text-lg">−</button>
                  <span className="px-4 py-3 text-sm font-bold text-bright min-w-[3rem] text-center border-x border-glass-border">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.countInStock, q + 1))}
                    className="px-4 py-3 text-silver hover:text-bright hover:bg-glass-hover transition-colors text-lg">+</button>
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="flex gap-3">
              <button onClick={handleAddToCart} disabled={product.countInStock === 0}
                className={`flex-1 py-4 rounded-2xl text-sm font-bold font-display transition-all duration-300 ${
                  added ? 'bg-emerald-500 text-white shadow-none' :
                  product.countInStock === 0 ? 'bg-glass border border-glass-border text-silver cursor-not-allowed' :
                  'bg-primary text-white hover:bg-primary-glow shadow-glow'
                }`}>
                {added ? '✓ Added to cart' : 'Add to cart'}
              </button>
              <button
                onClick={() => { dispatch(addToCart({ ...product, qty })); navigate('/cart') }}
                disabled={product.countInStock === 0}
                className="flex-1 py-4 rounded-2xl text-sm font-bold font-display glass border border-primary/30 text-primary hover:bg-primary/10 transition-all duration-200 disabled:opacity-40">
                Buy now
              </button>
            </div>

            {/* Trust */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-glass-border">
              {[
                { icon: '⚡', label: 'Fast delivery', sub: '2-5 days' },
                { icon: '↩️', label: '30-day returns', sub: 'No questions' },
                { icon: '🔒', label: 'Secure', sub: 'Stripe encrypted' },
              ].map(({ icon, label, sub }) => (
                <div key={label} className="glass border border-glass-border rounded-2xl p-3 text-center">
                  <div className="text-xl mb-1">{icon}</div>
                  <p className="text-xs font-semibold text-bright">{label}</p>
                  <p className="text-xs text-silver mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage