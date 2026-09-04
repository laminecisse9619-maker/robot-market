import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard, Package, ShoppingBag, MessageCircle, Star, Wallet, Store,
  TrendingUp, Plus, MoreVertical, Loader2,
} from 'lucide-react'
import { robots } from '../data/robots'
import { sellers } from '../data/sellers'
import { formatPrice } from '../utils/format'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { SellerRecord } from '../types'

const menu = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'messages', label: 'Messages', icon: MessageCircle },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'payments', label: 'Payments', icon: Wallet },
  { id: 'store', label: 'Store Settings', icon: Store },
]

const mockOrders = [
  { id: 'ORD-1042', robot: 'CleanBot Pro', buyer: 'M. Kowalski', total: 890, status: 'Shipped' },
  { id: 'ORD-1041', robot: 'CleanBot Pro', buyer: 'A. Ndiaye', total: 1780, status: 'Processing' },
  { id: 'ORD-1039', robot: 'PoolPal Cleaner', buyer: 'J. Smith', total: 640, status: 'Delivered' },
  { id: 'ORD-1035', robot: 'SwiftCourier Delivery Bot', buyer: 'L. Chen', total: 5400, status: 'Pending' },
]

const statusColor: Record<string, string> = {
  Shipped: 'bg-teal-50 text-teal-700',
  Processing: 'bg-mist text-slate',
  Delivered: 'bg-teal-100 text-teal-800',
  Pending: 'bg-coral/10 text-coral',
}

