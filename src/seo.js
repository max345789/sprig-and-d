import { useEffect } from 'react'

const SITE_URL = 'https://sprigandsoil.in'

function upsertMeta(name, content, attr = 'name') {
  const selector = `meta[${attr}="${name}"]`
  let tag = document.head.querySelector(selector)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

export function useSeo({ title, description, path = '/', ogType = 'website' }) {
  useEffect(() => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    const canonical = `${SITE_URL}${normalizedPath}`

    document.title = title
    upsertMeta('description', description)
    upsertMeta('og:title', title, 'property')
    upsertMeta('og:description', description, 'property')
    upsertMeta('og:url', canonical, 'property')
    upsertMeta('og:type', ogType, 'property')
    upsertMeta('twitter:title', title)
    upsertMeta('twitter:description', description)

    let canonicalTag = document.head.querySelector('link[rel="canonical"]')
    if (!canonicalTag) {
      canonicalTag = document.createElement('link')
      canonicalTag.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalTag)
    }
    canonicalTag.setAttribute('href', canonical)
  }, [title, description, path, ogType])
}
