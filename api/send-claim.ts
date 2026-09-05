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
    const { robotId, sellerId, fullName, jobTitle, professionalEmail, proof } = req.body || {}

    if (!robotId || !sellerId || !fullName || !jobTitle || !professionalEmail || !proof) {
      res.status(400).json({ error: 'Tous les champs sont requis.' })
      return
    }

    const robot = robots.find((r) => r.id === robotId)
    const seller = sellers.find((s) => s.id === sellerId)
    if (!robot || !seller) {
      res.status(404).json({ error: 'Robot ou vendeur introuvable.' })
      return
    }

    // 1. Enregistrement en base : c'est cette table que l'espace admin lit
    //    pour valider/refuser la revendication et basculer la propriété.
    if (supabaseAdmin) {
      const { error } = await supabaseAdmin.from('claim_requests').insert({
        robot_id: robot.id,
        robot_name: robot.name,
        seller_id: seller.id,
        seller_name: seller.name,
        full_name: fullName,
        job_title: jobTitle,
        professional_email: professionalEmail,
        proof,
        status: 'pending',
      })
      if (error) console.error('[send-claim] Supabase insert error:', error.message)
    }

    // 2. Notification immédiate à l'administrateur (jamais au fabricant lui-même
    //    à ce stade : la revendication n'est pas encore vérifiée).
    const html = `
      <div style="font-family: sans-serif; line-height: 1.5; color: #1a1a1a;">
        <h2 style="margin-bottom: 4px;">Nouvelle demande de revendication de fiche</h2>
        <table cellpadding="6" style="border-collapse: collapse;">
          <tr><td><strong>Fiche produit</strong></td><td>${robot.name} (${robot.brand} ${robot.model})</td></tr>
          <tr><td><strong>Vendeur (placeholder)</strong></td><td>${seller.name}</td></tr>
          <tr><td colspan="2"><hr /></td></tr>
          <tr><td><strong>Nom</strong></td><td>${fullName}</td></tr>
          <tr><td><strong>Fonction</strong></td><td>${jobTitle}</td></tr>
          <tr><td><strong>E-mail professionnel</strong></td><td>${professionalEmail}</td></tr>
        </table>
        <p style="margin-top:16px;"><strong>Preuve d'appartenance :</strong><br/>${String(proof).replace(/\n/g, '<br/>')}</p>
        <p style="margin-top:16px; color:#888; font-size:12px;">
          À valider dans l'espace admin avant de basculer la propriété de la fiche.
        </p>
      </div>
    `

    await sendEmail({
      to: [ADMIN_EMAIL],
      subject: `Revendication de fiche — ${seller.name} / ${robot.name}`,
      html,
      replyTo: professionalEmail,
    })

    res.status(200).json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    console.error('[send-claim] error:', message)
    res.status(500).json({ error: message })
  }
}
