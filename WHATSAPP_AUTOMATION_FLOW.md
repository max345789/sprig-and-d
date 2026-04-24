# WhatsApp Automation Flow for Dabcloud.in

This plan keeps the website untouched and builds the customer journey inside WhatsApp first.

## Recommended Setup

Use this stack:

1. `WhatsApp Business Platform Cloud API`
2. `WhatsApp Flows` for the structured in-chat form
3. `Webhook` to save replies, create orders, and trigger follow-ups
4. `Razorpay Payment Links` for online payment

Why this setup:

- It supports structured flows inside WhatsApp.
- It supports automated replies for every incoming message.
- It supports payment branching: `COD` or `Online Payment`.
- It gives us a clean path to connect the website later.

Important:

- If you only use the regular `WhatsApp Business App`, you can do basic greeting and away messages, but not a true automated step-by-step order flow.
- For a real flow that reacts to every message, you need `WhatsApp Business Platform / Cloud API`.

## Best UX Choice

You asked for "reply every message with a link for sending another message in a flow".

That can work, but the better WhatsApp-native version is:

- `Buttons` for 2 to 3 choices
- `List messages` for bigger menus
- `WhatsApp Flows` for multi-step onboarding and checkout

Use prefilled `wa.me` links mainly for:

- ads
- QR codes
- website entry points later
- re-entry from outside WhatsApp

Inside the chat, buttons and Flows are cleaner than sending a new link after every step.

## Full Customer Workflow

### 1. Entry Message

Trigger:

- user sends `Hi`
- user clicks a campaign link
- business sends an approved template with a `Flow` button

Bot reply:

`Welcome to Dabcloud. I can help you place an order, start a subscription, or track an existing order.`

Options:

- `Shop Now`
- `Subscribe`
- `Track Order`

Fallback text keywords:

- `ORDER`
- `SUBSCRIBE`
- `TRACK`

### 2. Onboarding Flow

If user is new:

- ask name
- ask mobile number
- ask delivery area
- ask address landmark
- ask customer type: `One-time` or `Weekly`

Store:

- customer name
- WhatsApp number
- area
- address
- preferred order type

Bot confirmation:

`Thanks, <name>. You are all set. Now let’s choose your items.`

### 3. Product Selection

Use a `WhatsApp Flow` or list-based flow.

Suggested structure:

- category or product screen
- size / quantity screen
- add more items screen
- order summary screen

For the current catalog, this can later map to:

- `Wheatgrass`
- `Broccoli Microgreens`
- `Basil Microgreens`

Each product should capture:

- product name
- variant / weight
- quantity
- one-time vs subscription

### 4. Delivery Preference

Ask:

- preferred delivery day
- delivery slot
- special notes

Suggested options:

- `Next available`
- `Monday`
- `Thursday`

Notes example:

- `Leave at gate`
- `Call on arrival`
- `No special note`

### 5. Payment Branch

Ask:

- `How would you like to pay?`

Options:

- `Cash on Delivery`
- `Online Payment`

#### COD Branch

Bot reply:

`Your order is marked as Cash on Delivery. Please keep the exact amount ready if possible.`

Then send:

- order summary
- delivery confirmation
- support contact option

#### Online Payment Branch

Bot action:

- create Razorpay payment link
- send link in WhatsApp

Bot reply:

`Please complete payment using the secure payment link below. Once payment is successful, I will confirm your order automatically.`

After payment webhook confirms success:

- mark order as paid
- send confirmation
- send expected delivery timing

If payment is not completed:

- send reminder after a defined delay
- provide `COD instead` fallback

### 6. Order Confirmation

Send one clean message:

`Order confirmed`

Include:

- order ID
- items
- total amount
- payment method
- delivery day
- address summary

Buttons:

- `Edit Order`
- `Cancel Order`
- `Talk to Support`

### 7. Post-Order Automation

Suggested follow-ups:

- order received
- payment pending reminder
- payment success
- packed
- out for delivery
- delivered
- reorder prompt after delivery

## Auto-Reply Logic

This is the message-routing logic we should implement first.

### Keyword Routing

If user sends:

- `hi`, `hello`, `start` -> show main menu
- `order`, `buy` -> start order flow
- `subscribe` -> start subscription flow
- `track` -> ask for order ID or show latest order
- `cod` -> switch payment method to COD
- `pay` -> generate or resend payment link
- `help` -> connect to human support

### Global Rules

- If the user is mid-flow, continue from the last unfinished step.
- If the user types something unexpected, show the current step again with valid choices.
- If the user becomes inactive, save progress and allow resume.
- If the user asks for a human, stop automation and hand over.

## Recommended Conversation Tree

