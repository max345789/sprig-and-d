import { useSeo } from '../seo.js'
import { RevealSection } from '../components/ui.jsx'

export default function WhyPage() {
  useSeo({
    title: 'Why Microgreens & How It Works | Sprig & Soil',
    description: 'Learn why microgreens are a nutritional powerhouse and how our farm-to-doorstep delivery works in Palakkad.',
  })

  return (
    <main style={{ paddingTop: '80px', paddingBottom: '60px' }}>
      {/* ─── WHY MICROGREENS ─── */}
      <RevealSection className="section why-section">
        <div className="container">
          <div className="section-header">
            <h1 className="super-heading" style={{fontSize: 'clamp(3rem, 6vw, 4.5rem)', textAlign: 'center'}}>Nutrient-Dense Living Food</h1>
            <div className="kicker">Why Microgreens</div>
            <h2>The Wellness Superfood You're Missing</h2>
            <p className="subtitle">Tiny greens, massive nutrition. Here's why health-conscious families across Palakkad are switching to microgreens.</p>
          </div>
        </div>
        <div className="why-grid" style={{ width: 'min(1120px, calc(100% - 48px))', margin: '0 auto', border: '3px solid var(--green-900)' }}>
          <article className="why-card">
            <div className="why-icon why-icon-lime">🌿</div>
            <h3>40x More Nutrients</h3>
            <p>Studies show microgreens contain up to 40 times more nutrients than their mature counterparts. Maximum nutrition in minimum space.</p>
          </article>
          <article className="why-card">
            <div className="why-icon why-icon-coral">💚</div>
            <h3>Supports Gut Health</h3>
            <p>Loaded with fibre, living enzymes, and powerful antioxidants that support digestion, reduce inflammation, and boost wellness.</p>
          </article>
          <article className="why-card">
            <div className="why-icon why-icon-amber">⚡</div>
            <h3>Ready in Days</h3>
            <p>Harvested at peak nutrition within 7-14 days of planting. Live food at maximum vitality — not sitting in a cold chain for weeks.</p>
          </article>
        </div>
      </RevealSection>

      {/* ─── HOW IT WORKS ─── */}
      <RevealSection className="section how-section">
        <div className="container">
          <div className="section-header">
            <div className="kicker">How It Works</div>
            <h2>Farm to Your Doorstep in 48 Hours</h2>
          </div>
          <div className="steps-grid">
            <div className="step">
              <span className="step-number">1</span>
              <span className="step-icon">🛒</span>
              <h3>You Order</h3>
              <p>Choose your greens online — pick varieties, weights, and one-time or subscription delivery.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <span className="step-number">2</span>
              <span className="step-icon">✂️</span>
              <h3>We Harvest</h3>
              <p>Your microgreens are cut fresh on your delivery day — never pre-cut, never stored.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <span className="step-number">3</span>
              <span className="step-icon">📦</span>
              <h3>You Receive</h3>
              <p>Packed in breathable containers and delivered to your doorstep across Palakkad.</p>
            </div>
          </div>
        </div>
      </RevealSection>
    </main>
  )
}
