import { useOutletContext } from 'react-router-dom'
import { useSeo } from '../seo.js'
import { subscriptionTiers, fmt, waLink } from '../data.js'
import { RevealSection } from '../components/ui.jsx'

export default function SubscribePage() {
  useSeo({
    title: 'Microgreens Subscription Box Palakkad — Sprig & Soil',
    description: 'Never run out of greens. Get fresh Wheatgrass, Broccoli, and Basil delivered weekly in Palakkad, Kerala. Pause or cancel anytime.',
    path: '/subscribe',
  })

  return (
    <main style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      <RevealSection className="section subscribe-section" id="subscribe">
        <div className="section-header">
          <p className="kicker">Never run out of greens</p>
          <h1>The Sprig &amp; Soil Weekly Box</h1>
          <p style={{ maxWidth: '600px', margin: '16px auto', color: 'var(--text-muted)' }}>
            Fresh microgreens delivered to your doorstep every Monday & Thursday in Palakkad.
          </p>
        </div>
        <p className="subscribe-urgency font-accent">🕐 Limited weekly slots — Palakkad delivery only</p>
        <div className="tiers-grid">
          {subscriptionTiers.map((tier) => (
            <article className={`tier-card ${tier.badge ? 'tier-featured' : ''}`} key={tier.id}>
              {tier.badge && <span className="tier-badge">{tier.badge}</span>}
              <h3>{tier.name}</h3>
              <p className="tier-desc">{tier.desc}</p>
              <div className="tier-price">
                <strong>{fmt(tier.price)}</strong><span>/week</span>
              </div>
              <ul className="tier-features">
                {tier.features.map((f) => <li key={f}>✓ {f}</li>)}
              </ul>
              <a className="btn btn-primary btn-block" href={waLink(`Hi, I want to subscribe to the ${tier.name} (${fmt(tier.price)}/week)`)} target="_blank" rel="noopener noreferrer">
                Start My Subscription
              </a>
            </article>
          ))}
        </div>
      </RevealSection>
    </main>
  )
}
