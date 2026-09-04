import Stripe from 'stripe'
import { robots } from '../src/data/robots'

// STRIPE_SECRET_KEY is a server-only env var (no VITE_ prefix) — never exposed to the browser.
const stripeSecretKey = process.env.STRIPE_SECRET_KEY

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (!stripeSecretKey) {
    res.status(500).json({ error: 'Stripe is not configured on the server (missing STRIPE_SECRET_KEY).' })
    return
  }

  try {
    const stripe = new Stripe(stripeSecretKey)
    const { items, deliveryFee } = req.body as {
      items: { robotId: string; quantity: number }[]
      deliveryFee: number
    }

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Cart is empty.' })
      return
    }

    // Prices are looked up server-side from our own catalog — never trust
    // amounts sent from the browser.
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(({ robotId, quantity }) => {
      const robot = robots.find((r) => r.id === robotId)
      if (!robot) throw new Error(`Unknown robot id: ${robotId}`)
      return {
        quantity,
        price_data: {
          currency: robot.currency.toLowerCase(),
          unit_amount: Math.round(robot.price * 100),
          product_data: {
            name: robot.name,
            images: [robot.images[0]],
          },
        },
      }
    })

    if (deliveryFee && deliveryFee > 0) {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(deliveryFee * 100),
          product_data: { name: 'Express shipping' },
        },
      })
    }

    const origin = req.headers.origin || `https://${req.headers.host}`

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
    })

    res.status(200).json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    res.status(500).json({ error: message })
  }
}
