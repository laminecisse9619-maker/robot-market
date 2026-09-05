import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { Star, BadgeCheck, Heart, MessageCircle, ShieldCheck, Truck, FileText, Building2 } from 'lucide-react'
import { robots } from '../data/robots'
import { sellers } from '../data/sellers'
import { useCart } from '../contexts/CartContext'
import { formatPriceOrQuote } from '../utils/format'
import RobotCard from '../components/RobotCard'
import QuoteRequestModal from '../components/QuoteRequestModal'
import ClaimListingModal from '../components/ClaimListingModal'

export default function RobotDetail() {
  const { slug } = useParams()
  const robot = robots.find((r) => r.slug === slug)
  const { addItem } = useCart()
  const [activeImage, setActiveImage] = useState(0)
  const [added, setAdded] = useState(false)
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [showClaimModal, setShowClaimModal] = useState(false)

  if (!robot) return <Navigate to="/robots" replace />

  const seller = sellers.find((s) => s.id === robot.sellerId)
  const similar = robots.filter((r) => r.categorySlug === robot.categorySlug && r.id !== robot.id).slice(0, 4)
  const isPlaceholderListing = seller?.isPlaceholder && !seller.claimed

  const handleAdd = () => {
    addItem(robot.id)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="mx-auto max-w-7xl px-5 lg:px-8 py-10">
      <nav className="text-xs text-slate mb-6 flex items-center gap-1.5">
        <Link to="/" className="hover:text-teal-700">Home</Link> /
        <Link to="/robots" className="hover:text-teal-700">Robots</Link> /
        <span className="text-ink">{robot.name}</span>
      </nav>

      {isPlaceholderListing && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-mist px-4 py-3 text-sm text-slate">
          <span>
            Cette fiche présente un produit réel de <strong className="text-ink">{seller?.name}</strong>, non encore
            revendiquée par le fabricant.
          </span>
          <button
            onClick={() => setShowClaimModal(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-ink px-3.5 py-1.5 text-xs font-medium text-ink hover:bg-ink hover:text-white transition-colors"
          >
            <Building2 size={13} /> Vous êtes le constructeur ? Revendiquez ce profil
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-mist">
            <img src={robot.images[activeImage]} alt={robot.name} className="h-full w-full object-cover" />
          </div>
          <div className="mt-3 flex gap-3">
            {robot.images.map((img, i) => (
              <button
                key={img}
                onClick={() => setActiveImage(i)}
                className={`h-16 w-20 rounded-lg overflow-hidden border-2 ${activeImage === i ? 'border-teal-600' : 'border-transparent'}`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2 text-xs text-slate">
            {robot.condition === 'used' && (
              <span className="rounded-full bg-mist px-2.5 py-1 font-medium text-slate">Refurbished</span>
            )}
            <span>{robot.brand} · {robot.model}</span>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-semibold text-ink">{robot.name}</h1>

          <div className="mt-3 flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1 text-ink font-medium">
              <Star size={15} className="fill-teal-500 text-teal-500" /> {robot.rating}
            </span>
            <span className="text-slate">{robot.reviewCount} reviews</span>
          </div>

          <p className="mt-5 font-display text-3xl font-semibold text-ink">
            {formatPriceOrQuote(robot.price, robot.currency, robot.priceOnRequest)}
          </p>
          {robot.priceOnRequest && (
            <p className="mt-1 text-xs text-slate">Tarif communiqué sur devis en fonction de votre configuration et de votre volume.</p>
          )}

          <p className="mt-4 text-sm leading-relaxed text-slate">{robot.description}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setShowQuoteModal(true)}
              className="flex-1 min-w-[180px] flex items-center justify-center gap-2 rounded-full bg-teal-600 px-6 py-3 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
            >
              <FileText size={15} /> Demander un devis
            </button>
            {!robot.priceOnRequest && (
              <button
                onClick={handleAdd}
                className="flex-1 min-w-[140px] rounded-full border border-line px-6 py-3 text-sm font-medium text-ink hover:bg-mist transition-colors"
              >
                {added ? 'Ajouté au panier' : 'Ajouter au panier'}
              </button>
            )}
            <button className="flex items-center justify-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-medium text-ink hover:bg-mist transition-colors">
              <Heart size={15} /> Wishlist
            </button>
          </div>

          {/* Seller card */}
          {seller && (
            <div className="mt-8 rounded-2xl border border-line p-4 flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mist font-display font-semibold text-teal-800">
                {seller.logoInitial}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium text-ink">{seller.name}</p>
                  {seller.verified && <BadgeCheck size={14} className="text-teal-600" />}
                  {isPlaceholderListing && (
                    <span className="rounded-full bg-mist px-2 py-0.5 text-[10px] font-medium text-slate">Fiche non revendiquée</span>
                  )}
                </div>
                <p className="text-xs text-slate">{seller.country}</p>
              </div>
              {isPlaceholderListing ? (
                <button
                  onClick={() => setShowClaimModal(true)}
                  className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink hover:bg-mist"
                >
                  <Building2 size={13} /> Revendiquer
                </button>
              ) : (
                <Link
                  to={`/messages?seller=${seller.slug}`}
                  className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink hover:bg-mist"
                >
                  <MessageCircle size={13} /> Contact
                </Link>
              )}
            </div>
          )}

          <div className="mt-4 flex flex-col gap-2 text-xs text-slate">
            <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-teal-600" /> {robot.warrantyMonths}-month warranty included</span>
            <span className="flex items-center gap-2"><Truck size={14} className="text-teal-600" /> Ships to {robot.shippingCountries.join(', ')}</span>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <section className="mt-14">
        <h2 className="font-display text-xl font-semibold text-ink mb-5">Robot specifications</h2>
        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-3 rounded-2xl border border-line p-6">
          {robot.specifications.map((spec) => (
            <div key={spec.label} className="flex justify-between border-b border-line/70 py-2 text-sm">
              <span className="text-slate">{spec.label}</span>
              <span className="font-medium text-ink">{spec.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      {robot.features.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold text-ink mb-5">Features</h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {robot.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-ink">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500 shrink-0" /> {f}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Similar robots */}
      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-xl font-semibold text-ink mb-5">Similar robots</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {similar.map((r) => (
              <RobotCard key={r.id} robot={r} />
            ))}
          </div>
        </section>
      )}

      {showQuoteModal && <QuoteRequestModal robot={robot} onClose={() => setShowQuoteModal(false)} />}
      {showClaimModal && seller && (
        <ClaimListingModal robot={robot} seller={seller} onClose={() => setShowClaimModal(false)} />
      )}
    </div>
  )
}
