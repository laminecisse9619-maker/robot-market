import { Link } from 'react-router-dom'
import { X, GitCompare } from 'lucide-react'
import { useCompare } from '../contexts/CompareContext'
import { robots } from '../data/robots'

export default function CompareBar() {
  const { ids, toggle, clear } = useCompare()

  if (ids.length === 0) return null

  const selected = ids.map((id) => robots.find((r) => r.id === id)).filter(Boolean)

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3 shadow-xl shadow-black/10">
        <div className="flex flex-1 items-center gap-2 overflow-x-auto no-scrollbar">
          {selected.map((r) => (
            <div key={r!.id} className="relative shrink-0">
              <img src={r!.images[0]} alt={r!.name} className="h-11 w-11 rounded-lg object-cover" />
              <button
                onClick={() => toggle(r!.id)}
                aria-label="Remove"
                className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-white"
              >
                <X size={10} />
              </button>
            </div>
          ))}
          <span className="shrink-0 text-xs text-slate px-1">{ids.length}/4 selected</span>
        </div>
        <button onClick={clear} className="shrink-0 text-xs font-medium text-slate hover:text-ink">
          Clear
        </button>
        <Link
          to="/compare"
          className="shrink-0 flex items-center gap-1.5 rounded-full bg-teal-600 px-4 py-2 text-xs font-medium text-white hover:bg-teal-700 transition-colors"
        >
          <GitCompare size={13} /> Compare
        </Link>
      </div>
    </div>
  )
}
