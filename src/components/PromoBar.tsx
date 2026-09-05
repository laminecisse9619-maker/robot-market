import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const messages: Record<string, { text: string; cta: string }> = {
  en: { text: 'Launch offer — free express shipping on your first order', cta: 'Shop now' },
  fr: { text: "Offre de lancement — livraison express offerte sur votre première commande", cta: 'En profiter' },
  es: { text: 'Oferta de lanzamiento: envío exprés gratis en tu primer pedido', cta: 'Comprar ahora' },
  de: { text: 'Startangebot — kostenloser Expressversand für deine erste Bestellung', cta: 'Jetzt einkaufen' },
  ar: { text: 'عرض الإطلاق — شحن سريع مجاني لطلبك الأول', cta: 'تسوق الآن' },
  zh: { text: '开业特惠 — 首单免费快递', cta: '立即选购' },
}

export default function PromoBar() {
  const [dismissed, setDismissed] = useState(false)
  const { language } = useLanguage()
  const msg = messages[language] ?? messages.en

  if (dismissed) return null

  return (
    <div className="bg-coral text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8 h-9 flex items-center justify-center gap-3 text-xs sm:text-sm relative">
        <span className="truncate font-medium">{msg.text}</span>
        <Link to="/robots?deals=1" className="shrink-0 underline underline-offset-2 font-semibold hover:no-underline">
          {msg.cta}
        </Link>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="absolute right-3 sm:right-5 lg:right-8 shrink-0 p-0.5 text-white/80 hover:text-white"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
