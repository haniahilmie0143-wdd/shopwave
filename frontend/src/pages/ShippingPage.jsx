import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { saveShippingAddress } from '../redux/cartSlice'

const ShippingPage = () => {
  const { shippingAddress } = useSelector((state) => state.cart)
  const [address, setAddress] = useState(shippingAddress.address || '')
  const [city, setCity] = useState(shippingAddress.city || '')
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '')
  const [country, setCountry] = useState(shippingAddress.country || '')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(saveShippingAddress({ address, city, postalCode, country }))
    navigate('/payment')
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 relative overflow-hidden">
      <div className="orb w-96 h-96 bg-primary/10 top-1/4 -left-48" />
      <div className="orb w-64 h-64 bg-purple-500/8 bottom-1/4 -right-32" />
      <div className="absolute inset-0 opacity-[0.02]"
        style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px'}} />

      <div className="glass border border-glass-border rounded-3xl p-8 w-full max-w-md relative page-enter">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-t-3xl" />

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8">
          {['Shipping', 'Payment', 'Confirm'].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 ${i === 0 ? 'text-primary' : 'text-silver/30'}`}>
                <div className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center border ${i === 0 ? 'bg-primary border-primary text-white' : 'border-glass-border'}`}>
                  {i + 1}
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider">{step}</span>
              </div>
              {i < 2 && <div className="w-6 h-px bg-glass-border" />}
            </div>
          ))}
        </div>

        <div className="mb-8">
          <p className="font-display text-3xl font-bold gradient-text mb-1">Shipping</p>
          <p className="text-sm text-silver">Where should we send your order?</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-silver uppercase tracking-wider mb-2 block">Street address</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required
              placeholder="123 Main Street"
              className="w-full glass border border-glass-border rounded-2xl px-4 py-3.5 text-sm text-bright placeholder-silver/30 outline-none focus:border-primary/60 transition-all duration-300 bg-transparent" />
          </div>
          <div>
            <label className="text-xs font-semibold text-silver uppercase tracking-wider mb-2 block">City</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required
              placeholder="New York"
              className="w-full glass border border-glass-border rounded-2xl px-4 py-3.5 text-sm text-bright placeholder-silver/30 outline-none focus:border-primary/60 transition-all duration-300 bg-transparent" />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-semibold text-silver uppercase tracking-wider mb-2 block">Postal code</label>
              <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required
                placeholder="10001"
                className="w-full glass border border-glass-border rounded-2xl px-4 py-3.5 text-sm text-bright placeholder-silver/30 outline-none focus:border-primary/60 transition-all duration-300 bg-transparent" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-silver uppercase tracking-wider mb-2 block">Country</label>
              <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required
                placeholder="USA"
                className="w-full glass border border-glass-border rounded-2xl px-4 py-3.5 text-sm text-bright placeholder-silver/30 outline-none focus:border-primary/60 transition-all duration-300 bg-transparent" />
            </div>
          </div>

          <button type="submit"
            className="bg-primary text-white py-4 rounded-2xl font-display font-bold hover:bg-primary-glow transition-all duration-200 shadow-glow mt-2">
            Continue to payment →
          </button>
        </form>
      </div>
    </div>
  )
}

export default ShippingPage