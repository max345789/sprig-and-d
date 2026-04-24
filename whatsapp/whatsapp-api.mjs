const API_VERSION = process.env.WHATSAPP_API_VERSION || 'v23.0'

function getMessagesUrl() {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  if (!phoneNumberId) {
    throw new Error('WHATSAPP_PHONE_NUMBER_ID is missing')
  }

  return `https://graph.facebook.com/${API_VERSION}/${phoneNumberId}/messages`
}

async function sendPayload(payload) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN
  if (!token) {
    throw new Error('WHATSAPP_ACCESS_TOKEN is missing')
  }

  const response = await fetch(getMessagesUrl(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`WhatsApp API request failed: ${response.status} ${errorText}`)
  }

  return response.json()
}

export function isWhatsAppConfigured() {
  return Boolean(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID)
}

export async function sendTextMessage(to, body) {
  return sendPayload({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'text',
    text: {
      preview_url: false,
      body,
    },
  })
}

export async function sendButtonsMessage(to, body, buttons) {
  return sendPayload({
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'interactive',
    interactive: {
      type: 'button',
      body: {
        text: body,
      },
      action: {
        buttons: buttons.slice(0, 3).map((button) => ({
          type: 'reply',
          reply: {
            id: button.id,
            title: button.title,
          },
        })),
      },
    },
  })
}
