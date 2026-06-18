import { SITE } from '@/config/site';

interface SeoProps {
  title: string;
  description: string;
  /** Path beginning with "/", e.g. "/product/123". Used for canonical + og:url. */
  path?: string;
  /** Absolute image URL for social cards (optional). */
  image?: string;
  type?: 'website' | 'product';
  /** One JSON-LD object or an array of them. */
  jsonLd?: object | object[];
}

/**
 * Per-page SEO tags rendered with React 19's native document metadata support
 * (no extra library) — React hoists <title>/<meta>/<link> into <head>, and
 * removes them again when the page unmounts. JSON-LD is emitted as a script
 * crawlers can read.
 */
const Seo = ({ title, description, path = '/', image, type = 'website', jsonLd }: SeoProps) => {
  const url = SITE.baseUrl + path;
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
};

export default Seo;
