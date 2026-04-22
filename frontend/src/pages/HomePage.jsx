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
        const { data } = await axios.get(`/api/products${search ? `?keyword=${search}` : ''}`)
        setProducts(data)
      } catch {
        setError('Failed to load products. Make sure your backend is running.')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [search])

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

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">

        {/* Background orbs */}
        <div className="orb w-[600px] h-[600px] bg-primary/10 top-1/2 -translate-y-1/2 -left-48 glow-pulse" />
        <div className="orb w-[400px] h-[400px] bg-purple-500/8 top-1/4 right-0 glow-pulse" style={{animationDelay:'1.5s'}} />
        <div className="orb w-[300px] h-[300px] bg-primary/5 bottom-0 right-1/3" />

        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '80px 80px'}} />

        <div className="max-w-7xl mx-auto px-6 pt-24 pb-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 glass border border-glass-border rounded-full px-4 py-2 mb-8">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-silver uppercase tracking-widest">New arrivals 2024</span>
              </div>

              <h1 className="font-display text-6xl lg:text-7xl font-bold leading-[1.0] mb-6">
                <span className="gradient-text">Premium</span>
                <br />
                <span className="text-bright">tech,</span>
                <br />
                <span className="text-silver font-normal italic">redefined.</span>
              </h1>

              <p className="text-silver text-lg leading-relaxed mb-10 max-w-md">
                Handpicked electronics from the world's most innovative brands. Built different. Built better.
              </p>

              {/* Search */}
              <div className="flex gap-3 mb-10">
                <div className="flex-1 relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-silver/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 glass border border-glass-border rounded-2xl text-sm text-bright placeholder-silver/40 outline-none focus:border-primary/50 transition-all duration-300 bg-transparent"
                  />
                </div>
                <button
                  onClick={() => setSearch('')}
                  className="bg-primary text-white px-7 py-4 rounded-2xl text-sm font-semibold hover:bg-primary-glow transition-all duration-200 shadow-glow whitespace-nowrap font-display"
                >
                  Browse all
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-8">
                {[
                  { val: '6+', label: 'Products' },
                  { val: '4.8★', label: 'Avg rating' },
                  { val: 'Free', label: 'Shipping $100+' },
                ].map(({ val, label }) => (
                  <div key={label}>
                    <p className="font-display text-2xl font-bold text-bright">{val}</p>
                    <p className="text-xs text-silver mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — floating product grid */}
            <div className="hidden lg:grid grid-cols-2 gap-4 relative">
              <div className="orb w-64 h-64 bg-primary/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              {products.slice(0, 4).map((p, i) => (
                <div key={p._id}
                  className={`glass border border-glass-border rounded-3xl overflow-hidden float ${i % 2 === 1 ? 'mt-8' : ''}`}
                  style={{animationDelay: `${i * 0.5}s`}}>
                  <img src={p.image} alt={p.name} className="w-full aspect-square object-cover opacity-90" />
                  <div className="p-3">
                    <p className="text-xs font-bold font-display text-bright truncate">{p.name}</p>
                    <p className="text-xs text-primary font-semibold">${p.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <p className="text-xs text-silver uppercase tracking-widest">Scroll</p>
          <div className="w-px h-12 bg-gradient-to-b from-silver to-transparent" />
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-glass-border bg-dark-2">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-center gap-10">
          {[
            { icon: '⚡', text: 'Lightning fast delivery' },
            { icon: '🔒', text: 'Encrypted payments' },
            { icon: '↩️', text: '30-day returns' },
            { icon: '🛡️', text: '2-year warranty' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2.5">
              <span className="text-base">{icon}</span>
              <span className="text-xs font-medium text-silver uppercase tracking-wider">{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Collection</p>
            <h2 className="font-display text-4xl font-bold text-bright">Our lineup</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    category === cat
                      ? 'bg-primary text-white shadow-glow'
                      : 'glass border border-glass-border text-silver hover:border-primary/40 hover:text-primary'
                  }`}>
                  {cat}
                </button>
              ))}
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="glass border border-glass-border rounded-xl px-4 py-2 text-xs text-silver bg-transparent outline-none hover:border-primary/40 cursor-pointer">
              <option value="default" className="bg-dark-3">Default</option>
              <option value="price-asc" className="bg-dark-3">Price ↑</option>
              <option value="price-desc" className="bg-dark-3">Price ↓</option>
              <option value="rating" className="bg-dark-3">Top rated</option>
            </select>
          </div>
        </div>

        {loading ? <Spinner /> : error ? <Message type="error">{error}</Message> : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-2xl text-silver">No products found</p>
            <button onClick={() => { setSearch(''); setCategory('All') }} className="mt-4 text-sm text-primary hover:underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="relative overflow-hidden">
        <div className="orb w-96 h-96 bg-primary/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-4xl mx-auto px-6 py-28 text-center relative">
          <h2 className="font-display text-5xl font-bold text-bright mb-6 leading-tight">
            The future of tech<br />
            <span className="gradient-text">starts here.</span>
          </h2>
          <p className="text-silver mb-10 max-w-md mx-auto">Every device in our collection is selected for performance, design, and longevity.</p>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-primary text-white px-10 py-4 rounded-2xl font-display font-semibold hover:bg-primary-glow transition-all duration-200 shadow-glow-lg">
            Shop now →
          </button>
        </div>
      </section>
    </div>
  )
}

export default HomePage