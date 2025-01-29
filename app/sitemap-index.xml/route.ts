import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = 'https://qudmeet.click'
  const currentDate = new Date().toISOString()

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`

  return new NextResponse(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'x-robots-tag': 'noindex',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=600'
    }
  })
} 