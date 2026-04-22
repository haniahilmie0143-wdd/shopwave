import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import AdminLayout from '../../components/layout/AdminLayout'

const AdminProductsPage = () => {
  const { userInfo } = useSelector((state) => state.auth)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products')
      setProducts(data)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const { data } = await axios.post('/api/products', {}, config)
      setProducts([data, ...products])
      setEditingId(data._id)
      setEditForm({ name: data.name, price: data.price, brand: data.brand, category: data.category, countInStock: data.countInStock, description: data.description, image: data.image })
      setMessage({ type: 'success', text: 'Product created. Fill in the details below.' })
    } catch {
      setMessage({ type: 'error', text: 'Failed to create product.' })
    }
  }

  const handleEdit = (product) => {
    setEditingId(product._id)
    setEditForm({ name: product.name, price: product.price, brand: product.brand, category: product.category, countInStock: product.countInStock, description: product.description, image: product.image })
  }

  const handleSave = async (id) => {
    setSaving(true)
    try {
      const { data } = await axios.put(`/api/products/${id}`, editForm, config)
      setProducts(products.map((p) => p._id === id ? data : p))
      setEditingId(null)
      setMessage({ type: 'success', text: 'Product updated.' })
    } catch {
      setMessage({ type: 'error', text: 'Failed to update.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await axios.delete(`/api/products/${id}`, config)
      setProducts(products.filter((p) => p._id !== id))
      setMessage({ type: 'success', text: 'Product deleted.' })
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete.' })
    }
  }

  const inputClass = "w-full glass border border-glass-border rounded-xl px-3 py-2.5 text-sm text-bright placeholder-silver/30 outline-none focus:border-primary/60 transition-all bg-transparent"

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Inventory</p>
          <h1 className="font-display text-4xl font-bold text-bright">Products</h1>
          <p className="text-silver text-sm mt-1">{products.length} total products</p>
        </div>
        <button onClick={handleCreate}
          className="bg-primary text-white px-5 py-3 rounded-2xl text-sm font-display font-bold hover:bg-primary-glow transition-all shadow-glow">
          + Add product
        </button>
      </div>

      {message && (
        <div className={`mb-6 px-5 py-4 rounded-2xl text-sm border ${
          message.type === 'success'
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : 'bg-red-500/10 text-red-400 border-red-500/20'
        }`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />
            <div className="absolute inset-0 border-2 border-transparent border-t-primary rounded-full animate-spin" />
          </div>
        </div>
      ) : (
        <div className="glass border border-glass-border rounded-3xl overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-glass-border bg-dark-3/50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-silver/40">Product</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-silver/40">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-silver/40">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-silver/40">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-silver/40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <>
                  <tr key={product._id} className="border-b border-glass-border/50 hover:bg-glass-hover transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded-xl object-cover bg-dark-3" />
                        <span className="font-semibold text-bright line-clamp-1">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-display font-bold text-primary">${product.price}</td>
                    <td className="px-6 py-4 text-silver text-xs uppercase tracking-wider">{product.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        product.countInStock > 0
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button onClick={() => handleEdit(product)} className="text-xs font-semibold text-primary hover:text-primary-glow transition-colors">Edit</button>
                        <button onClick={() => handleDelete(product._id)} className="text-xs font-semibold text-red-400/60 hover:text-red-400 transition-colors">Delete</button>
                      </div>
                    </td>
                  </tr>
                  {editingId === product._id && (
                    <tr key={`edit-${product._id}`} className="border-b border-primary/10">
                      <td colSpan={5} className="px-6 py-5 bg-primary/5">
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          {[
                            { label: 'Name', key: 'name' },
                            { label: 'Brand', key: 'brand' },
                            { label: 'Category', key: 'category' },
                            { label: 'Price', key: 'price', type: 'number' },
                            { label: 'Stock', key: 'countInStock', type: 'number' },
                            { label: 'Image URL', key: 'image' },
                          ].map(({ label, key, type }) => (
                            <div key={key}>
                              <label className="text-xs font-semibold text-silver/50 uppercase tracking-wider mb-1.5 block">{label}</label>
                              <input type={type || 'text'} value={editForm[key] || ''}
                                onChange={(e) => setEditForm({ ...editForm, [key]: type === 'number' ? Number(e.target.value) : e.target.value })}
                                className={inputClass} />
                            </div>
                          ))}
                        </div>
                        <div className="mb-4">
                          <label className="text-xs font-semibold text-silver/50 uppercase tracking-wider mb-1.5 block">Description</label>
                          <textarea value={editForm.description || ''}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            rows={2} className={inputClass} />
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => handleSave(product._id)} disabled={saving}
                            className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-display font-bold hover:bg-primary-glow disabled:opacity-50 transition-all shadow-glow">
                            {saving ? 'Saving...' : 'Save changes'}
                          </button>
                          <button onClick={() => setEditingId(null)}
                            className="glass border border-glass-border text-silver px-5 py-2.5 rounded-xl text-sm hover:text-bright transition-colors">
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminProductsPage