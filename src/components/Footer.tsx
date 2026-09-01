import { Link } from 'react-router-dom'
import { Bot } from 'lucide-react'

const columns = [
  {
    title: 'Marketplace',
    links: [
      { label: 'Browse Robots', to: '/robots' },
      { label: 'Categories', to: '/robots' },
      { label: 'Sellers', to: '/sellers' },
    ],
  },
  {
    title: 'Sell',
    links: [
      { label: 'Sell a Robot', to: '/sell' },
      { label: 'Seller Guide', to: '/sell' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Help Center', to: '/' },
      { label: 'Shipping', to: '/' },
      { label: 'Buyer Protection', to: '/' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-line bg-mist mt-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-white">
                <Bot size={18} />
              </span>
              <span className="font-display text-lg font-semibold text-ink">ROBOT MARKET</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-slate">
              The world's marketplace for robots — connecting makers and buyers across every continent.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-display text-sm font-semibold text-ink">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-slate hover:text-teal-700 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-xs text-slate sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Robot Market. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/" className="hover:text-teal-700">Privacy Policy</Link>
            <Link to="/" className="hover:text-teal-700">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
