/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://qudmeet.click', // Replace with your actual domain
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/api/*'], // Add paths you want to exclude
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://qudmeet.click/server-sitemap.xml', // If you have dynamic pages
    ],
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  outDir: './public',
} 