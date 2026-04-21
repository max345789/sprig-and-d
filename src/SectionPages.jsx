import { Link } from 'react-router-dom'
import './App.css'
import { useSeo } from './seo.js'

const products = [
  { id: 'sunflower', name: 'Sunflower Crunch', price: 8, accent: 'gold' },
  { id: 'broccoli', name: 'Broccoli Shield', price: 9, accent: 'forest' },
  { id: 'radish', name: 'Radish Ignite', price: 8, accent: 'rose' },
  { id: 'pea', name: 'Pea Tendril Sweet', price: 10, accent: 'sage' },
]

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
})

const PAGE_LINKS = [
  { to: '/benefits', label: 'Benefits' },
  { to: '/delivery-areas', label: 'Areas' },
  { to: '/about-microgreens', label: 'About' },
  { to: '/shop', label: 'Shop' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/testimonials', label: 'Testimonials' },
  { to: '/faq', label: 'FAQ' },
]

function createWhatsAppHref(text) {
  return `https://wa.me/916282652286?text=${encodeURIComponent(text)}`
}

function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="Sprig & Soil home">
        <span className="brand-mark" aria-hidden="true"></span>
        <span>Sprig & Soil</span>
      </Link>

      <nav className="site-nav" aria-label="Primary">
        {PAGE_LINKS.map((link) => (
          <Link key={link.to} to={link.to}>
            {link.label}
          </Link>
        ))}
      </nav>

      <a
        className="nav-cta"
        href={createWhatsAppHref('Hi, I want to place a microgreens order.')}
        target="_blank"
        rel="noopener noreferrer"
      >
        Order on WhatsApp
      </a>
    </header>
  )
}

