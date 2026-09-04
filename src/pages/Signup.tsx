import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { isSupabaseConfigured } from '../lib/supabase'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error: signUpError } = await signUp(email, password, fullName)
    setLoading(false)
    if (signUpError) {
      setError(signUpError)
      return
    }
    setDone(true)
  }

  if (done) {
    return (
      <div className="mx-auto max-w-sm px-5 py-20 text-center">
        <CheckCircle2 size={32} className="mx-auto text-teal-600" />
        <h1 className="mt-4 font-display text-xl font-semibold text-ink">Check your email</h1>
        <p className="mt-2 text-sm text-slate">We sent a confirmation link to {email}. Confirm it, then log in to continue.</p>
        <button
          onClick={() => navigate('/login')}
          className="mt-6 rounded-full bg-teal-600 px-6 py-3 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
        >
          Go to login
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-16">
      <h1 className="font-display text-2xl font-semibold text-ink text-center">Create your account</h1>
      <p className="text-sm text-slate text-center mt-1">Buy or sell robots on ROBOT MARKET.</p>

      {!isSupabaseConfigured && (
        <p className="mt-6 text-xs text-slate rounded-xl bg-mist p-3 flex items-start gap-2">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          Supabase isn't connected yet, so accounts can't be created for real. Add your Supabase credentials to enable signup.
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="block text-sm font-medium text-ink mb-1.5">Full name</span>
          <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" placeholder="Amadou Diallo" />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-ink mb-1.5">Email</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="you@example.com" />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-ink mb-1.5">Password</span>
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="At least 6 characters" />
        </label>
        {error && (
          <p className="text-xs text-coral rounded-xl bg-coral/10 p-3 flex items-start gap-2">
            <AlertCircle size={14} className="mt-0.5 shrink-0" /> {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-ink px-6 py-3 text-sm font-medium text-white hover:bg-teal-950 transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate text-center">
        Already have an account? <Link to="/login" className="font-medium text-teal-700 hover:text-teal-900">Log in</Link>
      </p>
    </div>
  )
}
