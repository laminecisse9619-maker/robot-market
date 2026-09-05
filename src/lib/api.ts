import type { QuoteRequestPayload, ClaimRequestPayload } from '../types'

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.error || `Erreur ${res.status}`)
  }
  return data as T
}

export function submitQuoteRequest(payload: QuoteRequestPayload) {
  return postJson<{ success: true; requestRef: string }>('/api/send-quote', payload)
}

export function submitClaimRequest(payload: ClaimRequestPayload) {
  return postJson<{ success: true }>('/api/send-claim', payload)
}
