import { randomUUID } from 'crypto'
import { robots } from '../src/data/robots'
import { sellers } from '../src/data/sellers'
import { supabaseAdmin } from './_lib/supabaseAdmin'
import { sendEmail } from './_lib/email'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@obovia.com'

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { robotId, buyerName, buyerEmail, buyerCompany, buyerPhone, message, quantity } = req.body || {}

    if (!robotId || !buyerName || !buyerEmail || !message) {
      res.status(400).json({ error: 'Champs requis manquants (robotId, buyerName, buyerEmail, message).' })
      return
    }

    const robot = robots.find((r) => r.id === robotId)
    if (!robot) {
      res.status(404).json({ error: 'Robot introuvable.' })
      return
    }
    const seller = sellers.find((s) => s.id === robot.sellerId)

    // Identifiant unique et lisible pour le suivi de la demande (ex. DEV-A1B2C3D4).
    const requestRef = `DEV-${randomUUID().split('-')[0].toUpperCase()}`

    // 1. Enregistrement en base pour l'espace admin (si Supabase est configuré).
    //    On continue même en cas d'échec ici : l'e-mail reste le canal principal.
    if (supabaseAdmin) {
      const { error } = await supabaseAdmin.from('quote_requests').insert({
        request_ref: requestRef,
        robot_id: robot.id,
        robot_name: robot.name,
        seller_id: seller?.id ?? null,
        seller_name: seller?.name ?? null,
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        buyer_company: buyerCompany ?? null,
        buyer_phone: buyerPhone ?? null,
        message,
        quantity: quantity ?? 1,
      })
      if (error) console.error('[send-quote] Supabase insert error:', error.message)
    }

    // 2. Destinataires de l'e-mail.
    //    On notifie toujours l'administrateur. On ne notifie le "vendeur" que
    //    si sa fiche a réellement été revendiquée et validée (seller.claimed
    //    === true) avec un e-mail de contact confirmé : on n'envoie jamais de
    //    message à une adresse générique devinée pour un fabricant qui n'a pas
    //    encore rejoint la plateforme.
    const recipients = [ADMIN_EMAIL]
    if (seller?.claimed && seller.contactEmail) {
      recipients.push(seller.contactEmail)
    }

    const html = `
      <div style="font-family: sans-serif; line-height: 1.5; color: #1a1a1a;">
        <h2 style="margin-bottom: 4px;">Nouvelle demande de devis</h2>
        <p style="color:#888; margin-top:0;">Référence : <strong>${requestRef}</strong></p>
        <table cellpadding="6" style="border-collapse: collapse;">
          <tr><td><strong>Robot</strong></td><td>${robot.name} (${robot.brand} ${robot.model})</td></tr>
          <tr><td><strong>Vendeur associé</strong></td><td>${seller?.name ?? 'Non assigné'}${seller && !seller.claimed ? ' — fiche non revendiquée' : ''}</td></tr>
          <tr><td colspan="2"><hr /></td></tr>
          <tr><td><strong>Acheteur</strong></td><td>${buyerName}</td></tr>
          <tr><td><strong>Entreprise</strong></td><td>${buyerCompany || '—'}</td></tr>
          <tr><td><strong>E-mail</strong></td><td>${buyerEmail}</td></tr>
          <tr><td><strong>Téléphone</strong></td><td>${buyerPhone || '—'}</td></tr>
          <tr><td><strong>Quantité</strong></td><td>${quantity ?? 1}</td></tr>
        </table>
        <p style="margin-top:16px;"><strong>Message :</strong><br/>${String(message).replace(/\n/g, '<br/>')}</p>
      </div>
    `

    await sendEmail({
      to: recipients,
      subject: `Nouvelle demande de devis — ${robot.name} [${requestRef}]`,
      html,
      replyTo: buyerEmail,
    })

    res.status(200).json({ success: true, requestRef })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    console.error('[send-quote] error:', message)
    res.status(500).json({ error: message })
  }
}
