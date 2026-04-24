import { fmt, products, subscriptionTiers } from '../src/data.js'

const PRODUCT_TITLES = {
  wheatgrass: 'Wheatgrass',
  'broccoli-microgreens': 'Broccoli',
  basil: 'Basil',
}

const PRODUCT_KEYWORDS = {
  wheatgrass: ['wheatgrass'],
  'broccoli-microgreens': ['broccoli', 'broccoli microgreens'],
  basil: ['basil', 'basil microgreens'],
}

const PLAN_TITLES = {
  starter: 'Starter Box',
  wellness: 'Wellness Box',
}

export { fmt, products, subscriptionTiers }

export function getProductTitle(productId) {
  return PRODUCT_TITLES[productId] ?? productId
}

export function getPlanTitle(planId) {
  return PLAN_TITLES[planId] ?? planId
}

export function getProductButtons() {
  return products.map((product) => ({
    id: `product:${product.id}`,
    title: getProductTitle(product.id),
  }))
}

export function getVariantButtons(productId) {
  const product = getProductById(productId)
  if (!product) {
    return []
  }

  return product.variants.map((variant) => ({
    id: `size:${variant.weight}`,
    title: variant.weight,
  }))
}

export function getQuantityButtons() {
  return [
    { id: 'qty:1', title: '1 Pack' },
    { id: 'qty:2', title: '2 Packs' },
    { id: 'qty:3', title: '3 Packs' },
  ]
}

export function getSubscriptionButtons() {
  return subscriptionTiers.map((tier) => ({
    id: `plan:${tier.id}`,
    title: getPlanTitle(tier.id),
  }))
}

export function getProductById(productId) {
  return products.find((product) => product.id === productId) ?? null
}

export function getVariantByWeight(productId, weight) {
  const product = getProductById(productId)
  return product?.variants.find((variant) => variant.weight === weight) ?? null
}

export function findProductFromText(value) {
  const normalized = normalizeText(value)
  return (
    products.find((product) =>
      PRODUCT_KEYWORDS[product.id]?.some((keyword) => normalized.includes(keyword))
    ) ?? null
  )
}

export function findVariantFromText(productId, value) {
  const normalized = normalizeText(value)
  const product = getProductById(productId)
  if (!product) {
    return null
  }

  return product.variants.find((variant) => normalizeText(variant.weight) === normalized) ?? null
}

export function findPlanFromText(value) {
  const normalized = normalizeText(value)
  return (
    subscriptionTiers.find((tier) =>
      normalizeText(getPlanTitle(tier.id)) === normalized || normalizeText(tier.id) === normalized
    ) ?? null
  )
}

export function createCartItem(productId, weight, quantity, subscribed) {
  const product = getProductById(productId)
  const variant = getVariantByWeight(productId, weight)
  if (!product || !variant) {
    return null
  }

  const unitPrice = subscribed ? Math.round(variant.price * 0.85) : variant.price

  return {
    productId,
    name: product.name,
    shortName: getProductTitle(productId),
    weight: variant.weight,
    qty: quantity,
    subscribed,
    unitPrice,
    lineTotal: unitPrice * quantity,
  }
}

export function createSubscriptionItems(planId) {
  const tier = subscriptionTiers.find((item) => item.id === planId)
  if (!tier) {
    return []
  }

  return [
    {
      productId: planId,
      name: tier.name,
      shortName: tier.name,
      weight: tier.desc,
      qty: 1,
      subscribed: true,
      unitPrice: tier.price,
      lineTotal: tier.price,
    },
  ]
}

export function sumItems(items) {
  return items.reduce((total, item) => total + item.lineTotal, 0)
}

export function formatItems(items) {
  return items
    .map((item) => `- ${item.shortName} (${item.weight}) x${item.qty} - ${fmt(item.lineTotal)}`)
    .join('\n')
}

export function normalizeText(value = '') {
  return value.trim().toLowerCase()
}