### Main Menu

Message:

`Welcome to Dabcloud. What would you like to do today?`

Options:

- `Place an Order`
- `Start Subscription`
- `Track Order`

### Place an Order

Flow:

1. confirm customer details
2. select products
3. select quantity
4. confirm delivery details
5. choose payment
6. confirm order

### Start Subscription

Flow:

1. choose plan
2. choose delivery frequency
3. confirm address
4. choose payment method
5. confirm subscription

### Track Order

Flow:

1. ask for order ID or fetch recent order from phone number
2. show status
3. offer support if needed

## Exact Reply Script

These are the direct bot replies to use in the first version.

### Welcome Reply

`Welcome to Dabcloud. I can help you place an order, start a subscription, or track your order.`

Buttons:

- `Place Order`
- `Subscribe`
- `Track Order`

### New Customer Onboarding

Reply 1:

`Before we start, please share your full name.`

Reply 2:

`Thanks, <name>. Please choose your delivery area.`

Reply 3:

`Please send your full delivery address with landmark.`

Reply 4:

`Would you like a one-time order or a weekly subscription?`

Buttons:

- `One-Time`
- `Weekly`

### Product Selection Reply

`Choose the product you want to order.`

Buttons or list:

- `Wheatgrass`
- `Broccoli`
- `Basil`

Next reply:

`Choose your pack size.`

Buttons:

- `50g`
- `100g`
- `200g`

Next reply:

`How many packs would you like?`

Buttons:

- `1`
- `2`
- `3+`

Next reply:

`Would you like to add another product?`

Buttons:

- `Yes`
- `No`

### Delivery Reply

`Please choose your preferred delivery day.`

Buttons:

- `Next Available`
- `Monday`
- `Thursday`

Next reply:

`Any delivery note?`

Buttons:

- `Call Me`
- `Leave At Gate`
- `No Note`

### Payment Reply

`How would you like to pay for this order?`

Buttons:

- `Cash on Delivery`
- `Online Payment`

### COD Confirmation

`Your order is marked as Cash on Delivery. We will collect payment when the order is delivered.`

### Online Payment Message

`Please complete your order using the secure payment link below. Once payment is successful, I will confirm your order automatically.`

### Final Confirmation

`Your order has been confirmed.`

Include:

- `Order ID`
- `Items`
- `Total`
- `Payment Method`
- `Delivery Day`

## Payment Setup Recommendation

For `Online Payment`, use `Razorpay Payment Links`.

Why:

- they work without building website checkout first
- they can be created from dashboard or API
- they are easy to send on WhatsApp

Recommended payment logic:

1. User selects `Online Payment`
2. System creates a payment link for the exact order amount
3. Bot sends the link
4. Razorpay webhook confirms payment
5. Bot sends `Payment received` + `Order confirmed`

For `COD`:

- no payment link needed
- confirm payable at delivery

## What We Need to Store

Minimum data model:

- `customer_id`
- `whatsapp_number`
- `name`
- `address`
- `area`
- `order_id`
- `items`
- `subtotal`
- `delivery_charge`
- `total`
- `payment_method`
- `payment_status`
- `delivery_slot`
- `flow_state`

## Human Handover Rule

Automation should stop and assign to a person when:

- user says `agent`, `call me`, `support`
- payment fails more than once
- address is outside service area
- custom order request is unclear

Bot handover message:

`I’m connecting you to our team now. Please share any extra details here and someone will continue in this chat.`

## What To Build First

Phase 1:

1. welcome menu
2. onboarding
3. product selection
4. COD / online payment branch
5. payment-link sending
6. order confirmation

Phase 2:

1. subscription automation
2. order tracking
3. reminders
4. website sync

## Exact Recommendation

The cleanest first implementation is:

1. Set up `WhatsApp Business Platform Cloud API`
2. Build one `WhatsApp Flow` called `order_checkout_v1`
3. Connect a `webhook` that stores customer progress
4. Add `Razorpay Payment Links`
5. Keep `COD` as the fallback payment option

## Source Links

- Meta WhatsApp Flows overview: https://developers.facebook.com/docs/whatsapp/flows
- Meta Flows getting started: https://developers.facebook.com/docs/whatsapp/flows/gettingstarted
- Meta sending a Flow: https://developers.facebook.com/docs/whatsapp/flows/guides/sendingaflow
- Meta receiving Flow responses: https://developers.facebook.com/docs/whatsapp/flows/guides/receiveflowresponse
- Meta Flows best practices: https://developers.facebook.com/docs/whatsapp/flows/guides/bestpractices
- Razorpay Payment Links: https://razorpay.com/docs/payments/payment-links/
