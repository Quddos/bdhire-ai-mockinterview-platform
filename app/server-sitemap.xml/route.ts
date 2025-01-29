import { getServerSideSitemap } from 'next-sitemap'
import { MetadataRoute } from 'next'

export async function GET() {
  // Get your dynamic routes/tools here
  const tools = [
    'converter',
    'qrcode',
    'business-idea  ',
    'research-analyzer',
    'resume-analyzer'
    // Add all your tool names
  ]

  const baseUrl = 'https://qudmeet.click'

  const dynamicPaths = tools.map(tool => ({
    url: `${baseUrl}/tools/${tool}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: 0.7,
  }))

  // Return the XML
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${dynamicPaths
        .map(({ url, lastModified, changeFrequency, priority }) => {
          return `
            <url>
              <loc>${url}</loc>
              <lastmod>${lastModified}</lastmod>
              <changefreq>${changeFrequency}</changefreq>
              <priority>${priority}</priority>
            </url>
          `
        })
        .join('')}
    </urlset>`,
    {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=600',
      },
    }
  )
} 