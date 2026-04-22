import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { waLink } from '../data.js'

export function Stars({ rating, count }) {
  return (
    <div className="stars" aria-label={`${rating} out of 5 stars from ${count} reviews`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i <= Math.round(rating) ? '#E8B931' : '#ddd'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      <span className="star-text">{rating} ({count})</span>
    </div>
  )
}

function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('revealed'); obs.unobserve(el) } }, { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

export function RevealSection({ className, id, children }) {
  const ref = useReveal()
  return <section className={`${className} reveal`} id={id} ref={ref}>{children}</section>
}

export function FaqItem({ faq }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item ${open ? 'faq-open' : ''}`}>
      <button className="faq-trigger" onClick={() => setOpen(!open)} aria-expanded={open} type="button">
        <h3>{faq.q}</h3>
        <span className="faq-icon" aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      <div className="faq-body" style={{ maxHeight: open ? '400px' : '0' }}>
        <p>{faq.a}</p>
      </div>
    </div>
  )
}

export function Header() {
  return (
    <header className="site-header" id="top">
      <div className="header-inner">
        <Link className="brand" to="/" aria-label="Sprig & Soil home">
          <span className="brand-dot" aria-hidden="true"></span>
          <span>Sprig &amp; Soil</span>
        </Link>
        <nav className="site-nav" aria-label="Primary">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/subscribe">Subscribe</Link>
          <Link to="/why">Why Microgreens</Link>
          <Link to="/faq">FAQ</Link>
        </nav>
        <a className="nav-cta" href={waLink('Hi, I want to order microgreens')} target="_blank" rel="noopener noreferrer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Order Now
        </a>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="brand-dot" aria-hidden="true"></span>
          <span className="footer-logo-text">Sprig &amp; Soil</span>
          <p className="footer-tagline">Fresh greens, rooted in Palakkad</p>
        </div>
        <nav className="footer-nav">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/subscribe">Subscriptions</Link>
          <Link to="/why">Why Microgreens</Link>
          <Link to="/faq">FAQ</Link>
        </nav>
        <div className="footer-contact">
          <h4>Get In Touch</h4>
          <a href={waLink('Hi, I have a question about Sprig & Soil')} target="_blank" rel="noopener noreferrer">💬 WhatsApp Us</a>
          <a href="https://instagram.com/sprigansoil" target="_blank" rel="noopener noreferrer">📸 Instagram</a>
          <a href="https://facebook.com/sprigandsoil" target="_blank" rel="noopener noreferrer">👍 Facebook</a>
        </div>
        <div className="footer-location">
          <h4>Our Farm</h4>
          <p>Grown with care in<br /><strong>Palakkad, Kerala, India</strong></p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Sprig &amp; Soil. All rights reserved.</p>
        <div className="footer-legal">
          <Link to="#">Privacy Policy</Link>
          <Link to="#">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}
