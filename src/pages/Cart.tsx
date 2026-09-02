import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { robots } from '../data/robots'
import { sellers } from '../data/sellers'
import { formatPrice } from '../utils/format'

export default function Cart() {
  const { items, setQuantity, removeItem, totalPrice } = useCart()
  const navigate = useNavigate()

  const lines = items
    .map((item) => ({ item, robot: robots.find((r) => r.id === item.robotId) }))
    .filter((l): l is { item: typeof items[0]; robot: NonNullable<typeof l.robot> } => Boolean(l.robot))

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-24 text-center">
        <ShoppingBag size={40} className="mx-auto text-slate" />
        <h1 className="mt-4 font-display text-2xl font-semibold text-ink">Your cart is empty</h1>
        <p className="mt-2 text-sm text-slate">Browse the marketplace to find your next robot.</p>
        <Link
          to="/robots"
          className="mt-6 inline-block rounded-full bg-teal-600 px-6 py-3 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
        >
          Explore Robots
        </Link>
      </div>
    )
  }

  const shippingEstimate = lines.length > 0 ? 0 : 0

  return (
    <div className="mx-auto max-w-7xl px-5 lg:px-8 py-10">
      <h1 className="font-display text-2xl font-semibold text-ink mb-8">Your cart</h1>
      <div className="grid lg:grid-cols-[1fr_340px] gap-10">
        <div className="space-y-4">
          {lines.map(({ item, robot }) => {
            const seller = sellers.find((s) => s.id === robot.sellerId)
            return (
              <div key={item.robotId} className="flex gap-4 rounded-2xl border border-line p-4">
                <Link to={`/robots/${robot.slug}`} className="h-24 w-28 shrink-0 rounded-xl overflow-hidden bg-mist">
                  <img src={robot.images[0]} alt={robot.name} className="h-full w-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link to={`/robots/${robot.slug}`} className="font-display text-sm font-semibold text-ink hover:text-teal-700">
                        {robot.name}
                      </Link>
                      <p className="text-xs text-slate mt-0.5">Sold by {seller?.name}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.robotId)}
                      aria-label="Remove"
                      className="p-1.5 text-slate hover:text-coral transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 rounded-full border border-line px-1">
                      <button
                        onClick={() => setQuantity(item.robotId, item.quantity - 1)}
                        className="h-7 w-7 rounded-full text-ink hover:bg-mist"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => setQuantity(item.robotId, item.quantity + 1)}
                        className="h-7 w-7 rounded-full text-ink hover:bg-mist"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-display text-sm font-semibold text-ink">
                      {formatPrice(robot.price * item.quantity, robot.currency)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="rounded-2xl border border-line p-6 h-fit sticky top-24">
          <h2 className="font-display text-base font-semibold text-ink mb-4">Order summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate">
              <span>Subtotal</span>
              <span className="text-ink font-medium">{formatPrice(totalPrice, 'USD')}</span>
            </div>
            <div className="flex justify-between text-slate">
              <span>Shipping</span>
              <span className="text-ink font-medium">{shippingEstimate === 0 ? 'Calculated at checkout' : formatPrice(shippingEstimate, 'USD')}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-line flex justify-between font-display text-base font-semibold text-ink">
            <span>Total</span>
            <span>{formatPrice(totalPrice, 'USD')}</span>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="mt-6 w-full rounded-full bg-ink px-6 py-3 text-sm font-medium text-white hover:bg-teal-950 transition-colors"
          >
            Proceed to Checkout
          </button>
          <p className="mt-3 text-xs text-slate text-center">
            Payments and shipping are simulated in this prototype.
          </p>
        </div>
      </div>
    </div>
  )
}
