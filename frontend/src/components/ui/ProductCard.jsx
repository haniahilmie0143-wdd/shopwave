import { Link } from 'react-router-dom'

const ProductCard = ({ product, index = 0 }) => (
  <Link to={`/product/${product._id}`} className="group block"
    style={{ animationDelay: `${index * 0.08}s` }}>
    <div className="card-3d glass glass-hover rounded-3xl overflow-hidden border border-glass-border relative">

      {/* Shimmer on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shimmer rounded-3xl" />

      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        {product.rating >= 4.7 && product.countInStock > 0 && (
          <span className="text-[10px] font-bold text-white bg-primary px-2.5 py-1 rounded-full shadow-glow">
            ★ TOP RATED
          </span>
        )}
        {product.countInStock === 0 && (
          <span className="text-[10px] font-bold text-silver bg-dark-4 border border-glass-border px-2.5 py-1 rounded-full">
            SOLD OUT
          </span>
        )}
      </div>

      {/* Image */}
      <div className="aspect-square overflow-hidden bg-dark-3 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
      </div>

      {/* Info */}
      <div className="p-5 relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/70 mb-2">{product.brand}</p>
        <h3 className="font-display font-semibold text-bright text-base leading-snug mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {product.name}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map((s) => (
              <svg key={s} className={`w-3 h-3 ${s <= Math.round(product.rating) ? 'text-amber-400' : 'text-glass-border'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-silver">({product.numReviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <p className="font-display text-2xl font-bold text-bright">${product.price}</p>
          <div className="w-9 h-9 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300 group-hover:shadow-glow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Link>
)

export default ProductCard