import { useSeo } from '../seo.js'
import { faqs } from '../data.js'
import { FaqItem, RevealSection } from '../components/ui.jsx'

export default function FaqPage() {
  useSeo({
    title: 'Frequently Asked Questions | Sprig & Soil',
    description: 'Find answers to common questions about our microgreens, subscriptions, and local delivery in Palakkad.',
  })

  return (
    <main style={{ paddingTop: '80px', paddingBottom: '60px' }}>
      <RevealSection className="section faq-section">
        <div className="container">
          <div className="section-header">
            <div className="kicker">FAQ</div>
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq) => <FaqItem faq={faq} key={faq.q} />)}
          </div>
        </div>
      </RevealSection>
    </main>
  )
}
