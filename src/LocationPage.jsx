import { useEffect } from 'react'
import './LocationPage.css'

const locationData = {
  'pattambi': {
    title: 'Fresh Microgreens Delivered Weekly in Pattambi',
    subtitle: 'Serving Pattambi and surrounding Kerala areas',
    heroText: `If you are searching for fresh microgreens in Pattambi, you now have a local source that delivers
    harvested greens straight to your doorstep. Our microgreens are grown in real soil in the Pattambi
    area, cut to order, and delivered within 48 hours of harvest — not the days-old produce you find
    in supermarket cold chains. Whether you live near Pattambi town centre, the Bharathapuzha river
    area, the college locality, or the surrounding villages, we bring farm-fresh microgreens weekly
    to your door. Our Pattambi microgreen delivery service covers the entire block, making it easy
    to add organic nutrition to your family's daily meals.`,
    landmarks: ['Bharathapuzha river area', 'Pattambi town centre', 'College locality', 'Surrounding Pattambi villages'],
    cta: 'Order Microgreens in Pattambi',
    whatsappText: 'Hi%2C%20I%20want%20to%20subscribe%20to%20microgreens%20delivery%20in%20Pattambi',
  },
  'valanchery': {
    title: 'Fresh Microgreens Delivered Weekly in Valanchery',
    subtitle: 'Serving Valanchery and Malappuram district',
    heroText: `Valanchery families deserve the same access to fresh, chemical-free microgreens as anyone else.
    Our weekly microgreen delivery service covers Valanchery and the wider Malappuram district, bringing
    harvested-at-peak greens straight from our grow room to your kitchen. We believe fresh microgreens
    Kerala families can trust should not require a trip to a specialty store or a long delivery wait.
    Every week, we cut to order, pack cold, and deliver to Valanchery addresses. Our varieties are
    chosen to work with Kerala food culture — mild enough for daily smoothies, peppery enough to
    lift a rice bowl, substantial enough for a real salad. Join the Valanchery families who have
    already made microgreens part of their weekly routine.`,
    landmarks: ['Valanchery town centre', 'Malappuram district areas', 'Valanchery market area'],
    cta: 'Order Microgreens in Valanchery',
    whatsappText: 'Hi%2C%20I%20want%20to%20subscribe%20to%20microgreens%20delivery%20in%20Valanchery',
  },
  'pallipuram': {
    title: 'Fresh Microgreens Delivered Weekly in Pallipuram',
    subtitle: 'Serving Pallipuram and Parathur Panchayath',
    heroText: `Pallipuram and the Parathur Panchayath area have a long agricultural tradition — and now
    that tradition includes fresh microgreens delivered weekly to your door. Our delivery service
    covers Pallipuram block, reaching families who want organic microgreens Kerala grown but never
    have to leave home to get. We grow in small indoor batches, cut to order, and deliver within
    48 hours of harvest. This is not hydroponic produce grown in sterile conditions — our microgreens
    are grown in real soil with natural light and proper air flow, giving you greens with actual
    flavor and nutrition. Whether you are in Pallipuram centre or the outer panchayath areas, our
    weekly delivery makes it simple to keep fresh greens on your table every week.`,
    landmarks: ['Pallipuram town centre', 'Parathur Panchayath area', 'Pattambi block villages'],
    cta: 'Order Microgreens in Pallipuram',
    whatsappText: 'Hi%2C%20I%20want%20to%20subscribe%20to%20microgreens%20delivery%20in%20Pallipuram',
  },
  'pulamanthole': {
    title: 'Fresh Microgreens Delivered Weekly in Pulamanthole',
    subtitle: 'Serving Pulamanthole and Kunthippuzha river area',
    heroText: `Pulamanthole sits along the banks of the Kunthippuzha river, an area known for its Ayurvedic
    traditions and agricultural heritage. That heritage deserves modern nutrition — which is why we
    deliver fresh microgreens weekly to Pulamanthole families who want to eat better without
    compromising on quality. Our microgreens are grown locally using methods that respect the
    natural soil and water of this area. We cut to order every delivery day, so the greens you
    receive were harvested hours earlier, not days. This is the difference between food that is
    alive and food that is merely preserved. For Pulamanthole families who value the area is
    traditional health wisdom, microgreens are a simple daily addition that fits naturally into
    the Ayurvedic-influenced food culture of this region.`,
    landmarks: ['Kunthippuzha river area', 'Pulamanthole town centre', 'Ayurvedic tradition communities'],
    cta: 'Order Microgreens in Pulamanthole',
    whatsappText: 'Hi%2C%20I%20want%20to%20subscribe%20to%20microgreens%20delivery%20in%20Pulamanthole',
  },
}

export default function LocationPage({ location }) {
  const data = locationData[location]

  useEffect(() => {
    document.title = `Fresh Microgreens Delivery in ${location.charAt(0).toUpperCase() + location.slice(1)} | Sprig & Soil`
  }, [location])

  if (!data) return null

  return (
    <div className="location-page">
      <section className="location-hero">
        <header className="location-header">
          <a className="brand" href="/" aria-label="Sprig & Soil home">
            <span className="brand-mark" aria-hidden="true"></span>
            <span>Sprig & Soil</span>
          </a>
        </header>

        <div className="location-hero-content">
          <p className="location-kicker">Local microgreen delivery</p>
          <h1>{data.title}</h1>
          <p className="location-subtitle">{data.subtitle}</p>
        </div>
      </section>

      <main className="location-main">
        <section className="location-content">
          <p className="location-body">{data.heroText}</p>

          <div className="location-landmarks">
            <h2>Delivery coverage in {location.charAt(0).toUpperCase() + location.slice(1)}</h2>
            <ul>
              {data.landmarks.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>

          <div className="location-cta-block">
            <h2>Ready to get started?</h2>
            <p>
              Ordering is simple. Send us a WhatsApp message with your delivery address and we will
              confirm your first delivery slot. No app download, no complicated checkout — just send
              a message and we handle the rest.
            </p>
            <a
              className="button button-primary"
              href={`https://wa.me/917306523297?text=${data.whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {data.cta}
            </a>
          </div>

          <div className="location-other-areas">
            <p>
              We also deliver to:{' '}
              <a href="/microgreens-pattambi">Pattambi</a> ·{' '}
              <a href="/microgreens-valanchery">Valanchery</a> ·{' '}
              <a href="/microgreens-pallipuram">Pallipuram</a> ·{' '}
              <a href="/microgreens-pulamanthole">Pulamanthole</a>
            </p>
          </div>
        </section>
      </main>

      <a
        href={`https://wa.me/917306523297?text=${data.whatsappText}`}
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
