import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'
import type { Robot } from '../types'
import { sellers } from '../data/sellers'
import { formatPrice } from '../utils/format'
import { useLanguage } from '../contexts/LanguageContext'

function useCountdown() {
  const [remaining, setRemaining] = useState(() => msUntilMidnight())

  useEffect(() => {
    const timer = setInterval(() => setRemaining(msUntilMidnight()), 1000)
    return () => clearInterval(timer)
  }, [])

  const h = Math.floor(remaining / 3_600_000)
  const m = Math.floor((remaining % 3_600_000) / 60_000)
  const s = Math.floor((remaining % 60_000) / 1000)
  return { h, m, s }
}

function msUntilMidnight() {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  return midnight.getTime() - now.getTime()
}

const pad = (n: number) => String(n).padStart(2, '0')

export default function FlashDeals({ robots }: { robots: Robot[] }) {
  const { h, m, s } = useCountdown()
  const { t } = useLanguage()

  return (
    <section className="mx-auto max-w-7xl px-5 lg:px-8 py-14">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-coral/10 text-coral">
            <Zap size={16} className="fill-coral" />
          </span>
          <h2 className="font-display text-2xl font-semibold text-ink">{t('home.deals')}</h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate">
          {t('home.dealsEnds')}
          {[h, m, s].map((v, i) => (
            <span key={i} className="rounded-md bg-ink px-2 py-1 font-display font-semibold text-white tabular-nums">
              {pad(v)}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {robots.map((robot) => {
          const seller = sellers.find((s) => s.id === robot.sellerId)
          const discountPct = 15 + (robot.id.charCodeAt(1) % 16) // deterministic pseudo-random 15-30%
          const wasPrice = Math.round(robot.price / (1 - discountPct / 100))
          return (
            <Link
              key={robot.id}
              to={`/robots/${robot.slug}`}
              className="group rounded-2xl border border-line bg-white overflow-hidden hover:shadow-lg hover:shadow-teal-900/5 transition-shadow"
            >
              <div className="relative aspect-square overflow-hidden bg-mist">
                <img src={robot.images[0]} alt={robot.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                <span className="absolute left-2 top-2 rounded-full bg-coral px-2 py-0.5 text-[10px] font-bold text-white">
                  -{discountPct}%
                </span>
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-ink line-clamp-2 leading-snug">{robot.name}</p>
                <p className="mt-1 text-[11px] text-slate truncate">{seller?.name}</p>
                <div className="mt-1.5 flex items-baseline gap-1.5">
                  <span className="font-display text-sm font-semibold text-coral">{formatPrice(robot.price, robot.currency)}</span>
                  <span className="text-[11px] text-slate line-through">{formatPrice(wasPrice, robot.currency)}</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
