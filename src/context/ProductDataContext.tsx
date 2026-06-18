import { createContext, useContext, useMemo, ReactNode } from "react";
import { useProductData } from "@/hooks/useProductData";
import { Brand, Category, SubCategory, EnhancedProduct } from "@/config/types";

interface ProductDataContextValue {
  products: EnhancedProduct[];
  brands: Brand[];
  categories: Category[];
  subCategories: SubCategory[];
  loading: boolean;
  error: string | null;
}

const ProductDataContext = createContext<ProductDataContextValue | undefined>(undefined);

/**
 * Fetches the catalogue ONCE (via the existing useProductData hook) and shares it
 * with every route. This lets the product page work on a cold/shared deep-link
 * without re-fetching per navigation. Inactive products are hidden here.
 */
export const ProductDataProvider = ({ children }: { children: ReactNode }) => {
  const data = useProductData();

  const value = useMemo<ProductDataContextValue>(() => ({
    ...data,
    // Hide products explicitly marked inactive; keep ones with no status set.
    products: data.products.filter((p) => !p.status || p.status === "active"),
  }), [data]);

  return (
    <ProductDataContext.Provider value={value}>
      {children}
    </ProductDataContext.Provider>
  );
};

export const useProductDataContext = () => {
  const ctx = useContext(ProductDataContext);
  if (!ctx) {
    throw new Error("useProductDataContext must be used within a ProductDataProvider");
  }
  return ctx;
};
