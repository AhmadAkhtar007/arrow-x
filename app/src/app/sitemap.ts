import { MetadataRoute } from 'next';
import { productsData } from '../data/mockData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://arrowx.shop';

  // Base static routes
  const routes = ['', '/products', '/blog', '/status'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic product routes for all 23 games
  const productRoutes = productsData.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...routes, ...productRoutes];
}
