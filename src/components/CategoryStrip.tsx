import { Link } from 'react-router-dom'
import { Bot, Cpu, Factory, House, Sparkles, Shield, Sprout, HeartPulse, GraduationCap, Truck, Plane, Cog } from 'lucide-react'
import { categories } from '../data/categories'

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Bot, Cpu, Factory, House, Sparkles, Shield, Sprout, HeartPulse, GraduationCap, Truck, Plane, Cog,
}

export default function CategoryStrip() {
  return (
    <div className="border-b border-line bg-white">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-4">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] ?? Bot
            return (
              <Link
                key={cat.id}
                to={`/robots?category=${cat.slug}`}
                className="flex shrink-0 flex-col items-center gap-1.5 group"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-mist text-teal-700 group-hover:bg-teal-100 transition-colors">
                  <Icon size={20} />
                </span>
                <span className="text-[11px] font-medium text-ink whitespace-nowrap">{cat.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
