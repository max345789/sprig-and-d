import crypto from 'crypto'

export function isRazorpayConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
}

export async function createPaymentLink(order) {
  if (!isRazorpayConfigured()) {
    return null
  }

  const auth = Buffer.from(
    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
  ).toString('base64')

  const response = await fetch('https://api.razorpay.com/v1/payment_links/', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: Math.round(order.total * 100),
      currency: 'INR',
      accept_partial: false,
      reference_id: order.id,
      description: `Sprig and Soil order ${order.id}`,
      customer: {
        name: order.customer.name || 'Sprig and Soil Customer',
        contact: order.waId.replace(/\D/g, ''),
      },
      notify: {
        sms: false,
        email: false,
      },
      notes: {
        order_id: order.id,
        wa_id: order.waId,
      },
      callback_method: 'get',
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Razorpay payment link failed: ${response.status} ${errorText}`)
  }

  return response.json()
}

export function verifyRazorpaySignature(rawBody, signature) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret) {
    return true
  }

  const digest = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  return digest === signature
}
