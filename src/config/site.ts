import { EnhancedProduct } from '@/config/types';

/**
 * Single source of site-level SEO + business (NAP) info.
 * Mirrors the contact details shown in the footer.
 */
export const SITE = {
  name: 'Rudra Trader',
  baseUrl: 'https://rudratrader.in',
  description:
    'Shop premium agarbatti, dhoop sticks and incense from trusted brands at Rudra Trader, Hyderabad — quality fragrances for pooja and everyday calm.',
  phone: '+919885156895',
  email: 'contact@rudratrader.in',
  address: {
    street: '11-3-934/1/1, 1st Floor, New Mallepally, Opp Priya Theater',
    locality: 'Hyderabad',
    region: 'Telangana',
    postalCode: '500001',
    country: 'IN',
  },
  mapUrl: 'https://maps.app.goo.gl/uBYT6Ljtz2EyNMSz5',
};

export const WEBSITE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE.name,
  url: SITE.baseUrl + '/',
};

// LocalBusiness/Store schema — the main lever for local "Hyderabad incense shop" searches.
export const ORGANIZATION_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: SITE.name,
  url: SITE.baseUrl + '/',
  telephone: SITE.phone,
  email: SITE.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.locality,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.postalCode,
    addressCountry: SITE.address.country,
  },
  hasMap: SITE.mapUrl,
};

export function buildProductJsonLd(product: EnhancedProduct, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images?.map((i) => i.url) ?? [],
    description: product.description || product.name,
    sku: product.id,
    brand: { '@type': 'Brand', name: product.brandName },
    category: product.categoryName,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: String(product.price),
      availability:
        !product.status || product.status === 'active'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url,
    },
  };
}
