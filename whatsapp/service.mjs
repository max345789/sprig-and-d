import { getSession, getLatestOrderForWaId, getOrder, listRecentOrders, saveOrder, saveSession, updateOrder } from './store.mjs'
import { fmt, formatItems } from './catalog.mjs'
import { processIncoming, summarizeCodSwitch, summarizePaidOrder } from './flow.mjs'
import { createPaymentLink, isRazorpayConfigured, verifyRazorpaySignature } from './razorpay.mjs'
import { isWhatsAppConfigured, sendButtonsMessage, sendTextMessage } from './whatsapp-api.mjs'

const ADMIN_ORDER_NUMBER = process.env.WHATSAPP_ADMIN_ORDER_NUMBER || process.env.WHATSAPP_SUPPORT_NUMBER || ''

function extractIncomingEntries(payload) {
  const entries = []

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value ?? {}
      const profileName = value.contacts?.[0]?.profile?.name ?? ''

      for (const message of value.messages ?? []) {
        entries.push({
          waId: message.from,
          profileName,
          message,
        })
      }
    }
  }

  return entries
}

function parseIncomingMessage(message) {
  if (message.type === 'text') {
    return {
      text: message.text?.body ?? '',
      choiceId: '',
    }
  }

  if (message.type === 'interactive') {
    if (message.interactive?.type === 'button_reply') {
      return {
        text: message.interactive.button_reply.title ?? '',
        choiceId: message.interactive.button_reply.id ?? '',
      }
    }

    if (message.interactive?.type === 'list_reply') {
      return {
        text: message.interactive.list_reply.title ?? '',
        choiceId: message.interactive.list_reply.id ?? '',
      }
    }
  }

  if (message.type === 'button') {
    return {
      text: message.button?.text ?? '',
      choiceId: '',
    }
  }

  return {
    text: '',
    choiceId: '',
  }
}

async function dispatchOutgoingActions(waId, actions) {
  if (!isWhatsAppConfigured()) {
    return
  }

  for (const action of actions) {
    if (action.type === 'text') {
      await sendTextMessage(waId, action.body)
    }

    if (action.type === 'buttons') {
      await sendButtonsMessage(waId, action.body, action.buttons)
    }
  }
}

async function handleInternalAction(session, action) {
  if (action.type === 'create_order') {
    saveOrder(action.order)
    await notifyAdminNewOrder(action.order)

    if (!action.createPaymentLink) {
      return []
    }

    if (!isRazorpayConfigured()) {
      return [
        {
          type: 'text',
          body: `Order ${action.order.id} is created, but Razorpay is not configured yet. Reply COD to switch this order to Cash on Delivery.`,
        },
      ]
    }

    try {
      const paymentLink = await createPaymentLink(action.order)
      updateOrder(action.order.id, {
        paymentLinkId: paymentLink.id,
        paymentLinkUrl: paymentLink.short_url,
      })
      return [
        {
          type: 'text',
          body: [
            `Order ${action.order.id} is ready.`,
            `Amount: ${fmt(action.order.total)}`,
            `Pay here: ${paymentLink.short_url}`,
            `Reply COD if you want to switch this order to Cash on Delivery.`,
          ].join('\n'),
        },
      ]
    } catch (error) {
      return [
        {
          type: 'text',
          body: `I could not create the payment link right now. Reply COD to switch the order to Cash on Delivery or try PAY again later.`,
        },
        {
          type: 'text',
          body: `Error detail: ${error.message}`,
        },
      ]
    }
  }

  if (action.type === 'switch_to_cod') {
    const order = updateOrder(action.orderId, {
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'pay_on_delivery',
      status: 'confirmed',
    })

    if (!order) {
      return [{ type: 'text', body: 'I could not find the pending order to switch to Cash on Delivery.' }]
    }

    session.activeOrderId = order.id
    session.lastOrderId = order.id
    saveSession(session)
    return [
      { type: 'text', body: summarizeCodSwitch(order) },
      {
        type: 'buttons',
        body: 'Anything else you want to do?',
        buttons: [
          { id: 'menu:order', title: 'Place Order' },
          { id: 'menu:subscribe', title: 'Subscribe' },
          { id: 'menu:track', title: 'Track Order' },
        ],
      },
    ]
  }

  if (action.type === 'resend_payment_link') {
    const order = getOrder(action.orderId)
    if (!order) {
      return [{ type: 'text', body: 'I could not find the pending order to resend the payment link.' }]
    }

    if (order.paymentLinkUrl) {
      return [
        {
          type: 'text',
          body: `Pay for order ${order.id} here: ${order.paymentLinkUrl}`,
        },
      ]
    }

    return await handleInternalAction(session, {
      type: 'create_order',
      order,
      createPaymentLink: true,
    })
  }

  return []
}

