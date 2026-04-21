import { useState } from 'react'
import { Link } from 'react-router-dom'
import './App.css'
import { useSeo } from './seo.js'

const products = [
  {
    id: 'sunflower',
    name: 'Sunflower Crunch',
    flavor: 'Nutty, juicy, and substantial enough for wraps and grain bowls.',
    benefit: 'High in plant protein and texture, ideal when you want greens that eat like food.',
    price: 8,
    accent: 'gold',
  },
  {
    id: 'broccoli',
    name: 'Broccoli Shield',
    flavor: 'Clean, mild, and easy to use from smoothies to omelets.',
    benefit: 'A simple daily microgreen with a gentle flavor profile and strong wellness appeal.',
    price: 9,
    accent: 'forest',
  },
  {
    id: 'radish',
    name: 'Radish Ignite',
    flavor: 'Peppery and bright with the snap chefs use to wake up rich plates.',
    benefit: 'Best for customers who want punch, circulation, and a quick salad upgrade.',
    price: 8,
    accent: 'rose',
  },
  {
    id: 'pea',
    name: 'Pea Tendril Sweet',
    flavor: 'Sweet, tender, and familiar for families easing into live greens.',
    benefit: 'Brings freshness to toast, sandwiches, and lunchboxes without bitterness.',
    price: 10,
    accent: 'sage',
  },
]

const principles = [
  {
    title: 'Harvested at peak tenderness',
    text: 'We cut to order in small indoor batches so the greens hit the fridge fast and stay lively on the plate.',
  },
  {
    title: 'Built for real meals, not garnish',
    text: 'Every variety is selected for everyday use: eggs, rice bowls, sandwiches, soups, juices, and salads.',
  },
  {
    title: 'Delivered with a habit in mind',
    text: 'Weekly plans create consistency, which is where the flavor and nutrition actually start compounding.',
  },
]

const rituals = [
  {
    title: 'Morning reset',
    text: 'Blend broccoli and pea shoots into smoothies or fold them into eggs for a cleaner start.',
  },
  {
    title: 'Lunch upgrade',
    text: 'Use sunflower and radish microgreens to turn wraps, bowls, and sandwiches into something crisp and alive.',
  },
  {
    title: 'Dinner finish',
    text: 'Scatter a final handful over soups, roasted vegetables, or grilled proteins right before serving.',
  },
]

const testimonials = [
  {
    quote: 'The weekly box made greens automatic. We stopped buying limp salad mixes and started actually using what arrived.',
    author: 'Maya R.',
    role: 'Weekly subscriber',
  },
  {
    quote: 'Radish Ignite is the first healthy add-on my husband notices. It changes the whole plate without any extra cooking.',
    author: 'Anika P.',
    role: 'Family plan customer',
  },
  {
    quote: 'Chefs want consistency. Sprig & Soil gives us the same cut, same snap, and same freshness every delivery.',
    author: 'Jon V.',
    role: 'Cafe buyer',
  },
]

const faqs = [
  {
    question: 'What makes microgreens different from salad greens?',
    answer:
      'Microgreens are harvested at the seedling stage, so you get concentrated flavor, fast prep, and an easy way to add fresh greens to meals without building a full salad.',
  },
  {
    question: 'How long do they stay fresh?',
    answer:
      'Most trays keep well for 7 to 10 days refrigerated. We include simple storage guidance so they stay dry, crisp, and ready to use.',
  },
  {
    question: 'Can I buy once before subscribing?',
    answer:
      'Yes. You can start with a one-time harvest box, then switch to weekly delivery once you know your favorite varieties.',
  },
]

const initialQuantities = Object.fromEntries(products.map((product) => [product.id, 0]))
const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
})

function formatCurrency(value) {
  return currency.format(value)
}

function createOrderHref(items, selectedPlan, subject) {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const discount = selectedPlan === 'weekly' ? subtotal * 0.1 : 0
  const shipping = subtotal === 0 || subtotal >= 32 || selectedPlan === 'weekly' ? 0 : 6
  const total = subtotal - discount + shipping

  const orderBody = [
    'Hello Sprig & Soil,',
    '',
    `I want to buy a ${selectedPlan === 'weekly' ? 'weekly microgreens delivery' : 'one-time microgreens order'}.`,
    '',
    ...items.map(
      (item) =>
        `- ${item.name}: ${item.quantity} x ${formatCurrency(item.price)} = ${formatCurrency(item.total)}`,
    ),
    '',
    `Subtotal: ${formatCurrency(subtotal)}`,
    discount > 0 ? `Weekly savings: -${formatCurrency(discount)}` : null,
    `Delivery: ${shipping === 0 ? 'Included' : formatCurrency(shipping)}`,
    `Total: ${formatCurrency(total)}`,
    '',
    'Name:',
    'Phone:',
    'Preferred delivery day:',
    'Address:',
  ]
    .filter(Boolean)
    .join('\n')

  const message = `${subject}\n\n${orderBody}`
  return `https://wa.me/916282652286?text=${encodeURIComponent(message)}`
}