function PageShell({ title, kicker, children, seoTitle, seoDescription, seoPath }) {
  useSeo({
    title: seoTitle ?? `${title} | Sprig & Soil`,
    description: seoDescription ?? kicker,
    path: seoPath ?? '/',
  })

  return (
    <div className="page-shell">
      <section className="hero-section">
        <SiteHeader />
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="hero-brand">Sprig & Soil — Kerala</p>
            <h1>{title}</h1>
            <p className="hero-text">{kicker}</p>
            <div className="hero-actions">
              <a
                className="button button-primary"
                href={createWhatsAppHref(`Hi, I want to order after viewing ${title}.`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Order on WhatsApp
              </a>
              <Link className="button button-secondary" to="/">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
      <main>{children}</main>
    </div>
  )
}

export function BenefitsPage() {
  return (
    <PageShell
      title="Why customers keep reordering"
      kicker="Microgreens solve the hardest part of healthy eating: consistency."
      seoTitle="Benefits of Microgreens for Daily Meals | Sprig & Soil"
      seoDescription="Learn why fresh microgreens improve meal quality, consistency, and nutrition for Kerala families."
      seoPath="/benefits"
    >
      <section className="section intro-section">
        <div className="principle-grid">
          <article className="principle">
            <h3>Harvested at peak tenderness</h3>
            <p>Cut to order in small indoor batches so greens stay lively on your plate.</p>
          </article>
          <article className="principle">
            <h3>Built for real meals</h3>
            <p>Selected for eggs, bowls, sandwiches, soups, juices, and salads.</p>
          </article>
          <article className="principle">
            <h3>Designed as a weekly habit</h3>
            <p>Weekly delivery helps families stay consistent with clean greens.</p>
          </article>
        </div>
      </section>
    </PageShell>
  )
}

export function DeliveryAreasPage() {
  return (
    <PageShell
      title="Delivery areas across Kerala belt"
      kicker="Serving Pattambi, Valanchery, Pallipuram, and Pulamanthole weekly."
      seoTitle="Microgreens Delivery Areas in Kerala | Sprig & Soil"
      seoDescription="Sprig & Soil delivers fresh microgreens weekly in Pattambi, Valanchery, Pallipuram, and Pulamanthole."
      seoPath="/delivery-areas"
    >
      <section className="section areas-section">
        <div className="areas-grid">
          <article className="area-card">
            <h3>Pattambi</h3>
            <p>Town center, river area, and nearby villages.</p>
          </article>
          <article className="area-card">
            <h3>Valanchery</h3>
            <p>Core market zone and nearby Malappuram areas.</p>
          </article>
          <article className="area-card">
            <h3>Pallipuram</h3>
            <p>Block-wide routes for weekly home delivery.</p>
          </article>
          <article className="area-card">
            <h3>Pulamanthole</h3>
            <p>Kunthippuzha-side routes with harvest-fresh logistics.</p>
          </article>
        </div>
      </section>
    </PageShell>
  )
}

export function AboutMicrogreensPage() {
  return (
    <PageShell
      title="What microgreens are"
      kicker="Young vegetable shoots with concentrated flavor and easy meal use."
      seoTitle="What Are Microgreens? Complete Guide | Sprig & Soil"
      seoDescription="Understand microgreens, grow cycle, nutrition value, and how to use them in daily meals."
      seoPath="/about-microgreens"
    >
      <section className="section story-section">
        <div className="story-copy">
          <h2>Harvested in the sweet spot between sprout and mature plant.</h2>
          <p>
            Microgreens are harvested at the seedling stage, giving strong flavor, fast prep,
            and easy daily use in food you already cook.
          </p>
          <div className="story-metrics">
            <div>
              <strong>7-14 days</strong>
              <span>Typical grow cycle</span>
            </div>
            <div>
              <strong>4 varieties</strong>
              <span>Mild to peppery flavor range</span>
            </div>
            <div>
              <strong>1 handful</strong>
              <span>Simple serving per meal</span>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  )
}

export function ShopPage() {
  return (
    <PageShell
      title="Build your harvest box"
      kicker="Choose trays and place your order directly on WhatsApp."
      seoTitle="Order Fresh Microgreens on WhatsApp | Sprig & Soil"
      seoDescription="Shop Sunflower, Broccoli, Radish, and Pea microgreens. Order directly on WhatsApp for weekly delivery."
      seoPath="/shop"
    >
      <section className="section shop-section">
        <div className="product-list">
          {products.map((product) => (
            <article className={`product product-${product.accent}`} key={product.id}>
              <div className="product-topline">
                <p>Fresh tray</p>
                <strong>{currency.format(product.price)}</strong>
              </div>
              <div className="product-main">
                <h3>{product.name}</h3>
              </div>
              <a
                className="button button-primary product-buy"
                href={createWhatsAppHref(`Hi, I want to order ${product.name}.`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Order on WhatsApp
              </a>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  )
}

export function HowItWorksPage() {
  return (
    <PageShell
      title="How it works daily"
      kicker="Add microgreens to meals without changing your cooking style."
      seoTitle="How to Use Microgreens in Daily Food | Sprig & Soil"
      seoDescription="Simple morning, lunch, and dinner ways to add microgreens into your daily meals."
      seoPath="/how-it-works"
    >
      <section className="section ritual-section">
        <div className="ritual-grid">
          <article className="ritual">
            <h3>Morning reset</h3>
            <p>Add into smoothies or eggs.</p>
          </article>
          <article className="ritual">
            <h3>Lunch upgrade</h3>
            <p>Top wraps, bowls, and sandwiches.</p>
          </article>
          <article className="ritual">
            <h3>Dinner finish</h3>
            <p>Scatter over soups, vegetables, or protein before serving.</p>
          </article>
        </div>
      </section>
    </PageShell>
  )
}

export function TestimonialsPage() {
  return (
    <PageShell
      title="What subscribers say"
      kicker="Real customers, real meals, real repeat orders."
      seoTitle="Customer Reviews for Sprig & Soil Microgreens"
      seoDescription="Read subscriber experiences with weekly microgreens delivery and meal usage."
      seoPath="/testimonials"
    >
      <section className="section testimonial-section">
        <div className="testimonial-grid">
          <blockquote className="testimonial">
            <p>The weekly box made greens automatic. We use every tray.</p>
            <footer>
              <strong>Maya R.</strong>
              <span>Weekly subscriber</span>
            </footer>
          </blockquote>
          <blockquote className="testimonial">
            <p>Radish Ignite adds a huge flavor lift without extra cooking.</p>
            <footer>
              <strong>Anika P.</strong>
              <span>Family plan customer</span>
            </footer>
          </blockquote>
          <blockquote className="testimonial">
            <p>Consistent cut, snap, and freshness every delivery.</p>
            <footer>
              <strong>Jon V.</strong>
              <span>Cafe buyer</span>
            </footer>
          </blockquote>
        </div>
      </section>
    </PageShell>
  )
}

export function FaqPage() {
  return (
    <PageShell
      title="Common questions"
      kicker="Everything customers ask before starting weekly delivery."
      seoTitle="Microgreens FAQ | Delivery, Freshness, Ordering"
      seoDescription="Answers on microgreens freshness, delivery schedule, and one-time or weekly ordering."
      seoPath="/faq"
    >
      <section className="section faq-section">
        <div className="faq-list">
          <article className="faq-item">
            <h3>How are microgreens different from salad greens?</h3>
            <p>They are harvested young, with concentrated flavor and easy prep.</p>
          </article>
          <article className="faq-item">
            <h3>How long do they stay fresh?</h3>
            <p>Usually 7 to 10 days in refrigeration with dry storage.</p>
          </article>
          <article className="faq-item">
            <h3>Can I buy once before subscribing?</h3>
            <p>Yes, one-time trays are available before moving to weekly plans.</p>
          </article>
        </div>
      </section>
    </PageShell>
  )
}
