import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, MapPin, Truck, CreditCard, PartyPopper } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { formatPrice } from '../utils/format'

const steps = [
  { id: 1, label: 'Shipping', icon: MapPin },
  { id: 2, label: 'Delivery', icon: Truck },
  { id: 3, label: 'Payment', icon: CreditCard },
  { id: 4, label: 'Done', icon: PartyPopper },
]

interface ShippingForm {
  fullName: string
  address: string
  city: string
  country: string
  phone: string
}

const emptyShipping: ShippingForm = { fullName: '', address: '', city: '', country: '', phone: '' }

const deliveryOptions = [
  { id: 'standard', label: 'Standard shipping', eta: '10–20 business days', price: 0 },
  { id: 'express', label: 'Express shipping', eta: '3–5 business days', price: 89 },
]

export default function Checkout() {
  const { items, totalPrice, clear } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [shipping, setShipping] = useState<ShippingForm>(emptyShipping)
  const [delivery, setDelivery] = useState('standard')
  const [placing, setPlacing] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  if (items.length === 0 && step < 4) {
    navigate('/cart')
    return null
  }

  const update = (patch: Partial<ShippingForm>) => setShipping((s) => ({ ...s, ...patch }))
  const canContinueShipping = shipping.fullName.trim() && shipping.address.trim() && shipping.city.trim() && shipping.country.trim() && shipping.phone.trim()

  const deliveryFee = deliveryOptions.find((d) => d.id === delivery)?.price ?? 0
  const total = totalPrice + deliveryFee

  const placeOrder = () => {
    setPlacing(true)
    // Payments are simulated in this prototype — no real API keys or charges involved.
    setTimeout(() => {
      setOrderNumber(`ORD-${Math.floor(1000 + Math.random() * 9000)}`)
      setPlacing(false)
      setStep(4)
      clear()
    }, 1200)
  }

  return (
    <div className="mx-auto max-w-3xl px-5 lg:px-8 py-12">
      <h1 className="font-display text-2xl font-semibold text-ink text-center">Checkout</h1>

      <div className="mt-8 flex items-center justify-center gap-2">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                step >= s.id ? 'border-teal-600 bg-teal-600 text-white' : 'border-line text-slate'
              }`}
            >
              {step > s.id ? <CheckCircle2 size={16} /> : <s.icon size={15} />}
            </div>
            {i < steps.length - 1 && <div className={`h-0.5 w-10 sm:w-16 ${step > s.id ? 'bg-teal-600' : 'bg-line'}`} />}
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-line p-6 sm:p-8">
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="font-display text-lg font-semibold text-ink">Shipping address</h2>
            <Field label="Full name">
              <input value={shipping.fullName} onChange={(e) => update({ fullName: e.target.value })} className="input" placeholder="Amadou Diallo" />
            </Field>
            <Field label="Address">
              <input value={shipping.address} onChange={(e) => update({ address: e.target.value })} className="input" placeholder="Street address" />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="City">
                <input value={shipping.city} onChange={(e) => update({ city: e.target.value })} className="input" placeholder="Dakar" />
              </Field>
              <Field label="Country">
                <input value={shipping.country} onChange={(e) => update({ country: e.target.value })} className="input" placeholder="Senegal" />
              </Field>
            </div>
            <Field label="Phone number">
              <input value={shipping.phone} onChange={(e) => update({ phone: e.target.value })} className="input" placeholder="+221 XX XXX XX XX" />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-display text-lg font-semibold text-ink">Delivery method</h2>
            {deliveryOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setDelivery(opt.id)}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-colors ${
                  delivery === opt.id ? 'border-teal-600 bg-mist' : 'border-line'
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-ink">{opt.label}</p>
                  <p className="text-xs text-slate">{opt.eta}</p>
                </div>
                <span className="text-sm font-semibold text-ink">{opt.price === 0 ? 'Free' : formatPrice(opt.price, 'USD')}</span>
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="font-display text-lg font-semibold text-ink">Payment</h2>
            <Field label="Card number">
              <input className="input" placeholder="4242 4242 4242 4242" inputMode="numeric" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Expiry">
                <input className="input" placeholder="MM/YY" />
              </Field>
              <Field label="CVC">
                <input className="input" placeholder="123" inputMode="numeric" />
              </Field>
            </div>
            <p className="text-xs text-slate rounded-xl bg-mist p-3">
              This is a simulated payment form — no real card is charged and no payment provider is connected yet.
              A production version would integrate Stripe, PayPal, or a local mobile-money provider here.
            </p>

            <div className="pt-2 border-t border-line space-y-1.5">
              <Row label="Subtotal" value={formatPrice(totalPrice, 'USD')} />
              <Row label="Delivery" value={deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee, 'USD')} />
              <Row label="Total" value={formatPrice(total, 'USD')} bold />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-600">
              <PartyPopper size={26} />
            </div>
            <h2 className="mt-4 font-display text-xl font-semibold text-ink">Order confirmed</h2>
            <p className="mt-2 text-sm text-slate">Order number: <span className="font-medium text-ink">{orderNumber}</span></p>
            <p className="mt-1 text-sm text-slate max-w-sm mx-auto">
              A confirmation would normally be emailed to you. Track your order from your account once order history is connected.
            </p>
            <button
              onClick={() => navigate('/robots')}
              className="mt-6 rounded-full bg-teal-600 px-6 py-3 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
            >
              Continue shopping
            </button>
          </div>
        )}

        {step < 4 && (
          <div className="mt-8 flex items-center justify-between">
            <button onClick={() => setStep((s) => Math.max(s - 1, 1))} disabled={step === 1} className="text-sm font-medium text-slate disabled:opacity-0">
              Back
            </button>
            <button
              onClick={() => (step === 3 ? placeOrder() : setStep((s) => s + 1))}
              disabled={placing || (step === 1 && !canContinueShipping)}
              className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-950 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {step === 3 ? (placing ? 'Placing order...' : 'Place order') : 'Continue'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>
      {children}
    </label>
  )
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between text-sm ${bold ? 'font-display font-semibold text-ink' : 'text-slate'}`}>
      <span>{label}</span>
      <span className={bold ? 'text-ink' : 'text-ink font-medium'}>{value}</span>
    </div>
  )
}
