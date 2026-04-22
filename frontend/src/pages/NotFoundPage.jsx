import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <div className="min-h-screen bg-sand flex items-center justify-center px-6">
    <div className="text-center">
      <p className="font-display text-8xl font-semibold text-border mb-6">404</p>
      <h1 className="font-display text-3xl font-semibold text-ink mb-3">Page not found</h1>
      <p className="text-muted text-sm mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="bg-primary text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-secondary transition-colors">
        Back to home
      </Link>
    </div>
  </div>
)

export default NotFoundPage