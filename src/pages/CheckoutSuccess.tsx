import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { PartyPopper, AlertCircle, Loader2 } from 'lucide-react'
import { useCart } from '../contexts/CartContext'

type Status = 'checking' | 'paid' | 'unpaid' | 'error'

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { clear } = useCart()
  const [status, setStatus] = useState<Status>('checking')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!sessionId) {
      setStatus('error')
      setMessage('Missing checkout session.')
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/api/verify-checkout-session?session_id=${encodeURIComponent(sessionId)}`)
        const data = await res.json()
        if (cancelled) return
        if (!res.ok) {
          setStatus('error')
          setMessage(data.error || 'Could not verify payment.')
          return
        }
        if (data.status === 'paid') {
          clear()
          setStatus('paid')
        } else {
          setStatus('unpaid')
        }
      } catch {
        if (!cancelled) {
          setStatus('error')
          setMessage('Could not reach the server to verify payment.')
        }
      }
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  return (
    <div className="mx-auto max-w-lg px-5 lg:px-8 py-24 text-center">
      {status === 'checking' && (
        <>
          <Loader2 size={32} className="mx-auto animate-spin text-slate" />
          <p className="mt-4 text-sm text-slate">Confirming your payment...</p>
        </>
      )}

      {status === 'paid' && (
        <>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-600">
            <PartyPopper size={26} />
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold text-ink">Payment confirmed</h1>
          <p className="mt-2 text-sm text-slate max-w-sm mx-auto">
            Your order has been placed. A confirmation would normally be emailed to you.
          </p>
          <Link to="/robots" className="mt-6 inline-block rounded-full bg-teal-600 px-6 py-3 text-sm font-medium text-white hover:bg-teal-700 transition-colors">
            Continue shopping
          </Link>
        </>
      )}

      {status === 'unpaid' && (
        <>
          <AlertCircle size={32} className="mx-auto text-coral" />
          <h1 className="mt-4 font-display text-xl font-semibold text-ink">Payment not completed</h1>
          <p className="mt-2 text-sm text-slate">Your cart is still saved — you can try again.</p>
          <Link to="/checkout" className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-medium text-white hover:bg-teal-950 transition-colors">
            Back to checkout
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <AlertCircle size={32} className="mx-auto text-coral" />
          <h1 className="mt-4 font-display text-xl font-semibold text-ink">Something went wrong</h1>
          <p className="mt-2 text-sm text-slate">{message}</p>
          <Link to="/cart" className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-medium text-white hover:bg-teal-950 transition-colors">
            Back to cart
          </Link>
        </>
      )}
    </div>
  )
}
