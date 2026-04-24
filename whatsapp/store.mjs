import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, resolve } from 'path'

const STORE_PATH = resolve(process.cwd(), '.data', 'whatsapp-state.json')

let cache = null

function defaultStore() {
  return {
    sessions: {},
    orders: {},
  }
}

function loadStore() {
  if (cache) {
    return cache
  }

  if (!existsSync(STORE_PATH)) {
    cache = defaultStore()
    return cache
  }

  try {
    cache = JSON.parse(readFileSync(STORE_PATH, 'utf8'))
  } catch {
    cache = defaultStore()
  }

  cache.sessions ??= {}
  cache.orders ??= {}
  return cache
}

function persistStore() {
  const store = loadStore()
  mkdirSync(dirname(STORE_PATH), { recursive: true })
  writeFileSync(STORE_PATH, JSON.stringify(store, null, 2))
}

function buildSession(waId, profileName = '') {
  return {
    waId,
    step: 'main_menu',
    mode: null,
    profile: {
      name: profileName || '',
      area: '',
      address: '',
      phone: '',
    },
    orderType: '',
    cart: [],
    pendingItem: null,
    subscriptionPlan: '',
    deliveryDay: '',
    deliveryNote: '',
    paymentMethod: '',
    activeOrderId: '',
    lastOrderId: '',
    updatedAt: new Date().toISOString(),
  }
}

export function getSession(waId, profileName = '') {
  const store = loadStore()
  const existing = store.sessions[waId]

  if (existing) {
    if (!existing.profile?.name && profileName) {
      existing.profile.name = profileName
    }
    return existing
  }

  const session = buildSession(waId, profileName)
  store.sessions[waId] = session
  persistStore()
  return session
}

export function saveSession(session) {
  const store = loadStore()
  session.updatedAt = new Date().toISOString()
  store.sessions[session.waId] = session
  persistStore()
}

export function saveOrder(order) {
  const store = loadStore()
  store.orders[order.id] = order
  persistStore()
}

export function getOrder(orderId) {
  const store = loadStore()
  return store.orders[orderId] ?? null
}

export function updateOrder(orderId, updates) {
  const store = loadStore()
  const order = store.orders[orderId]
  if (!order) {
    return null
  }

  store.orders[orderId] = {
    ...order,
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  persistStore()
  return store.orders[orderId]
}

export function getLatestOrderForWaId(waId) {
  const store = loadStore()
  const orders = Object.values(store.orders)
    .filter((order) => order.waId === waId)
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))

  return orders[0] ?? null
}
