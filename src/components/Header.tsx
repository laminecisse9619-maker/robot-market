import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Search, Heart, ShoppingCart, Menu, X, Bot } from 'lucide-react'
import { useCart } from '../contexts/CartContext'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/robots', label: 'Robots' },
  { to: '/sellers', label: 'Sellers' },
  { to: '/sell', label: 'Sell a Robot' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { totalItems } = useCart()
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(query ? `/robots?q=${encodeURIComponent(query)}` : '/robots')
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-line">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-white">
              <Bot size={18} strokeWidth={2} />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-ink">ROBOT MARKET</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive ? 'text-teal-900 bg-mist' : 'text-slate hover:text-ink'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm items-center gap-2 rounded-full border border-line bg-mist px-4 py-2">
            <Search size={16} className="text-slate shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search robots..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate"
            />
          </form>

          <div className="hidden md:flex items-center gap-1">
            <Link to="/wishlist" aria-label="Wishlist" className="p-2 rounded-full text-slate hover:text-ink hover:bg-mist transition-colors">
              <Heart size={19} />
            </Link>
            <Link to="/cart" aria-label="Cart" className="relative p-2 rounded-full text-slate hover:text-ink hover:bg-mist transition-colors">
              <ShoppingCart size={19} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-teal-600 text-[10px] font-semibold text-white">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link
              to="/sell"
              className="ml-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-teal-950 transition-colors"
            >
              Sell Your Robot
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden p-2 text-ink"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-line bg-white px-5 py-4 space-y-4">
          <form onSubmit={handleSearch} className="flex items-center gap-2 rounded-full border border-line bg-mist px-4 py-2">
            <Search size={16} className="text-slate shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search robots..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate"
            />
          </form>
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'text-teal-900 bg-mist' : 'text-slate'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link to="/cart" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-sm font-medium text-slate">
              Cart {totalItems > 0 && `(${totalItems})`}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
