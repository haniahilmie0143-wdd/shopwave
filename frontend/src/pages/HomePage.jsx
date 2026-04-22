import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import ProductCard from '../components/ui/ProductCard'
import Spinner from '../components/ui/Spinner'
import Message from '../components/ui/Message'

const categories = ['All', 'Phones', 'Laptops', 'Tablets', 'Audio', 'Accessories']

const HomePage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('default')
  const heroRef = useRef(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)

        const { data } = await axios.get(
          `/api/products${search ? `?keyword=${search}` : ''}`
        )

        // ✅ SAFE NORMALIZATION (fixes your crash root cause)
        const safeData =
          Array.isArray(data)
            ? data
            : Array.isArray(data?.products)
            ? data.products
            : []

        setProducts(safeData)

      } catch (err) {
        setError('Failed to load products. Make sure your backend is running.')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [search])

  const filtered = (Array.isArray(products) ? products : [])
    .filter((p) => category === 'All' || p.category === category)
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'rating') return b.rating - a.rating
      return 0
    })

  return (
    <div className="min-h-screen bg-dark page-enter">

      {/* HERO SECTION (unchanged UI except safety fix below) */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">

        <div className="orb w-[600px] h-[600px] bg-primary/10 top-1/2 -translate-y-1/2 -left-48 glow-pulse" />
        <div className="orb w-[400px] h-[400px] bg-purple-500/8 top-1/4 right-0 glow-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="orb w-[300px] h-[300px] bg-primary/5 bottom-0 right-1/3" />

        <div className="max-w-7xl mx-auto px-6 pt-24 pb-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* LEFT SIDE */}
            <div>
              <h1 className="font-display text-6xl lg:text-7xl font-bold leading-[1.0] mb-6">
                <span className="gradient-text">Premium</span><br />
                <span className="text-bright">tech,</span><br />
                <span className="text-silver font-normal italic">redefined.</span>
              </h1>

              {/* FLOATING PRODUCTS (🔥 FIXED CRASH HERE) */}
              <div className="hidden lg:grid grid-cols-2 gap-4 relative mt-10">
                <div className="orb w-64 h-64 bg-primary/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

                {(Array.isArray(products) ? products : [])
                  .slice(0, 4)
                  .map((p, i) => (
                    <div
                      key={p?._id || i}
                      className={`glass border border-glass-border rounded-3xl overflow-hidden float ${i % 2 === 1 ? 'mt-8' : ''}`}
                      style={{ animationDelay: `${i * 0.5}s` }}
                    >
                      <img
                        src={p?.image || ''}
                        alt={p?.name || 'product'}
                        className="w-full aspect-square object-cover opacity-90"
                      />
                      <div className="p-3">
                        <p className="text-xs font-bold font-display text-bright truncate">
                          {p?.name || 'Unnamed'}
                        </p>
                        <p className="text-xs text-primary font-semibold">
                          ${p?.price ?? 0}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="max-w-7xl mx-auto px-6 py-24">

        {loading ? (
          <Spinner />
        ) : error ? (
          <Message type="error">{error}</Message>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-2xl text-silver">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((product, i) => (
              <ProductCard key={product?._id || i} product={product} index={i} />
            ))}
          </div>
        )}
      </section>

    </div>
  )
}

export default HomePage