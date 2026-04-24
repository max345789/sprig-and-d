import {
  createCartItem,
  createSubscriptionItems,
  findPlanFromText,
  findProductFromText,
  findVariantFromText,
  fmt,
  formatItems,
  getPlanTitle,
  getProductButtons,
  getProductById,
  getProductTitle,
  getQuantityButtons,
  getSubscriptionButtons,
  getVariantButtons,
  normalizeText,
  subscriptionTiers,
  sumItems,
} from './catalog.mjs'

const MAIN_MENU_BUTTONS = [
  { id: 'menu:order', title: 'Place Order' },
  { id: 'menu:subscribe', title: 'Subscribe' },
  { id: 'menu:track', title: 'Track Order' },
]

const ORDER_TYPE_BUTTONS = [
  { id: 'order_type:one_time', title: 'One-Time' },
  { id: 'order_type:weekly', title: 'Weekly' },
]

const DELIVERY_DAY_BUTTONS = [
  { id: 'delivery:next', title: 'Next Available' },
  { id: 'delivery:monday', title: 'Monday' },
  { id: 'delivery:thursday', title: 'Thursday' },
]

const NOTE_BUTTONS = [
  { id: 'note:call', title: 'Call Me' },
  { id: 'note:gate', title: 'Leave At Gate' },
  { id: 'note:none', title: 'No Note' },
]

const PAYMENT_BUTTONS = [
  { id: 'payment:cod', title: 'Cash on Delivery' },
  { id: 'payment:online', title: 'Online Payment' },
]

const YES_NO_BUTTONS = [
  { id: 'more:yes', title: 'Yes' },
  { id: 'more:no', title: 'No' },
]

function text(body) {
  return { type: 'text', body }
}

function buttons(body, buttonList) {
  return { type: 'buttons', body, buttons: buttonList }
}

function resetFlow(session) {
  session.step = 'main_menu'
  session.mode = null
  session.orderType = ''
  session.cart = []
  session.pendingItem = null
  session.subscriptionPlan = ''
  session.deliveryDay = ''
  session.deliveryNote = ''
  session.paymentMethod = ''
  session.activeOrderId = ''
}

function hasCustomerDetails(session) {
  return session.profile.name && session.profile.area && session.profile.address && session.profile.phone
}

function showMainMenu(session) {
  session.step = 'main_menu'
  return [
    buttons(
      'Welcome to Sprig and Soil. I can help you place an order, start a subscription, or track your order.',
      MAIN_MENU_BUTTONS
    ),
  ]
}

function normalizedChoice(input) {
  return input.choiceId || normalizeText(input.text)
}

function generateOrderId() {
  return `DAB-${Date.now().toString(36).toUpperCase().slice(-6)}`
}

function summarizeOrder(order) {
  return [
    `Order confirmed: ${order.id}`,
    `Items:`,
    formatItems(order.items),
    `Total: ${fmt(order.total)}`,
    `Payment: ${order.paymentMethod}`,
    `Delivery day: ${order.deliveryDay || 'Next available'}`,
    `Phone: ${order.customer.phone}`,
    `Address: ${order.customer.address}`,
  ].join('\n')
}

function summarizeTracking(order) {
  return [
    `Latest order: ${order.id}`,
    `Status: ${order.status}`,
    `Payment status: ${order.paymentStatus}`,
    `Total: ${fmt(order.total)}`,
    `Delivery day: ${order.deliveryDay || 'Next available'}`,
  ].join('\n')
}

function buildOrder(session, overrides = {}) {
  const items =
    session.mode === 'subscription'
      ? createSubscriptionItems(session.subscriptionPlan)
      : session.cart

  const total = sumItems(items)
  const paymentMethod = overrides.paymentMethod ?? session.paymentMethod
  const paymentStatus =
    overrides.paymentStatus ?? (paymentMethod === 'Cash on Delivery' ? 'pay_on_delivery' : 'pending')

  return {
    id: generateOrderId(),
    waId: session.waId,
    type: session.mode === 'subscription' ? 'subscription' : 'order',
    orderType: session.orderType || (session.mode === 'subscription' ? 'Weekly' : 'One-Time'),
    subscriptionPlan: session.subscriptionPlan || '',
    items,
    total,
    paymentMethod,
    paymentStatus,
    deliveryDay: session.deliveryDay,
    deliveryNote: session.deliveryNote,
    status: paymentStatus === 'pending' ? 'payment_pending' : 'confirmed',
    customer: {
      name: session.profile.name,
      area: session.profile.area,
      address: session.profile.address,
      phone: session.profile.phone,
    },
    createdAt: new Date().toISOString(),
  }
}

