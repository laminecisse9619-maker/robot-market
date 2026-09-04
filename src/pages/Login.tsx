import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { isSupabaseConfigured } from '../lib/supabase'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error: signInError } = await signIn(email, password)
    setLoading(false)
    if (signInError) {
      setError(signInError)
      return
    }
    navigate(redirectTo)
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-16">
      <h1 className="font-display text-2xl font-semibold text-ink text-center">Log in</h1>
      <p className="text-sm text-slate text-center mt-1">Welcome back to ROBOT MARKET.</p>

      {!isSupabaseConfigured && (
        <p className="mt-6 text-xs text-slate rounded-xl bg-mist p-3 flex items-start gap-2">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          Supabase isn't connected yet, so accounts can't be created or verified. Add your Supabase credentials to enable login.
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="block text-sm font-medium text-ink mb-1.5">Email</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="you@example.com" />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-ink mb-1.5">Password</span>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="••••••••" />
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
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate text-center">
        Don't have an account? <Link to="/signup" className="font-medium text-teal-700 hover:text-teal-900">Sign up</Link>
      </p>
    </div>
  )
}
