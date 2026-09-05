import { Link } from 'react-router-dom'
import { X, GitCompare } from 'lucide-react'
import { useCompare } from '../contexts/CompareContext'
import { robots } from '../data/robots'
import { sellers } from '../data/sellers'
import { formatPriceOrQuote } from '../utils/format'

export default function Compare() {
  const { ids, toggle, clear } = useCompare()
  const selected = ids.map((id) => robots.find((r) => r.id === id)).filter(Boolean) as typeof robots

  if (selected.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 lg:px-8 py-24 text-center">
        <GitCompare size={36} className="mx-auto text-slate" />
        <h1 className="mt-4 font-display text-2xl font-semibold text-ink">No robots selected</h1>
        <p className="mt-2 text-sm text-slate">Pick up to 4 robots from the marketplace to compare them side by side.</p>
        <Link to="/robots" className="mt-6 inline-block rounded-full bg-teal-600 px-6 py-3 text-sm font-medium text-white hover:bg-teal-700">
          Browse Robots
        </Link>
      </div>
    )
  }

  // Union of all spec labels across selected robots, in first-seen order
  const allLabels: string[] = []
  selected.forEach((r) => r.specifications.forEach((s) => { if (!allLabels.includes(s.label)) allLabels.push(s.label) }))

  return (
    <div className="mx-auto max-w-7xl px-5 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-semibold text-ink">Compare robots</h1>
        <button onClick={clear} className="text-sm font-medium text-slate hover:text-ink">Clear all</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0 min-w-[640px]">
          <thead>
            <tr>
              <th className="w-40" />
              {selected.map((r) => (
                <th key={r.id} className="p-3 text-left align-top">
                  <div className="relative rounded-xl border border-line p-3 bg-white">
                    <button
                      onClick={() => toggle(r.id)}
                      aria-label="Remove"
                      className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-mist text-slate hover:text-ink"
                    >
                      <X size={13} />
                    </button>
                    <img src={r.images[0]} alt={r.name} className="h-24 w-full rounded-lg object-cover mb-2" />
                    <Link to={`/robots/${r.slug}`} className="font-display text-sm font-semibold text-ink hover:text-teal-700 line-clamp-2">
                      {r.name}
                    </Link>
                    <p className="mt-1 font-display text-sm font-semibold text-teal-700">{formatPriceOrQuote(r.price, r.currency, r.priceOnRequest)}</p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <Row label="Brand">{selected.map((r) => <td key={r.id} className="p-3 text-sm text-ink border-t border-line">{r.brand}</td>)}</Row>
            <Row label="Seller">{selected.map((r) => <td key={r.id} className="p-3 text-sm text-ink border-t border-line">{sellers.find((s) => s.id === r.sellerId)?.name}</td>)}</Row>
            <Row label="Country">{selected.map((r) => <td key={r.id} className="p-3 text-sm text-ink border-t border-line">{r.country}</td>)}</Row>
            <Row label="Rating">{selected.map((r) => <td key={r.id} className="p-3 text-sm text-ink border-t border-line">{r.rating} ({r.reviewCount})</td>)}</Row>
            <Row label="Condition">{selected.map((r) => <td key={r.id} className="p-3 text-sm text-ink border-t border-line capitalize">{r.condition}</td>)}</Row>
            <Row label="Warranty">{selected.map((r) => <td key={r.id} className="p-3 text-sm text-ink border-t border-line">{r.warrantyMonths} months</td>)}</Row>
            {allLabels.map((label) => (
              <Row key={label} label={label}>
                {selected.map((r) => {
                  const spec = r.specifications.find((s) => s.label === label)
                  return <td key={r.id} className="p-3 text-sm text-ink border-t border-line">{spec?.value ?? '—'}</td>
                })}
              </Row>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr>
      <td className="p-3 text-sm font-medium text-slate border-t border-line whitespace-nowrap">{label}</td>
      {children}
    </tr>
  )
}
