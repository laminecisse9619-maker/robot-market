import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BadgeCheck, Star } from 'lucide-react'
import { sellers } from '../data/sellers'
import { robots } from '../data/robots'

export default function Sellers() {
  const [query, setQuery] = useState('')
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  const filtered = useMemo(() => {
    return sellers.filter((s) => {
      const matchesQuery = query ? s.name.toLowerCase().includes(query.toLowerCase()) || s.country.toLowerCase().includes(query.toLowerCase()) : true
      const matchesVerified = verifiedOnly ? s.verified : true
      return matchesQuery && matchesVerified
    })
  }, [query, verifiedOnly])

  return (
    <div className="mx-auto max-w-7xl px-5 lg:px-8 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Discover sellers</h1>
          <p className="text-sm text-slate mt-1">{filtered.length} sellers across the world</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or country..."
            className="input max-w-xs"
          />
          <button
            onClick={() => setVerifiedOnly((v) => !v)}
            className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-medium border transition-colors ${
              verifiedOnly ? 'bg-ink text-white border-ink' : 'border-line text-slate'
            }`}
          >
            Verified only
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((seller) => {
          const listingCount = robots.filter((r) => r.sellerId === seller.id).length
          return (
            <Link
              key={seller.id}
              to={`/sellers/${seller.slug}`}
              className="rounded-2xl border border-line bg-white p-5 hover:shadow-lg hover:shadow-teal-900/5 transition-shadow"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-mist font-display font-semibold text-teal-800">
                  {seller.logoInitial}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-display text-sm font-semibold text-ink truncate">{seller.name}</p>
                    {seller.verified && <BadgeCheck size={14} className="text-teal-600 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate">{seller.country}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate leading-relaxed line-clamp-2">{seller.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-slate pt-3 border-t border-line">
                <span className="flex items-center gap-1"><Star size={12} className="fill-teal-500 text-teal-500" /> {seller.rating} ({seller.reviewCount})</span>
                <span>{listingCount} robots</span>
                <span>{seller.salesCount} sales</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
