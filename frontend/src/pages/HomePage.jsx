import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import ProductCard from '../components/ui/ProductCard'
import Spinner from '../components/ui/Spinner'
import Message from '../components/ui/Message'
import HeroDevice from '../components/ui/HeroDevice'

const categories = ['All', 'Phones', 'Laptops', 'Tablets', 'Audio', 'Accessories']

const HomePage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('default')

  const heroRef = useRef(null)

  const API = import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const { data } = await axios.get(
          `${API}/api/products${search ? `?keyword=${search}` : ''}`,
          { timeout: 10000 }
        )
        const safeData = Array.isArray(data)
          ? data
          : Array.isArray(data?.products)
          ? data.products
          : []
        setProducts(safeData)
      } catch (err) {
        console.log('API ERROR:', err.message)
        setError('Failed to load products. Please try again later.')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    if (API) fetchProducts()
  }, [search, API])

  const filtered = products
    .filter((p) => category === 'All' || p.category === category)
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'rating') return b.rating - a.rating
      return 0
    })

  return (
    <div className="min-h-screen bg-dark page-enter">

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">

        {/* Background orbs — unchanged from your original */}
        <div className="orb w-[600px] h-[600px] bg-primary/10 top-1/2 -translate-y-1/2 -left-48 glow-pulse" />
        <div className="orb w-[400px] h-[400px] bg-purple-500/8 top-1/4 right-0 glow-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="orb w-[300px] h-[300px] bg-primary/5 bottom-0 right-1/3" />

        <div className="max-w-7xl mx-auto px-6 pt-24 pb-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* LEFT — text + search */}
            <div className="flex flex-col gap-6">
              <div
                className="inline-flex items-center gap-2 w-fit px-4 py-1.5 rounded-full text-xs font-medium"
                style={{
                  background: 'rgba(79,195,247,0.1)',
                  border: '1px solid rgba(79,195,247,0.25)',
                  color: '#4fc3f7',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                Premium electronics store
              </div>

              <h1 className="font-display text-6xl lg:text-7xl font-bold leading-[1.0]">
                <span className="gradient-text">Premium</span><br />
                <span className="text-bright">tech,</span><br />
                <span className="text-silver font-normal italic">redefined.</span>
              </h1>

              <p className="text-silver text-lg max-w-md leading-relaxed">
                Discover the latest smartphones, laptops, audio and more — curated for those who demand the best.
              </p>

              {/* Search bar */}
              <div className="flex gap-3 max-w-md">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 px-5 py-3 rounded-xl text-sm outline-none bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary/60 transition-colors"
                />
                <button
                  className="px-5 py-3 rounded-xl text-sm font-medium transition-colors"
                  style={{ background: '#4fc3f7', color: '#0a0a1a' }}
                >
                  Search
                </button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-6 mt-2">
                {['500+ Products', 'Fast Shipping', 'Secure Checkout'].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#4fc3f7' }} />
                    <span className="text-xs text-silver">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — 3D phone */}
            <div className="hidden lg:flex items-center justify-center">
              <HeroDevice />
            </div>

          </div>
        </div>
      </section>

      {/* CATEGORY FILTERS */}
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  category === cat
                    ? 'bg-primary text-dark font-medium'
                    : 'text-silver border border-white/10 hover:border-primary/50 hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-white/10 rounded-xl px-4 py-2 text-sm text-silver bg-transparent outline-none hover:border-primary/50 transition-colors"
          >
            <option value="default" className="bg-gray-900">Sort: Default</option>
            <option value="price-asc" className="bg-gray-900">Price: Low to High</option>
            <option value="price-desc" className="bg-gray-900">Price: High to Low</option>
            <option value="rating" className="bg-gray-900">Top Rated</option>
          </select>
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <Spinner />
        ) : error ? (
          <Message type="error">{error}</Message>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-2xl text-silver">No products found</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-silver mb-6">{filtered.length} products</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((product, i) => (
                <ProductCard key={product?._id || i} product={product} index={i} />
              ))}
            </div>
          </>
        )}
      </section>

    </div>
  )
}

export default HomePage