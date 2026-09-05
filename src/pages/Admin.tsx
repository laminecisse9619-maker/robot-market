import { useEffect, useState } from 'react'
import { FileText, Building2, Mail } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

interface QuoteRequestRow {
  id: string
  request_ref: string
  robot_name: string
  seller_name: string | null
  buyer_name: string
  buyer_email: string
  buyer_company: string | null
  quantity: number
  status: string
  created_at: string
}

interface ClaimRequestRow {
  id: string
  robot_name: string
  seller_name: string
  full_name: string
  job_title: string
  professional_email: string
  proof: string
  status: string
  created_at: string
}

// Espace admin léger : lit les tables `quote_requests` et `claim_requests`.
// La lecture n'est possible que si l'utilisateur connecté correspond à
// l'e-mail admin défini dans les policies RLS de supabase/schema.sql — sinon
// Supabase renvoie simplement une liste vide (comportement normal de RLS).
export default function Admin() {
  const [quotes, setQuotes] = useState<QuoteRequestRow[]>([])
  const [claims, setClaims] = useState<ClaimRequestRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    const load = async () => {
      const [{ data: quoteData, error: quoteError }, { data: claimData, error: claimError }] = await Promise.all([
        supabase.from('quote_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('claim_requests').select('*').order('created_at', { ascending: false }),
      ])
      if (quoteError) setError(quoteError.message)
      if (claimError) setError((prev) => prev || claimError.message)
      setQuotes((quoteData as QuoteRequestRow[]) ?? [])
      setClaims((claimData as ClaimRequestRow[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 text-center">
        <p className="text-sm text-slate">
          Connectez Supabase (voir README) pour activer l'espace admin et consulter les demandes de devis et de
          revendication.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-5 lg:px-8 py-10">
      <h1 className="font-display text-2xl font-semibold text-ink">Espace admin</h1>
      <p className="mt-1 text-sm text-slate">
        Connecté(e) avec un compte non-admin ? Les listes ci-dessous resteront vides — ajustez la policy RLS dans{' '}
        <code className="rounded bg-mist px-1 py-0.5">supabase/schema.sql</code> avec votre e-mail.
      </p>
      {error && <p className="mt-3 text-sm text-coral">{error}</p>}
      {loading && <p className="mt-6 text-sm text-slate">Chargement…</p>}

      {!loading && (
        <>
          <section className="mt-8">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
              <FileText size={18} className="text-teal-600" /> Demandes de devis ({quotes.length})
            </h2>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-line">
              <table className="w-full text-left text-sm">
                <thead className="bg-mist text-xs uppercase tracking-wide text-slate">
                  <tr>
                    <th className="px-4 py-3">Réf.</th>
                    <th className="px-4 py-3">Robot</th>
                    <th className="px-4 py-3">Vendeur</th>
                    <th className="px-4 py-3">Acheteur</th>
                    <th className="px-4 py-3">Entreprise</th>
                    <th className="px-4 py-3">Qté</th>
                    <th className="px-4 py-3">Statut</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((q) => (
                    <tr key={q.id} className="border-t border-line">
                      <td className="px-4 py-3 font-mono text-xs">{q.request_ref}</td>
                      <td className="px-4 py-3">{q.robot_name}</td>
                      <td className="px-4 py-3">{q.seller_name ?? '—'}</td>
                      <td className="px-4 py-3">
                        <a href={`mailto:${q.buyer_email}`} className="flex items-center gap-1.5 hover:text-teal-700">
                          <Mail size={12} /> {q.buyer_name}
                        </a>
                      </td>
                      <td className="px-4 py-3">{q.buyer_company ?? '—'}</td>
                      <td className="px-4 py-3">{q.quantity}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-mist px-2 py-0.5 text-xs">{q.status}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate">{new Date(q.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {quotes.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-6 text-center text-slate">Aucune demande pour le moment.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-12">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
              <Building2 size={18} className="text-teal-600" /> Revendications de fiche ({claims.length})
            </h2>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-line">
              <table className="w-full text-left text-sm">
                <thead className="bg-mist text-xs uppercase tracking-wide text-slate">
                  <tr>
                    <th className="px-4 py-3">Robot</th>
                    <th className="px-4 py-3">Vendeur revendiqué</th>
                    <th className="px-4 py-3">Demandeur</th>
                    <th className="px-4 py-3">Fonction</th>
                    <th className="px-4 py-3">E-mail pro</th>
                    <th className="px-4 py-3">Preuve</th>
                    <th className="px-4 py-3">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map((c) => (
                    <tr key={c.id} className="border-t border-line align-top">
                      <td className="px-4 py-3">{c.robot_name}</td>
                      <td className="px-4 py-3">{c.seller_name}</td>
                      <td className="px-4 py-3">{c.full_name}</td>
                      <td className="px-4 py-3">{c.job_title}</td>
                      <td className="px-4 py-3">
                        <a href={`mailto:${c.professional_email}`} className="hover:text-teal-700">{c.professional_email}</a>
                      </td>
                      <td className="px-4 py-3 max-w-xs truncate" title={c.proof}>{c.proof}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-mist px-2 py-0.5 text-xs">{c.status}</span>
                      </td>
                    </tr>
                  ))}
                  {claims.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-slate">Aucune revendication pour le moment.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-slate">
              Pour approuver une revendication : validez l'identité du demandeur, passez son statut à{' '}
              <code className="rounded bg-mist px-1 py-0.5">approved</code>, puis mettez à jour la fiche vendeur
              correspondante dans <code className="rounded bg-mist px-1 py-0.5">src/data/sellers.ts</code> (
              <code className="rounded bg-mist px-1 py-0.5">claimed: true</code> +{' '}
              <code className="rounded bg-mist px-1 py-0.5">contactEmail</code>).
            </p>
          </section>
        </>
      )}
    </div>
  )
}
