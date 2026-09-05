import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Search, Heart, ShoppingCart, Menu, X, Bot, User, LogOut, ChevronDown, MapPin, Globe } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useDelivery } from '../contexts/DeliveryContext'
import { isSupabaseConfigured } from '../lib/supabase'
import { categories } from '../data/categories'
import { languages } from '../i18n/translations'

const quickLinkKeys = [
  { to: '/robots', key: 'nav.allRobots' },
  { to: '/robots?category=cobots', label: 'Cobots' },
  { to: '/robots?category=amr', label: 'AMR' },
  { to: '/robots?category=quadrupeds', label: 'Quadrupèdes' },
  { to: '/robots?category=educational', label: 'Éducatifs' },
  { to: '/sellers', key: 'nav.sellers' },
  { to: '/robots?deals=1', key: 'nav.flashDeals' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const { totalItems } = useCart()
  const { user, signOut } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const { location } = useDelivery()
  const navigate = useNavigate()
  const currentLang = languages.find((l) => l.code === language)!

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (category !== 'all') params.set('category', category)
    navigate(`/robots${params.toString() ? `?${params.toString()}` : ''}`)
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40">
      {/* Top bar */}
      <div className="bg-ink">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex h-16 items-center gap-3">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500 text-ink">
                <Bot size={18} strokeWidth={2.2} />
              </span>
              <span className="font-display text-lg font-semibold tracking-tight text-white hidden sm:inline">ROBOT MARKET</span>
            </Link>

            <div className="hidden lg:flex items-center gap-1 text-white/70 text-xs pl-2 pr-3 border-r border-white/10 mr-1 shrink-0">
              {location ? (
                <span className="text-base leading-none" aria-hidden>{location.flag}</span>
              ) : (
                <MapPin size={14} />
              )}
              <span className="leading-tight">{t('nav.shipTo')}<br /><span className="font-medium text-white">{location?.country ?? t('nav.worldwide')}</span></span>
            </div>

            {/* Big search bar with category dropdown, Amazon-style */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 items-stretch rounded-md overflow-hidden bg-white h-10 shadow-sm">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCategoryOpen((v) => !v)}
                  onBlur={() => setTimeout(() => setCategoryOpen(false), 150)}
                  className="h-full flex items-center gap-1 bg-mist px-3 text-xs font-medium text-ink border-r border-line hover:bg-teal-50 transition-colors"
                >
                  {category === 'all' ? 'All' : categories.find((c) => c.slug === category)?.name ?? 'All'}
                  <ChevronDown size={13} />
                </button>
                {categoryOpen && (
                  <div className="absolute left-0 top-full mt-1 w-56 max-h-72 overflow-y-auto rounded-lg border border-line bg-white shadow-xl py-1 z-50">
                    <button
                      onMouseDown={() => { setCategory('all'); setCategoryOpen(false) }}
                      className="w-full text-left px-3 py-2 text-xs text-ink hover:bg-mist"
                    >
                      {t('nav.allCategories')}
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        onMouseDown={() => { setCategory(c.slug); setCategoryOpen(false) }}
                        className="w-full text-left px-3 py-2 text-xs text-ink hover:bg-mist"
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('nav.searchPlaceholder')}
                className="flex-1 min-w-0 px-3 text-sm outline-none text-ink"
              />
              <button type="submit" aria-label="Search" className="shrink-0 flex items-center justify-center w-12 bg-teal-500 hover:bg-teal-400 transition-colors">
                <Search size={17} className="text-ink" />
              </button>
            </form>

            <div className="flex items-center gap-1 ml-auto md:ml-0">
              <div className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() => setLangOpen((v) => !v)}
                  onBlur={() => setTimeout(() => setLangOpen(false), 150)}
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors text-xs"
                  aria-label="Change language"
                >
                  <Globe size={17} />
                  <span className="uppercase">{currentLang.code}</span>
                  <ChevronDown size={12} />
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-full mt-1 w-44 rounded-lg border border-line bg-white shadow-xl py-1 z-50">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onMouseDown={() => { setLanguage(l.code); setLangOpen(false) }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-mist ${l.code === language ? 'text-teal-700 font-medium' : 'text-ink'}`}
                      >
                        {l.nativeLabel}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {isSupabaseConfigured && (
                user ? (
                  <button
                    onClick={handleLogout}
                    className="hidden md:flex flex-col items-start px-2 py-1 text-white/90 hover:text-white text-xs leading-tight"
                  >
                    <span className="text-white/60">Hello, {user.email?.split('@')[0]}</span>
                    <span className="font-medium flex items-center gap-1">{t('nav.signOut')} <LogOut size={11} /></span>
                  </button>
                ) : (
                  <Link to="/login" className="hidden md:flex flex-col items-start px-2 py-1 text-white/90 hover:text-white text-xs leading-tight">
                    <span className="text-white/60">{t('nav.helloSignIn')}</span>
                    <span className="font-medium flex items-center gap-1">{t('nav.account')} <User size={11} /></span>
                  </Link>
                )
              )}
              <Link to="/wishlist" aria-label="Wishlist" className="hidden md:block p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                <Heart size={19} />
              </Link>
              <Link to="/cart" aria-label="Cart" className="relative p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                <ShoppingCart size={19} />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-teal-400 text-[10px] font-bold text-ink">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button onClick={() => setMenuOpen((v) => !v)} className="lg:hidden p-2 text-white" aria-label="Toggle menu">
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary nav: quick category links */}
      <div className="hidden lg:block bg-coral">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <nav className="flex items-center gap-5 h-10 overflow-x-auto no-scrollbar">
            {quickLinkKeys.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="shrink-0 text-xs font-medium text-white/90 hover:text-white transition-colors"
              >
                {link.key ? t(link.key) : link.label}
              </NavLink>
            ))}
            <Link to="/sell" className="ml-auto shrink-0 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-coral hover:bg-teal-50 transition-colors">
              {t('nav.sell')}
            </Link>
          </nav>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-line bg-white px-5 py-4 space-y-4">
          <form onSubmit={handleSearch} className="flex items-center gap-2 rounded-full border border-line bg-mist px-4 py-2">
            <Search size={16} className="text-slate shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('nav.searchPlaceholder')}
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate"
            />
          </form>
          <div className="flex flex-wrap gap-1.5">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  l.code === language ? 'border-teal-600 bg-mist text-teal-800 font-medium' : 'border-line text-slate'
                }`}
              >
                {l.nativeLabel}
              </button>
            ))}
          </div>
          <nav className="flex flex-col gap-1">
            {quickLinkKeys.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate hover:bg-mist"
              >
                {link.key ? t(link.key) : link.label}
              </Link>
            ))}
            <Link to="/sell" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-sm font-medium text-teal-700">
              {t('nav.sell')}
            </Link>
            <Link to="/cart" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-sm font-medium text-slate">
              Cart {totalItems > 0 && `(${totalItems})`}
            </Link>
            {isSupabaseConfigured && (
              user ? (
                <button
                  onClick={() => { setMenuOpen(false); handleLogout() }}
                  className="px-3 py-2 text-left text-sm font-medium text-slate"
                >
                  {t('nav.signOut')}
                </button>
              ) : (
                <Link to="/login" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-sm font-medium text-slate">
                  {t('nav.account')}
                </Link>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
