import { useState } from 'react'
import { X, CheckCircle2, Loader2 } from 'lucide-react'
import { submitQuoteRequest } from '../lib/api'
import type { Robot } from '../types'

interface Props {
  robot: Robot
  onClose: () => void
}

export default function QuoteRequestModal({ robot, onClose }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState(`Bonjour, je souhaiterais recevoir un devis pour ${robot.name}.`)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [requestRef, setRequestRef] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')
    try {
      const result = await submitQuoteRequest({
        robotId: robot.id,
        buyerName: name,
        buyerEmail: email,
        buyerCompany: company,
        buyerPhone: phone,
        message,
        quantity,
      })
      setRequestRef(result.requestRef)
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
            <h2 className="font-display text-lg font-semibold text-ink">Demander un devis</h2>
            <p className="text-sm text-slate mt-0.5">{robot.name}</p>
          </div>
          <button onClick={onClose} aria-label="Fermer" className="text-slate hover:text-ink">
            <X size={20} />
          </button>
        </div>

        {status === 'success' ? (
          <div className="mt-6 flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 size={40} className="text-teal-600" />
            <p className="font-medium text-ink">Votre demande a bien été envoyée.</p>
            <p className="text-sm text-slate">
              Référence : <span className="font-mono font-medium text-ink">{requestRef}</span>
              <br />
              Notre équipe revient vers vous rapidement à l'adresse indiquée.
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
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-medium text-slate">Nom complet *</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate">E-mail professionnel *</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate">Entreprise</label>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate">Téléphone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate">Quantité souhaitée</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                className="mt-1 w-28 rounded-lg border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate">Message *</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {status === 'error' && <p className="text-sm text-coral">{errorMsg}</p>}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="mt-1 flex items-center justify-center gap-2 rounded-full bg-teal-600 px-6 py-3 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60 transition-colors"
            >
              {status === 'submitting' && <Loader2 size={15} className="animate-spin" />}
              Envoyer la demande de devis
            </button>
            <p className="text-[11px] text-slate text-center">
              Un e-mail récapitulatif est envoyé à notre équipe avec vos coordonnées et un identifiant de suivi unique.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
