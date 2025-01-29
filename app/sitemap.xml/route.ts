import { MetadataRoute } from 'next'
import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = 'https://qudmeet.click'
  
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/tools/converter',
    '/tools/business-idea',
    '/tools/interview',
    '/tools/qrcode',
    '/tools/research-analysis',
    '/tools/resume-analysis',
  ]

  const currentDate = new Date().toISOString()

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticRoutes.map(route => `
    <url>
      <loc>${baseUrl}${route}</loc>
      <lastmod>${currentDate}</lastmod>
      <changefreq>daily</changefreq>
      <priority>${route === '' ? '1.0' : '0.8'}</priority>
    </url>
  `).join('')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=600'
    }
  })
} 