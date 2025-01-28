import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/', '/admin/'], // Add paths you want to block
    },
    sitemap: 'https://qudmeet.click/sitemap.xml',
  }
} 