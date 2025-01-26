import { GetServerSideProps } from 'next'

const EXTERNAL_DATA_URL = 'https://qudmeet.click'

function generateSiteMap(pages: string[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${pages
       .map((page) => {
         return `
       <url>
           <loc>${`${EXTERNAL_DATA_URL}${page}`}</loc>
           <lastmod>${new Date().toISOString()}</lastmod>
           <changefreq>daily</changefreq>
           <priority>0.7</priority>
       </url>
     `
       })
       .join('')}
   </urlset>
 `
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // Generate dynamic pages array based on your application routes
  const pages = [
    '/',
    '/about',
    '/contact',
    // Add more routes
  ]

  // Generate the XML sitemap with the pages
  const sitemap = generateSiteMap(pages)

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default function Sitemap() {
  // getServerSideProps will handle the XML generation
  return null
} 