import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, User, Store, ShieldCheck, PartyPopper, AlertCircle } from 'lucide-react'
import type { SellerApplication } from '../types'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const steps = [
  { id: 1, label: 'Account', icon: User },
  { id: 2, label: 'Seller info', icon: ShieldCheck },
  { id: 3, label: 'Store', icon: Store },
  { id: 4, label: 'Done', icon: PartyPopper },
]

const emptyForm: SellerApplication = {
  fullName: '',
  businessName: '',
  country: '',
  email: '',
  phone: '',
  sellerType: 'individual',
  storeName: '',
  storeDescription: '',
}

export default function SellerSignup() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<SellerApplication>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = (patch: Partial<SellerApplication>) => setForm((f) => ({ ...f, ...patch }))

  const next = () => setStep((s) => Math.min(s + 1, 4))
  const back = () => setStep((s) => Math.max(s - 1, 1))

  const canContinueFromStep1 = form.fullName.trim() && form.email.trim()
  const canContinueFromStep2 = form.country.trim() && form.phone.trim()
  const canContinueFromStep3 = form.storeName.trim()

  const createStore = async () => {
    if (!isSupabaseConfigured) {
      // No Supabase project connected yet — fall back to local-only demo flow.
      next()
      return
    }
    setSubmitting(true)
    setError(null)
    const { error: insertError } = await supabase.from('sellers').insert({
      full_name: form.fullName,
      business_name: form.businessName || null,
      country: form.country,
      email: form.email,
      phone: form.phone,
      seller_type: form.sellerType,
      store_name: form.storeName,
      store_description: form.storeDescription || null,
    })
    setSubmitting(false)
    if (insertError) {
      setError(insertError.message)
      return
    }
    next()
  }

  return (
    <div className="mx-auto max-w-3xl px-5 lg:px-8 py-12">
      <h1 className="font-display text-2xl font-semibold text-ink text-center">Sell a Robot</h1>
      <p className="text-sm text-slate text-center mt-1">Create your seller account and open your store.</p>

      {/* Stepper */}
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
            {i < steps.length - 1 && (
              <div className={`h-0.5 w-10 sm:w-16 ${step > s.id ? 'bg-teal-600' : 'bg-line'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-line p-6 sm:p-8">
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="font-display text-lg font-semibold text-ink">Create your account</h2>
            <Field label="Full name">
              <input
                value={form.fullName}
                onChange={(e) => update({ fullName: e.target.value })}
                className="input"
                placeholder="Amadou Diallo"
              />
            </Field>
            <Field label="Email address">
              <input
                type="email"
                value={form.email}
                onChange={(e) => update({ email: e.target.value })}
                className="input"
                placeholder="you@example.com"
              />
            </Field>
            <Field label="I'm selling as">
              <div className="grid grid-cols-2 gap-2">
                {(['individual', 'manufacturer', 'distributor', 'business'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => update({ sellerType: type })}
                    className={`rounded-xl border px-4 py-2.5 text-sm capitalize transition-colors ${
                      form.sellerType === type ? 'border-teal-600 bg-mist text-teal-900 font-medium' : 'border-line text-slate'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="font-display text-lg font-semibold text-ink">Seller information</h2>
            <Field label="Business name (optional)">
              <input
                value={form.businessName}
                onChange={(e) => update({ businessName: e.target.value })}
                className="input"
                placeholder="Dakar Automation SARL"
              />
            </Field>
            <Field label="Country">
              <input
                value={form.country}
                onChange={(e) => update({ country: e.target.value })}
                className="input"
                placeholder="Senegal"
              />
            </Field>
            <Field label="Phone number">
              <input
                value={form.phone}
                onChange={(e) => update({ phone: e.target.value })}
                className="input"
                placeholder="+221 XX XXX XX XX"
              />
            </Field>
            <p className="text-xs text-slate rounded-xl bg-mist p-3">
              In a production version, identity and business documents would be verified here before your store goes live.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="font-display text-lg font-semibold text-ink">Create your store</h2>
            <Field label="Store name">
              <input
                value={form.storeName}
                onChange={(e) => update({ storeName: e.target.value })}
                className="input"
                placeholder="RoboTech Store"
              />
            </Field>
            <Field label="Store description">
              <textarea
                value={form.storeDescription}
                onChange={(e) => update({ storeDescription: e.target.value })}
                className="input min-h-24 resize-none"
                placeholder="Tell buyers what makes your robots stand out."
              />
            </Field>
            {!isSupabaseConfigured && (
              <p className="text-xs text-slate rounded-xl bg-mist p-3 flex items-start gap-2">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                No Supabase project connected yet — this submission will run in local demo mode and won't be saved. Add your credentials to .env to persist real signups.
              </p>
            )}
            {error && (
              <p className="text-xs text-coral rounded-xl bg-coral/10 p-3 flex items-start gap-2">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                Couldn't create your store: {error}
              </p>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-600">
              <PartyPopper size={26} />
            </div>
            <h2 className="mt-4 font-display text-xl font-semibold text-ink">
              {form.storeName || 'Your store'} is ready
            </h2>
            <p className="mt-2 text-sm text-slate max-w-sm mx-auto">
              Your seller account has been created. Next, add your first robot listing to start selling.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/dashboard" className="rounded-full bg-teal-600 px-6 py-3 text-sm font-medium text-white hover:bg-teal-700 transition-colors">
                Go to Dashboard
              </Link>
              <Link to="/robots" className="rounded-full border border-line px-6 py-3 text-sm font-medium text-ink hover:bg-mist transition-colors">
                Browse Marketplace
              </Link>
            </div>
          </div>
        )}

        {step < 4 && (
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={back}
              disabled={step === 1}
              className="text-sm font-medium text-slate disabled:opacity-0"
            >
              Back
            </button>
            <button
              onClick={step === 3 ? createStore : next}
              disabled={
                submitting ||
                (step === 1 && !canContinueFromStep1) ||
                (step === 2 && !canContinueFromStep2) ||
                (step === 3 && !canContinueFromStep3)
              }
              className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-950 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {step === 3 ? (submitting ? 'Creating store...' : 'Create store') : 'Continue'}
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
