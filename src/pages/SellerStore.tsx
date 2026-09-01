import { useParams, Navigate, Link } from 'react-router-dom'
import { BadgeCheck, Star, MessageCircle, MapPin } from 'lucide-react'
import { sellers } from '../data/sellers'
import { robots } from '../data/robots'
import RobotCard from '../components/RobotCard'

export default function SellerStore() {
  const { slug } = useParams()
  const seller = sellers.find((s) => s.slug === slug)
  if (!seller) return <Navigate to="/sellers" replace />

  const listings = robots.filter((r) => r.sellerId === seller.id)

  return (
    <div>
      <div className="bg-ink">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-10 flex flex-wrap items-center gap-5">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 font-display text-xl font-semibold text-white">
            {seller.logoInitial}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl font-semibold text-white">{seller.name}</h1>
              {seller.verified && <BadgeCheck size={16} className="text-teal-400" />}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-white/70">
              <span className="flex items-center gap-1"><MapPin size={13} /> {seller.country}</span>
              <span className="flex items-center gap-1"><Star size={13} className="fill-teal-400 text-teal-400" /> {seller.rating} ({seller.reviewCount} reviews)</span>
              <span>{seller.salesCount} sales</span>
              <span>Member since {seller.joinedYear}</span>
            </div>
          </div>
          <Link
            to={`/messages?seller=${seller.slug}`}
            className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-ink hover:bg-teal-50 transition-colors"
          >
            <MessageCircle size={15} /> Contact seller
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-10">
        <p className="max-w-2xl text-sm text-slate leading-relaxed">{seller.description}</p>

        <h2 className="mt-10 font-display text-lg font-semibold text-ink mb-5">{listings.length} robots from {seller.name}</h2>
        {listings.length === 0 ? (
          <p className="text-sm text-slate">This seller has no active listings right now.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {listings.map((r) => <RobotCard key={r.id} robot={r} />)}
          </div>
        )}
      </div>
    </div>
  )
}