export default function SellerDashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState('overview')
  const [liveSeller, setLiveSeller] = useState<SellerRecord | null>(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured || !user) {
      setLoading(false)
      return
    }
    let cancelled = false
    ;(async () => {
      const { data } = await supabase
        .from('sellers')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()
      if (!cancelled) {
        setLiveSeller(data)
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user])

  const mockSeller = sellers[0]
  const displayName = liveSeller?.store_name ?? mockSeller.name
  const initial = displayName.charAt(0).toUpperCase()
  // Real stores start empty until a products table exists; the mock seller keeps sample listings for demo purposes.
  const myListings = liveSeller ? [] : robots.filter((r) => r.sellerId === mockSeller.id)
  const hasNoStoreYet = isSupabaseConfigured && user && !loading && !liveSeller

  return (
    <div className="mx-auto max-w-7xl px-5 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mist font-display font-semibold text-teal-800">
          {initial}
        </span>
        <div>
          <h1 className="font-display text-lg font-semibold text-ink">{displayName} · Seller Dashboard</h1>
          <p className="text-xs text-slate flex items-center gap-1.5">
            {loading && <Loader2 size={12} className="animate-spin" />}
            {liveSeller
              ? 'Live store data loaded from Supabase.'
              : hasNoStoreYet
                ? "You don't have a store yet — showing sample data."
                : isSupabaseConfigured
                  ? 'Showing sample data.'
                  : 'Supabase not connected — showing sample data.'}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-8">
        <nav className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar">
          {menu.map((m) => (
            <button
              key={m.id}
              onClick={() => setTab(m.id)}
              className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                tab === m.id ? 'bg-ink text-white' : 'text-slate hover:bg-mist'
              }`}
            >
              <m.icon size={15} /> {m.label}
            </button>
          ))}
        </nav>

        <div>
          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total sales" value={String(liveSeller ? 0 : mockSeller.salesCount)} icon={ShoppingBag} />
                <StatCard label="Revenue (30d)" value={formatPrice(18420, 'USD')} icon={Wallet} trend="+12.4%" />
                <StatCard label="Active products" value={String(myListings.length)} icon={Package} />
                <StatCard label="Visitors (30d)" value="3,204" icon={TrendingUp} trend="+6.1%" />
              </div>

              <div className="rounded-2xl border border-line p-5">
                <h2 className="font-display text-sm font-semibold text-ink mb-4">Recent orders</h2>
                <OrdersTable rows={mockOrders.slice(0, 3)} />
              </div>
            </div>
          )}

          {tab === 'products' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-lg font-semibold text-ink">Products</h2>
                <Link
                  to="/sell"
                  className="flex items-center gap-1.5 rounded-full bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
                >
                  <Plus size={14} /> Add robot
                </Link>
              </div>
              <div className="rounded-2xl border border-line overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-mist/60 text-left text-xs text-slate">
                      <th className="p-3 font-medium">Robot</th>
                      <th className="p-3 font-medium">Price</th>
                      <th className="p-3 font-medium">Stock</th>
                      <th className="p-3 font-medium">Rating</th>
                      <th className="p-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {myListings.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-sm text-slate">
                          No products yet — add your first robot to start selling.
                        </td>
                      </tr>
                    )}
                    {myListings.map((r) => (
                      <tr key={r.id} className="border-t border-line">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img src={r.images[0]} alt="" className="h-10 w-10 rounded-lg object-cover" />
                            <Link to={`/robots/${r.slug}`} className="font-medium text-ink hover:text-teal-700 line-clamp-1">{r.name}</Link>
                          </div>
                        </td>
                        <td className="p-3 text-ink">{formatPrice(r.price, r.currency)}</td>
                        <td className="p-3 text-ink">{r.stock}</td>
                        <td className="p-3 text-ink">{r.rating} ({r.reviewCount})</td>
                        <td className="p-3 text-right"><MoreVertical size={15} className="text-slate inline" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'orders' && (
            <div>
              <h2 className="font-display text-lg font-semibold text-ink mb-5">Orders</h2>
              <div className="rounded-2xl border border-line p-5">
                <OrdersTable rows={mockOrders} />
              </div>
            </div>
          )}

          {tab === 'messages' && (
            <div className="rounded-2xl border border-line p-8 text-center">
              <MessageCircle size={28} className="mx-auto text-slate" />
              <p className="mt-3 text-sm text-slate">View and reply to buyer messages.</p>
              <Link to="/messages" className="mt-4 inline-block rounded-full bg-teal-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-700">
                Open Messages
              </Link>
            </div>
          )}

          {tab === 'reviews' && (
            <div className="rounded-2xl border border-line p-8 text-center">
              <Star size={28} className="mx-auto text-slate" />
              <p className="mt-3 text-sm text-slate">
                {liveSeller ? 'No reviews yet.' : `${mockSeller.reviewCount} reviews · ${mockSeller.rating} average rating`}
              </p>
            </div>
          )}

          {tab === 'payments' && (
            <div className="rounded-2xl border border-line p-8 text-center">
              <Wallet size={28} className="mx-auto text-slate" />
              <p className="mt-3 text-sm text-slate">Payout integration (Stripe Connect) not yet configured in this prototype.</p>
            </div>
          )}

          {tab === 'store' && (
            <StoreSettings liveSeller={liveSeller} mockSeller={mockSeller} />
          )}
        </div>
      </div>
    </div>
  )
}

function StoreSettings({ liveSeller, mockSeller }: { liveSeller: SellerRecord | null; mockSeller: (typeof sellers)[number] }) {
  const [name, setName] = useState(liveSeller?.store_name ?? mockSeller.name)
  const [description, setDescription] = useState(liveSeller?.store_description ?? mockSeller.description)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const save = async () => {
    if (!liveSeller) {
      // Demo mode: nothing to persist without a connected Supabase store.
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      return
    }
    setSaving(true)
    await supabase
      .from('sellers')
      .update({ store_name: name, store_description: description })
      .eq('id', liveSeller.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="rounded-2xl border border-line p-6 space-y-4 max-w-md">
      <h2 className="font-display text-sm font-semibold text-ink">Store settings</h2>
      <label className="block">
        <span className="block text-sm font-medium text-ink mb-1.5">Store name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
      </label>
      <label className="block">
        <span className="block text-sm font-medium text-ink mb-1.5">Description</span>
        <textarea value={description ?? ''} onChange={(e) => setDescription(e.target.value)} className="input min-h-24 resize-none" />
      </label>
      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-950 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>
        {saved && <span className="text-xs text-teal-600 font-medium">Saved ✓</span>}
      </div>
      {!liveSeller && (
        <p className="text-xs text-slate">Connect Supabase to persist changes for real.</p>
      )}
    </div>
  )
}

function StatCard({ label, value, icon: Icon, trend }: { label: string; value: string; icon: React.ComponentType<{ size?: number }>; trend?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mist text-teal-700">
          <Icon size={16} />
        </span>
        {trend && <span className="text-xs font-medium text-teal-600">{trend}</span>}
      </div>
      <p className="mt-3 font-display text-xl font-semibold text-ink">{value}</p>
      <p className="text-xs text-slate">{label}</p>
    </div>
  )
}

function OrdersTable({ rows }: { rows: typeof mockOrders }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-xs text-slate">
          <th className="pb-2 font-medium">Order</th>
          <th className="pb-2 font-medium">Robot</th>
          <th className="pb-2 font-medium">Buyer</th>
          <th className="pb-2 font-medium">Total</th>
          <th className="pb-2 font-medium">Status</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((o) => (
          <tr key={o.id} className="border-t border-line">
            <td className="py-2.5 text-ink font-medium">{o.id}</td>
            <td className="py-2.5 text-ink">{o.robot}</td>
            <td className="py-2.5 text-slate">{o.buyer}</td>
            <td className="py-2.5 text-ink">{formatPrice(o.total, 'USD')}</td>
            <td className="py-2.5">
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor[o.status]}`}>{o.status}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
