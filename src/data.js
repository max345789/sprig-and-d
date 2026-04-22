export const WHATSAPP = '916282652286'
export const waLink = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`

export const products = [
  {
    id: 'wheatgrass',
    name: 'Fresh Wheatgrass Microgreens',
    tagline: 'Detox powerhouse loaded with chlorophyll — your daily immunity shield',
    benefit: 'Rich in chlorophyll, enzymes & vitamins. Ideal for juices, smoothies, and morning detox shots.',
    image: '/wheatgrass.png',
    alt: 'fresh wheatgrass microgreens grown in palakkad kerala',
    accent: 'lime',
    rating: 4.8,
    reviews: 56,
    variants: [
      { weight: '50g', price: 79 },
      { weight: '100g', price: 149 },
      { weight: '200g', price: 269 },
    ],
  },
  {
    id: 'broccoli-microgreens',
    name: 'Fresh Broccoli Microgreens',
    tagline: 'Rich in sulforaphane — a powerful cancer-fighting antioxidant',
    benefit: 'Packed with sulforaphane for gut health and cellular protection. Mild flavor, easy to add anywhere.',
    image: '/broccoli.png',
    alt: 'fresh broccoli microgreens grown in palakkad kerala',
    accent: 'green',
    rating: 4.9,
    reviews: 72,
    variants: [
      { weight: '50g', price: 99 },
      { weight: '100g', price: 179 },
      { weight: '200g', price: 329 },
    ],
  },
  {
    id: 'basil',
    name: 'Fresh Basil Microgreens',
    tagline: 'Aromatic antioxidant boost for digestion and everyday meals',
    benefit: 'Fragrant, antioxidant-rich microgreens perfect for pasta, eggs, salads, and sandwiches.',
    image: '/basil.png',
    alt: 'fresh basil microgreens grown in palakkad kerala',
    accent: 'purple',
    rating: 4.7,
    reviews: 41,
    variants: [
      { weight: '50g', price: 89 },
      { weight: '100g', price: 159 },
      { weight: '200g', price: 289 },
    ],
  },
]

export const subscriptionTiers = [
  {
    id: 'starter',
    name: 'Starter Box',
    desc: '2 varieties, delivered weekly',
    price: 349,
    features: ['Choose any 2 microgreens', 'Free home delivery', 'Pause anytime', 'Freshness guarantee'],
    badge: null,
  },
  {
    id: 'wellness',
    name: 'Wellness Box',
    desc: 'All 3 varieties, delivered weekly',
    price: 499,
    features: ['Wheatgrass + Broccoli + Basil', 'Free home delivery', 'Pause anytime', 'Freshness guarantee', 'Priority harvest slot'],
    badge: 'Best Value',
  },
]

export const testimonials = [
  { quote: 'The weekly box changed our mornings. We blend wheatgrass into smoothies every day now — the kids actually love it.', author: 'Priya M.', role: 'Weekly subscriber, Palakkad', rating: 5 },
  { quote: 'Broccoli microgreens on my dosa is something I never knew I needed. Fresh, crunchy, and genuinely healthy.', author: 'Rahul K.', role: 'One-time buyer turned subscriber', rating: 5 },
  { quote: 'Finally, a local brand that delivers what it promises. The basil microgreens smell incredible — like a mini herb garden at home.', author: 'Anitha S.', role: 'Family plan customer', rating: 5 },
]

export const faqs = [
  { q: 'What are microgreens and how are they different from sprouts?', a: 'Microgreens are young vegetable greens harvested after the first true leaves develop — typically 7-14 days after germination. Unlike sprouts which are eaten root and all in 2-3 days, microgreens grow in soil, develop leaves, and are harvested by cutting above the soil line. They have more developed flavors and significantly higher nutrient density.' },
  { q: 'Are your microgreens organic?', a: 'We grow all our microgreens using organic practices — no synthetic pesticides, no chemical fertilizers, and no GMO seeds. We use natural coco peat and organic soil blends. While we are in the process of formal organic certification, our growing methods are 100% chemical-free.' },
  { q: 'Do you deliver to all areas in Palakkad?', a: 'Yes, we deliver to all areas within Palakkad district. Our delivery days are Monday and Thursday every week. Orders placed before 8 PM the previous day are harvested fresh and delivered the next morning.' },
  { q: 'How long do microgreens last after delivery?', a: 'When stored properly in the refrigerator (2-6°C), our microgreens stay fresh for 7-10 days. We pack them in breathable containers with a damp cloth to maintain humidity. Keep them unwashed until you\'re ready to use them for maximum freshness.' },
  { q: 'Can I pause or cancel my subscription?', a: 'Absolutely. You can pause or cancel your weekly subscription at any time — just send us a WhatsApp message 24 hours before your next delivery. No questions asked, no cancellation fees.' },
  { q: 'How do I use microgreens in meals?', a: 'Microgreens are incredibly versatile! Add wheatgrass to smoothies and juices. Toss broccoli microgreens into salads, sandwiches, or on top of soups. Sprinkle basil microgreens over pasta, pizza, or eggs. They work best added fresh — no cooking needed.' },
]

export const fmt = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v)
