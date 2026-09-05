import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface Banner {
  id: string
  eyebrow: string
  title: string
  subtitle: string
  cta: string
  to: string
  gradient: string
}

const banners: Banner[] = [
  {
    id: 'b1',
    eyebrow: 'New sellers welcome',
    title: 'Open your robotics store in minutes',
    subtitle: 'Join sellers from 12+ countries already listing on Robot Market.',
    cta: 'Start selling',
    to: '/sell',
    gradient: 'linear-gradient(120deg, var(--color-teal-900), var(--color-teal-600))',
  },
  {
    id: 'b2',
    eyebrow: 'Flash deals',
    title: 'Up to 30% off industrial arms this week',
    subtitle: 'Limited-time pricing from verified manufacturers.',
    cta: 'Shop deals',
    to: '/robots?deals=1',
    gradient: 'linear-gradient(120deg, #0B2F2C, var(--color-teal-700))',
  },
  {
    id: 'b3',
    eyebrow: 'Worldwide shipping',
    title: 'Robots delivered to over 40 countries',
    subtitle: 'Track every order from dock to doorstep.',
    cta: 'Explore robots',
    to: '/robots',
    gradient: 'linear-gradient(120deg, var(--color-ink), #0B4740)',
  },
]

export default function BannerCarousel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % banners.length), 5000)
    return () => clearInterval(timer)
  }, [])

  const banner = banners[index]

  return (
    <div className="relative overflow-hidden" style={{ background: banner.gradient }}>
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-8 sm:py-10 flex items-center justify-between gap-6">
        <div className="min-w-0">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-glow">{banner.eyebrow}</span>
          <h3 className="mt-1 font-display text-lg sm:text-xl font-semibold text-white leading-snug">{banner.title}</h3>
          <p className="mt-1 text-sm text-white/70 max-w-md">{banner.subtitle}</p>
        </div>
        <Link
          to={banner.to}
          className="shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-ink hover:bg-teal-50 transition-colors"
        >
          {banner.cta}
        </Link>
      </div>
      <div className="relative flex justify-center gap-1.5 pb-3">
        {banners.map((b, i) => (
          <button
            key={b.id}
            onClick={() => setIndex(i)}
            aria-label={`Show banner ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  )
}
