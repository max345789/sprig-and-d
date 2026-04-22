import { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { products, fmt } from '../data.js'
import { Stars, RevealSection } from '../components/ui.jsx'
import { useSeo } from '../seo.js'

export default function ShopPage() {
  const { addToCart, subscribeToggles, toggleSubscribe } = useOutletContext()

  useSeo({
    title: 'Shop Fresh Microgreens | Sprig & Soil',
    description: 'Order fresh, Palakkad-grown microgreens. Browse our selection of Wheatgrass, Broccoli, and Basil microgreens delivered to your doorstep.',
  })

  const [selectedVariants, setSelectedVariants] = useState(
    Object.fromEntries(products.map((p) => [p.id, 1]))
  )

  const setVariant = (id, idx) => setSelectedVariants((s) => ({ ...s, [id]: idx }))

  return (
    <main style={{ paddingTop: '80px', paddingBottom: '60px' }}>
      <RevealSection className="section shop-section">
        <div className="container">
          <div className="section-header">
            <div className="kicker">Our Products</div>
            <h2>Shop Fresh Microgreens</h2>
            <p className="subtitle">Palakkad grown, freshly harvested, delivered to your doorstep. No pesticides, no chemicals — just pure nutrition.</p>
          </div>
          <div className="products-grid">
            {products.map((p) => {
              const vi = selectedVariants[p.id]
              const v = p.variants[vi]
              const isSub = subscribeToggles[p.id]
              const displayPrice = isSub ? Math.round(v.price * 0.85) : v.price
              const accentClass = p.accent === 'lime' ? 'product-accent-lime' : p.accent === 'green' ? 'product-accent-green' : 'product-accent-purple'
              return (
                <article className="product-card" key={p.id}>
                  <div className={`product-accent-bar ${accentClass}`}></div>
                  <Link to={`/shop/${p.id}`} className="product-img-wrap">
                    <img src={p.image} alt={p.alt} width="400" height="400" loading="lazy" />
                  </Link>
                  <div className="product-body">
                    <Stars rating={p.rating} count={p.reviews} />
                    <h3><Link to={`/shop/${p.id}`}>{p.name} — {v.weight}</Link></h3>
                    <p className="product-tagline">{p.tagline}</p>
                    <p className="product-benefit">{p.benefit}</p>

                    <div className="variant-pills">
                      {p.variants.map((vr, i) => (
                        <button key={vr.weight} className={`pill ${i === vi ? 'pill-active' : ''}`} onClick={() => setVariant(p.id, i)} type="button">
                          {vr.weight}
                        </button>
                      ))}
                    </div>

                    <div className="product-price-row">
                      <div className="price-display">
                        <strong className="price-current">{fmt(displayPrice)}</strong>
                        {isSub && <span className="price-original">{fmt(v.price)}</span>}
                      </div>
                    </div>

                    <label className="subscribe-toggle">
                      <input type="checkbox" checked={!!isSub} onChange={() => toggleSubscribe(p.id)} />
                      <span className="toggle-track"><span className="toggle-thumb"></span></span>
                      <span className="toggle-label">Subscribe &amp; Save 15%</span>
                    </label>

                    <button className="btn btn-primary btn-block" onClick={() => addToCart(p.id, vi, isSub)} type="button">
                      Add to Cart
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </RevealSection>
    </main>
  )
}
