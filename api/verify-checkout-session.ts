import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (!stripeSecretKey) {
    res.status(500).json({ error: 'Stripe is not configured on the server (missing STRIPE_SECRET_KEY).' })
    return
  }

  const sessionId = req.query.session_id as string | undefined
  if (!sessionId) {
    res.status(400).json({ error: 'Missing session_id.' })
    return
  }

  try {
    const stripe = new Stripe(stripeSecretKey)
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    res.status(200).json({
      status: session.payment_status,
      amountTotal: session.amount_total,
      currency: session.currency,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    res.status(500).json({ error: message })
  }
}
