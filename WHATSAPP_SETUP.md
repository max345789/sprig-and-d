# WhatsApp Live Setup

This repo now includes a standalone WhatsApp automation server in [whatsapp/server.mjs](/Users/iitsmesarathgmail.com/Project/sprig-and-d/whatsapp/server.mjs).

## What It Does

- verifies the Meta webhook
- receives incoming WhatsApp messages
- replies automatically with a menu
- guides the customer through onboarding and ordering
- supports `Cash on Delivery` and `Online Payment`
- creates `Razorpay Payment Links`
- marks orders paid from a Razorpay webhook

## Start It

1. Copy `.env.example` to `.env`
2. Fill in your Meta and Razorpay credentials
3. Run `npm run whatsapp:start`
4. Expose the server with a public HTTPS URL
5. Add `GET/POST /webhook` in Meta
6. Add `POST /razorpay/webhook` in Razorpay

## Required Meta Setup

You still need to configure these in your own Meta account:

- `WhatsApp Business Platform / Cloud API`
- your real production number `+91 6282652286`
- permanent access token
- phone number ID
- webhook subscription
- business verification
- payment method in Meta if Meta billing requires it for your account

## Required Razorpay Setup

- Razorpay account
- API key ID
- API key secret
- webhook secret

## Cost Notes

There is no standard official `3 month free` production period for a real live WhatsApp Cloud API number.

What to expect instead:

- Meta charges according to its current WhatsApp Business Platform pricing model.
- As of `July 1, 2025`, Meta uses `per-message pricing` for billable template messaging.
- Free-form replies inside the customer service window after the user messages you are generally not the expensive part of the setup.
- Razorpay does not list setup fees or AMC on its pricing page, but it does charge transaction fees on successful online payments.

Official links:

- Meta pricing: https://developers.facebook.com/docs/whatsapp/pricing
- Razorpay pricing: https://razorpay.com/pricing/
- Razorpay payment links: https://razorpay.com/docs/payments/payment-links/
