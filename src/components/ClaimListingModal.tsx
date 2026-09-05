import { useState } from 'react'
import { X, CheckCircle2, Loader2 } from 'lucide-react'
import { submitClaimRequest } from '../lib/api'
import type { Robot, Seller } from '../types'

interface Props {
  robot: Robot
  seller: Seller
  onClose: () => void
}

export default function ClaimListingModal({ robot, seller, onClose }: Props) {
  const [fullName, setFullName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [professionalEmail, setProfessionalEmail] = useState('')
  const [proof, setProof] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')
    try {
      await submitClaimRequest({
        robotId: robot.id,
        sellerId: seller.id,
        fullName,
        jobTitle,
        professionalEmail,
        proof,
      })
      setStatus('success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Une erreur est survenue.")
      setStatus('error')
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-ink/40 p-0 sm:p-4" onClick={onClose}>
      <div
        className="w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Revendiquer cette fiche</h2>
            <p className="text-sm text-slate mt-0.5">{seller.name} — {robot.name}</p>
          </div>
          <button onClick={onClose} aria-label="Fermer" className="text-slate hover:text-ink">
            <X size={20} />
          </button>
        </div>

        {status === 'success' ? (
          <div className="mt-6 flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 size={40} className="text-teal-600" />
            <p className="font-medium text-ink">Votre demande de revendication a été transmise.</p>
            <p className="text-sm text-slate">
              Notre équipe vérifie votre appartenance à {seller.name} puis vous recontacte pour finaliser le transfert de propriété de la fiche.
            </p>
            <button
              onClick={onClose}
              className="mt-2 rounded-full bg-teal-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3.5">
            <p className="text-xs text-slate leading-relaxed">
              Cette fiche présente un produit de <strong>{seller.name}</strong> à titre informatif. Si vous
              travaillez pour ce fabricant (ou son distributeur officiel), revendiquez la fiche pour la modifier,
              y ajouter vos vraies photos et recevoir directement les demandes de devis.
            </p>
            <div>
              <label className="text-xs font-medium text-slate">Nom complet *</label>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate">Fonction *</label>
              <input
                required
                placeholder="ex. Responsable Export, Directeur Commercial…"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate">E-mail professionnel *</label>
              <input
                required
                type="email"
                placeholder={`ex. prenom.nom@${seller.website?.replace(/^https?:\/\//, '') ?? 'domaine-du-fabricant.com'}`}
                value={professionalEmail}
                onChange={(e) => setProfessionalEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <p className="mt-1 text-[11px] text-slate">
                Idéalement une adresse au domaine officiel du fabricant — cela accélère fortement la validation.
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-slate">Preuve d'appartenance *</label>
              <textarea
                required
                rows={3}
                placeholder="Lien LinkedIn, page équipe du site officiel, ou tout justificatif permettant de confirmer votre rôle."
                value={proof}
                onChange={(e) => setProof(e.target.value)}
                className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {status === 'error' && <p className="text-sm text-coral">{errorMsg}</p>}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="mt-1 flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white hover:bg-ink/90 disabled:opacity-60 transition-colors"
            >
              {status === 'submitting' && <Loader2 size={15} className="animate-spin" />}
              Soumettre la revendication
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
