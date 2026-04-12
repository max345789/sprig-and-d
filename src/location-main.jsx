import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LocationPage from './LocationPage.jsx'

// Extract location from the HTML filename (e.g., microgreens-pattambi.html -> 'pattambi')
const script = document.currentScript
const src = script ? script.src : ''
const match = src.match(/microgreens-([a-z]+)\.html/)
const location = match ? match[1] : 'pattambi'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LocationPage location={location} />
  </StrictMode>,
)
