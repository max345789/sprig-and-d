import { useState } from 'react'
import { useParams, Navigate, Link, useOutletContext } from 'react-router-dom'
import { useSeo } from '../seo.js'
import { products, fmt } from '../data.js'
import { Stars } from '../components/ui.jsx'

export default function ProductPage() {
  const { productId } = useParams()
  const { addToCart, subscribeToggles, toggleSubscribe } = useOutletContext()
  const [vi, setVi] = useState(0)

  const product = products.find(p => p.id === productId)

  if (!product) {
    return <Navigate to="/" replace />
  }

  const v = product.variants[vi]
  const isSub = subscribeToggles[product.id]
  const displayPrice = isSub ? Math.round(v.price * 0.85) : v.price

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.benefit,
    image: `https://dabcloud.in${product.image}`,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: displayPrice,
      availability: 'https://schema.org/InStock'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviews
    }
  }

  useSeo({
    title: `${product.name} in Palakkad, Kerala — Sprig & Soil`,
    description: `Order ${product.name}. ${product.tagline}. Freshly harvested and delivered in Palakkad.`,
    path: `/shop/${product.id}`,
    schema: productSchema,
    schemaId: `product-${product.id}`
  })

  return (
    <main className="product-page-shell" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="section">
        <div className="products-grid" style={{ gridTemplateColumns: '1fr', maxWidth: '800px', margin: '0 auto' }}>
          <article className={`product-card product-${product.accent}`}>
            <div className="product-img-wrap">
              <img src={product.image} alt={product.alt} width="600" height="600" loading="eager" />
            </div>
            <div className="product-body">
              <Stars rating={product.rating} count={product.reviews} />
              <h1>{product.name}</h1>
              <p className="product-tagline">{product.tagline}</p>
              <p className="product-benefit">{product.benefit}</p>

              <div className="variant-pills">
                {product.variants.map((vr, i) => (
                  <button key={vr.weight} className={`pill ${i === vi ? 'pill-active' : ''}`} onClick={() => setVi(i)} type="button">
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
                <input type="checkbox" checked={!!isSub} onChange={() => toggleSubscribe(product.id)} />
                <span className="toggle-track"><span className="toggle-thumb"></span></span>
                <span className="toggle-label">Subscribe &amp; Save 15%</span>
              </label>

              <button className="btn btn-primary btn-block" onClick={() => addToCart(product.id, vi, isSub)} type="button">
                Add to Cart
              </button>
              
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                 <Link to="/#shop" style={{ textDecoration: 'underline' }}>&larr; Back to all microgreens</Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </main>
  )
}