function beginOrder(session) {
  session.mode = 'order'
  session.cart = []
  session.pendingItem = null
  session.orderType = ''
  session.deliveryDay = ''
  session.deliveryNote = ''
  session.paymentMethod = ''

  if (hasCustomerDetails(session)) {
    session.step = 'awaiting_order_type'
    return [
      buttons(
        `Welcome back ${session.profile.name}. Choose your order type to continue.`,
        ORDER_TYPE_BUTTONS
      ),
    ]
  }

  session.step = 'awaiting_name'
  return [text('Let us get your order started. Please share your full name.')]
}

function beginSubscription(session) {
  session.mode = 'subscription'
  session.subscriptionPlan = ''
  session.deliveryDay = ''
  session.deliveryNote = ''
  session.paymentMethod = ''

  if (hasCustomerDetails(session)) {
    session.step = 'awaiting_subscription_plan'
    return [buttons('Choose your weekly subscription plan.', getSubscriptionButtons())]
  }

  session.step = 'awaiting_name'
  return [text('Let us start your subscription. Please share your full name.')]
}

function handleMenuSelection(session, input, latestOrder) {
  const choice = normalizedChoice(input)

  if (
    choice === 'menu:order' ||
    choice === 'order' ||
    choice === 'buy' ||
    choice === 'place order'
  ) {
    return beginOrder(session)
  }

  if (
    choice === 'menu:subscribe' ||
    choice === 'subscribe' ||
    choice === 'start subscription'
  ) {
    return beginSubscription(session)
  }

  if (choice === 'menu:track' || choice === 'track' || choice === 'track order') {
    if (!latestOrder) {
      return [
        text('I do not have any saved order for this WhatsApp number yet.'),
        ...showMainMenu(session),
      ]
    }

    return [text(summarizeTracking(latestOrder)), ...showMainMenu(session)]
  }

  return showMainMenu(session)
}

function handleName(session, input) {
  const name = input.text.trim()
  if (!name) {
    return [text('Please share your full name so I can continue.')]
  }

  session.profile.name = name
  session.step = 'awaiting_area'
  return [text(`Thanks, ${name}. Which area should we deliver to?`)]
}

function handleArea(session, input) {
  const area = input.text.trim()
  if (!area) {
    return [text('Please send your delivery area.')]
  }

  session.profile.area = area
  session.step = 'awaiting_address'
  return [text('Please send your full delivery address with a landmark.')]
}

function handleAddress(session, input) {
  const address = input.text.trim()
  if (!address) {
    return [text('Please send your full delivery address so I can continue.')]
  }

  session.profile.address = address
  session.step = 'awaiting_phone'
  return [text('Please send the phone number we can call for delivery or order confirmation.')]
}

function handlePhone(session, input) {
  const phone = input.text.replace(/[^\d+]/g, '').trim()
  if (phone.length < 10) {
    return [text('Please send a valid phone number with at least 10 digits.')]
  }

  session.profile.phone = phone

  if (session.mode === 'subscription') {
    session.step = 'awaiting_subscription_plan'
    return [buttons('Choose your weekly subscription plan.', getSubscriptionButtons())]
  }

  session.step = 'awaiting_order_type'
  return [buttons('Would you like a one-time order or a weekly order?', ORDER_TYPE_BUTTONS)]
}

function handleOrderType(session, input) {
  const choice = normalizedChoice(input)
  const isWeekly = choice === 'order_type:weekly' || choice === 'weekly'

  if (
    choice !== 'order_type:one_time' &&
    choice !== 'one-time' &&
    choice !== 'one_time' &&
    choice !== 'order_type:weekly' &&
    choice !== 'weekly'
  ) {
    return [buttons('Choose your order type.', ORDER_TYPE_BUTTONS)]
  }

  session.orderType = isWeekly ? 'Weekly' : 'One-Time'
  session.step = 'awaiting_product'
  return [buttons('Choose the product you want to order.', getProductButtons())]
}

