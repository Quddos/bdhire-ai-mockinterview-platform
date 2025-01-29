import { MetadataRoute } from 'next'

// Add all your static routes here
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
  // Add more static routes
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://qudmeet.click'

  // Generate static routes with correct type for changeFrequency
  const staticPaths: MetadataRoute.Sitemap = staticRoutes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // You can add dynamic routes here if needed
  // const dynamicPaths = await fetchDynamicPaths()

  return staticPaths
} 