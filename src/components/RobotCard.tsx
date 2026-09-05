import { Link } from 'react-router-dom'
import { Star, Heart, BadgeCheck, GitCompare } from 'lucide-react'
import type { Robot } from '../types'
import { sellers } from '../data/sellers'
import { formatPriceOrQuote } from '../utils/format'
import { useCompare } from '../contexts/CompareContext'

export default function RobotCard({ robot }: { robot: Robot }) {
  const seller = sellers.find((s) => s.id === robot.sellerId)
  const { toggle, isComparing } = useCompare()
  const comparing = isComparing(robot.id)

  return (
    <Link
      to={`/robots/${robot.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-lg hover:shadow-teal-900/5"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-mist">
        <img
          src={robot.images[0]}
          alt={robot.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            aria-label="Add to wishlist"
            onClick={(e) => e.preventDefault()}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate hover:text-teal-700 transition-colors"
          >
            <Heart size={15} />
          </button>
          <button
            aria-label="Add to compare"
            onClick={(e) => {
              e.preventDefault()
              toggle(robot.id)
            }}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              comparing ? 'bg-teal-600 text-white' : 'bg-white/90 text-slate hover:text-teal-700'
            }`}
          >
            <GitCompare size={14} />
          </button>
        </div>
        {robot.condition === 'used' && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-slate">
            Refurbished
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-1.5 text-xs text-slate">
          <span>{seller?.name}</span>
          {seller?.verified && <BadgeCheck size={13} className="text-teal-600" />}
          <span aria-hidden>·</span>
          <span>{robot.country}</span>
        </div>
        <h3 className="font-display text-base font-semibold leading-snug text-ink">{robot.name}</h3>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-display text-lg font-semibold text-ink">
            {formatPriceOrQuote(robot.price, robot.currency, robot.priceOnRequest)}
          </span>
          <span className="flex items-center gap-1 text-sm text-slate">
            <Star size={14} className="fill-teal-500 text-teal-500" />
            {robot.rating} <span className="text-slate/70">({robot.reviewCount})</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
