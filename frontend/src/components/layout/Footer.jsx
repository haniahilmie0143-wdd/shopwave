import { Link } from 'react-router-dom'

const Footer = () => (
  <footer className="bg-dark-2 border-t border-glass-border mt-32 relative overflow-hidden">
    <div className="orb w-96 h-96 bg-primary/5 -top-48 left-1/2 -translate-x-1/2" />
    <div className="max-w-7xl mx-auto px-6 py-20 relative">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-glass-border">
        <div className="md:col-span-1">
          <p className="font-display text-2xl font-bold gradient-text mb-4">ShopWave</p>
          <p className="text-sm text-silver leading-relaxed">Premium electronics engineered for those who demand the extraordinary.</p>
          <div className="flex gap-3 mt-6">
            {['T', 'I', 'G'].map((s) => (
              <div key={s} className="w-8 h-8 glass rounded-lg border border-glass-border flex items-center justify-center text-xs text-silver hover:text-primary hover:border-primary/40 transition-all cursor-pointer">
                {s}
              </div>
            ))}
          </div>
        </div>
        {[
          { title: 'Products', links: ['Phones', 'Laptops', 'Audio', 'Accessories'] },
          { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
          { title: 'Support', links: ['Help Center', 'Returns', 'Shipping', 'Contact'] },
        ].map(({ title, links }) => (
          <div key={title}>
            <p className="text-xs font-semibold uppercase tracking-widest text-silver/40 mb-5">{title}</p>
            <div className="flex flex-col gap-3">
              {links.map((l) => (
                <Link key={l} to="/" className="text-sm text-silver hover:text-primary transition-colors duration-200">{l}</Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-silver/30">© 2024 ShopWave. Built with React, Node.js & MongoDB.</p>
        <p className="text-xs text-silver/30">Free shipping on orders over $100</p>
      </div>
    </div>
  </footer>
)

export default Footer