import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { robots } from '../data/robots'
import { categories } from '../data/categories'
import RobotCard from '../components/RobotCard'

type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'newest' | 'rating'

export default function Robots() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const activeCategory = searchParams.get('category') ?? ''

  const [sort, setSort] = useState<SortKey>('relevance')
  const [maxPrice, setMaxPrice] = useState<number>(200000)
  const [condition, setCondition] = useState<'all' | 'new' | 'used'>('all')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filtered = useMemo(() => {
    let list = robots.filter((r) => {
      const matchesQuery = query
        ? `${r.name} ${r.brand} ${r.categorySlug}`.toLowerCase().includes(query.toLowerCase())
        : true
      const matchesCategory = activeCategory ? r.categorySlug === activeCategory : true
      const matchesPrice = r.price <= maxPrice
      const matchesCondition = condition === 'all' ? true : r.condition === condition
      return matchesQuery && matchesCategory && matchesPrice && matchesCondition
    })

    switch (sort) {
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price)
        break
      case 'newest':
        list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        break
      case 'rating':
        list = [...list].sort((a, b) => b.rating - a.rating)
        break
    }
    return list
  }, [query, activeCategory, sort, maxPrice, condition])

  const setCategory = (slug: string) => {
    const next = new URLSearchParams(searchParams)
    if (slug) next.set('category', slug)
    else next.delete('category')
    setSearchParams(next)
  }

  return (
    <div className="mx-auto max-w-7xl px-5 lg:px-8 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            {query ? `Results for "${query}"` : 'Browse robots'}
          </h1>
          <p className="text-sm text-slate mt-1">{filtered.length} robots found</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className="lg:hidden flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink"
          >
            <SlidersHorizontal size={15} /> Filters
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full border border-line px-4 py-2 text-sm text-ink bg-white"
          >
            <option value="relevance">Relevance</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="newest">Newest</option>
            <option value="rating">Top rated</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        {/* Filters sidebar */}
        <aside className={`${filtersOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="rounded-2xl border border-line p-5 space-y-6 sticky top-24">
            <div className="flex items-center justify-between lg:hidden">
              <h2 className="font-display text-sm font-semibold">Filters</h2>
              <button onClick={() => setFiltersOpen(false)}><X size={16} /></button>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-ink mb-3">Category</h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => setCategory('')}
                  className={`block text-sm ${activeCategory === '' ? 'text-teal-700 font-medium' : 'text-slate'}`}
                >
                  All categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.slug)}
                    className={`block text-sm ${activeCategory === cat.slug ? 'text-teal-700 font-medium' : 'text-slate'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-ink mb-3">
                Max price: {maxPrice >= 200000 ? 'No limit' : `$${maxPrice.toLocaleString()}`}
              </h3>
              <input
                type="range"
                min={500}
                max={200000}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
              <p className="mt-1.5 text-[11px] text-slate">Les robots "Prix sur devis" restent toujours visibles.</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-ink mb-3">Condition</h3>
              <div className="flex gap-2">
                {(['all', 'new', 'used'] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCondition(c)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize border ${
                      condition === c ? 'bg-ink text-white border-ink' : 'border-line text-slate'
                    }`}
                  >
                    {c === 'all' ? 'All' : c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Results grid */}
        <div>
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-line p-12 text-center">
              <p className="text-ink font-medium">No robots match these filters.</p>
              <p className="text-sm text-slate mt-1">Try widening your price range or clearing a filter.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((robot) => (
                <RobotCard key={robot.id} robot={robot} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
