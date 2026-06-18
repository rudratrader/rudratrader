import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductDetails from '@/components/ProductDetails';
import ErrorDisplay from '@/components/ErrorDisplay';
import Seo from '@/components/Seo';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useProductDataContext } from '@/context/ProductDataContext';
import { useCart } from '@/context/CartContext';
import { SITE, buildProductJsonLd } from '@/config/site';

const DetailSkeleton = () => (
  <div className="grid gap-3 md:grid-cols-2 md:gap-6">
    <Skeleton className="w-full aspect-square rounded-md" />
    <div className="flex flex-col gap-4 pt-2">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="space-y-3 mt-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <Skeleton className="h-10 w-full mt-4" />
    </div>
  </div>
);

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { products, loading, error } = useProductDataContext();
  const { addToCart } = useCart();

  const product = products.find((p) => p.id === id);
  const productPath = `/product/${id ?? ''}`;

  const seo = product
    ? {
        title: `${product.name} — Rudra Trader`,
        description: (
          `${product.name} — ${[product.brandName, product.categoryName].filter(Boolean).join(', ')}.` +
          (product.description ? ` ${product.description}` : '') +
          ' Buy online at Rudra Trader, Hyderabad.'
        ).slice(0, 160),
        image: product.images?.[0]?.url,
        path: productPath,
        type: 'product' as const,
        jsonLd: buildProductJsonLd(product, SITE.baseUrl + productPath),
      }
    : {
        title: loading ? 'Loading… — Rudra Trader' : 'Product not found — Rudra Trader',
        description: SITE.description,
        path: productPath,
      };

  return (
    <div className="min-h-screen bg-[#FAF7F3] flex flex-col">
      <Seo {...seo} />
      <Navbar />

      <main className="container mt-16 mx-auto px-4 pt-4 pb-12 flex-1 w-full max-w-5xl">
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-[#624d15] hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to products
          </Link>
        </div>

        {loading ? (
          <div className="bg-[#fffbf4] rounded-xl border p-4 md:p-6">
            <DetailSkeleton />
          </div>
        ) : error ? (
          <ErrorDisplay message={error} />
        ) : !product ? (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold text-gray-700">Product not found</h2>
            <p className="text-gray-500 mt-2 mb-6">
              This product may have been removed or the link is incorrect.
            </p>
            <Button asChild className="bg-[#624d15] hover:bg-amber-800">
              <Link to="/">Browse all products</Link>
            </Button>
          </div>
        ) : (
          <div className="bg-[#fffbf4] rounded-xl border p-4 md:p-6">
            <ProductDetails product={product} onAddToCart={() => addToCart(product)} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
