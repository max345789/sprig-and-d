import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import BlogPage from './BlogPage.jsx'

// Extract blog slug from the HTML filename
const scripts = document.querySelectorAll('script[type="module"]')
const src = scripts[0] ? scripts[0].src : ''
const match = src.match(/blog\/([a-z0-9-]+)\.html/)
const slug = match ? match[1] : 'microgreens-benefits-malayalam'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BlogPage slug={slug} />
  </StrictMode>,
)
