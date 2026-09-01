import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, ArrowUpRight, Bot, Cpu, Factory, House, Sparkles, Shield, Sprout, HeartPulse, GraduationCap, Truck, Plane, Cog } from 'lucide-react'
import { categories } from '../data/categories'
import { robots } from '../data/robots'
import RobotCard from '../components/RobotCard'

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Bot, Cpu, Factory, House, Sparkles, Shield, Sprout, HeartPulse, GraduationCap, Truck, Plane, Cog,
}

const suggestions = ['Humanoid robot', 'Cleaning robot', 'Industrial robot', 'Agricultural robot', 'AI robot']

export default function Home() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(query ? `/robots?q=${encodeURIComponent(query)}` : '/robots')
  }

  const featured = robots.slice(0, 8)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: 'radial-gradient(circle at 80% 20%, var(--color-teal-700), transparent 55%)',
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold leading-[1.08] tracking-tight text-white">
              Discover. Buy. Sell.
              <br />
              The future of robotics.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-teal-glow/90 text-white/70">
              The world's marketplace for robots. Find innovative machines from sellers and manufacturers across the globe.
            </p>

            <form onSubmit={handleSearch} className="mt-8 flex items-center gap-2 rounded-full bg-white p-1.5 pl-5 shadow-xl shadow-black/20">
              <Search size={18} className="text-slate shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What robot are you looking for?"
                className="w-full bg-transparent text-sm outline-none py-2"
              />
              <button type="submit" className="shrink-0 rounded-full bg-teal-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-700 transition-colors">
                Search
              </button>
            </form>
            <div className="mt-4 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <Link
                  key={s}
                  to={`/robots?q=${encodeURIComponent(s)}`}
                  className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:text-white hover:border-white/30 transition-colors"
                >
                  {s}
                </Link>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/robots" className="rounded-full bg-teal-500 px-6 py-3 text-sm font-medium text-ink hover:bg-teal-glow transition-colors">
                Explore Robots
              </Link>
              <Link to="/sell" className="rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                Sell Your Robot
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <img src="https://picsum.photos/seed/hero-a/500/620" alt="" className="rounded-2xl object-cover h-72 w-full translate-y-6" />
              <img src="https://picsum.photos/seed/hero-b/500/620" alt="" className="rounded-2xl object-cover h-72 w-full" />
              <img src="https://picsum.photos/seed/hero-c/500/620" alt="" className="rounded-2xl object-cover h-72 w-full" />
              <img src="https://picsum.photos/seed/hero-d/500/620" alt="" className="rounded-2xl object-cover h-72 w-full translate-y-6" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-2xl font-semibold text-ink">Explore robot categories</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] ?? Bot
            return (
              <Link
                key={cat.id}
                to={`/robots?category=${cat.slug}`}
                className="flex flex-col items-center gap-2 rounded-2xl border border-line p-5 text-center hover:border-teal-500 hover:bg-mist transition-colors"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-mist text-teal-700">
                  <Icon size={18} />
                </span>
                <span className="text-sm font-medium text-ink leading-tight">{cat.name}</span>
                <span className="text-xs text-slate">{cat.productCount} listings</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Featured robots */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-2xl font-semibold text-ink">Featured robots</h2>
          <Link to="/robots" className="hidden sm:flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-900">
            View all <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((robot) => (
            <RobotCard key={robot.id} robot={robot} />
          ))}
        </div>
      </section>

      {/* Trust section */}
      <section className="bg-mist py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <h2 className="font-display text-2xl font-semibold text-ink mb-8">Buy with confidence</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: 'Verified sellers', desc: 'Every seller passes an identity and business check before listing.' },
              { title: 'Secure payments', desc: 'Funds are held safely until your order is confirmed as received.' },
              { title: 'Order tracking', desc: 'Follow your robot from the seller\'s dock to your door.' },
              { title: 'Buyer protection', desc: 'Get a refund if a robot doesn\'t match its listing.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-white p-5 border border-line">
                <h3 className="font-display text-sm font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm text-slate leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
