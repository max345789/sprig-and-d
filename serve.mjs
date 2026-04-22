import { createServer } from 'http'
import { readFileSync, existsSync, statSync } from 'fs'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const PORT = 5173

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.jsx': 'text/javascript',
  '.mjs': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
}

// Simple JSX/React transform for browser
function transformJSX(code, filePath) {
  // Replace JSX imports with browser-compatible versions
  code = code.replace(/import\s+\{([^}]+)\}\s+from\s+['"]react['"]/g, 
    'const {$1} = React')
  code = code.replace(/import\s+React\s+from\s+['"]react['"]/g, '')
  code = code.replace(/import\s+\{([^}]+)\}\s+from\s+['"]react-dom\/client['"]/g,
    'const {$1} = ReactDOM')
  code = code.replace(/import\s+\{([^}]+)\}\s+from\s+['"]react-router-dom['"]/g,
    'const {$1} = ReactRouterDOM')
  return code
}

createServer((req, res) => {
  let url = req.url.split('?')[0]
  
  // Try public directory first, then src
  let filePath
  if (url === '/' || url === '/index.html') {
    filePath = join(__dirname, 'index.html')
  } else {
    // Try public first
    let pubPath = join(__dirname, 'public', url)
    if (existsSync(pubPath) && statSync(pubPath).isFile()) {
      filePath = pubPath
    } else {
      filePath = join(__dirname, url)
    }
  }

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    // SPA fallback
    filePath = join(__dirname, 'index.html')
  }

  const ext = extname(filePath)
  const mime = MIME[ext] || 'application/octet-stream'

  try {
    const content = readFileSync(filePath)
    res.writeHead(200, { 'Content-Type': mime })
    res.end(content)
  } catch (e) {
    res.writeHead(500)
    res.end('Error')
  }
}).listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
