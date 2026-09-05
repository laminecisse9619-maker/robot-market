// Envoi d'e-mails via l'API HTTP de Resend (https://resend.com) — pas de SDK
// supplémentaire nécessaire, un simple fetch suffit et reste léger côté
// Vercel Functions. Variables d'environnement attendues (à définir sur Vercel,
// jamais dans le code ni dans un .env commité) :
//   RESEND_API_KEY       — clé API Resend (Dashboard > API Keys)
//   QUOTES_FROM_EMAIL     — expéditeur, doit être sur un domaine vérifié Resend
//                           ex. "ROBOT MARKET <devis@obovia.com>"
//   ADMIN_EMAIL           — adresse qui reçoit toutes les demandes de devis/revendication

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.QUOTES_FROM_EMAIL || 'ROBOT MARKET <onboarding@resend.dev>'

interface SendEmailInput {
  to: string[]
  subject: string
  html: string
  replyTo?: string
}

export async function sendEmail({ to, subject, html, replyTo }: SendEmailInput) {
  if (!RESEND_API_KEY) {
    throw new Error(
      "RESEND_API_KEY manquant : ajoutez cette variable dans Vercel > Project Settings > Environment Variables pour activer l'envoi d'e-mails."
    )
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      reply_to: replyTo,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Échec de l'envoi via Resend (${response.status}) : ${text}`)
  }

  return response.json()
}