function handleProduct(session, input) {
  const choice = normalizedChoice(input)
  const productId = choice.startsWith('product:') ? choice.replace('product:', '') : ''
  const product = productId ? getProductById(productId) : findProductFromText(input.text)

  if (!product) {
    return [buttons('Choose one of the available products to continue.', getProductButtons())]
  }

  session.pendingItem = {
    productId: product.id,
  }
  session.step = 'awaiting_size'
  return [
    buttons(
      `Choose your pack size for ${getProductTitle(product.id)}.`,
      getVariantButtons(product.id)
    ),
  ]
}

function handleSize(session, input) {
  const productId = session.pendingItem?.productId
  const choice = normalizedChoice(input)
  const weight = choice.startsWith('size:') ? choice.replace('size:', '') : ''
  const variant = weight
    ? findVariantFromText(productId, weight)
    : findVariantFromText(productId, input.text)

  if (!productId || !variant) {
    return [
      buttons(
        'Choose a valid pack size to continue.',
        getVariantButtons(productId || 'wheatgrass')
      ),
    ]
  }

  session.pendingItem.weight = variant.weight
  session.step = 'awaiting_quantity'
  return [buttons('How many packs would you like?', getQuantityButtons())]
}

function handleQuantity(session, input) {
  const choice = normalizedChoice(input)
  const quantity =
    choice.startsWith('qty:') ? Number.parseInt(choice.replace('qty:', ''), 10) : Number.parseInt(choice, 10)

  if (!session.pendingItem?.productId || !session.pendingItem?.weight || Number.isNaN(quantity) || quantity < 1) {
    return [buttons('Choose the quantity for this item.', getQuantityButtons())]
  }

  const item = createCartItem(
    session.pendingItem.productId,
    session.pendingItem.weight,
    quantity,
    session.orderType === 'Weekly'
  )

  if (!item) {
    session.step = 'awaiting_product'
    return [buttons('I could not build that item. Please choose the product again.', getProductButtons())]
  }

  session.cart.push(item)
  session.pendingItem = null
  session.step = 'awaiting_add_more'
  return [buttons('Would you like to add another product?', YES_NO_BUTTONS)]
}

function handleAddMore(session, input) {
  const choice = normalizedChoice(input)
  if (choice === 'more:yes' || choice === 'yes') {
    session.step = 'awaiting_product'
    return [buttons('Choose the next product you want to add.', getProductButtons())]
  }

  if (choice === 'more:no' || choice === 'no') {
    session.step = 'awaiting_delivery_day'
    return [buttons('Please choose your preferred delivery day.', DELIVERY_DAY_BUTTONS)]
  }

  return [buttons('Please choose Yes or No.', YES_NO_BUTTONS)]
}

function handleSubscriptionPlan(session, input) {
  const choice = normalizedChoice(input)
  const planId = choice.startsWith('plan:') ? choice.replace('plan:', '') : ''
  const plan = planId
    ? subscriptionTiers.find((tier) => tier.id === planId) ?? null
    : findPlanFromText(input.text)

  if (!plan) {
    return [buttons('Choose a valid subscription plan.', getSubscriptionButtons())]
  }

  session.subscriptionPlan = plan.id
  session.orderType = 'Weekly'
  session.step = 'awaiting_delivery_day'
  return [
    text(
      `${getPlanTitle(plan.id)} selected for ${fmt(plan.price)} per week. Now choose your delivery day.`
    ),
    buttons('Please choose your preferred delivery day.', DELIVERY_DAY_BUTTONS),
  ]
}

function handleDeliveryDay(session, input) {
  const choice = normalizedChoice(input)
  const value = {
    'delivery:next': 'Next available',
    'delivery:monday': 'Monday',
    'delivery:thursday': 'Thursday',
    'next available': 'Next available',
    monday: 'Monday',
    thursday: 'Thursday',
  }[choice]

  if (!value) {
    return [buttons('Choose your preferred delivery day.', DELIVERY_DAY_BUTTONS)]
  }

  session.deliveryDay = value
  session.step = 'awaiting_note'
  return [buttons('Any delivery note?', NOTE_BUTTONS)]
}