async function notifyAdminNewOrder(order) {
  if (!isWhatsAppConfigured() || !ADMIN_ORDER_NUMBER || ADMIN_ORDER_NUMBER === order.waId) {
    return
  }

  await sendTextMessage(
    ADMIN_ORDER_NUMBER.replace(/[^\d]/g, ''),
    [
      `New WhatsApp order: ${order.id}`,
      `Customer: ${order.customer.name}`,
      `WhatsApp: +${order.waId}`,
      `Call: ${order.customer.phone}`,
      `Area: ${order.customer.area}`,
      `Address: ${order.customer.address}`,
      `Items:`,
      formatItems(order.items),
      `Total: ${fmt(order.total)}`,
      `Payment: ${order.paymentMethod}`,
      `Delivery: ${order.deliveryDay || 'Next available'}`,
      `Note: ${order.deliveryNote || 'No note'}`,
    ].join('\n')
  )
}

export async function processIncomingMessage(event) {
  const parsed = parseIncomingMessage(event.message)
  const session = getSession(event.waId, event.profileName)
  const latestOrder = getLatestOrderForWaId(event.waId)
  const actions = processIncoming(
    session,
    {
      ...parsed,
      profileName: event.profileName,
    },
    latestOrder
  )

  const outbound = []
  for (const action of actions) {
    if (action.type === 'create_order' || action.type === 'switch_to_cod' || action.type === 'resend_payment_link') {
      const internalOutbound = await handleInternalAction(session, action)
      outbound.push(...internalOutbound)
    } else {
      outbound.push(action)
    }
  }

  saveSession(session)
  await dispatchOutgoingActions(event.waId, outbound)
  return outbound
}

export async function processIncomingWebhook(payload) {
  const events = extractIncomingEntries(payload)
  const responses = []

  for (const event of events) {
    responses.push({
      waId: event.waId,
      actions: await processIncomingMessage(event),
    })
  }

  return responses
}

export async function simulateIncoming({ waId, text, profileName = 'Test User' }) {
  return processIncomingMessage({
    waId,
    profileName,
    message: {
      type: 'text',
      text: {
        body: text,
      },
    },
  })
}

export async function handleRazorpayWebhook(payload, signature, rawBody) {
  if (!verifyRazorpaySignature(rawBody, signature)) {
    throw new Error('Invalid Razorpay webhook signature')
  }

  const paymentLink = payload.payload?.payment_link?.entity ?? null
  const payment = payload.payload?.payment?.entity ?? null
  const orderId = paymentLink?.reference_id || payment?.notes?.order_id

  if (!orderId) {
    return null
  }

  const order = updateOrder(orderId, {
    paymentStatus: 'paid',
    status: 'confirmed',
    paidAt: new Date().toISOString(),
  })

  if (!order) {
    return null
  }

  if (isWhatsAppConfigured()) {
    await sendTextMessage(order.waId, summarizePaidOrder(order))
  }

  const session = getSession(order.waId)
  session.activeOrderId = order.id
  session.lastOrderId = order.id
  session.step = 'main_menu'
  saveSession(session)
  return order
}

export function getHealthSnapshot() {
  return {
    whatsappConfigured: isWhatsAppConfigured(),
    razorpayConfigured: isRazorpayConfigured(),
    verifyTokenSet: Boolean(process.env.WHATSAPP_VERIFY_TOKEN),
    phoneNumberIdSet: Boolean(process.env.WHATSAPP_PHONE_NUMBER_ID),
    supportNumber: process.env.WHATSAPP_SUPPORT_NUMBER || '',
  }
}

export function getRecentOrders(limit = 50) {
  return listRecentOrders(limit)
}

export function getRecentOrdersCsv(limit = 100) {
  const rows = listRecentOrders(limit)
  const headers = [
    'order_id',
    'created_at',
    'customer_name',
    'whatsapp',
    'call_number',
    'area',
    'address',
    'items',
    'total',
    'payment_method',
    'payment_status',
    'delivery_day',
    'delivery_note',
    'status',
  ]

  const escape = (value = '') => `"${String(value).replaceAll('"', '""')}"`
  const csvRows = rows.map((order) =>
    [
      order.id,
      order.createdAt,
      order.customer?.name,
      order.waId,
      order.customer?.phone,
      order.customer?.area,
      order.customer?.address,
      formatItems(order.items || []).replaceAll('\n', ' | '),
      order.total,
      order.paymentMethod,
      order.paymentStatus,
      order.deliveryDay,
      order.deliveryNote,
      order.status,
    ].map(escape).join(',')
  )

  return [headers.join(','), ...csvRows].join('\n')
}
