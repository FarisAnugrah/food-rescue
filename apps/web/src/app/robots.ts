import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/merchant/'],
    },
    sitemap: 'https://food-rescue.vercel.app/sitemap.xml',
  };
}
