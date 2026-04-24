import 'dotenv/config'
import { createServer } from 'http'
import { getHealthSnapshot, handleRazorpayWebhook, processIncomingWebhook, simulateIncoming } from './service.mjs'

const PORT = Number.parseInt(process.env.PORT || process.env.WHATSAPP_PORT || '4000', 10)

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(payload))
}

function sendText(response, statusCode, payload) {
  response.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' })
  response.end(payload)
}

async function parseRequestBody(request) {
  const chunks = []

  for await (const chunk of request) {
    chunks.push(chunk)
  }

  const raw = Buffer.concat(chunks).toString('utf8')
  const json = raw ? JSON.parse(raw) : {}
  return { raw, json }
}

createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`)

  try {
    if (request.method === 'GET' && url.pathname === '/health') {
      return sendJson(response, 200, getHealthSnapshot())
    }

    if (request.method === 'GET' && url.pathname === '/webhook') {
      const mode = url.searchParams.get('hub.mode')
      const token = url.searchParams.get('hub.verify_token')
      const challenge = url.searchParams.get('hub.challenge')

      if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
        return sendText(response, 200, challenge || '')
      }

      return sendText(response, 403, 'Webhook verification failed')
    }

    if (request.method === 'POST' && url.pathname === '/webhook') {
      const { json } = await parseRequestBody(request)
      const events = await processIncomingWebhook(json)
      return sendJson(response, 200, { ok: true, events })
    }

    if (request.method === 'POST' && url.pathname === '/razorpay/webhook') {
      const signature = request.headers['x-razorpay-signature'] || ''
      const { raw, json } = await parseRequestBody(request)
      const order = await handleRazorpayWebhook(json, signature, raw)
      return sendJson(response, 200, { ok: true, order })
    }

    if (request.method === 'POST' && url.pathname === '/debug/simulate') {
      const { json } = await parseRequestBody(request)
      const actions = await simulateIncoming({
        waId: json.waId || '919999999999',
        text: json.text || 'Hi',
        profileName: json.profileName || 'Test User',
      })
      return sendJson(response, 200, { ok: true, actions })
    }

    return sendJson(response, 404, { ok: false, error: 'Not found' })
  } catch (error) {
    return sendJson(response, 500, {
      ok: false,
      error: error.message,
    })
  }
}).listen(PORT, () => {
  console.log(`WhatsApp automation server running at http://localhost:${PORT}`)
})
