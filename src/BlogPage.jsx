import { Link, useParams } from 'react-router-dom'
import blogPosts from './blogPosts.js'
import './BlogPage.css'
import { useSeo } from './seo.js'

export default function BlogPage() {
  const { slug } = useParams()
  const post = blogPosts[slug]

  useSeo({
    title: post ? `${post.title} | Sprig & Soil Blog` : 'Blog Post Not Found | Sprig & Soil',
    description: post ? post.excerpt : 'The requested blog post could not be found.',
    path: post ? `/blog/${post.slug}` : '/blog',
    ogType: post ? 'article' : 'website',
  })

  if (!post) {
    return (
      <div className="blog-page">
        <div className="blog-not-found">
          <h1>Post not found</h1>
          <a href="/">← Back to home</a>
        </div>
      </div>
    )
  }

  return (
    <div className="blog-page">
      <header className="blog-header">
        <Link className="brand" to="/" aria-label="Sprig & Soil home">
          <span className="brand-mark" aria-hidden="true"></span>
          <span>Sprig & Soil</span>
        </Link>
      </header>

      <main className="blog-main">
        <article className="blog-article">
          <div className="blog-meta">
            <span className="blog-date">{post.date}</span>
            <span className="blog-reading-time">
              {Math.ceil(post.content.split(/\s+/).length / 200)} min read
            </span>
          </div>

          <h1 className="blog-title">{post.title}</h1>

          <p className="blog-excerpt">{post.excerpt}</p>

          <div className="blog-body">
            {post.content.split('\n\n').map((paragraph, i) => (
              paragraph.startsWith('-') || paragraph.startsWith('First,') || paragraph.startsWith('Second,') ||
              paragraph.startsWith('Third,') || paragraph.startsWith('Fourth,') || paragraph.match(/^[A-Z][a-z]+ (morning|breakfast|lunch|evening|dinner):/)
              ? (
                <ul key={i}>
                  {paragraph.split('\n').map((line, j) => (
                    <li key={j}>{line.replace(/^[-•]\s*/, '')}</li>
                  ))}
                </ul>
              ) : paragraph.match(/^How to|^For|^Start your|^Getting started|^Ordering|^Delivery|^What|^Why|^The next|^Storage|^This is|^A small|^When you|^Most|^Here is what|^Here is how|^A weekly/)
              ? (
                <h2 key={i}>{paragraph}</h2>
              ) : paragraph.match(/^[A-Z][a-z]+ (is|are|works|keeps|starts|makes)\s/)
              ? (
                <h3 key={i}>{paragraph}</h3>
              ) : (
                <p key={i}>{paragraph}</p>
              )
            ))}
          </div>

          <div className="blog-cta">
            <h2>Ready to try fresh microgreens?</h2>
            <p>
              Get your first delivery of farm-fresh microgreens in Pattambi, Valanchery,
              Pallipuram, or Pulamanthole. Send us a WhatsApp message and we will have you
              set up within minutes.
            </p>
            <a
              className="button button-primary"
              href="https://wa.me/916282652286?text=Hi%2C%20I%20found%20your%20blog%20and%20want%20to%20try%20your%20microgreens"
              target="_blank"
              rel="noopener noreferrer"
            >
              Order on WhatsApp
            </a>
          </div>

          <div className="blog-footer-nav">
            <Link to="/">← Back to Sprig & Soil home</Link>
          </div>
        </article>
      </main>

      <a
        href="https://wa.me/916282652286?text=Hi%2C%20I%20found%20your%20blog%20and%20want%20to%20try%20your%20microgreens"
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
