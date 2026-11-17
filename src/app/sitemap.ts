import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl()
  const lastModified = new Date()

  return [
    { url: base, lastModified, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/cart`, lastModified, changeFrequency: 'weekly', priority: 0.6 },
  ]
}
