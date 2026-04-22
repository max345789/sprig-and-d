import { Link } from 'react-router-dom'
import { useSeo } from '../seo.js'
import { testimonials } from '../data.js'
import { Stars, RevealSection } from '../components/ui.jsx'

export default function Home() {
  useSeo({
    title: 'Fresh Microgreens in Palakkad — Sprig & Soil',
    description: 'Order fresh-harvested Wheatgrass, Broccoli & Basil microgreens in Palakkad. Weekly subscription boxes & one-time orders. Home delivery across Kerala.',
    path: '/',
  })

  return (
    <main>
      {/* ─── HERO ─── */}
      <section className="hero-section" id="home">

        {/* Ticker */}
        <div className="ticker-bar hero-ticker">
          <div className="ticker-inner">
            {Array(4).fill(null).map((_, i) => (
              <span key={i} style={{display:'flex',gap:'3rem',alignItems:'center'}}>
                <span>🌱 Farm-Fresh Microgreens</span>
                <span className="ticker-dot">◆</span>
                <span>✦ Grown in Palakkad, Kerala</span>
                <span className="ticker-dot">◆</span>
                <span>🚴 Delivered in 48 Hours</span>
                <span className="ticker-dot">◆</span>
                <span>💚 100% Natural, No Pesticides</span>
                <span className="ticker-dot">◆</span>
                <span>⭐ 4.9 Rating from 200+ Families</span>
                <span className="ticker-dot">◆</span>
              </span>
            ))}
          </div>
        </div>

        <div className="hero-grid">
          <div className="hero-copy">
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              Grown in Palakkad, Kerala
            </div>
            <h1>
              Fresh <span className="highlight">Microgreens</span><br/>
              Delivered to<br/>Your Door
            </h1>
            <p className="hero-text">
              Nutrient-dense Wheatgrass, Broccoli &amp; Basil microgreens —
              grown clean, harvested to order, delivered every Monday &amp; Thursday.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-lime" to="/shop">Shop Now →</Link>
              <Link className="btn btn-secondary" style={{color:'rgba(255,255,255,0.8)',borderColor:'rgba(255,255,255,0.25)'}} to="/subscribe">Subscribe &amp; Save 15%</Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-num">200+</span>
                <span className="hero-stat-label">Families Served</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-num">4.9★</span>
                <span className="hero-stat-label">Avg Rating</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-num">48hr</span>
                <span className="hero-stat-label">Farm to Door</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-decor-ring"></div>
            <div className="hero-img-frame">
              <img src="/hero-flat.png" alt="Fresh microgreens in Palakkad Kerala" width="700" height="700" loading="eager" />
              <span className="hero-tag">Farm Fresh · Palakkad</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF ─── */}
      <RevealSection className="section proof-section" id="reviews">
        <div className="container">
          <div className="section-header">
            <div className="kicker">Testimonials</div>
            <h2 style={{color:'var(--white)'}}>Trusted by 200+ Families in Palakkad</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <blockquote className="testimonial-card" key={t.author}>
                <Stars rating={t.rating} count={1} />
                <p>"{t.quote}"</p>
                <footer>
                  <strong>{t.author}</strong>
                  <span>{t.role}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ─── BOTTOM CTA ─── */}
      <section style={{background:'var(--lime)',padding:'5rem 0',textAlign:'center'}}>
        <div className="container">
          <p style={{fontFamily:'var(--font-ui)',fontSize:'0.78rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.15em',color:'var(--ink)',marginBottom:'1rem',opacity:0.6}}>Ready to Start?</p>
          <h2 style={{fontFamily:'var(--font-display)',fontSize:'clamp(2.4rem,5vw,4rem)',color:'var(--ink)',marginBottom:'2rem',lineHeight:1.05}}>Eat Cleaner.<br/>Live Better.</h2>
          <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
            <Link className="btn btn-primary" to="/shop">Browse All Microgreens →</Link>
            <Link className="btn" style={{background:'transparent',border:'2px solid var(--ink)',color:'var(--ink)'}} to="/subscribe">Start a Subscription</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