function handleDeliveryNote(session, input) {
  const choice = normalizedChoice(input)
  const value = {
    'note:call': 'Call me on arrival',
    'note:gate': 'Leave at gate',
    'note:none': 'No note',
    'call me': 'Call me on arrival',
    'leave at gate': 'Leave at gate',
    'no note': 'No note',
  }[choice]

  if (!value) {
    return [buttons('Choose one delivery note option.', NOTE_BUTTONS)]
  }

  session.deliveryNote = value
  session.step = 'awaiting_payment'
  return [buttons('How would you like to pay for this order?', PAYMENT_BUTTONS)]
}

function handlePayment(session, input) {
  const choice = normalizedChoice(input)

  if (choice === 'payment:cod' || choice === 'cod' || choice === 'cash on delivery') {
    session.paymentMethod = 'Cash on Delivery'
    const order = buildOrder(session, {
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'pay_on_delivery',
    })
    session.lastOrderId = order.id
    session.activeOrderId = order.id
    resetFlow(session)
    return [
      { type: 'create_order', order },
      text(summarizeOrder(order)),
      ...showMainMenu(session),
    ]
  }

  if (choice === 'payment:online' || choice === 'pay' || choice === 'online payment') {
    session.paymentMethod = 'Online Payment'
    const order = buildOrder(session, {
      paymentMethod: 'Online Payment',
      paymentStatus: 'pending',
    })
    session.lastOrderId = order.id
    session.activeOrderId = order.id
    session.step = 'payment_pending'
    return [
      text(`Creating a secure payment link for order ${order.id}.`),
      { type: 'create_order', order, createPaymentLink: true },
    ]
  }

  return [buttons('Choose a payment option to continue.', PAYMENT_BUTTONS)]
}

function handlePaymentPending(session, input) {
  const choice = normalizedChoice(input)

  if (choice === 'cod' || choice === 'payment:cod' || choice === 'cash on delivery') {
    session.step = 'main_menu'
    return [
      {
        type: 'switch_to_cod',
        orderId: session.activeOrderId,
      },
    ]
  }

  if (choice === 'pay' || choice === 'payment:online' || choice === 'online payment') {
    return [
      {
        type: 'resend_payment_link',
        orderId: session.activeOrderId,
      },
    ]
  }

  return [
    text('Your order is waiting for payment. Reply PAY to resend the link or COD to switch to Cash on Delivery.'),
  ]
}

function handleSupport(session) {
  return [
    text('I am handing this over to a human. Reply in this chat and your team can continue from here.'),
    ...showMainMenu(session),
  ]
}

export function processIncoming(session, input, latestOrder) {
  const value = normalizedChoice(input)
  if (!session.profile.name && input.profileName) {
    session.profile.name = input.profileName
  }

  if (['hi', 'hello', 'start', 'menu', 'main menu'].includes(value)) {
    resetFlow(session)
    return showMainMenu(session)
  }

  if (value === 'help' || value === 'agent' || value === 'support' || value === 'human') {
    return handleSupport(session)
  }

  switch (session.step) {
    case 'main_menu':
      return handleMenuSelection(session, input, latestOrder)
    case 'awaiting_name':
      return handleName(session, input)
    case 'awaiting_area':
      return handleArea(session, input)
    case 'awaiting_address':
      return handleAddress(session, input)
    case 'awaiting_phone':
      return handlePhone(session, input)
    case 'awaiting_order_type':
      return handleOrderType(session, input)
    case 'awaiting_product':
      return handleProduct(session, input)
    case 'awaiting_size':
      return handleSize(session, input)
    case 'awaiting_quantity':
      return handleQuantity(session, input)
    case 'awaiting_add_more':
      return handleAddMore(session, input)
    case 'awaiting_subscription_plan':
      return handleSubscriptionPlan(session, input)
    case 'awaiting_delivery_day':
      return handleDeliveryDay(session, input)
    case 'awaiting_note':
      return handleDeliveryNote(session, input)
    case 'awaiting_payment':
      return handlePayment(session, input)
    case 'payment_pending':
      return handlePaymentPending(session, input)
    default:
      resetFlow(session)
      return showMainMenu(session)
  }
}

export function summarizePaidOrder(order) {
  return `${summarizeOrder(order)}\nPayment status: Paid`
}

export function summarizeCodSwitch(order) {
  return `${summarizeOrder(order)}\nPayment status: Pay on delivery`
}
