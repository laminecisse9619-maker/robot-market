import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { isSupabaseConfigured } from '../lib/supabase'

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  // If Supabase isn't connected, there's no real auth to enforce yet —
  // let the page through so the demo flow still works.
  if (!isSupabaseConfigured) return <>{children}</>

  if (loading) {
    return <div className="mx-auto max-w-7xl px-5 py-24 text-center text-sm text-slate">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}