function App() {
  const [quantities, setQuantities] = useState(initialQuantities)
  const [plan, setPlan] = useState('weekly')

  useSeo({
    title: 'Fresh Microgreens Delivery in Kerala | Sprig & Soil',
    description:
      'Order fresh microgreens in Pattambi, Valanchery, Pallipuram, and Pulamanthole. Weekly harvest-to-door delivery and direct WhatsApp ordering.',
    path: '/',
  })

  const selectedItems = products
    .filter((product) => quantities[product.id] > 0)
    .map((product) => ({
      ...product,
      quantity: quantities[product.id],
      total: quantities[product.id] * product.price,
    }))

  const itemCount = selectedItems.reduce((count, item) => count + item.quantity, 0)
  const subtotal = selectedItems.reduce((sum, item) => sum + item.total, 0)
  const discount = plan === 'weekly' ? subtotal * 0.1 : 0
  const shipping = subtotal === 0 || subtotal >= 32 || plan === 'weekly' ? 0 : 6
  const total = subtotal - discount + shipping

  const checkoutHref = createOrderHref(selectedItems, plan, 'Buy Microgreens')

  const setQuantity = (id, nextValue) => {
    setQuantities((current) => ({
      ...current,
      [id]: Math.max(0, nextValue),
    }))
  }

  return (
    <div className="page-shell">
      <section className="hero-section" id="home">
        <header className="site-header">
          <Link className="brand" to="/" aria-label="Sprig & Soil home">
            <span className="brand-mark" aria-hidden="true"></span>
            <span>Sprig & Soil</span>
          </Link>

          <nav className="site-nav" aria-label="Primary">
            <Link to="/delivery-areas">Delivery Areas</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/faq">FAQ</Link>
          </nav>

          <a
            className="nav-cta"
            href="https://wa.me/916282652286?text=Hi%2C%20I%20want%20to%20order%20Sprig%20%26%20Soil%20microgreens"
            target="_blank"
            rel="noopener noreferrer"
          >
            Order on WhatsApp
          </a>
        </header>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="hero-brand">Sprig & Soil — Kerala</p>
            <h1>Farm-Fresh Microgreens, Delivered Weekly to Your Door</h1>
            <p className="hero-text">
              Harvested within 48 hours and delivered straight to your doorstep in Pattambi, Valanchery,
              Pallipuram, and Pulamanthole. Our fresh microgreens are grown in real soil — not sterile
              hydroponic setups — giving you organic microgreens Kerala families can actually taste the
              difference in.
            </p>

            <div className="hero-actions">
              <a
                className="button button-primary"
                href="https://wa.me/916282652286?text=Hi%2C%20I%20want%20to%20subscribe%20weekly%20for%20microgreens"
                target="_blank"
                rel="noopener noreferrer"
              >
                Subscribe Weekly
              </a>
              <Link className="button button-secondary" to="/benefits">See Why They Work</Link>
            </div>

            <ul className="hero-proof" aria-label="Key proof points">
              <li>Cut to order in small indoor batches</li>
              <li>Free weekly microgreen delivery in all service areas</li>
              <li>Chef-grade varieties with family-friendly options</li>
            </ul>
          </div>

          <div className="hero-visual" aria-label="Fresh microgreens in a harvest container">
            <div className="hero-photo-frame">
              <img
                src="https://images.unsplash.com/photo-1647613233085-ba108714a559?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&q=80&w=1400"
                alt="Fresh microgreens packed in a clamshell container"
              />
            </div>
            <div className="hero-orbit hero-orbit-one"></div>
            <div className="hero-orbit hero-orbit-two"></div>
            <div className="hero-caption">
              <span>24 hours from harvest window to cold pack.</span>
              <strong>That is the difference customers taste.</strong>
            </div>
          </div>
        </div>
      </section>

      <main>
        <section className="section intro-section" id="benefits">
          <div className="section-heading">
            <p className="section-kicker">Why customers keep reordering</p>
            <h2>Microgreens solve the hardest part of healthy eating: consistency.</h2>
          </div>

          <div className="principle-grid">
            {principles.map((principle) => (
              <article className="principle" key={principle.title}>
                <h3>{principle.title}</h3>
                <p>{principle.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section areas-section" id="areas">
          <div className="section-heading">
            <p className="section-kicker">Delivery coverage</p>
            <h2>Serving Pattambi, Valanchery, Pallipuram & Pulamanthole</h2>
            <p className="areas-description">
              Our microgreens home delivery covers four key areas in the Pattambi-Malappuram belt.
              Every delivery route is planned so your greens arrive harvested fresh — not days-old
              from a supermarket cold chain. Whether you are in Pattambi town centre, Valanchery
              market area, Pallipuram panchayat, or along the Kunthippuzha river near Pulamanthole,
              we deliver farm-fresh microgreens weekly to your doorstep.
            </p>
          </div>

          <div className="areas-grid">
            <article className="area-card">
              <h3>Pattambi</h3>
              <p>Fresh microgreens delivered across Pattambi town, including Bharathapuzha river area, college locality, and surrounding villages.</p>
              <a href="/microgreens-pattambi">Learn more →</a>
            </article>
            <article className="area-card">
              <h3>Valanchery</h3>
              <p>Weekly microgreen delivery serving Valanchery and nearby Malappuram district areas with fresh, chemical-free greens.</p>
              <a href="/microgreens-valanchery">Learn more →</a>
            </article>
            <article className="area-card">
              <h3>Pallipuram</h3>
              <p>Farm-fresh microgreens delivered in Pallipuram block — locally grown, harvested at peak nutrition, delivered to your door.</p>
              <a href="/microgreens-pallipuram">Learn more →</a>
            </article>
            <article className="area-card">
              <h3>Pulamanthole</h3>
              <p>Weekly microgreens delivery in Pulamanthole area, grown on the banks of Kunthippuzha with traditional agricultural care.</p>
              <a href="/microgreens-pulamanthole">Learn more →</a>
            </article>
          </div>
        </section>

        <section className="section story-section">
          <div className="story-copy">
            <p className="section-kicker">Understanding the product</p>
            <h2>Microgreens are young vegetable shoots harvested when flavor and tenderness are both high.</h2>
            <p>
              Microgreens are not sprouts and they are not salad greens. They are harvested at the
              seedling stage — after the first leaves have formed but before the plant matures. That
              window gives you concentrated flavor, fast prep, and an easy way to add fresh organic
              microgreens Kerala families actually want to eat. The right tray makes it easier to add
              living greens to the food you already cook, which is why the weekly microgreen delivery
              habit sticks.
            </p>

            <div className="story-metrics" aria-label="Microgreen education highlights">
              <div>
                <strong>7-14 days</strong>
                <span>Typical grow cycle from seed to harvest</span>
              </div>
              <div>
                <strong>4 varieties</strong>
                <span>Chosen to cover mild, sweet, peppery, and hearty profiles</span>
              </div>
              <div>
                <strong>1 handful</strong>
                <span>The easiest serving size to build into a real meal</span>
              </div>
            </div>
          </div>

          <div className="story-media">
            <img
              src="https://images.unsplash.com/photo-1640671509786-7ddd9d77c866?auto=format&fit=crop&fm=webp&q=80&w=1200"
              alt="Microgreen seeds sprouting in a growing tray on a farm in Kerala"
              loading="lazy"
              width="600"
              height="750"
            />
            <p className="story-note">
              Grown in compact trays, packed cold, and delivered for use across the week.
            </p>
          </div>
        </section>

        <section className="section shop-section" id="shop">
          <div className="section-heading section-heading-shop">
            <div>
              <p className="section-kicker">How It Works</p>
              <h2>This Week's Box — Build Your Harvest</h2>
            </div>

            <div className="plan-switch" role="tablist" aria-label="Delivery plan">
              <button
                className={plan === 'weekly' ? 'is-active' : ''}
                onClick={() => setPlan('weekly')}
                type="button"
              >
                Weekly plan
              </button>
              <button
                className={plan === 'once' ? 'is-active' : ''}
                onClick={() => setPlan('once')}
                type="button"
              >
                One-time box
              </button>
            </div>
          </div>

          <div className="shop-layout">
            <div className="product-list">
              {products.map((product) => {
                const quantity = quantities[product.id]
                const productHref = createOrderHref(
                  [{ ...product, quantity: 1, total: product.price }],
                  'once',
                  `Buy ${product.name}`,
                )

                return (
                  <article className={`product product-${product.accent}`} key={product.id}>
                    <div className="product-topline">
                      <p>Fresh tray</p>
                      <strong>{formatCurrency(product.price)}</strong>
                    </div>

                    <div className="product-main">
                      <div>
                        <h3>{product.name}</h3>
                        <p className="product-flavor">{product.flavor}</p>
                      </div>
                      <p className="product-benefit">{product.benefit}</p>
                    </div>

                    <div className="product-controls">
                      <p className="product-usage">
                        Best for:{' '}
                        {product.id === 'sunflower' && 'bowls, wraps, and crunch-heavy lunches'}
                        {product.id === 'broccoli' && 'smoothies, eggs, and daily wellness habits'}
                        {product.id === 'radish' && 'avocado toast, tacos, and rich meals'}
                        {product.id === 'pea' && 'sandwiches, snack plates, and family meals'}
                      </p>

                      <div className="product-actions-row">
                        <div className="quantity-picker" aria-label={`${product.name} quantity`}>
                          <button
                            aria-label={`Remove one ${product.name}`}
                            disabled={quantity === 0}
                            onClick={() => setQuantity(product.id, quantity - 1)}
                            type="button"
                          >
                            -
                          </button>
                          <span>{quantity}</span>
                          <button
                            aria-label={`Add one ${product.name}`}
                            onClick={() => setQuantity(product.id, quantity + 1)}
                            type="button"
                          >
                            +
                          </button>
                        </div>

                        <a className="button button-primary product-buy" href={productHref}>
                          Buy This Tray
                        </a>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            <aside className="order-summary" aria-labelledby="summary-heading">
              <p className="section-kicker">Your order</p>
              <h3 id="summary-heading">Harvest box summary</h3>

              <div className="summary-list">
                {selectedItems.length > 0 ? (
                  selectedItems.map((item) => (
                    <div className="summary-row" key={item.id}>
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <strong>{formatCurrency(item.total)}</strong>
                    </div>
                  ))
                ) : (
                  <p className="summary-empty">
                    Add trays to create a box. Weekly plans unlock 10% savings and included
                    delivery.
                  </p>
                )}
              </div>

              <div className="summary-totals">
                <div className="summary-row">
                  <span>Items</span>
                  <strong>{itemCount}</strong>
                </div>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <strong>{formatCurrency(subtotal)}</strong>
                </div>
                <div className="summary-row">
                  <span>{plan === 'weekly' ? 'Weekly savings' : 'Savings'}</span>
                  <strong>{discount > 0 ? `-${formatCurrency(discount)}` : formatCurrency(0)}</strong>
                </div>
                <div className="summary-row">
                  <span>Delivery</span>
                  <strong>{shipping === 0 ? 'Included' : formatCurrency(shipping)}</strong>
                </div>
                <div className="summary-row summary-row-total">
                  <span>Total</span>
                  <strong>{formatCurrency(total)}</strong>
                </div>
              </div>

              <a
                className={`button button-primary button-block${selectedItems.length === 0 ? ' is-disabled' : ''}`}
                href={selectedItems.length === 0 ? '#shop' : checkoutHref}
              >
                {selectedItems.length === 0 ? 'Choose Your Trays First' : 'Buy Selected Microgreens'}
              </a>

              <a className="button button-secondary button-block" href="mailto:hello@sprigandsoil.com?subject=Wholesale%20Microgreens">
                Ask About Office or Cafe Supply
              </a>
            </aside>
          </div>
        </section>

        <section className="section ritual-section">
          <div className="section-heading">
            <p className="section-kicker">How It Works</p>
            <h2>Add fresh microgreens to your daily meals without changing what you cook.</h2>
          </div>

          <div className="ritual-grid">
            {rituals.map((ritual) => (
              <article className="ritual" key={ritual.title}>
                <h3>{ritual.title}</h3>
                <p>{ritual.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section testimonial-section">
          <div className="section-heading">
            <p className="section-kicker">What Our Subscribers Say</p>
            <h2>Real customers. Real meals. Real results.</h2>
          </div>

          <div className="testimonial-grid">
            {testimonials.map((testimonial) => (
              <blockquote className="testimonial" key={testimonial.author}>
                <p>{testimonial.quote}</p>
                <footer>
                  <strong>{testimonial.author}</strong>
                  <span>{testimonial.role}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section className="section faq-section" id="faq">
          <div className="section-heading">
            <p className="section-kicker">FAQ</p>
            <h2>Common questions before you subscribe.</h2>
          </div>

          <div className="faq-list">
            {faqs.map((faq) => (
              <article className="faq-item" key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section final-cta">
          <p className="section-kicker">Subscribe Today</p>
          <h2>Start your weekly microgreen delivery today — fresh from our farm to your kitchen.</h2>
          <p>
            Order once or set a weekly rhythm. Either way, the fastest path is the same: pick your
            trays, send the order, and we prepare the harvest for you. We deliver fresh microgreens
            weekly to Pattambi, Valanchery, Pallipuram, and Pulamanthole — and your first box is
            just a WhatsApp message away.
          </p>
          <a className="button button-primary" href={selectedItems.length === 0 ? '#shop' : checkoutHref}>
            {selectedItems.length === 0 ? 'Start Your Subscription' : 'Complete Your Order'}
          </a>
        </section>
      </main>

      {/* Floating WhatsApp CTA */}
      <a
        href="https://wa.me/916282652286?text=Hi%2C%20I%20want%20to%20subscribe%20to%20Sprig%20%26%20Soil%20microgreens"
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order on WhatsApp"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Order on WhatsApp
      </a>
    </div>
  )
}

export default App
